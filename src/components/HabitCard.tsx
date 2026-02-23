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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative bg-card border border-border p-5 rounded-2xl flex items-center gap-4 transition-all duration-500",
        isCompletedToday ? "border-primary/20 bg-primary/5" : "hover:border-primary/30"
      )}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
          isCompletedToday 
            ? "bg-primary border-primary text-primary-foreground scale-110" 
            : "border-border text-muted-foreground hover:border-primary/50"
        )}
      >
        <AnimatePresence mode="wait">
          {isCompletedToday ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
            >
              <Check size={24} strokeWidth={3} />
            </motion.div>
          ) : (
            <span key="emoji" className="text-xl group-hover:scale-110 transition-transform">{habit.emoji}</span>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0 space-y-1">
        <h4 className={cn(
          "font-serif text-lg truncate transition-all duration-500",
          isCompletedToday && "text-muted-foreground line-through opacity-60"
        )}>
          {habit.name}
        </h4>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
          <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">{habit.category}</span>
          <div className="flex items-center gap-1 text-primary">
            <Flame size={12} fill="currentColor" />
            <span>{habit.streak} DAY STREAK</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem 
              onClick={() => onDelete(habit.id)}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 size={14} className="mr-2" />
              Delete Habit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default HabitCard;