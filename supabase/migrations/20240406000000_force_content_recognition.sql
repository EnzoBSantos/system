-- 1. Ensure the column exists with the correct type and default
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '[]'::jsonb;

-- 2. Explicitly grant permissions on the new column to all relevant roles
GRANT ALL ON TABLE public.lessons TO postgres;
GRANT ALL ON TABLE public.lessons TO service_role;
GRANT ALL ON TABLE public.lessons TO authenticated;
GRANT ALL ON TABLE public.lessons TO anon;

-- 3. Trigger a structural change event to kick the cache
COMMENT ON COLUMN public.lessons.content IS 'Stores the modular blocks for the atomic ritual lesson.';

-- 4. Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- 5. Ensure RLS is active and has a bypass for the service role
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_bypass" ON public.lessons;
CREATE POLICY "service_role_bypass" ON public.lessons 
FOR ALL TO service_role USING (true) WITH CHECK (true);