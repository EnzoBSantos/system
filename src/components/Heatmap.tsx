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
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl">Weekly Energy</h3>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Less</span>
          <div className="flex space-x-1">
            {[0.2, 0.5, 0.8, 1].map((lvl) => (
              <div 
                key={lvl} 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: `rgba(240, 165, 0, ${lvl})` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">More</span>
        </div>
      </div>

      <div className="flex justify-between items-end gap-2 h-32">
        <TooltipProvider>
          {last7Days.map((day) => {
            const intensity = getIntensity(day);
            return (
              <Tooltip key={day.toISOString()}>
                <TooltipTrigger asChild>
                  <div className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-500 bg-primary/20 hover:bg-primary/40"
                      style={{ height: `${Math.max(15, intensity * 100)}%`, backgroundColor: intensity > 0 ? `rgba(240, 165, 0, ${0.2 + intensity * 0.8})` : undefined }}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground">
                      {format(day, 'EEE')}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-background border-border text-foreground">
                  {format(day, 'MMM d')}: {Math.round(intensity * 100)}% Complete
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