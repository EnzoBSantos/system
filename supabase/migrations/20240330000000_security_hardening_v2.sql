-- Security Hardening Migration

-- 1. Ensure RLS is enabled on core tables
ALTER TABLE IF EXISTS public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;

-- 2. Habits Policies
DROP POLICY IF EXISTS "habits_all" ON public.habits;
CREATE POLICY "Users can manage their own habits" 
ON public.habits 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 3. Pomodoro Sessions Policies
DROP POLICY IF EXISTS "sessions_all" ON public.pomodoro_sessions;
CREATE POLICY "Users can manage their own sessions" 
ON public.pomodoro_sessions 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 4. Tasks Policies
DROP POLICY IF EXISTS "user_tasks_all" ON public.tasks;
CREATE POLICY "Users can manage their own tasks" 
ON public.tasks 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 5. Protection for user_id column update
-- This prevents users from reassigning records to other users
CREATE OR REPLACE FUNCTION public.check_user_id_immutability()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.user_id <> NEW.user_id THEN
    RAISE EXCEPTION 'Ownership change is forbidden.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS habits_user_id_protection ON public.habits;
CREATE TRIGGER habits_user_id_protection
BEFORE UPDATE ON public.habits
FOR EACH ROW EXECUTE FUNCTION public.check_user_id_immutability();

DROP TRIGGER IF EXISTS tasks_user_id_protection ON public.tasks;
CREATE TRIGGER tasks_user_id_protection
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.check_user_id_immutability();