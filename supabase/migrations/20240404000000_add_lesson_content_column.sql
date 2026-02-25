-- Ensure the content column exists on the lessons table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='content') THEN
    ALTER TABLE public.lessons ADD COLUMN content JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Ensure service_role has full access for Edge Functions
DROP POLICY IF EXISTS "Service role can manage all lessons" ON public.lessons;
CREATE POLICY "Service role can manage all lessons" ON public.lessons
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Ensure admins can manage lessons
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
CREATE POLICY "Admins can manage all lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Force a reload of the PostgREST schema cache
NOTIFY pgrst, 'reload schema';