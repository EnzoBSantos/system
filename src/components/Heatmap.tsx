"use client";

import React from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { Habit } from '@/types/app';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
}

const Heatmap = ({ habits, onToggleHabit }: HeatmapProps) => {
  // Configura a semana para começar na segunda-feira (ISO week)
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 space-y-8 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight lowercase">weekly flow.</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">completed</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[450px] space-y-4">
          {/* Header row with day initials */}
          <div className="grid grid-cols-[1fr_repeat(7,40px)] gap-4 items-center mb-6">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">ritual</span>
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

          {/* Habit rows */}
          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-600 text-sm font-medium lowercase">no rituals defined yet.</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className="grid grid-cols-[1fr_repeat(7,40px)] gap-4 items-center group py-2"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xl shrink-0">{habit.emoji || '✨'}</span>
                    <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors truncate lowercase">
                      {habit.name}
                    </span>
                  </div>

                  {weekDays.map((day) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const isCompleted = habit.completedDays.includes(dateStr);
                    
                    return (
                      <TooltipProvider key={dateStr}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onToggleHabit(habit.id, dateStr)}
                              className={cn(
                                "w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all duration-300 mx-auto",
                                isCompleted 
                                  ? "bg-white border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                                  : "border-zinc-800 hover:border-zinc-600 bg-transparent"
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-black border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">
                            {format(day, 'MMM d')}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
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