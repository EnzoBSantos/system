"use client";

import React, { useState } from 'react';
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

      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          project_id: defaultProjectId,
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
      "relative transition-all duration-300",
      isFocused ? "scale-[1.01]" : "scale-100"
    )}>
      <div className={cn(
        "bg-zinc-900/50 border rounded-2xl md:rounded-[2rem] p-2 md:p-4 transition-all duration-300",
        isFocused ? "border-white/20 bg-zinc-900" : "border-zinc-800"
      )}>
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Capture ritual..."
            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 text-sm md:text-lg placeholder:text-zinc-600 lowercase font-medium h-10 md:h-12"
          />
          <button 
            onClick={handleCreate}
            disabled={!input.trim() || isSubmitting}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
              input.trim() ? "bg-white text-black" : "bg-zinc-800 text-zinc-500"
            )}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskInput;