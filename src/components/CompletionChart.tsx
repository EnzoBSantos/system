"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '@/types/app';

interface CompletionChartProps {
  habits: Habit[];
}

const CompletionChart = ({ habits }: CompletionChartProps) => {
  const today = new Date().toISOString().split('T')[0];
  const total = habits.length;
  const completed = habits.filter(h => h.completed_days?.includes(today)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white text-black rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex flex-col items-center justify-center space-y-3 md:space-y-6 relative overflow-hidden h-full min-h-[220px] md:min-h-[320px]">
      <div className="relative w-28 h-28 md:w-40 md:h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "circOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl md:text-5xl font-black tracking-tighter leading-none">{percentage}%</span>
          <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 md:mt-1">rituals</span>
        </div>
      </div>
      <div className="text-center space-y-0.5 md:space-y-1">
        <h4 className="font-bold text-lg md:text-xl tracking-tight lowercase">daily mastery.</h4>
        <p className="text-[10px] md:text-xs text-zinc-500 font-medium px-2 md:px-4">
          {completed} of {total} rituals honored today.
        </p>
      </div>
    </div>
  );
};

export default CompletionChart;