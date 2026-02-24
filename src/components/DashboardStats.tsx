"use client";

import React from 'react';
import { Habit } from '@/types/app';
import { Flame, Target, Trophy, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  habits: Habit[];
}

const DashboardStats = ({ habits }: DashboardStatsProps) => {
  const totalRituals = habits.length;
  const currentStreaks = habits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const avgCompletion = habits.length > 0 
    ? Math.round((habits.reduce((acc, h) => acc + (h.completed_days?.length || 0), 0) / (habits.length * 7)) * 100) 
    : 0;

  const stats = [
    { label: 'active rituals', value: totalRituals, icon: Target, color: 'text-blue-500' },
    { label: 'total streaks', value: currentStreaks, icon: Flame, color: 'text-orange-500' },
    { label: 'weekly flow', value: `${avgCompletion}%`, icon: Calendar, color: 'text-green-500' },
    { label: 'best record', value: Math.max(0, ...habits.map(h => h.streak || 0)), icon: Trophy, color: 'text-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] space-y-3">
            <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-bold tracking-tighter">{stat.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;