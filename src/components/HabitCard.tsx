"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit } from '@/types/app';
import { Check, Flame, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitCard = ({ habit, onToggle, onDelete }: HabitCardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDays.includes(today);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative p-6 rounded-[2rem] flex items-center gap-6 transition-all duration-300 border",
        isCompletedToday 
          ? "bg-zinc-900 border-transparent opacity-60" 
          : "bg-black border-zinc-800 hover:border-zinc-600"
      )}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
          isCompletedToday 
            ? "bg-white text-black" 
            : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-white"
        )}
      >
        <AnimatePresence mode="wait">
          {isCompletedToday ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Check size={28} strokeWidth={3} />
            </motion.div>
          ) : (
            <span key="emoji" className="text-2xl grayscale hover:grayscale-0 transition-all">{habit.emoji}</span>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-xl font-bold tracking-tight lowercase transition-all duration-300",
          isCompletedToday && "text-zinc-500 line-through"
        )}>
          {habit.name}
        </h4>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{habit.category}</span>
          <div className="flex items-center gap-1.5 text-white/80">
            <Flame size={12} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{habit.streak} day streak</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 rounded-xl">
            <DropdownMenuItem 
              onClick={() => onDelete(habit.id)}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer p-3 rounded-lg"
            >
              <Trash2 size={16} className="mr-2" />
              Delete ritual
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default HabitCard;