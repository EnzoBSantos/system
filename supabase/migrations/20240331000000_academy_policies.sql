-- Enable RLS on all academy tables (they are already enabled in schema, but let's be sure)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for Courses
CREATE POLICY "Admins can manage courses" ON public.courses
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Public can view published courses" ON public.courses
FOR SELECT TO authenticated
USING (is_published = true);

-- Create policies for Units
CREATE POLICY "Admins can manage units" ON public.units
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Public can view units" ON public.units
FOR SELECT TO authenticated
USING (true);

-- Create policies for Lessons
CREATE POLICY "Admins can manage lessons" ON public.lessons
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Public can view lessons" ON public.lessons
FOR SELECT TO authenticated
USING (true);

-- Create policies for Exercises
CREATE POLICY "Admins can manage exercises" ON public.exercises
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Public can view exercises" ON public.exercises
FOR SELECT TO authenticated
USING (true);

-- Create policies for Lesson Completions
CREATE POLICY "Users can manage their own completions" ON public.lesson_completions
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);