"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import HabitCard from '@/components/HabitCard';
import AddHabitDialog from '@/components/AddHabitDialog';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Habit, PomodoroSession } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'pomodoro'>('dashboard');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'evening reflection',
      emoji: '🌑',
      color: '#ffffff',
      category: 'Mindfulness',
      frequency: 'daily',
      completedDays: [new Date().toISOString().split('T')[0]],
      createdAt: new Date().toISOString(),
      streak: 5,
      longestStreak: 12
    },
    {
      id: '2',
      name: 'cold exposure',
      emoji: '❄️',
      color: '#ffffff',
      category: 'Health',
      frequency: 'daily',
      completedDays: [],
      createdAt: new Date().toISOString(),
      streak: 3,
      longestStreak: 8
    }
  ]);

  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  const filteredHabits = useMemo(() => {
    return habits.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
      const today = new Date().toISOString().split('T')[0];
      const isCompleted = h.completedDays.includes(today);
      
      if (filter === 'Completed') return matchesSearch && isCompleted;
      if (filter === 'Pending') return matchesSearch && !isCompleted;
      return matchesSearch;
    });
  }, [habits, search, filter]);

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'completedDays' | 'createdAt' | 'streak' | 'longestStreak'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      completedDays: [],
      createdAt: new Date().toISOString(),
      streak: 0,
      longestStreak: 0
    };
    setHabits([habit, ...habits]);
  };

  const handleToggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDays.includes(today);
        const newCompletedDays = isCompleted 
          ? h.completedDays.filter(d => d !== today)
          : [...h.completedDays, today];
        
        return {
          ...h,
          completedDays: newCompletedDays,
          streak: isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1
        };
      }
      return h;
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleCompleteSession = (session: Omit<PomodoroSession, 'id' | 'timestamp'>) => {
    const newSession: PomodoroSession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Subtle Noise Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 lg:p-16">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Dashboard habits={habits} sessions={sessions} />
              </motion.div>
            )}

            {activeTab === 'habits' && (
              <motion.div
                key="habits"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-3">
                    <h2 className="text-6xl font-black tracking-tighter lowercase">daily rituals.</h2>
                    <p className="text-zinc-500 text-lg font-medium lowercase">discipline is the path to freedom.</p>
                  </div>
                  <AddHabitDialog onAdd={handleAddHabit} />
                </header>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-zinc-900 p-3 rounded-[2rem] border border-zinc-800">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <Input 
                      placeholder="search practices..." 
                      className="pl-12 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg lowercase font-medium"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    {['All', 'Pending', 'Completed'].map((f) => (
                      <Button
                        key={f}
                        variant="ghost"
                        onClick={() => setFilter(f as any)}
                        className={cn(
                          "px-6 h-12 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all",
                          filter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                        )}
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredHabits.map((habit) => (
                      <HabitCard 
                        key={habit.id} 
                        habit={habit} 
                        onToggle={handleToggleHabit} 
                        onDelete={handleDeleteHabit}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {filteredHabits.length === 0 && (
                  <div className="text-center py-32 space-y-4">
                    <p className="text-4xl font-black tracking-tighter opacity-20 lowercase">void.</p>
                    <p className="text-zinc-500 font-medium">every habit begins with a single choice.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pomodoro' && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <header className="space-y-3 mb-12 text-center">
                  <h2 className="text-6xl font-black tracking-tighter lowercase">deep focus.</h2>
                  <p className="text-zinc-500 text-lg font-medium lowercase">be here now.</p>
                </header>
                <PomodoroTimer habits={habits} onComplete={handleCompleteSession} />
                
                <div className="mt-20 max-w-xl mx-auto space-y-6">
                  <h3 className="text-2xl font-black tracking-tighter border-b border-zinc-800 pb-4 lowercase">recorded sessions.</h3>
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((s) => (
                      <div key={s.id} className="flex items-center justify-between bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            s.type === 'focus' ? "bg-white" : "bg-zinc-600"
                          )} />
                          <span className="font-bold tracking-tight lowercase text-zinc-300">{s.type.replace('-', ' ')}</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-500">
                          {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <p className="text-center text-zinc-600 font-bold text-xs uppercase tracking-widest py-12 opacity-30">
                        no intervals recorded today
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;