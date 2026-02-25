"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Habit } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Flame, Target, Timer, LayoutDashboard, Plus, Settings, LogOut, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Heatmap from '@/components/Heatmap';
import HabitDialog from '@/components/HabitDialog';
import Goals from './Goals';
import GoalDetail from '@/components/GoalDetail';
import RitualFlow from '@/components/RitualFlow';
import { useToast } from "@/components/ui/use-toast";
import { subDays } from 'date-fns';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals'>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isHabitDialogOpen, setIsHabitDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [ritualStreak, setRitualStreak] = useState(0);
  const { toast } = useToast();

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setHabits(data);
      calculateRitualStreak(data);
    }
  };

  const calculateRitualStreak = (allHabits: Habit[]) => {
    if (allHabits.length === 0) {
      setRitualStreak(0);
      return;
    }

    let currentStreak = 0;
    let checkDate = new Date();

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const allCompleted = allHabits.every(h => h.completed_days?.includes(dateStr));
      
      if (allCompleted) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        if (currentStreak === 0 && !isToday(checkDate)) {
           break;
        } else if (currentStreak > 0 || isToday(checkDate)) {
           if (isToday(checkDate)) {
              checkDate = subDays(checkDate, 1);
              continue;
           }
           break;
        }
        break;
      }
    }
    setRitualStreak(currentStreak);
  };

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleToggleHabit = async (habitId: string, dateStr: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const completedDays = habit.completed_days || [];
    const isCompleted = completedDays.includes(dateStr);
    
    const newCompletedDays = isCompleted
      ? completedDays.filter(d => d !== dateStr)
      : [...completedDays, dateStr];

    const { error } = await supabase
      .from('habits')
      .update({ completed_days: newCompletedDays })
      .eq(habitId, 'id' as any); // Small fix for potential type mismatch in query

    // Correct query for update
    const { error: updateError } = await supabase
      .from('habits')
      .update({ completed_days: newCompletedDays })
      .match({ id: habitId });

    if (!updateError) {
      const updatedHabits = habits.map(h => 
        h.id === habitId ? { ...h, completed_days: newCompletedDays } : h
      );
      setHabits(updatedHabits);
      calculateRitualStreak(updatedHabits);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed left-0 top-0 h-full w-24 bg-zinc-950 border-r border-white/5 flex flex-col items-center py-10 z-50">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
        
        <div className="flex-1 flex flex-col gap-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "p-4 rounded-2xl transition-all duration-300",
              activeTab === 'dashboard' ? "bg-white text-black scale-110 shadow-xl" : "text-zinc-600 hover:text-white"
            )}
          >
            <LayoutDashboard size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('goals')}
            className={cn(
              "p-4 rounded-2xl transition-all duration-300",
              activeTab === 'goals' ? "bg-white text-black scale-110 shadow-xl" : "text-zinc-600 hover:text-white"
            )}
          >
            <Target size={24} />
          </button>
        </div>

        <button className="p-4 text-zinc-800 hover:text-red-500 transition-colors">
          <LogOut size={24} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="pl-24 pt-10 pb-24 px-10 md:px-20 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">overview</h2>
                  <h1 className="text-6xl font-extrabold tracking-tighter lowercase">the path today.</h1>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">perfect days</span>
                    <div className="flex items-center gap-2">
                      <Crown className="text-yellow-500" size={20} />
                      <span className="text-3xl font-black">{ritualStreak}</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-zinc-800" />
                  <Button 
                    onClick={() => setIsHabitDialogOpen(true)}
                    className="h-14 px-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black transition-all font-bold lowercase gap-2"
                  >
                    <Plus size={20} className="text-white group-hover:text-black" /> add ritual
                  </Button>
                </div>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <Heatmap habits={habits} onToggleHabit={handleToggleHabit} />
                </div>
                
                <div className="space-y-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <Flame className="text-white" size={20} />
                      <h3 className="font-bold lowercase">active focus</h3>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed lowercase font-medium">
                      you have {habits.length} rituals active. keep the momentum to maintain your {ritualStreak} day perfect streak.
                    </p>
                  </div>
                  
                  <div className="bg-white text-black rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
                    <h3 className="text-xl font-black lowercase leading-tight">the vision is the strategy. the rituals are the execution.</h3>
                    <Button 
                      onClick={() => setActiveTab('goals')}
                      variant="link" 
                      className="p-0 h-auto text-black font-bold uppercase tracking-widest text-[10px] hover:no-underline group"
                    >
                      view architecture <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div 
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Goals 
                onOpenFlow={() => setIsFlowOpen(true)} 
                onSelectGoal={setSelectedGoalId}
                refreshTrigger={0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HabitDialog 
        isOpen={isHabitDialogOpen} 
        onClose={() => setIsHabitDialogOpen(false)} 
        onSuccess={fetchHabits}
      />

      {selectedGoalId && (
        <GoalDetail 
          goalId={selectedGoalId} 
          onClose={() => setSelectedGoalId(null)} 
          onUpdate={fetchHabits} 
        />
      )}

      {isFlowOpen && (
        <RitualFlow 
          onClose={() => setIsFlowOpen(false)} 
          onSuccess={() => {
            setIsFlowOpen(false);
            fetchHabits();
          }} 
        />
      )}
    </div>
  );
};

export default Index;