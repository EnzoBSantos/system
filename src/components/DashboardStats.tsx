"use client";

import React from 'react';
import { Habit } from '@/types/app';
import { Flame, Target, Trophy, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  habits: Habit[];
}

const DashboardStats = ({ habits }: DashboardStatsProps) => {
  const totalRituals = habits.length;

  // Calcula o streak global (dias onde TODOS os rituais foram completados)
  const calculateGlobalStreak = () => {
    if (habits.length === 0) return 0;

    // Pega todas as datas únicas de conclusão
    const allCompletedDates = Array.from(new Set(habits.flatMap(h => h.completed_days || [])));
    
    // Identifica quais datas foram "perfeitas" (todos os hábitos completados nela)
    const perfectDays = allCompletedDates.filter(date => 
      habits.every(h => h.completed_days?.includes(date))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (perfectDays.length === 0) return 0;

    // Calcula a sequência consecutiva partindo de hoje ou ontem
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Se o dia mais recente não for hoje nem ontem, o streak é 0
    if (perfectDays[0] !== todayStr && perfectDays[0] !== yesterdayStr) return 0;

    let streak = 0;
    let currentDate = new Date(perfectDays[0]);

    for (let i = 0; i < perfectDays.length; i++) {
      const pDay = perfectDays[i];
      const expectedDateStr = currentDate.toISOString().split('T')[0];

      if (pDay === expectedDateStr) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const globalStreak = calculateGlobalStreak();
  
  const avgCompletion = habits.length > 0 
    ? Math.round((habits.reduce((acc, h) => acc + (h.completed_days?.length || 0), 0) / (habits.length * 7)) * 100) 
    : 0;

  const stats = [
    { label: 'active rituals', value: totalRituals, icon: Target },
    { label: 'total streaks', value: globalStreak, icon: Flame },
    { label: 'weekly flow', value: `${avgCompletion}%`, icon: Calendar },
    { label: 'best record', value: Math.max(0, ...habits.map(h => h.streak || 0)), icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white">
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