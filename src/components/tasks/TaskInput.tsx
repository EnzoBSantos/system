"use client";

import React, { useState, useRef } from 'react';
import { Plus, Calendar, Hash, Tag, Send, Loader2 } from 'lucide-react';
import { parseTaskInput } from '@/utils/nlpParser';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/tasks';

interface TaskInputProps {
  onTaskCreated: (task?: Task) => void;
  defaultProjectId?: string | null;
}

const TaskInput = ({ onTaskCreated, defaultProjectId }: TaskInputProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const parsed = parseTaskInput(input);
  const hasMetadata = parsed.due_date || parsed.project || parsed.labels.length > 0 || parsed.priority < 4;

  const handleCreate = async () => {
    if (!input.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      let resolvedProjectId = defaultProjectId;
      if (parsed.project) {
        const { data: projectData } = await supabase
          .from('projects')
          .select('id')
          .ilike('name', parsed.project)
          .single();
        if (projectData) resolvedProjectId = projectData.id;
      }

      if (!resolvedProjectId) {
        const { data: inbox } = await supabase
          .from('projects')
          .select('id')
          .eq('is_inbox', true)
          .single();
        resolvedProjectId = inbox?.id;
      }

      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          project_id: resolvedProjectId,
          title: parsed.title,
          due_date: parsed.due_date,
          due_time: parsed.due_time,
          priority_level: parsed.priority,
          status: 'open'
        })
        .select()
        .single();

      if (taskError) throw taskError;

      setInput('');
      onTaskCreated(task);
      toast({ title: "task captured." });
    } catch (error: any) {
      toast({ title: "capture failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn(
      "relative group transition-all duration-500",
      isFocused ? "scale-[1.01]" : "scale-100"
    )}>
      <div className={cn(
        "bg-zinc-900/50 border rounded-[2rem] p-4 transition-all duration-300",
        isFocused ? "border-white/20 bg-zinc-900 shadow-2xl" : "border-zinc-800"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
            <Plus size={20} className={cn("transition-transform duration-500", isFocused && "rotate-90")} />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Capture ritual... (e.g. Read Stoicism tomorrow #Personal !p1)"
            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 text-lg placeholder:text-zinc-600 lowercase font-medium"
          />
          <button 
            onClick={handleCreate}
            disabled={!input.trim() || isSubmitting}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              input.trim() ? "bg-white text-black" : "bg-zinc-800 text-zinc-500"
            )}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isFocused && hasMetadata && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-white/5">
                {parsed.due_date && (
                  <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{parsed.due_date} {parsed.due_time || ''}</span>
                  </div>
                )}
                {parsed.project && (
                  <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-xl border border-purple-500/20">
                    <Hash size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{parsed.project}</span>
                  </div>
                )}
                {parsed.priority < 4 && (
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                    parsed.priority === 1 ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    parsed.priority === 2 ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  )}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">P{parsed.priority}</span>
                  </div>
                )}
                {parsed.labels.map(label => (
                  <div key={label} className="flex items-center gap-2 bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-xl border border-zinc-700">
                    <Tag size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskInput;