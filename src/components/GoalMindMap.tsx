"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from '@/types/goals';
import { Plus, Edit2, Target, Rocket, CheckCircle2, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import RequirementDialog from './RequirementDialog';

interface GoalMindMapProps {
  goal: Goal;
  onUpdateGoal: (updatedGoal: Goal) => void;
}

const GoalMindMap = ({ goal, onUpdateGoal }: GoalMindMapProps) => {
  const [hiddenNodes, setHiddenNodes] = useState<string[]>([]);
  const [showGoalContent, setShowGoalContent] = useState(true);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    editingId?: string;
  }>({ isOpen: false, mode: 'create' });

  const toggleNodeVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenNodes(prev => 
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    );
  };

  const handleOpenCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogState({ isOpen: true, mode: 'create' });
  };

  const handleOpenEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogState({ isOpen: true, mode: 'edit', editingId: id });
  };

  const handleDialogSubmit = (data: { title: string }) => {
    if (dialogState.mode === 'create') {
      const newRequirement = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        is_completed: false
      };
      onUpdateGoal({
        ...goal,
        requirements: [...(goal.requirements || []), newRequirement]
      });
    } else if (dialogState.editingId) {
      onUpdateGoal({
        ...goal,
        requirements: (goal.requirements || []).map(req => 
          req.id === dialogState.editingId ? { ...req, title: data.title } : req
        )
      });
    }
    setDialogState({ ...dialogState, isOpen: false });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateGoal({
      ...goal,
      requirements: (goal.requirements || []).filter(req => req.id !== id)
    });
  };

  const isNodeHidden = (id: string) => hiddenNodes.includes(id);
  const requirements = goal.requirements || [];

  return (
    <div className="relative w-full h-full bg-black/50 overflow-hidden cursor-grab active:cursor-grabbing">
      <TransformWrapper
        initialScale={0.8}
        initialPositionX={0}
        initialPositionY={0}
        centerOnInit
        minScale={0.2}
        maxScale={2}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent 
              wrapperClass="!w-full !h-full" 
              contentClass="!w-auto !h-auto"
            >
              <div className="relative w-[3000px] h-[3000px] flex items-center justify-center select-none">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {requirements.map((req, idx) => {
                    if (isNodeHidden(req.id) || !showGoalContent) return null;
                    
                    const angle = (idx / (requirements.length || 1)) * 2 * Math.PI;
                    const distance = 400;
                    const x2 = 1500 + Math.cos(angle) * distance;
                    const y2 = 1500 + Math.sin(angle) * distance;
                    
                    return (
                      <motion.line
                        key={`line-${req.id}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        x1="1500" y1="1500"
                        x2={x2} y2={y2}
                        stroke="white"
                        strokeWidth="1.5"
                        strokeOpacity="0.1"
                        strokeDasharray="8,8"
                      />
                    );
                  })}
                </svg>

                {/* Central Node */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-50"
                  style={{ position: 'absolute', left: 1500, top: 1500, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative group -translate-x-1/2 -translate-y-1/2">
                    <button 
                      onClick={() => setShowGoalContent(!showGoalContent)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={cn(
                        "w-48 h-48 rounded-full flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-500",
                        showGoalContent 
                          ? "bg-white text-black scale-100" 
                          : "bg-zinc-900 text-white scale-90 border border-zinc-800"
                      )}
                    >
                      <Target size={32} className={cn("mb-2 transition-transform", !showGoalContent && "rotate-180")} />
                      <span className="text-sm font-black leading-tight lowercase px-2 line-clamp-3">{goal.title}</span>
                    </button>
                  </div>
                </motion.div>

                {/* Pillars */}
                <AnimatePresence>
                  {showGoalContent && requirements.map((req, idx) => {
                    const angle = (idx / (requirements.length || 1)) * 2 * Math.PI;
                    const distance = 400;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const isHidden = isNodeHidden(req.id);

                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: isHidden ? 0.3 : 1, 
                          scale: isHidden ? 0.7 : 1,
                          x: x, 
                          y: y 
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 90 }}
                        className="absolute z-40"
                        style={{ left: 1500, top: 1500 }}
                      >
                        <div className="group relative -translate-x-1/2 -translate-y-1/2">
                          <div 
                            className={cn(
                              "w-44 h-44 rounded-[3rem] border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative",
                              req.is_completed 
                                ? "bg-zinc-900/50 border-white/10" 
                                : isHidden 
                                  ? "bg-zinc-950 border-zinc-900" 
                                  : "bg-black border-zinc-800 group-hover:border-white/40"
                            )}
                          >
                            <button 
                              onClick={(e) => toggleNodeVisibility(req.id, e)}
                              onPointerDown={(e) => e.stopPropagation()}
                              className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 z-10"
                            >
                              {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>

                            <div className={cn("transition-all duration-300", isHidden && "blur-md opacity-10")}>
                              {req.is_completed ? <CheckCircle2 size={28} className="mb-2 text-white/50" /> : <Rocket size={28} className="mb-2 text-zinc-600" />}
                              <span className="text-[11px] font-black uppercase tracking-widest leading-tight block line-clamp-2">{req.title}</span>
                            </div>

                            {!isHidden && (
                              <div className="absolute inset-0 bg-black/95 rounded-[3rem] flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                                 <div className="flex gap-2">
                                  <Button 
                                    size="icon" 
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => handleOpenEdit(req.id, e)}
                                    className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black"
                                  >
                                    <Edit2 size={18} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => handleDelete(req.id, e)}
                                    className="w-12 h-12 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-500 hover:bg-red-600 hover:text-white"
                                  >
                                    <Trash2 size={18} />
                                  </Button>
                                 </div>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1">pilar actions</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </TransformComponent>

            {/* Manual Controls */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-2.5 rounded-[1.5rem] shadow-2xl">
              <Button variant="ghost" size="icon" onClick={() => zoomIn()} className="rounded-xl hover:bg-white hover:text-black">
                <ZoomIn size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => zoomOut()} className="rounded-xl hover:bg-white hover:text-black">
                <ZoomOut size={20} />
              </Button>
              <div className="w-px h-8 bg-zinc-800 mx-1" />
              <Button variant="ghost" size="icon" onClick={() => resetTransform()} className="rounded-xl hover:bg-white hover:text-black">
                <Maximize size={20} />
              </Button>
              <div className="flex items-center gap-3 px-4 border-l border-zinc-800 ml-1">
                <Move size={16} className="text-zinc-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">drag to navigate</span>
              </div>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Fixed Add Button */}
      <div className="fixed bottom-12 right-12 z-[60]">
        <Button 
          onClick={handleOpenCreate}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-16 px-10 rounded-[2rem] bg-white text-black hover:bg-zinc-200 shadow-2xl font-black lowercase gap-4 text-xl border-4 border-black/10"
        >
          <Plus size={28} /> add vision pilar
        </Button>
      </div>

      {/* Pillar Dialog */}
      <RequirementDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        mode={dialogState.mode}
        onSubmit={handleDialogSubmit}
        initialData={
          dialogState.mode === 'edit' 
            ? { title: (goal.requirements || []).find(r => r.id === dialogState.editingId)?.title || '' }
            : undefined
        }
      />
    </div>
  );
};

export default GoalMindMap;