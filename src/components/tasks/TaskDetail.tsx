"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';
import { X, Calendar, Flag, Hash, AlignLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import SubTaskList from './SubTaskList';
import { useToast } from '@/components/ui/use-toast';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskDetail = ({ task: initialTask, onClose, onUpdate }: TaskDetailProps) => {
  const [task, setTask] = useState<Task>(initialTask);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const priorities: { level: Priority; label: string; color: string }[] = [
    { level: 1, label: 'p1', color: 'text-red-500' },
    { level: 2, label: 'p2', color: 'text-orange-500' },
    { level: 3, label: 'p3', color: 'text-blue-500' },
    { level: 4, label: 'p4', color: 'text-zinc-500' },
  ];

  const updateTask = async (updates: Partial<Task>) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', task.id);

    if (!error) {
      setTask({ ...task, ...updates });
      onUpdate();
    } else {
      toast({ title: "failed to sync", variant: "destructive" });
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 md:p-6 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />
      
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-xl h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl pointer-events-auto flex flex-col rounded-[2.5rem] lg:rounded-r-none"
      >
        <header className="flex items-center justify-between p-8 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              task.status === 'completed' ? "bg-white text-black" : "bg-zinc-900 text-zinc-500"
            )}>
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">task detail</span>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && <Loader2 size={16} className="animate-spin text-zinc-700 mr-2" />}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-zinc-500 hover:text-white">
              <X size={20} />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* Title & Priority */}
          <div className="space-y-6">
            <input 
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              onBlur={() => updateTask({ title: task.title })}
              className="w-full bg-transparent border-none text-4xl font-black tracking-tighter lowercase focus:ring-0 px-0 outline-none"
            />
            
            <div className="flex flex-wrap gap-3">
              {priorities.map((p) => (
                <button
                  key={p.level}
                  onClick={() => updateTask({ priority_level: p.level })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                    task.priority_level === p.level 
                      ? "bg-white text-black border-white" 
                      : cn("bg-zinc-900 border-zinc-800 hover:border-zinc-600", p.color)
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> due date
              </label>
              <input 
                type="date"
                value={task.due_date || ''}
                onChange={(e) => updateTask({ due_date: e.target.value || null })}
                className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-2 text-sm lowercase font-medium focus:border-white outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <Hash size={12} /> project
              </label>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm lowercase font-medium text-zinc-400">
                inbox
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft size={12} /> description
            </label>
            <Textarea 
              value={task.description || ''}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              onBlur={() => updateTask({ description: task.description })}
              placeholder="add details about this ritual..."
              className="min-h-[150px] bg-zinc-900/50 border-zinc-800 rounded-[1.5rem] p-6 text-sm leading-relaxed lowercase focus:border-white"
            />
          </div>

          {/* Subtasks */}
          <SubTaskList 
            parentTaskId={task.id} 
            userId={task.user_id} 
            projectId={task.project_id} 
          />
        </div>

        <footer className="p-8 border-t border-zinc-900 flex justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-2xl h-12 px-8 font-bold text-zinc-500 hover:text-white lowercase"
          >
            close detail
          </Button>
        </footer>
      </motion.div>
    </div>
  );
};

export default TaskDetail;