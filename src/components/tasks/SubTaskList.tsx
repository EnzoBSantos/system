"use client";

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Check, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SubTaskListProps {
  parentTaskId: string;
  userId: string;
  projectId: string | null;
}

const SubTaskList = ({ parentTaskId, userId, projectId }: SubTaskListProps) => {
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchSubtasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('parent_task_id', parentTaskId)
      .order('created_at', { ascending: true });

    if (!error) setSubtasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubtasks();
  }, [parentTaskId]);

  const addSubtask = async () => {
    if (!newTitle.trim() || isAdding) return;
    setIsAdding(true);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        parent_task_id: parentTaskId,
        project_id: projectId,
        title: newTitle.trim(),
        status: 'open',
        priority_level: 4
      })
      .select()
      .single();

    if (!error) {
      setSubtasks([...subtasks, data]);
      setNewTitle('');
    }
    setIsAdding(false);
  };

  const toggleSubtask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'completed' : 'open';
    setSubtasks(subtasks.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
  };

  const deleteSubtask = async (id: string) => {
    setSubtasks(subtasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">sub-tasks</h4>
        <span className="text-[10px] font-bold text-zinc-700">{subtasks.filter(s => s.status === 'completed').length}/{subtasks.length}</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {subtasks.map((st) => (
            <motion.div 
              key={st.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3 group"
            >
              <button
                onClick={() => toggleSubtask(st.id, st.status)}
                className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                  st.status === 'completed' ? "bg-white border-white text-black" : "border-zinc-800 hover:border-zinc-600"
                )}
              >
                {st.status === 'completed' && <Check size={12} strokeWidth={4} />}
              </button>
              <span className={cn(
                "flex-1 text-sm lowercase font-medium transition-all",
                st.status === 'completed' && "text-zinc-600 line-through"
              )}>
                {st.title}
              </span>
              <button 
                onClick={() => deleteSubtask(st.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-500 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-5 h-5 flex items-center justify-center text-zinc-700">
            <Plus size={14} />
          </div>
          <input 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
            placeholder="add sub-task..."
            className="flex-1 bg-transparent border-none outline-none ring-0 text-sm lowercase placeholder:text-zinc-700"
          />
          {isAdding && <Loader2 className="animate-spin text-zinc-700" size={14} />}
        </div>
      </div>
    </div>
  );
};

export default SubTaskList;