-- Update Courses table with metadata
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#ffffff';

-- Update Lessons table to include the JSONB content field
-- This field will store the array of Pages and Blocks
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '[]'::jsonb;

-- Ensure RLS allows admins to update these fields
CREATE POLICY "Admins can update lesson content" ON public.lessons
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));