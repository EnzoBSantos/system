"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Heatmap from '@/components/Heatmap';
import HabitTracker from '@/components/HabitTracker';
import PomodoroTimer from '@/components/PomodoroTimer';
import DashboardStats from '@/components/DashboardStats';
import { Habit } from '@/types/app';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format, isYesterday, isToday, parseISO, subDays } from 'date-fns';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'pomodoro'>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHabits(data || []);
    } catch (error: any) {
      console.error("Error fetching habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const calculateStreak = (completedDays: string[]) => {
    if (!completedDays || completedDays.length === 0) return 0;
    
    const sortedDates = [...completedDays]
      .map(d => parseISO(d))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Se não completou hoje, começa a checar a partir de ontem
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (!completedDays.includes(todayStr)) {
      checkDate = subDays(checkDate, 1);
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (completedDays.includes(dateStr)) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const handleToggleHabit = async (habitId: string, dateStr: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const completedDays = habit.completed_days || [];
    let newCompletedDays: string[];

    if (completedDays.includes(dateStr)) {
      newCompletedDays = completedDays.filter(d => d !== dateStr);
    } else {
      newCompletedDays = [...completedDays, dateStr];
    }

    const newStreak = calculateStreak(newCompletedDays);

    // Atualização Otimista
    setHabits(prev => prev.map(h => 
      h.id === habitId 
        ? { ...h, completed_days: newCompletedDays, streak: newStreak } 
        : h
    ));

    try {
      const { error } = await supabase
        .from('habits')
        .update({ 
          completed_days: newCompletedDays,
          streak: newStreak
        })
        .eq('id', habitId);

      if (error) throw error;
    } catch (error: any) {
      toast({ 
        title: "sync error", 
        description: "could not save progress.", 
        variant: "destructive" 
      });
      // Reverter em caso de erro
      fetchHabits();
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="container max-w-7xl mx-auto px-6 py-12 md:px-12 md:py-16">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <header className="space-y-2">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">overview</h2>
                <h1 className="text-6xl font-extrabold tracking-tighter lowercase">the path today.</h1>
              </header>
              
              <DashboardStats habits={habits} />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <Heatmap habits={habits} onToggleHabit={handleToggleHabit} />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">focus session</p>
                  <PomodoroTimer mini />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <HabitTracker habits={habits} onUpdate={fetchHabits} />
            </div>
          )}

          {activeTab === 'pomodoro' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <PomodoroTimer />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;