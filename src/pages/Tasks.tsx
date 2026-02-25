"use client";

import React, { useState, useEffect } from 'react';
import { LayoutList, LayoutGrid, Inbox, Calendar, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskInput from '@/components/tasks/TaskInput';
import TaskListView from '@/components/tasks/TaskListView';
import TaskDetail from '@/components/tasks/TaskDetail';
import { Task } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

type Filter = 'inbox' | 'today' | 'upcoming';
type View = 'list' | 'board';

const Tasks = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('inbox');
  const [view, setView] = useState<View>('list');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

      if (activeFilter === 'today') {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        query = query.or(`due_date.eq.${todayStr},due_date.lt.${todayStr}`);
      } else if (activeFilter === 'inbox') {
        const { data: inbox } = await supabase.from('projects').select('id').eq('is_inbox', true).single();
        if (inbox) query = query.eq('project_id', inbox.id);
      } else if (activeFilter === 'upcoming') {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        query = query.gt('due_date', todayStr);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({ title: "fetch error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeFilter]);

  const handleToggle = async (id: string, status: 'open' | 'completed') => {
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
      if (error) throw error;
      
      if (status === 'completed') {
        toast({ title: "task conquered." });
      }
    } catch (error: any) {
      fetchTasks();
      toast({ title: "sync error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== id));
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "removed from reality." });
    } catch (error: any) {
      fetchTasks();
      toast({ title: "delete error", description: error.message, variant: "destructive" });
    }
  };

  const handleTaskCreated = (newTask?: Task) => {
    fetchTasks();
    if (newTask) {
      setSelectedTask(newTask);
    }
  };

  const filterTabs = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">workflow</h2>
          <h1 className="text-6xl font-extrabold tracking-tighter lowercase">the grind.</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as Filter)}
                className={cn(
                  "px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeFilter === tab.id ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            <button 
              onClick={() => setView('list')}
              className={cn(
                "p-2 rounded-xl transition-all",
                view === 'list' ? "bg-zinc-800 text-white" : "text-zinc-500"
              )}
            >
              <LayoutList size={18} />
            </button>
            <button 
              onClick={() => setView('board')}
              className={cn(
                "p-2 rounded-xl transition-all",
                view === 'board' ? "bg-zinc-800 text-white" : "text-zinc-500"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        <TaskInput onTaskCreated={handleTaskCreated} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-zinc-800" size={40} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Syncing database...</p>
          </div>
        ) : (
          <TaskListView 
            tasks={tasks} 
            onToggle={handleToggle} 
            onDelete={handleDelete} 
            onTaskClick={(task) => setSelectedTask(task)}
            title={activeFilter}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)}
            onUpdate={fetchTasks}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;