"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import HabitCard from '@/components/HabitCard';
import AddHabitDialog from '@/components/AddHabitDialog';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Habit, PomodoroSession, Category } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'pomodoro'>('dashboard');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  
  // State stored in memory (as requested)
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Deep Reading',
      emoji: '📚',
      color: '#f0a500',
      category: 'Learning',
      frequency: 'daily',
      completedDays: [new Date().toISOString().split('T')[0]],
      createdAt: new Date().toISOString(),
      streak: 5,
      longestStreak: 12
    },
    {
      id: '2',
      name: 'Morning Vinyasa',
      emoji: '🧘',
      color: '#f0a500',
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <Dashboard habits={habits} sessions={sessions} />
              </motion.div>
            )}

            {activeTab === 'habits' && (
              <motion.div
                key="habits"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Rituals</p>
                    <h2 className="text-4xl font-serif">Daily Practice</h2>
                  </div>
                  <AddHabitDialog onAdd={handleAddHabit} />
                </header>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-2 rounded-2xl border border-border">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                      placeholder="Search habits..." 
                      className="pl-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1">
                    {['All', 'Pending', 'Completed'].map((f) => (
                      <Button
                        key={f}
                        variant="ghost"
                        onClick={() => setFilter(f as any)}
                        className={cn(
                          "px-4 h-9 font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all",
                          filter === f ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" : "text-muted-foreground"
                        )}
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                  <div className="text-center py-20 space-y-4">
                    <p className="font-serif text-2xl text-muted-foreground">The space is empty.</p>
                    <p className="text-muted-foreground font-sans">Time to cultivate a new intention.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pomodoro' && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <header className="space-y-2 mb-8 text-center">
                  <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Concentration</p>
                  <h2 className="text-4xl font-serif">Deep Focus</h2>
                </header>
                <PomodoroTimer habits={habits} onComplete={handleCompleteSession} />
                
                <div className="mt-12 max-w-md mx-auto">
                  <h3 className="font-serif text-xl mb-4 border-b border-border pb-2">Recent Intervals</h3>
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm bg-card/50 p-3 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            s.type === 'focus' ? "bg-primary" : "bg-blue-400"
                          )} />
                          <span className="capitalize text-foreground/80">{s.type.replace('-', ' ')}</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <p className="text-center text-muted-foreground font-mono text-xs uppercase tracking-widest py-8 opacity-50">
                        No sessions recorded today
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