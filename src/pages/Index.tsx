"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import HabitCard from '@/components/HabitCard';
import AddHabitDialog from '@/components/AddHabitDialog';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Habit, PomodoroSession } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'pomodoro'>('dashboard');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [habitsRes, sessionsRes] = await Promise.all([
      supabase.from('habits').select('*').order('created_at', { ascending: false }),
      supabase.from('pomodoro_sessions').select('*').order('timestamp', { ascending: false })
    ]);

    if (habitsRes.data) {
      setHabits(habitsRes.data.map(h => ({
        ...h,
        completedDays: h.completed_days || []
      })));
    }
    if (sessionsRes.data) setSessions(sessionsRes.data);
    setLoading(false);
  };

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

  const handleAddHabit = async (newHabit: Omit<Habit, 'id' | 'completedDays' | 'createdAt' | 'streak' | 'longestStreak'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('habits').insert({
      user_id: user.id,
      name: newHabit.name,
      emoji: newHabit.emoji,
      category: newHabit.category,
      frequency: newHabit.frequency,
      color: newHabit.color
    }).select().single();

    if (error) {
      showError("failed to set intention.");
      return;
    }

    setHabits([{ ...data, completedDays: [] }, ...habits]);
    showSuccess("ritual created.");
  };

  const handleToggleHabit = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompleted = habit.completedDays.includes(today);
    const newCompletedDays = isCompleted 
      ? habit.completedDays.filter(d => d !== today)
      : [...habit.completedDays, today];
    
    const newStreak = isCompleted ? Math.max(0, habit.streak - 1) : habit.streak + 1;

    const { error } = await supabase.from('habits').update({
      completed_days: newCompletedDays,
      streak: newStreak
    }).eq('id', id);

    if (error) {
      showError("failed to update ritual.");
      return;
    }

    setHabits(habits.map(h => h.id === id ? { ...h, completedDays: newCompletedDays, streak: newStreak } : h));
  };

  const handleDeleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) {
      showError("failed to remove ritual.");
      return;
    }
    setHabits(habits.filter(h => h.id !== id));
    showSuccess("ritual removed.");
  };

  const handleCompleteSession = async (session: Omit<PomodoroSession, 'id' | 'timestamp'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('pomodoro_sessions').insert({
      user_id: user.id,
      habit_id: session.habitId === 'none' ? null : session.habitId,
      duration: session.duration,
      type: session.type
    }).select().single();

    if (error) {
      showError("failed to record focus.");
      return;
    }

    setSessions([data, ...sessions]);
    showSuccess("focus session recorded.");
  };

  const handleLogout = () => supabase.auth.signOut();

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 lg:p-16 relative">
        <button 
          onClick={handleLogout}
          className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
        >
          <LogOut size={20} />
        </button>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Dashboard habits={habits} sessions={sessions} />
              </motion.div>
            )}

            {activeTab === 'habits' && (
              <motion.div key="habits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
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
              <motion.div key="pomodoro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                          <div className={cn("w-3 h-3 rounded-full", s.type === 'focus' ? "bg-white" : "bg-zinc-600")} />
                          <span className="font-bold tracking-tight lowercase text-zinc-300">{s.type.replace('-', ' ')}</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-500">
                          {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
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