"use client";

import React from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { Habit } from '@/types/app';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapProps {
  habits: Habit[];
}

const Heatmap = ({ habits }: HeatmapProps) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
  
  const getIntensity = (date: Date) => {
    const completions = habits.filter(h => 
      h.completedDays.some(d => isSameDay(new Date(d), date))
    ).length;
    
    if (habits.length === 0) return 0;
    return completions / habits.length;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight lowercase">weekly flow.</h3>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">low</span>
          <div className="flex space-x-1.5">
            {[0.2, 0.4, 0.7, 1].map((lvl) => (
              <div 
                key={lvl} 
                className="w-4 h-4 rounded-md" 
                style={{ backgroundColor: `rgba(255, 255, 255, ${lvl})` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">high</span>
        </div>
      </div>

      <div className="flex justify-between items-end gap-4 h-40">
        <TooltipProvider>
          {last7Days.map((day) => {
            const intensity = getIntensity(day);
            return (
              <Tooltip key={day.toISOString()}>
                <TooltipTrigger asChild>
                  <div className="flex-1 flex flex-col items-center gap-4 group">
                    <div 
                      className="w-full rounded-2xl transition-all duration-500 bg-zinc-800 hover:bg-zinc-700"
                      style={{ 
                        height: `${Math.max(10, intensity * 100)}%`, 
                        backgroundColor: intensity > 0 ? `rgba(255, 255, 255, ${0.2 + intensity * 0.8})` : undefined 
                      }}
                    />
                    <span className="text-[10px] font-bold text-zinc-500 group-hover:text-white uppercase tracking-widest">
                      {format(day, 'EEE')}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black border-zinc-800 text-white rounded-xl">
                  {format(day, 'MMM d')}: {Math.round(intensity * 100)}% complete
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Heatmap;