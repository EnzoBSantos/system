"use client";

import React, { useState } from 'react';
import { Habit } from '@/types/app';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface HabitTrackerProps {
  habits: Habit[];
  onUpdate: () => void;
}

const HabitTracker = ({ habits, onUpdate }: HabitTrackerProps) => {
  const [newHabit, setNewHabit] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addHabit = async () => {
    if (!newHabit.trim()) return;

    try {
      setIsAdding(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({ 
          title: "Authentication error", 
          description: "Please sign in to add rituals.",
          variant: "destructive" 
        });
        return;
      }

      const { error } = await supabase.from('habits').insert([
        { 
          name: newHabit, 
          user_id: user.id,
          emoji: 'Sparkles', // Usando um nome de ícone compatível com o Heatmap
          completed_days: [],
          streak: 0
        }
      ]);

      if (error) throw error;

      setNewHabit('');
      onUpdate();
      toast({ title: "Ritual created" });
    } catch (error: any) {
      console.error("Error creating habit:", error);
      toast({ 
        title: "Error creating ritual", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) {
      toast({ title: "Error deleting ritual", variant: "destructive" });
    } else {
      onUpdate();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="space-y-4 text-center">
        <h2 className="text-5xl font-extrabold tracking-tighter lowercase">your rituals.</h2>
        <p className="text-zinc-500 font-medium lowercase">define the habits that build your pillar.</p>
      </header>

      <div className="flex gap-4">
        <Input 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="new ritual name..."
          className="h-14 rounded-2xl bg-zinc-900 border-zinc-800 focus:border-white transition-all text-lg lowercase"
          onKeyDown={(e) => e.key === 'Enter' && !isAdding && addHabit()}
          disabled={isAdding}
        />
        <Button 
          onClick={addHabit}
          disabled={isAdding || !newHabit.trim()}
          className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
        </Button>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-3xl group hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{habit.emoji}</span>
              </div>
              <div>
                <h4 className="text-xl font-bold lowercase tracking-tight">{habit.name}</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{habit.streak} day streak</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => deleteHabit(habit.id)}
              className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
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