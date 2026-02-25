"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import Heatmap from '@/components/Heatmap';
import HabitTracker from '@/components/HabitTracker';
import PomodoroTimer from '@/components/PomodoroTimer';
import DashboardStats from '@/components/DashboardStats';
import CompletionChart from '@/components/CompletionChart';
import Goals from '@/pages/Goals';
import Tasks from '@/pages/Tasks';
import GoalCreationFlow from '@/components/GoalCreationFlow';
import GoalDetail from '@/components/GoalDetail';
import { Habit } from '@/types/app';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO, subDays } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'pomodoro' | 'goals' | 'tasks'>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [refreshGoals, setRefreshGoals] = useState(0);

  const { toast } = useToast();

  const fetchHabits = async () => {
    const { data } = await supabase.from('habits').select('*').order('created_at', { ascending: true });
    setHabits(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchHabits(); }, []);

  const handleToggleHabit = async (habitId: string, dateStr: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const newCompletedDays = habit.completed_days.includes(dateStr)
      ? habit.completed_days.filter(d => d !== dateStr)
      : [...habit.completed_days, dateStr];
    
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completed_days: newCompletedDays } : h));
    await supabase.from('habits').update({ completed_days: newCompletedDays }).eq('id', habitId);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
        <div className="container max-w-7xl mx-auto px-4 py-8 md:px-12 md:py-16">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 md:space-y-12">
              <header className="space-y-1">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">overview</h2>
                <h1 className="lowercase">the path today.</h1>
              </header>
              <DashboardStats habits={habits} />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
                <div className="xl:col-span-2"><Heatmap habits={habits} onToggleHabit={handleToggleHabit} /></div>
                <div className="hidden md:block"><CompletionChart habits={habits} /></div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'habits' && <HabitTracker habits={habits} onUpdate={fetchHabits} />}
          {activeTab === 'goals' && (
            <Goals 
              onOpenFlow={() => setIsFlowOpen(true)}
              onSelectGoal={(id) => setSelectedGoalId(id)}
              refreshTrigger={refreshGoals}
            />
          )}
          {activeTab === 'pomodoro' && <PomodoroTimer />}
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence>
        {isFlowOpen && (
          <GoalCreationFlow 
            onClose={() => setIsFlowOpen(false)} 
            onSuccess={() => { setRefreshGoals(prev => prev + 1); setIsFlowOpen(false); }} 
          />
        )}
        {selectedGoalId && (
          <GoalDetail 
            goalId={selectedGoalId} 
            onClose={() => setSelectedGoalId(null)}
            onUpdate={() => setRefreshGoals(prev => prev + 1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;