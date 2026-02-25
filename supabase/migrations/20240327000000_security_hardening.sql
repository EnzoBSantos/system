-- 1. Fix Orphaned Data: Add cascading deletes to goal requirements
ALTER TABLE public.goal_requirements 
DROP CONSTRAINT IF EXISTS goal_requirements_goal_id_fkey,
ADD CONSTRAINT goal_requirements_goal_id_fkey 
FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE;

-- 2. Fix Karma Manipulation: Restrict direct updates and provide a secure function
DROP POLICY IF EXISTS "user_karma_all" ON public.user_karma;

-- Only allow reading karma directly
CREATE POLICY "user_karma_select" ON public.user_karma
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Secure function to increment karma (prevents arbitrary jumps)
CREATE OR REPLACE FUNCTION public.award_karma(points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to bypass restricted RLS
AS $$
BEGIN
  -- Validate that points are within a reasonable range per call (e.g., max 50)
  IF points < 0 OR points > 50 THEN
    RAISE EXCEPTION 'Invalid karma amount';
  END IF;

  UPDATE public.user_karma
  SET total_score = total_score + points,
      updated_at = NOW()
  WHERE user_id = auth.uid();
END;
$$;

-- 3. Fix Schema Exposure: Move RLS utility to internal schema
CREATE SCHEMA IF NOT EXISTS internal;

-- Update the existing function's schema
ALTER FUNCTION public.rls_auto_enable() SET SCHEMA internal;

-- Note: The event trigger remains in place but now references the function in the internal schema.
-- This hides the function logic from the public 'public' schema exposed via PostgREST.