-- Add content column to store the multi-page structure
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '[]'::jsonb;

-- Ensure RLS is enabled
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Grant service_role full access (Edge Functions use this)
CREATE POLICY "Service role can manage all lessons" ON public.lessons
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Ensure admins can also manage lessons directly if needed
CREATE POLICY "Admins can manage all lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));