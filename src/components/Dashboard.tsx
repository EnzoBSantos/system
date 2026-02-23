"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Habit, PomodoroSession } from '@/types/app';
import { Flame, CheckCircle2, Timer, TrendingUp } from 'lucide-react';
import Heatmap from './Heatmap';
import { format } from 'date-fns';

interface DashboardProps {
  habits: Habit[];
  sessions: PomodoroSession[];
}

const Dashboard = ({ habits, sessions }: DashboardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const habitsToday = habits.length;
  const completedToday = habits.filter(h => h.completedDays.includes(today)).length;
  const completionRate = habitsToday > 0 ? Math.round((completedToday / habitsToday) * 100) : 0;
  
  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
  const totalSessions = sessions.filter(s => s.timestamp.split('T')[0] === today).length;

  const stats = [
    { label: 'progress', value: `${completionRate}%`, icon: TrendingUp },
    { label: 'rituals', value: `${completedToday}/${habitsToday}`, icon: CheckCircle2 },
    { label: 'focus', value: totalSessions, icon: Timer },
    { label: 'streak', value: totalStreaks, icon: Flame },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <header className="space-y-3">
        <h2 className="text-6xl font-extrabold tracking-tighter lowercase">good morning.</h2>
        <p className="text-zinc-500 font-medium text-lg lowercase">{format(new Date(), 'EEEE, MMMM do')}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900 p-8 rounded-[2.5rem] space-y-4 hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="text-white" size={24} />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-4xl font-extrabold tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Heatmap habits={habits} />
        </div>
        
        <div className="bg-white text-black rounded-[3rem] p-10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="84"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="12"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="84"
                fill="none"
                stroke="black"
                strokeWidth="12"
                strokeDasharray="528"
                initial={{ strokeDashoffset: 528 }}
                animate={{ strokeDashoffset: 528 - (528 * completionRate) / 100 }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-tighter">{completionRate}%</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">daily goal</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h4 className="font-bold text-2xl tracking-tight lowercase">keep growing.</h4>
            <p className="text-sm text-zinc-500 px-6 font-medium">your discipline defines your peace.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;