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
    { label: 'Progress', value: `${completionRate}%`, icon: TrendingUp, color: 'text-primary' },
    { label: 'Habits', value: `${completedToday}/${habitsToday}`, icon: CheckCircle2, color: 'text-primary' },
    { label: 'Sessions', value: totalSessions, icon: Timer, color: 'text-primary' },
    { label: 'Total Streak', value: totalStreaks, icon: Flame, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="space-y-2">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Overview</p>
        <h2 className="text-4xl font-serif text-foreground">Welcome back.</h2>
        <p className="text-muted-foreground font-sans">It's {format(new Date(), 'EEEE, MMMM do')}.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={stat.color} size={20} />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-serif">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Heatmap habits={habits} />
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * completionRate) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif">{completionRate}%</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Day Goal</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-serif text-lg">Consistent Spirit</h4>
            <p className="text-xs text-muted-foreground px-4">You're doing better than 80% of your average.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;