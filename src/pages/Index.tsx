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
    
    if (habitsData) {
      // Map snake_case from DB to camelCase for App
      const mappedHabits: Habit[] = habitsData.map(h => ({
        id: h.id,
        name: h.name,
        emoji: h.emoji,
        color: h.color,
        category: h.category,
        frequency: h.frequency,
        completedDays: h.completed_days || [],
        createdAt: h.created_at,
        streak: h.streak || 0,
        longestStreak: h.longest_streak || 0
      }));
      setHabits(mappedHabits);
    }

    if (sessionsData) {
      const mappedSessions: PomodoroSession[] = sessionsData.map(s => ({
        id: s.id,
        timestamp: s.timestamp,
        duration: s.duration,
        type: s.type as any,
        habitId: s.habit_id
      }));
      setSessions(mappedSessions);
    }
  };

  const handleToggleHabit = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    let newCompletedDays = [...(habit.completedDays || [])];
    if (newCompletedDays.includes(date)) {
      newCompletedDays = newCompletedDays.filter(d => d !== date);
    } else {
      newCompletedDays.push(date);
    }

    // Update DB using snake_case
    const { error } = await supabase
      .from('habits')
      .update({ completed_days: newCompletedDays })
      .eq('id', habitId);

    if (error) {
      console.error("Error updating habit:", error);
      toast({ title: "Error updating ritual", variant: "destructive" });
    } else {
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completedDays: newCompletedDays } : h));
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