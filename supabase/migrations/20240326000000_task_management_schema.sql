-- 1. Projects & Sections
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#ffffff',
  is_inbox BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Labels
CREATE TABLE public.labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tasks
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TIME,
  priority_level INTEGER CHECK (priority_level BETWEEN 1 AND 4) DEFAULT 4,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed')),
  recurring_rule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Many-to-Many: Tasks <-> Labels
CREATE TABLE public.task_labels (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  label_id UUID REFERENCES public.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

-- 5. Gamification (Karma)
CREATE TABLE public.user_karma (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_score INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECURITY: Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_karma ENABLE ROW LEVEL SECURITY;

-- POLICIES (Simplified for user access)
CREATE POLICY "user_projects_all" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_sections_all" ON public.sections FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = section_id AND p.user_id = auth.uid()));
CREATE POLICY "user_labels_all" ON public.labels FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_tasks_all" ON public.tasks FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_task_labels_all" ON public.task_labels FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND t.user_id = auth.uid()));
CREATE POLICY "user_karma_all" ON public.user_karma FOR ALL TO authenticated USING (auth.uid() = user_id);

-- AUTOMATION: Create Inbox on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_inbox()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.projects (user_id, name, is_inbox)
  VALUES (new.id, 'Inbox', true);
  
  INSERT INTO public.user_karma (user_id)
  VALUES (new.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_inbox
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_inbox();