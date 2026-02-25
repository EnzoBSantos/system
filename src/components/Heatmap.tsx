"use client";

import React from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { Habit } from '@/types/app';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, CheckCircle2, Wind, Droplets, Smile, Star, Sun, Flame,
  LucideIcon
} from 'lucide-react';

interface HeatmapProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, CheckCircle2, Wind, Droplets, Smile, Star, Sun, Flame
};

const Heatmap = ({ habits, onToggleHabit }: HeatmapProps) => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const renderSymbol = (emoji: string) => {
    const Icon = ICON_MAP[emoji];
    if (Icon) return <Icon size={20} className="md:size-6" />;
    return <span className="text-xl">{emoji}</span>;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 space-y-8 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight lowercase">weekly flow.</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">completed</span>
        </div>
      </div>

      <div className="w-full">
        <div className="space-y-6">
          <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 items-center">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center">rit</span>
            <div className="grid grid-cols-7 gap-1 md:gap-4">
              {dayInitials.map((initial, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isToday(weekDays[i]) ? "text-white" : "text-zinc-600"
                  )}>
                    {initial}
                  </span>
                  {isToday(weekDays[i]) && (
                    <div className="w-1 h-1 rounded-full bg-white" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-600 text-sm font-medium lowercase">no rituals defined yet.</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 items-center group"
                >
                  <div className="flex justify-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-zinc-400 hover:text-white transition-colors">
                            {renderSymbol(habit.emoji)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">
                          {habit.name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-7 gap-1 md:gap-4">
                    {weekDays.map((day) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const isCompleted = habit.completed_days?.includes(dateStr);
                      
                      return (
                        <div key={dateStr} className="flex justify-center">
                          <button
                            onClick={() => onToggleHabit(habit.id, dateStr)}
                            className={cn(
                              "w-7 h-7 md:w-9 md:h-9 rounded-full border-2 transition-all duration-200",
                              isCompleted 
                                ? "bg-white border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                                : "border-zinc-800 hover:border-zinc-700 bg-transparent"
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;