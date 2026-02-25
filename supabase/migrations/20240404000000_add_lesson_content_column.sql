-- Add content column to store the multi-page structure
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '[]'::jsonb;

-- Ensure RLS allows the edge function (service role) to manage this
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;