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
    parentId?: string;
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
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className="fixed inset-0 z-[40] bg-black overflow-hidden h-screen w-screen"
    >
      <div className="w-full h-full flex flex-col">
        <header className="flex items-center justify-between shrink-0 px-4 md:px-8 py-4 md:py-10 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
          <Button variant="ghost" onClick={onClose} className="rounded-xl md:rounded-2xl text-zinc-500 hover:text-white gap-2 font-bold lowercase text-xs md:text-base">
            <ArrowLeft size={16} className="md:size-20" /> back
          </Button>
          
          <div className="flex bg-zinc-900 p-0.5 md:p-1 rounded-xl md:rounded-2xl border border-zinc-800 scale-90 md:scale-100">
            <button 
              onClick={() => setView('list')}
              className={cn(
                "px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'list' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutList size={12} className="md:size-14" /> list
            </button>
            <button 
              onClick={() => setView('mindmap')}
              className={cn(
                "px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'mindmap' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Share2 size={12} className="md:size-14" /> map
            </button>
          </div>

          <Button variant="ghost" onClick={deleteGoal} className="rounded-xl md:rounded-2xl text-zinc-800 hover:text-red-500 gap-1 md:gap-2 font-bold lowercase text-[10px] md:text-base">
            <Trash2 size={16} className="md:size-20" /> abandon
          </Button>
        </header>

        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {view === 'mindmap' ? (
              <motion.div 
                key="mindmap"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-full w-full relative"
              >
                <GoalMindMap 
                  goal={goal} 
                  onEditNode={handleOpenEdit}
                  onCreateChild={handleOpenCreate}
                  onDeleteRequirement={deleteRequirement}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="h-full overflow-y-auto px-4 md:px-16 py-8 md:py-12"
              >
                <div className="grid lg:grid-cols-[1fr_400px] gap-8 md:gap-16 max-w-[1800px] mx-auto">
                  <div className="space-y-8 md:space-y-12">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2 md:space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          active architecture
                        </span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 group">
                        <h1 className="text-4xl md:text-8xl font-black tracking-tighter lowercase leading-[0.9]">{goal.title}</h1>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEdit('goal')}
                          className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-8 h-8 md:w-12 md:h-12"
                        >
                          <Edit2 size={16} className="md:size-32" />
                        </Button>
                      </div>
                      <p className="text-xl md:text-3xl text-zinc-500 font-medium lowercase leading-relaxed max-w-3xl">"{goal.why}"</p>
                    </motion.div>

                    <div className="space-y-6 md:space-y-8">
                      <div className="flex items-center justify-between px-1 md:px-2 border-b border-zinc-900 pb-3 md:pb-4">
                        <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">pillars</h3>
                        <Button variant="ghost" size="sm" onClick={(e) => handleOpenCreate(e)} className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:text-white">
                          <Plus size={12} className="md:size-14 mr-1" /> new
                        </Button>
                      </div>
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: { transition: { staggerChildren: 0.05 } }
                        }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6"
                      >
                        {goal.requirements?.filter(r => !r.parent_id).map((req: any) => (
                          <motion.div 
                            key={req.id} 
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 }
                            }}
                            className="group relative"
                          >
                            <button
                              onClick={() => toggleRequirement(req.id, req.is_completed)}
                              className={cn(
                                "w-full p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border flex items-center gap-4 md:gap-8 transition-all text-left h-full",
                                req.is_completed 
                                  ? "bg-zinc-900/30 border-transparent opacity-60" 
                                  : "bg-black border-zinc-800 hover:border-white/20"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all shrink-0",
                                req.is_completed ? "bg-white text-black shadow-lg" : "bg-zinc-900 text-zinc-600"
                              )}>
                                {req.is_completed ? <Check size={20} className="md:size-32" strokeWidth={3} /> : <div className="w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-current" />}
                              </div>
                              <div className="flex-1 pr-6 md:pr-8">
                                <h4 className={cn("text-lg md:text-2xl font-bold lowercase leading-tight", req.is_completed && "line-through text-zinc-500")}>{req.title}</h4>
                                {req.weekly_commitment && (
                                  <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-2 md:mt-3">{req.weekly_commitment}</p>
                                )}
                              </div>
                            </button>
                            
                            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-1.5 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={(e) => { e.stopPropagation(); handleOpenEdit('requirement', req.id); }}
                                className="w-8 h-8 md:w-12 md:h-12 rounded-full text-zinc-500 hover:text-white bg-black/40 backdrop-blur-sm"
                              >
                                <Edit2 size={14} className="md:size-20" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={(e) => { e.stopPropagation(); deleteRequirement(req.id); }}
                                className="w-8 h-8 md:w-12 md:h-12 rounded-full text-zinc-500 hover:text-red-500 bg-black/40 backdrop-blur-sm"
                              >
                                <Trash2 size={14} className="md:size-20" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  <aside className="space-y-6 md:space-y-8">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-zinc-900/50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] space-y-8 md:space-y-12 border border-zinc-800/50"
                    >
                      <div className="space-y-4 md:space-y-8">
                        <div className="flex justify-between items-end">
                          <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-zinc-500">completion</p>
                          <p className="text-4xl md:text-6xl font-black">{progress}%</p>
                        </div>
                        <div className="h-4 md:h-8 bg-black rounded-full overflow-hidden p-1 md:p-1.5">
                          <motion.div 
                            className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", damping: 20 }}
                          />
                        </div>
                      </div>
                    </motion.div>
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