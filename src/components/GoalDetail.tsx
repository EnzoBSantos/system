"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from '@/types/goals';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Check, Calendar, Target, Trash2, ArrowLeft, LayoutList, Share2, Plus, Edit2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import GoalMindMap from './GoalMindMap';
import RequirementDialog from './RequirementDialog';

interface GoalDetailProps {
  goalId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const GoalDetail = ({ goalId, onClose, onUpdate }: GoalDetailProps) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'mindmap'>('list');
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    type: 'goal' | 'requirement';
    editingId?: string;
  }>({ isOpen: false, mode: 'create', type: 'requirement' });

  const { toast } = useToast();

  const fetchGoal = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*, requirements:goal_requirements(*)')
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

  const handleOpenCreate = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDialogState({ isOpen: true, mode: 'create', type: 'requirement' });
  };

  const handleOpenEdit = (type: 'goal' | 'requirement', id?: string) => {
    setDialogState({ 
      isOpen: true, 
      mode: 'edit', 
      type, 
      editingId: id 
    });
  };

  const handleDialogSubmit = async (data: any) => {
    try {
      if (dialogState.mode === 'create') {
        const { error } = await supabase.from('goal_requirements').insert({
          goal_id: goalId,
          title: data.title,
          first_action: data.first_action || '',
          weekly_commitment: data.weekly_commitment || '',
          is_completed: false
        });
        if (error) throw error;
        toast({ title: "pilar added." });
      } else {
        if (dialogState.type === 'goal') {
          const { error } = await supabase.from('goals').update({ title: data.title }).eq('id', goalId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('goal_requirements').update({ 
            title: data.title,
            first_action: data.first_action || '',
            weekly_commitment: data.weekly_commitment || ''
          }).eq('id', dialogState.editingId);
          if (error) throw error;
        }
        toast({ title: "updated." });
      }
      
      setDialogState({ ...dialogState, isOpen: false });
      fetchGoal();
      onUpdate();
    } catch (e: any) {
      toast({ title: "failed to save", description: e.message, variant: "destructive" });
    }
  };

  const deleteRequirement = async (id: string) => {
    if (!confirm("remove this pilar from your vision?")) return;
    
    const { error } = await supabase.from('goal_requirements').delete().eq('id', id);
    if (!error) {
      fetchGoal();
      onUpdate();
      toast({ title: "pilar removed." });
    }
  };

  const deleteGoal = async () => {
    if (confirm("are you sure you want to abandon this entire vision?")) {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      if (!error) {
        onUpdate();
        onClose();
      }
    }
  };

  if (loading || !goal) return null;

  const completedCount = goal.requirements?.filter(r => r.is_completed).length || 0;
  const totalCount = goal.requirements?.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentRequirement = dialogState.editingId 
    ? goal.requirements?.find(r => r.id === dialogState.editingId) 
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[1000] bg-black overflow-y-auto h-screen w-screen"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12 h-full flex flex-col">
        <header className="flex items-center justify-between shrink-0">
          <Button variant="ghost" onClick={onClose} className="rounded-2xl text-zinc-500 hover:text-white gap-2 font-bold lowercase">
            <ArrowLeft size={20} /> back
          </Button>
          
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            <button 
              onClick={() => setView('list')}
              className={cn(
                "px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'list' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutList size={14} /> list view
            </button>
            <button 
              onClick={() => setView('mindmap')}
              className={cn(
                "px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'mindmap' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Share2 size={14} /> mind map
            </button>
          </div>

          <Button variant="ghost" onClick={deleteGoal} className="rounded-2xl text-zinc-800 hover:text-red-500 gap-2 font-bold lowercase">
            <Trash2 size={20} /> abandon vision
          </Button>
        </header>

        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {view === 'mindmap' ? (
              <motion.div 
                key="mindmap"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full w-full relative"
              >
                <GoalMindMap 
                  goal={goal} 
                  onEditNode={handleOpenEdit}
                  onDeleteRequirement={deleteRequirement}
                />
                
                {/* Fixed Add Button for Mind Map */}
                <div className="absolute bottom-12 right-12 z-[100]">
                  <Button 
                    onClick={handleOpenCreate}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="h-16 px-10 rounded-[2rem] bg-white text-black hover:bg-zinc-200 shadow-2xl font-black lowercase gap-4 text-xl border-4 border-black/10"
                  >
                    <Plus size={28} /> add vision pillar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid lg:grid-cols-[1fr_350px] gap-12"
              >
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        active architecture
                      </span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <h1 className="text-7xl font-black tracking-tighter lowercase leading-[0.9]">{goal.title}</h1>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEdit('goal')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      >
                        <Edit2 size={24} />
                      </Button>
                    </div>
                    <p className="text-2xl text-zinc-500 font-medium lowercase leading-relaxed max-w-2xl">"{goal.why}"</p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-2 border-b border-zinc-900 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">architecture pillars</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenCreate()} className="text-[10px] font-bold uppercase tracking-widest hover:text-white">
                        <Plus size={14} className="mr-1" /> new pillar
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {goal.requirements?.map((req: any) => (
                        <div key={req.id} className="group relative">
                          <button
                            onClick={() => toggleRequirement(req.id, req.is_completed)}
                            className={cn(
                              "w-full p-8 rounded-[3rem] border flex items-center gap-6 transition-all text-left h-full",
                              req.is_completed 
                                ? "bg-zinc-900/30 border-transparent opacity-60" 
                                : "bg-black border-zinc-800 hover:border-white/20"
                            )}
                          >
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0",
                              req.is_completed ? "bg-white text-black shadow-lg" : "bg-zinc-900 text-zinc-600"
                            )}>
                              {req.is_completed ? <Check size={28} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>
                            <div className="flex-1 pr-8">
                              <h4 className={cn("text-xl font-bold lowercase leading-tight", req.is_completed && "line-through text-zinc-500")}>{req.title}</h4>
                              {req.weekly_commitment && (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-2">{req.weekly_commitment}</p>
                              )}
                            </div>
                          </button>
                          
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); handleOpenEdit('requirement', req.id); }}
                              className="w-10 h-10 rounded-full text-zinc-500 hover:text-white"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); deleteRequirement(req.id); }}
                              className="w-10 h-10 rounded-full text-zinc-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="space-y-8">
                  <div className="bg-zinc-900/50 p-10 rounded-[3rem] space-y-10 border border-zinc-800/50 sticky top-0">
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">completion</p>
                        <p className="text-4xl font-black">{progress}%</p>
                      </div>
                      <div className="h-6 bg-black rounded-full overflow-hidden p-1">
                        <motion.div 
                          className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <RequirementDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        mode={dialogState.mode}
        onSubmit={handleDialogSubmit}
        initialData={
          dialogState.mode === 'edit' 
            ? (dialogState.type === 'goal' 
                ? { title: goal.title } 
                : { 
                    title: currentRequirement?.title || '',
                    first_action: currentRequirement?.first_action || '',
                    weekly_commitment: currentRequirement?.weekly_commitment || ''
                  }
              )
            : undefined
        }
      />
    </motion.div>
  );
};

export default GoalDetail;