"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from '@/types/goals';
import { Plus, Edit2, Target, Rocket, CheckCircle2, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface GoalMindMapProps {
  goal: Goal;
  onAddRequirement: (e: React.MouseEvent) => void;
  onEditNode: (type: 'goal' | 'requirement', id?: string) => void;
  onDeleteRequirement: (id: string) => void;
}

const GoalMindMap = ({ goal, onAddRequirement, onEditNode, onDeleteRequirement }: GoalMindMapProps) => {
  const [hiddenNodes, setHiddenNodes] = useState<string[]>([]);
  const [showGoalContent, setShowGoalContent] = useState(true);

  const toggleNodeVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenNodes(prev => 
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    );
  };

  const isNodeHidden = (id: string) => hiddenNodes.includes(id);
  const requirements = goal.requirements || [];

  return (
    <div className="relative w-full h-full bg-black/50 overflow-hidden cursor-grab active:cursor-grabbing">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        centerOnInit
        minScale={0.3}
        maxScale={2}
        limitToBounds={false}
        centerZoomedOut={true}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent 
              wrapperClass="!w-full !h-full" 
              contentClass="!w-auto !h-auto"
            >
              <div className="relative w-[2000px] h-[2000px] flex items-center justify-center select-none">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {requirements.map((req, idx) => {
                    if (isNodeHidden(req.id) || !showGoalContent) return null;
                    
                    const angle = (idx / (requirements.length || 1)) * 2 * Math.PI;
                    const distance = 350;
                    const x2 = 1000 + Math.cos(angle) * distance;
                    const y2 = 1000 + Math.sin(angle) * distance;
                    
                    return (
                      <motion.line
                        key={`line-${req.id}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        x1="1000" y1="1000"
                        x2={x2} y2={y2}
                        stroke="white"
                        strokeWidth="1.5"
                        strokeOpacity="0.15"
                        strokeDasharray="5,5"
                      />
                    );
                  })}
                </svg>

                {/* Central Node */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-50"
                  style={{ position: 'absolute', left: 1000, top: 1000, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative group -translate-x-1/2 -translate-y-1/2">
                    <button 
                      onClick={() => setShowGoalContent(!showGoalContent)}
                      onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                      className={cn(
                        "w-44 h-44 rounded-full flex flex-col items-center justify-center p-6 text-center shadow-2xl transition-all duration-500",
                        showGoalContent 
                          ? "bg-white text-black scale-100" 
                          : "bg-zinc-900 text-white scale-90 border border-zinc-800"
                      )}
                    >
                      <Target size={28} className={cn("mb-2 transition-transform", !showGoalContent && "rotate-180")} />
                      <span className="text-sm font-black leading-tight lowercase px-2 line-clamp-3">{goal.title}</span>
                    </button>
                    
                    <div className="absolute -top-4 -right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                        onClick={(e) => { e.stopPropagation(); onEditNode('goal'); }}
                        className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black"
                      >
                        <Edit2 size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Pillars */}
                <AnimatePresence>
                  {showGoalContent && requirements.map((req, idx) => {
                    const angle = (idx / (requirements.length || 1)) * 2 * Math.PI;
                    const distance = 350;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const isHidden = isNodeHidden(req.id);

                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: isHidden ? 0.4 : 1, 
                          scale: isHidden ? 0.8 : 1,
                          x: x, 
                          y: y 
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 100 }}
                        className="absolute z-40"
                        style={{ left: 1000, top: 1000 }}
                      >
                        <div className="group relative -translate-x-1/2 -translate-y-1/2">
                          <div 
                            className={cn(
                              "w-40 h-40 rounded-[2.5rem] border-2 flex flex-col items-center justify-center p-5 text-center transition-all duration-300 relative",
                              req.is_completed 
                                ? "bg-zinc-900/50 border-white/10" 
                                : isHidden 
                                  ? "bg-zinc-950 border-zinc-900" 
                                  : "bg-black border-zinc-800 group-hover:border-white/40"
                            )}
                          >
                            <button 
                              onClick={(e) => toggleNodeVisibility(req.id, e)}
                              onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                              className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 z-10"
                            >
                              {isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                            </button>

                            <div className={cn("transition-all duration-300", isHidden && "blur-sm opacity-20")}>
                              {req.is_completed ? <CheckCircle2 size={24} className="mb-2 text-white/50" /> : <Rocket size={24} className="mb-2 text-zinc-600" />}
                              <span className="text-[10px] font-black uppercase tracking-widest leading-tight block">{req.title}</span>
                            </div>

                            {!isHidden && (
                              <div className="absolute inset-0 bg-black/90 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                                 <div className="flex gap-2">
                                  <Button 
                                    size="icon" 
                                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                                    onClick={(e) => { e.stopPropagation(); onEditNode('requirement', req.id); }}
                                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black"
                                  >
                                    <Edit2 size={16} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                                    onClick={(e) => { e.stopPropagation(); onDeleteRequirement(req.id); }}
                                    className="w-10 h-10 rounded-xl bg-red-950/30 border border-red-900/50 text-red-500 hover:bg-red-600 hover:text-white"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                 </div>
                                 <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mt-2">pilar actions</p>
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
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl shadow-2xl">
              <Button variant="ghost" size="icon" onClick={() => zoomIn()} className="rounded-xl hover:bg-white hover:text-black">
                <ZoomIn size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => zoomOut()} className="rounded-xl hover:bg-white hover:text-black">
                <ZoomOut size={18} />
              </Button>
              <div className="w-px h-6 bg-zinc-800 mx-1" />
              <Button variant="ghost" size="icon" onClick={() => resetTransform()} className="rounded-xl hover:bg-white hover:text-black">
                <Maximize size={18} />
              </Button>
              <div className="flex items-center gap-2 px-3 border-l border-zinc-800 ml-1">
                <Move size={14} className="text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">drag to explore</span>
              </div>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Fixed Add Button */}
      <div className="fixed bottom-12 right-12 z-[60]">
        <Button 
          onClick={onAddRequirement}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
          className="h-16 px-8 rounded-3xl bg-white text-black hover:bg-zinc-200 shadow-2xl font-black lowercase gap-3 text-lg"
        >
          <Plus size={24} /> add vision pilar
        </Button>
      </div>
    </div>
  );
};

export default GoalMindMap;