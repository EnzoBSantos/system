"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, GoalRequirement } from '@/types/goals';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Check, X, Calendar, Flame, Target, Trash2, ArrowLeft, LayoutList, Share2, Plus, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import GoalMindMap from './GoalMindMap';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface GoalDetailProps {
  goalId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const GoalDetail = ({ goalId, onClose, onUpdate }: GoalDetailProps) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'mindmap'>('list');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNodeData, setEditNodeData] = useState<{type: 'goal' | 'requirement', id?: string, title: string}>({type: 'goal', title: ''});
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

  const handleEditNode = (type: 'goal' | 'requirement', id?: string) => {
    const title = type === 'goal' 
      ? goal?.title || '' 
      : goal?.requirements?.find(r => r.id === id)?.title || '';
    
    setEditNodeData({ type, id, title });
    setIsEditModalOpen(true);
  };

  const saveNodeEdit = async () => {
    try {
      if (editNodeData.type === 'goal') {
        await supabase.from('goals').update({ title: editNodeData.title }).eq('id', goalId);
      } else {
        await supabase.from('goal_requirements').update({ title: editNodeData.title }).eq('id', editNodeData.id);
      }
      toast({ title: "updated." });
      setIsEditModalOpen(false);
      fetchGoal();
      onUpdate();
    } catch (e) {
      toast({ title: "failed to update", variant: "destructive" });
    }
  };

  const addNewPillar = async () => {
    const { error } = await supabase.from('goal_requirements').insert({
      goal_id: goalId,
      title: 'new pilar',
      is_completed: false
    });
    if (!error) {
      fetchGoal();
      onUpdate();
      toast({ title: "pilar added to the vision." });
    }
  };

  const deleteGoal = async () => {
    if (confirm("are you sure you want to abandon this path?")) {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      if (!error) {
        onUpdate();
        onClose();
      }
    }
  };

  if (loading) return null;
  if (!goal) return null;

  const completedCount = goal.requirements?.filter(r => r.is_completed).length || 0;
  const totalCount = goal.requirements?.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[1000] bg-black overflow-y-auto h-screen w-screen"
    >
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-12">
        <header className="flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="rounded-2xl text-zinc-500 hover:text-white gap-2 font-bold lowercase">
            <ArrowLeft size={20} /> back
          </Button>
          
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            <button 
              onClick={() => setView('list')}
              className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'list' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutList size={14} /> list
            </button>
            <button 
              onClick={() => setView('mindmap')}
              className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'mindmap' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Share2 size={14} /> map
            </button>
          </div>

          <Button variant="ghost" onClick={deleteGoal} className="rounded-2xl text-zinc-800 hover:text-red-500 gap-2 font-bold lowercase">
            <Trash2 size={20} /> abandon
          </Button>
        </header>

        <AnimatePresence mode="wait">
          {view === 'mindmap' ? (
            <motion.div 
              key="mindmap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <GoalMindMap 
                goal={goal} 
                onAddRequirement={addNewPillar}
                onEditNode={handleEditNode}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid lg:grid-cols-[1fr_320px] gap-12"
            >
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      level {goal.level}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 cursor-pointer hover:text-white" onClick={() => handleEditNode('goal')}>
                      edit vision title
                    </span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter lowercase leading-tight">{goal.title}</h1>
                  <p className="text-2xl text-zinc-500 font-medium lowercase italic leading-relaxed">"{goal.why}"</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">active requirements</h3>
                    <Button variant="ghost" size="sm" onClick={addNewPillar} className="text-[10px] font-bold uppercase tracking-widest hover:text-white">
                      <Plus size={14} className="mr-1" /> add
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {goal.requirements?.map((req: any) => (
                      <div key={req.id} className="group relative">
                        <button
                          onClick={() => toggleRequirement(req.id, req.is_completed)}
                          className={cn(
                            "w-full p-8 rounded-[2.5rem] border flex items-center gap-6 transition-all",
                            req.is_completed 
                              ? "bg-zinc-900 border-transparent opacity-60" 
                              : "bg-black border-zinc-800 hover:border-white/20"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                            req.is_completed ? "bg-white text-black" : "bg-zinc-900 text-zinc-600"
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
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditNode('requirement', req.id); }}
                          className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:text-white"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
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
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Edição Rápida */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-900 rounded-[2.5rem] p-8 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black lowercase tracking-tight">edit {editNodeData.type}.</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Input 
              value={editNodeData.title}
              onChange={(e) => setEditNodeData({...editNodeData, title: e.target.value})}
              className="h-14 bg-zinc-900 border-zinc-800 rounded-2xl px-6 focus:border-white lowercase text-lg"
              autoFocus
            />
            <Button onClick={saveNodeEdit} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl lowercase">
              save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default GoalDetail;