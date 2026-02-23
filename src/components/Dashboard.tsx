"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Habit, PomodoroSession } from '@/types/app';
import { Flame, CheckCircle2, Timer, TrendingUp, Quote } from 'lucide-react';
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
    <div className="space-y-8 md:space-y-12 max-w-5xl mx-auto">
      <header className="space-y-3">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter lowercase">good morning.</h2>
        <p className="text-zinc-500 font-medium text-lg lowercase">{format(new Date(), 'EEEE, MMMM do')}.</p>
      </header>

      {/* Mobile-only Inspiration Quote Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <Quote size={18} className="text-zinc-400" />
        </div>
        <p className="text-sm font-medium leading-relaxed italic text-zinc-300">"what you think, you become."</p>
      </motion.div>

      {/* Stats Grid: 2x2 on Mobile, 1x4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-3 md:space-y-4 hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="text-white" size={20} md-size={24} />
              <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-2xl md:text-4xl font-extrabold tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <Heatmap habits={habits} />
        </div>
        
        {/* Daily Goal Progress Ring */}
        <div className="bg-white text-black rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col items-center justify-center space-y-6 md:space-y-8 relative overflow-hidden min-h-[320px]">
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80" md-cx="96"
                cy="80" md-cy="96"
                r="70" md-r="84"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="10" md-strokeWidth="12"
              />
              <motion.circle
                cx="80" md-cx="96"
                cy="80" md-cy="96"
                r="70" md-r="84"
                fill="none"
                stroke="black"
                strokeWidth="10" md-strokeWidth="12"
                strokeDasharray="440" md-strokeDasharray="528"
                initial={{ strokeDashoffset: 528 }}
                animate={{ strokeDashoffset: 528 - (528 * completionRate) / 100 }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-black tracking-tighter">{completionRate}%</span>
              <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase">daily goal</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h4 className="font-bold text-xl md:text-2xl tracking-tight lowercase">keep growing.</h4>
            <p className="text-xs md:text-sm text-zinc-500 px-4 md:px-6 font-medium">your discipline defines your peace.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;