-- Enable RLS on courses if not already enabled
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 1. Everyone can view published courses
CREATE POLICY "Anyone can view courses" ON public.courses
FOR SELECT USING (true);

-- 2. Only admins can INSERT courses
CREATE POLICY "Admins can insert courses" ON public.courses
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 3. Only admins can UPDATE courses
CREATE POLICY "Admins can update courses" ON public.courses
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 4. Only admins can DELETE courses
CREATE POLICY "Admins can delete courses" ON public.courses
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Fix RLS for Lessons table as well
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons" ON public.lessons
FOR SELECT USING (true);

CREATE POLICY "Admins can insert lessons" ON public.lessons
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete lessons" ON public.lessons
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);