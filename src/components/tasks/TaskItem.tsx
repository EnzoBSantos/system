"use client";

import React from 'react';
import { Task } from '@/types/tasks';
import { Check, Calendar, Hash, Trash2, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast, isToday as isTodayDate } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, status: 'open' | 'completed') => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onClick }: TaskItemProps) => {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isTodayDate(new Date(task.due_date)) && !isCompleted;

  const priorityColors = {
    1: "border-red-500 text-red-500 bg-red-500/5",
    2: "border-orange-500 text-orange-500 bg-orange-500/5",
    3: "border-blue-500 text-blue-500 bg-blue-500/5",
    4: "border-zinc-800 text-zinc-500 bg-transparent"
  };

  return (
    <motion.div 
      layout
      className={cn(
        "group flex items-center gap-3 p-3 md:p-5 rounded-[1.2rem] md:rounded-[2rem] transition-all border cursor-pointer min-h-[52px]",
        isCompleted ? "bg-zinc-900/30 border-transparent opacity-50" : cn("bg-black hover:border-zinc-600", priorityColors[task.priority_level as keyof typeof priorityColors])
      )}
      onClick={() => onClick(task)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id, isCompleted ? 'open' : 'completed');
        }}
        className={cn(
          "w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
          isCompleted 
            ? "bg-white border-white text-black" 
            : "border-zinc-700 hover:border-white"
        )}
      >
        {isCompleted && <Check size={14} strokeWidth={4} />}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-sm md:text-lg font-bold tracking-tight lowercase truncate",
          isCompleted && "line-through text-zinc-600"
        )}>
          {task.title}
        </h4>
        
        <div className="flex items-center gap-3 mt-0.5">
          {task.due_date && (
            <div className={cn(
              "flex items-center gap-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest",
              isOverdue ? "text-red-500" : "text-zinc-500"
            )}>
              <Calendar size={10} />
              {isTodayDate(new Date(task.due_date)) ? "Today" : format(new Date(task.due_date), 'MMM d')}
            </div>
          )}
          <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <Hash size={10} />
            #inbox
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-700 hover:text-red-500 transition-all"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

export default TaskItem;