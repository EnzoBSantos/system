-- Explicitly enable RLS on sensitive tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing generic policies if any to avoid conflicts
DROP POLICY IF EXISTS "habits_all" ON public.habits;
DROP POLICY IF EXISTS "sessions_all" ON public.pomodoro_sessions;

-- STRICT HABITS POLICIES
CREATE POLICY "habits_select_policy" ON public.habits
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "habits_insert_policy" ON public.habits
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_update_policy" ON public.habits
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_delete_policy" ON public.habits
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- STRICT SESSIONS POLICIES
CREATE POLICY "sessions_select_policy" ON public.pomodoro_sessions
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert_policy" ON public.pomodoro_sessions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_update_policy" ON public.pomodoro_sessions
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_delete_policy" ON public.pomodoro_sessions
FOR DELETE TO authenticated USING (auth.uid() = user_id);