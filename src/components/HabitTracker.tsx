"use client";

import React from 'react';
import { Habit } from '@/types/app';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import CreateHabitDialog from './CreateHabitDialog';
import { 
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, Wind, Droplets, Smile, Star, Sun, Flame, LucideIcon 
} from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onUpdate: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, Wind, Droplets, Smile, Star, Sun, Flame
};

const HabitTracker = ({ habits, onUpdate }: HabitTrackerProps) => {
  const { toast } = useToast();

  const deleteHabit = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Explicit ownership check

      if (error) throw error;
      
      onUpdate();
      toast({ title: "ritual removed." });
    } catch (error: any) {
      toast({ title: "error deleting ritual", description: error.message, variant: "destructive" });
    }
  };

  const renderIcon = (emoji: string) => {
    const Icon = ICON_MAP[emoji];
    if (Icon) return <Icon size={24} />;
    return <span className="text-xl">{emoji}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="space-y-4 text-center">
        <h2 className="text-5xl font-extrabold tracking-tighter lowercase">your rituals.</h2>
        <p className="text-zinc-500 font-medium lowercase">define the habits that build your pillar.</p>
      </header>

      <CreateHabitDialog onSuccess={onUpdate} />

      <div className="space-y-4">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] group hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white">
                {renderIcon(habit.emoji || 'Sparkles')}
              </div>
              <div>
                <h4 className="text-xl font-bold lowercase tracking-tight">{habit.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{habit.streak} day streak</span>
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{habit.frequency || 'daily'}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => deleteHabit(habit.id)}
              className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <Trash2 size={20} />
            </Button>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-[3rem]">
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">the path is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;