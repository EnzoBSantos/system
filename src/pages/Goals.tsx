"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Target, Plus, Rocket, Star, Clock, Trophy } from 'lucide-react';
import { Goal } from '@/types/goals';
import { cn } from '@/lib/utils';

interface GoalsProps {
  onOpenFlow: () => void;
  onSelectGoal: (id: string) => void;
  refreshTrigger: number;
}

const Goals = ({ onOpenFlow, onSelectGoal, refreshTrigger }: GoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*, requirements:goal_requirements(*)');

    if (!error) setGoals(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [refreshTrigger]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 200 }
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">architecture</h2>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter lowercase">the vision.</h1>
        </div>
        <Button 
          onClick={onOpenFlow}
          className="h-12 md:h-16 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-white text-black hover:bg-zinc-200 text-base md:text-lg font-bold lowercase gap-2 md:gap-3 transition-transform active:scale-95 shadow-lg"
        >
          <Plus size={20} className="md:size-24" /> new goal
        </Button>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
      >
        {goals.map((goal) => {
          const completed = goal.requirements?.filter(r => r.is_completed).length || 0;
          const total = goal.requirements?.length || 0;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <motion.div
              layoutId={goal.id}
              key={goal.id}
              variants={itemVariants}
              onClick={() => onSelectGoal(goal.id)}
              className="group bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8 cursor-pointer hover:border-white/20 transition-all hover:translate-y-[-4px]"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Rocket size={18} className="md:size-24" />
                </div>
                <div className="text-right">
                  <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">level {goal.level}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest">{goal.xp} xp</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black tracking-tight lowercase line-clamp-2 leading-tight">{goal.title}</h3>
                <div className="flex items-center gap-3 text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock size={10} className="md:size-12" /> active</span>
                  <span className="flex items-center gap-1.5"><Star size={10} className="md:size-12" /> {total} pillars</span>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-500">progress</span>
                  <span className="text-white">{progress}%</span>
                </div>
                <div className="h-1.5 md:h-2 bg-black rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {goals.length === 0 && !loading && (
          <motion.div 
            variants={itemVariants}
            onClick={onOpenFlow}
            className="col-span-full py-20 md:py-32 border-2 border-dashed border-zinc-900 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-4 md:gap-6 group cursor-pointer hover:border-zinc-700 transition-all"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-800 group-hover:text-white transition-colors">
              <Target size={32} className="md:size-40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">the horizon is clear.</p>
              <p className="text-zinc-700 font-medium text-xs md:text-sm">click to define your first major goal.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Goals;