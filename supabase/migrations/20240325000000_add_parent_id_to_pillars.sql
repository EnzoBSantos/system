-- Adicionar coluna parent_id para suportar hierarquia de pilares no mapa mental
ALTER TABLE public.goal_requirements 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.goal_requirements(id) ON DELETE CASCADE;

-- Comentário: Execute este comando no SQL Editor do Supabase caso a migração automática não ocorra.