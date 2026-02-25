-- 1. Fix Insecure RLS Policies for Courses and Lessons
DROP POLICY IF EXISTS "Dev Bypass Courses" ON public.courses;
DROP POLICY IF EXISTS "Dev Bypass Lessons" ON public.lessons;

-- Secure policies for courses: Public can see published, Admins can manage all
CREATE POLICY "courses_read_policy" ON public.courses
FOR SELECT USING (
  is_published = true 
  OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
);

CREATE POLICY "courses_admin_policy" ON public.courses
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Secure policies for lessons
CREATE POLICY "lessons_read_policy" ON public.lessons
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.units u
    JOIN public.courses c ON u.course_id = c.id
    WHERE u.id = lessons.unit_id 
    AND (c.is_published = true OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')))
  )
);

CREATE POLICY "lessons_admin_policy" ON public.lessons
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Secure Karma Awarding (Move to Triggers)
-- This prevents users from calling award_karma with arbitrary points from the console.

CREATE OR REPLACE FUNCTION public.handle_karma_on_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only award points when a task moves from 'open' to 'completed'
  IF (OLD.status = 'open' AND NEW.status = 'completed') THEN
    INSERT INTO public.user_karma (user_id, total_score, updated_at, last_completed_at)
    VALUES (NEW.user_id, 10, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET total_score = user_karma.total_score + 10,
        updated_at = NOW(),
        last_completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_task_completed ON public.tasks;
CREATE TRIGGER on_task_completed
  AFTER UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_karma_on_task_completion();

CREATE OR REPLACE FUNCTION public.handle_karma_on_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
  xp_reward_val INTEGER;
BEGIN
  -- Fetch the actual XP reward from the lesson record
  SELECT xp_reward INTO xp_reward_val FROM public.lessons WHERE id = NEW.lesson_id;
  
  INSERT INTO public.user_karma (user_id, total_score, updated_at, last_completed_at)
  VALUES (NEW.user_id, COALESCE(xp_reward_val, 50), NOW(), NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET total_score = user_karma.total_score + COALESCE(xp_reward_val, 50),
      updated_at = NOW(),
      last_completed_at = NOW();
      
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lesson_completed ON public.lesson_completions;
CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON public.lesson_completions
  FOR EACH ROW EXECUTE FUNCTION public.handle_karma_on_lesson_completion();