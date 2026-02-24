"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, GoalRequirement } from '@/types/goals';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Check, X, Calendar, Flame, Target, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface GoalDetailProps {
  goalId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const GoalDetail = ({ goalId, onClose, onUpdate }: GoalDetailProps) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoal = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*, goal_requirements(*)')
      .eq('id', goalId)
      .single();

    if (error) {
      toast({ title: "error loading goal", variant: "destructive" });
      onClose();
    } else {
      setGoal(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoal();
  }, [goalId]);

  const toggleRequirement = async (reqId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('goal_requirements')
      .update({ is_completed: !currentStatus })
      .eq('id', reqId);

    if (!error) {
      if (!currentStatus) {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#ffffff']
        });
      }
      fetchGoal();
      onUpdate();
    }
  };

  const deleteGoal = async () => {
    if (confirm("are you sure you want to abandon this path?")) {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      if (!error) {
        toast({ title: "goal removed." });
        onUpdate();
        onClose();
      }
    }
  };

  if (loading) return null;
  if (!goal) return null;

  const completedCount = goal.goal_requirements?.filter(r => r.is_completed).length || 0;
  const totalCount = goal.goal_requirements?.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[110] bg-black overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16">
        <header className="flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="rounded-2xl text-zinc-500 hover:text-white gap-2 font-bold lowercase">
            <ArrowLeft size={20} /> back
          </Button>
          <Button variant="ghost" onClick={deleteGoal} className="rounded-2xl text-zinc-800 hover:text-red-500 gap-2 font-bold lowercase">
            <Trash2 size={20} /> abandon
          </Button>
        </header>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  level {goal.level}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  {goal.xp} xp earned
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter lowercase leading-tight">{goal.title}</h1>
              <p className="text-2xl text-zinc-500 font-medium lowercase italic leading-relaxed">"{goal.why}"</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">active requirements</h3>
                <span className="text-[10px] font-bold text-zinc-600 uppercase">{completedCount} / {totalCount}</span>
              </div>
              <div className="space-y-4">
                {goal.goal_requirements?.map((req: any) => (
                  <button
                    key={req.id}
                    onClick={() => toggleRequirement(req.id, req.is_completed)}
                    className={cn(
                      "w-full p-8 rounded-[2.5rem] border flex items-center gap-6 transition-all group",
                      req.is_completed 
                        ? "bg-zinc-900 border-transparent opacity-60" 
                        : "bg-black border-zinc-800 hover:border-white/20"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      req.is_completed ? "bg-white text-black" : "bg-zinc-900 text-zinc-600 group-hover:text-white"
                    )}>
                      {req.is_completed ? <Check size={24} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <div className="text-left flex-1">
                      <h4 className={cn("text-xl font-bold lowercase", req.is_completed && "line-through text-zinc-500")}>{req.title}</h4>
                      {req.first_action && !req.is_completed && (
                        <p className="text-sm text-zinc-500 font-medium lowercase mt-1">next: {req.first_action}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-[3rem] space-y-8 border border-zinc-800">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">progress</p>
                  <p className="text-3xl font-black">{progress}%</p>
                </div>
                <div className="h-4 bg-black rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">deadline</p>
                    <p className="text-sm font-bold">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'no date'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-500/50">
                    <Flame size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">daily streak</p>
                    <p className="text-sm font-bold">12 days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-zinc-900 p-8 rounded-[3rem] space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">smart insight</p>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase text-zinc-600">specific</p>
                  <p className="text-xs font-medium lowercase text-zinc-400">{goal.specific || 'n/a'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-zinc-600">measurable</p>
                  <p className="text-xs font-medium lowercase text-zinc-400">{goal.measurable || 'n/a'}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalDetail;