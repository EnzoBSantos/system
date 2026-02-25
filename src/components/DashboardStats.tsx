"use client";

import React from 'react';
import { Habit } from '@/types/app';
import { Flame, Target, Trophy, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  habits: Habit[];
}

const DashboardStats = ({ habits }: DashboardStatsProps) => {
  const totalRituals = habits.length;

  const calculateGlobalStreak = () => {
    if (habits.length === 0) return 0;
    const allCompletedDates = Array.from(new Set(habits.flatMap(h => h.completed_days || [])));
    const perfectDays = allCompletedDates.filter(date => 
      habits.every(h => h.completed_days?.includes(date))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (perfectDays.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (perfectDays[0] !== todayStr && perfectDays[0] !== yesterdayStr) return 0;

    let streak = 0;
    let currentDate = new Date(perfectDays[0]);
    for (let i = 0; i < perfectDays.length; i++) {
      if (perfectDays[i] === currentDate.toISOString().split('T')[0]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const globalStreak = calculateGlobalStreak();
  
  const stats = [
    { label: 'rituals', value: totalRituals, icon: Target },
    { label: 'streak', value: globalStreak, icon: Flame },
    { label: 'flow', value: '88%', icon: Calendar },
    { label: 'record', value: Math.max(0, ...habits.map(h => h.streak || 0)), icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
              <Icon size={16} className="md:size-20" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-lg md:text-2xl font-bold tracking-tighter">{stat.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;