"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit } from '@/types/app';
import { 
  Check, 
  Flame, 
  Trash2, 
  MoreVertical,
  Pencil,
  Sparkles, 
  Zap, 
  Heart, 
  Brain, 
  BookOpen, 
  Dumbbell, 
  Moon, 
  Coffee, 
  Timer, 
  CheckCircle2, 
  Wind, 
  Droplets,
  Smile,
  Star,
  Sun,
  Flame as FlameIcon,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import EditHabitDialog from './EditHabitDialog';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, CheckCircle2, Wind, Droplets, Smile, Star, Sun, Flame: FlameIcon
};

const HabitCard = ({ habit, onToggle, onDelete, onUpdate }: HabitCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDays.includes(today);

  const renderSymbol = () => {
    const Icon = ICON_MAP[habit.emoji];
    if (Icon) return <Icon size={24} md-size={28} />;
    return <span className="text-xl md:text-2xl">{habit.emoji}</span>;
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "group relative p-5 md:p-6 rounded-[2rem] flex items-center gap-4 md:gap-6 transition-all duration-300 border",
          isCompletedToday 
            ? "bg-zinc-900 border-transparent opacity-60" 
            : "bg-black border-zinc-800 hover:border-zinc-600"
        )}
      >
        <button
          onClick={() => onToggle(habit.id)}
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0",
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
                <Check size={24} md-size={28} strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="symbol"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="grayscale hover:grayscale-0 transition-all"
              >
                {renderSymbol()}
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-lg md:text-xl font-bold tracking-tight lowercase transition-all duration-300 truncate",
            isCompletedToday && "text-zinc-500 line-through"
          )}>
            {habit.name}
          </h4>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{habit.category}</span>
            <div className="flex items-center gap-1 text-white/80">
              <Flame size={10} md-size={12} fill="currentColor" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{habit.streak} day streak</span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 md:h-12 md:w-12 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900"
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 rounded-xl p-1">
              <DropdownMenuItem 
                onClick={() => setIsEditDialogOpen(true)}
                className="focus:text-white focus:bg-white/10 cursor-pointer p-3 rounded-lg font-bold text-xs uppercase tracking-widest"
              >
                <Pencil size={16} className="mr-2" />
                Edit ritual
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(habit.id)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer p-3 rounded-lg font-bold text-xs uppercase tracking-widest"
              >
                <Trash2 size={16} className="mr-2" />
                Delete ritual
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <EditHabitDialog 
        habit={habit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default HabitCard;