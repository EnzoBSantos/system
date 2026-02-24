"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from '@/types/goals';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Check, Target, Trash2, ArrowLeft, LayoutList, Share2, Plus, Edit2 } from 'lucide-react';
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
    parentId?: string; // Track which pillar we are adding a child to
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

  const handleOpenCreate = (e?: React.MouseEvent, parentId?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDialogState({ isOpen: true, mode: 'create', type: 'requirement', parentId });
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
          parent_id: dialogState.parentId || null,
          title: data.title,
          first_action: data.first_action || '',
          weekly_commitment: data.weekly_commitment || '',
          is_completed: false
        });
        if (error) throw error;
        toast({ title: "pillar added." });
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
      
      setDialogState(prev => ({ ...prev, isOpen: false }));
      fetchGoal();
      onUpdate();
    } catch (e: any) {
      toast({ title: "failed to save", description: e.message, variant: "destructive" });
    }
  };

  const deleteRequirement = async (id: string) => {
    if (!confirm("remove this pillar from your vision?")) return;
    
    const { error } = await supabase.from('goal_requirements').delete().eq('id', id);
    if (!error) {
      fetchGoal();
      onUpdate();
      toast({ title: "pillar removed." });
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
      className="fixed inset-0 z-[40] bg-black overflow-hidden h-screen w-screen"
    >
      <div className="w-full h-full flex flex-col">
        <header className="flex items-center justify-between shrink-0 px-8 py-8 md:py-10 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
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

        <div className="flex-1 min-h-0 relative">
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
                  onCreateChild={handleOpenCreate}
                  onDeleteRequirement={deleteRequirement}
                />
                
                <div className="absolute bottom-12 right-12 z-[100]">
                  <Button 
                    onClick={(e) => handleOpenCreate(e)}
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
                className="h-full overflow-y-auto px-8 md:px-16 py-12"
              >
                <div className="grid lg:grid-cols-[1fr_400px] gap-16 max-w-[1800px] mx-auto">
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          active architecture
                        </span>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <h1 className="text-7xl md:text-8xl font-black tracking-tighter lowercase leading-[0.9]">{goal.title}</h1>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEdit('goal')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-12 h-12"
                        >
                          <Edit2 size={32} />
                        </Button>
                      </div>
                      <p className="text-3xl text-zinc-500 font-medium lowercase leading-relaxed max-w-3xl">"{goal.why}"</p>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center justify-between px-2 border-b border-zinc-900 pb-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">architecture pillars</h3>
                        <Button variant="ghost" size="sm" onClick={(e) => handleOpenCreate(e)} className="text-[10px] font-bold uppercase tracking-widest hover:text-white">
                          <Plus size={14} className="mr-1" /> new pillar
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {goal.requirements?.filter(r => !r.parent_id).map((req: any) => (
                          <div key={req.id} className="group relative">
                            <button
                              onClick={() => toggleRequirement(req.id, req.is_completed)}
                              className={cn(
                                "w-full p-10 rounded-[3.5rem] border flex items-center gap-8 transition-all text-left h-full",
                                req.is_completed 
                                  ? "bg-zinc-900/30 border-transparent opacity-60" 
                                  : "bg-black border-zinc-800 hover:border-white/20"
                              )}
                            >
                              <div className={cn(
                                "w-16 h-16 rounded-3xl flex items-center justify-center transition-all shrink-0",
                                req.is_completed ? "bg-white text-black shadow-lg" : "bg-zinc-900 text-zinc-600"
                              )}>
                                {req.is_completed ? <Check size={32} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                              </div>
                              <div className="flex-1 pr-8">
                                <h4 className={cn("text-2xl font-bold lowercase leading-tight", req.is_completed && "line-through text-zinc-500")}>{req.title}</h4>
                                {req.weekly_commitment && (
                                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-3">{req.weekly_commitment}</p>
                                )}
                              </div>
                            </button>
                            
                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={(e) => { e.stopPropagation(); handleOpenEdit('requirement', req.id); }}
                                className="w-12 h-12 rounded-full text-zinc-500 hover:text-white bg-black/40 backdrop-blur-sm"
                              >
                                <Edit2 size={20} />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={(e) => { e.stopPropagation(); deleteRequirement(req.id); }}
                                className="w-12 h-12 rounded-full text-zinc-500 hover:text-red-500 bg-black/40 backdrop-blur-sm"
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-8">
                    <div className="bg-zinc-900/50 p-12 rounded-[3.5rem] space-y-12 border border-zinc-800/50 sticky top-0">
                      <div className="space-y-8">
                        <div className="flex justify-between items-end">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">total completion</p>
                          <p className="text-6xl font-black">{progress}%</p>
                        </div>
                        <div className="h-8 bg-black rounded-full overflow-hidden p-1.5">
                          <motion.div 
                            className="h-full bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)]" 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", damping: 20 }}
                          />
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <RequirementDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
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
            : { title: '', first_action: '', weekly_commitment: '' }
        }
      />
    </motion.div>
  );
};

export default GoalDetail;