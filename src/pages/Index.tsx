"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import HabitTracker from '@/components/HabitTracker';
import PomodoroTimer from '@/components/PomodoroTimer';
import MobileNav from '@/components/MobileNav';
import { Habit, PomodoroSession } from '@/types/app';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Tab = 'dashboard' | 'habits' | 'pomodoro';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: habitsData } = await supabase.from('habits').select('*');
    const { data: sessionsData } = await supabase.from('pomodoro_sessions').select('*');
    
    if (habitsData) setHabits(habitsData);
    if (sessionsData) setSessions(sessionsData);
  };

  const handleToggleHabit = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    let newCompletedDays = [...habit.completedDays];
    if (newCompletedDays.includes(date)) {
      newCompletedDays = newCompletedDays.filter(d => d !== date);
    } else {
      newCompletedDays.push(date);
    }

    const { error } = await supabase
      .from('habits')
      .update({ completedDays: newCompletedDays })
      .eq('id', habitId);

    if (error) {
      toast({ title: "Error updating ritual", variant: "destructive" });
    } else {
      setHabits(habits.map(h => h.id === habitId ? { ...h, completedDays: newCompletedDays } : h));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard habits={habits} sessions={sessions} onToggleHabit={handleToggleHabit} />;
      case 'habits':
        return <HabitTracker habits={habits} onUpdate={fetchData} />;
      case 'pomodoro':
        return <PomodoroTimer onSessionComplete={fetchData} />;
      default:
        return <Dashboard habits={habits} sessions={sessions} onToggleHabit={handleToggleHabit} />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6 md:p-12 pb-32 lg:pb-12">
        {renderContent()}
      </main>
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;