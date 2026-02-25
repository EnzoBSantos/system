-- 1. Exposure of Database Schema through Public RLS Utility
-- Create a private schema for administrative functions not exposed via PostgREST
CREATE SCHEMA IF NOT EXISTS private;

-- Move rls_auto_enable to private schema
DROP EVENT TRIGGER IF EXISTS rls_auto_enable_trigger ON ddl_command_end;
DROP FUNCTION IF EXISTS public.rls_auto_enable();

CREATE OR REPLACE FUNCTION private.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

CREATE EVENT TRIGGER rls_auto_enable_trigger
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION private.rls_auto_enable();

-- 2. Arbitrary Score Manipulation in user_karma
-- Remove broad update permissions and only allow selection
DROP POLICY IF EXISTS "user_karma_all" ON public.user_karma;
CREATE POLICY "user_karma_select" ON public.user_karma
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Create a secure server-side function to handle karma increments
-- This prevents users from manually setting their score to arbitrary values
CREATE OR REPLACE FUNCTION public.award_karma(points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate input to prevent negative points or unrealistic jumps
  IF points < 0 OR points > 100 THEN
    RAISE EXCEPTION 'Invalid karma increment';
  END IF;

  INSERT INTO public.user_karma (user_id, total_score, updated_at)
  VALUES (auth.uid(), points, now())
  ON CONFLICT (user_id) DO UPDATE
  SET total_score = user_karma.total_score + points,
      updated_at = now();
END;
$$;

-- 3. Orphaned Data Leak in Goal Requirements
-- Enforce database-level cascading deletes for requirements
ALTER TABLE public.goal_requirements 
DROP CONSTRAINT IF EXISTS goal_requirements_goal_id_fkey,
ADD CONSTRAINT goal_requirements_goal_id_fkey 
  FOREIGN KEY (goal_id) 
  REFERENCES public.goals(id) 
  ON DELETE CASCADE;