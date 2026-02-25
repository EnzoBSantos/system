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
import QuickTaskDialog from '@/components/tasks/QuickTaskDialog';
import { Habit } from '@/types/app';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO, subDays } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

type Tab = 'dashboard' | 'habits' | 'pomodoro' | 'goals' | 'tasks';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [refreshGoals, setRefreshGoals] = useState(0);

  const { toast } = useToast();

  const fetchHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id) // Explicit client-side filter
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setHabits(data || []);
    } catch (error: any) {
      console.error("Fetch habits error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedGoalId(null);
    setIsFlowOpen(false);
  };

  const handleToggleHabit = async (habitId: string, dateStr: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;
      
      const newCompletedDays = habit.completed_days.includes(dateStr)
        ? habit.completed_days.filter(d => d !== dateStr)
        : [...habit.completed_days, dateStr];
      
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completed_days: newCompletedDays } : h));
      
      const { error } = await supabase
        .from('habits')
        .update({ completed_days: newCompletedDays })
        .eq('id', habitId)
        .eq('user_id', user.id); // Guard against IDOR
      
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Failed to update ritual", description: error.message, variant: "destructive" });
      fetchHabits(); // Revert state on error
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    if (hour >= 18 && hour < 22) return "good evening.";
    return "good night.";
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
        <div className="container max-w-7xl mx-auto px-4 py-4 md:px-12 md:py-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 md:space-y-8">
              <header className="space-y-1">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">overview</h2>
                <h1 className="lowercase text-3xl md:text-4xl font-extrabold tracking-tighter">
                  {getGreeting()}
                </h1>
              </header>
              <DashboardStats habits={habits} />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-8">
                <div className="xl:col-span-2">
                  <Heatmap habits={habits} onToggleHabit={handleToggleHabit} />
                </div>
                <div className="block">
                  <CompletionChart habits={habits} />
                </div>
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

      <div className="relative z-[60]">
        <MobileNav 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          onOpenGoalFlow={() => setIsFlowOpen(true)}
          onOpenQuickTask={() => setIsTaskDialogOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isFlowOpen && (
          <div className="z-50">
            <GoalCreationFlow 
              onClose={() => setIsFlowOpen(false)} 
              onSuccess={() => { setRefreshGoals(prev => prev + 1); setIsFlowOpen(false); }} 
            />
          </div>
        )}
        {selectedGoalId && (
          <div className="z-50">
            <GoalDetail 
              goalId={selectedGoalId} 
              onClose={() => setSelectedGoalId(null)}
              onUpdate={() => setRefreshGoals(prev => prev + 1)}
            />
          </div>
        )}
      </AnimatePresence>

      <QuickTaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen} 
        onTaskCreated={() => {
          // As tarefas serão atualizadas via Supabase no componente Tasks se estiver ativo
        }}
      />
    </div>
  );
};

export default Index;