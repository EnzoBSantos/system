"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, GoalRequirement } from '@/types/goals';
import { Edit2, Target, Rocket, CheckCircle2, Trash2, Maximize2, Minimize2, ZoomIn, ZoomOut, Maximize, Move, Calendar, Info, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface GoalMindMapProps {
  goal: Goal;
  onEditNode: (type: 'goal' | 'requirement', id?: string) => void;
  onCreateChild: (e: React.MouseEvent, parentId: string) => void;
  onDeleteRequirement: (id: string) => void;
}

const GoalMindMap = ({ goal, onEditNode, onCreateChild, onDeleteRequirement }: GoalMindMapProps) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [showGoalContent, setShowGoalContent] = useState(true);

  const toggleNodeExpansion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedNodes(prev => 
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    );
  };

  const isNodeExpanded = (id: string) => expandedNodes.includes(id);
  const requirements = goal.requirements || [];
  
  const getPillars = (parentId: string | null = null) => {
    return requirements.filter(r => r.parent_id === parentId);
  };

  const renderPillarNode = (req: GoalRequirement, x: number, y: number, parentX: number, parentY: number, level: number) => {
    const isExpanded = isNodeExpanded(req.id);
    const children = getPillars(req.id);
    const currentX = 2000 + x;
    const currentY = 2000 + y;

    return (
      <React.Fragment key={req.id}>
        {/* Connection Line to parent */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <motion.line
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            x1={parentX} y1={parentY}
            x2={currentX} y2={currentY}
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.15"
            strokeDasharray="8,8"
          />
        </svg>

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, x: x, y: y }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="absolute z-40"
          style={{ left: 2000, top: 2000 }}
        >
          <div className="group relative -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              layout
              className={cn(
                "rounded-[3.5rem] border-2 flex flex-col p-8 transition-all duration-500 relative",
                req.is_completed 
                  ? "bg-zinc-900/50 border-white/10" 
                  : "bg-black border-zinc-800 group-hover:border-white/40 shadow-2xl",
                isExpanded ? "w-[400px] min-h-[300px]" : "w-52 h-52 items-center justify-center text-center",
                level > 0 && "scale-90"
              )}
            >
              <button 
                onClick={(e) => toggleNodeExpansion(req.id, e)}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 z-[60] shadow-xl transition-colors"
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              <div className={cn("flex flex-col h-full", !isExpanded && "items-center justify-center")}>
                {req.is_completed ? (
                  <CheckCircle2 size={isExpanded ? 32 : 36} className={cn(isExpanded ? "mb-4" : "mb-2", "text-white/50")} />
                ) : (
                  <Rocket size={isExpanded ? 32 : 36} className={cn(isExpanded ? "mb-4" : "mb-2", "text-zinc-600")} />
                )}
                
                <h4 className={cn(
                  "font-black lowercase leading-tight mb-2",
                  isExpanded ? "text-2xl text-left" : "text-sm line-clamp-3"
                )}>
                  {req.title}
                </h4>

                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-6 flex-1"
                  >
                    {req.first_action && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Info size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">pillar intent</span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed lowercase">{req.first_action}</p>
                      </div>
                    )}
                    
                    <div className="pt-6 mt-auto flex gap-3 border-t border-white/5">
                      <Button 
                        size="sm" 
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onEditNode('requirement', req.id); }}
                        className="flex-1 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black font-bold lowercase gap-2"
                      >
                        <Edit2 size={14} /> refine
                      </Button>
                      <Button 
                        size="icon" 
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => onCreateChild(e, req.id)}
                        className="w-12 h-12 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-lg"
                        title="Add sub-pillar"
                      >
                        <Plus size={20} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {!isExpanded && (
                <div className="absolute inset-0 bg-black/95 rounded-[3.5rem] flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                   <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); onEditNode('requirement', req.id); }}
                      className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black shadow-xl"
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      size="icon" 
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => onCreateChild(e, req.id)}
                      className="w-12 h-12 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-xl"
                    >
                      <Plus size={20} />
                    </Button>
                   </div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1">pillar actions</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Render children recursively */}
        {children.map((child, cidx) => {
          const totalChildren = children.length;
          const spreadAngle = Math.PI / 1.5; // 120 degrees spread
          const startAngle = Math.atan2(y, x) - (spreadAngle / 2);
          const angle = startAngle + (cidx * (spreadAngle / Math.max(1, totalChildren - 1)));
          const distance = 450;
          const cx = x + Math.cos(angle) * distance;
          const cy = y + Math.sin(angle) * distance;
          
          return renderPillarNode(child, cx, cy, currentX, currentY, level + 1);
        })}
      </React.Fragment>
    );
  };

  const rootPillars = getPillars(null);

  return (
    <div className="relative w-full h-full bg-black/50 overflow-hidden cursor-grab active:cursor-grabbing">
      <TransformWrapper
        initialScale={0.7}
        minScale={0.1}
        maxScale={2}
        centerOnInit={true}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent 
              wrapperClass="!w-full !h-full" 
              contentClass="!w-auto !h-auto"
            >
              <div className="relative w-[4000px] h-[4000px] flex items-center justify-center select-none">
                {/* Central Node */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-50"
                  style={{ position: 'absolute', left: 2000, top: 2000, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative group -translate-x-1/2 -translate-y-1/2">
                    <button 
                      onClick={() => setShowGoalContent(!showGoalContent)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={cn(
                        "w-56 h-56 rounded-full flex flex-col items-center justify-center p-10 text-center shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500",
                        showGoalContent 
                          ? "bg-white text-black scale-100" 
                          : "bg-zinc-900 text-white scale-90 border border-zinc-800"
                      )}
                    >
                      <Target size={40} className={cn("mb-3 transition-transform", !showGoalContent && "rotate-180")} />
                      <span className="text-base font-black leading-tight lowercase px-2 line-clamp-3">{goal.title}</span>
                    </button>
                  </div>
                </motion.div>

                {/* Root Pillars Rendering */}
                <AnimatePresence>
                  {showGoalContent && rootPillars.map((req, idx) => {
                    const angle = (idx / (rootPillars.length || 1)) * 2 * Math.PI;
                    const distance = 550;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    return renderPillarNode(req, x, y, 2000, 2000, 0);
                  })}
                </AnimatePresence>
              </div>
            </TransformComponent>

            {/* Manual Controls */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-2.5 rounded-[1.5rem] shadow-2xl">
              <Button variant="ghost" size="icon" onMouseDown={(e) => e.stopPropagation()} onClick={() => zoomIn()} className="rounded-xl hover:bg-white hover:text-black">
                <ZoomIn size={20} />
              </Button>
              <Button variant="ghost" size="icon" onMouseDown={(e) => e.stopPropagation()} onClick={() => zoomOut()} className="rounded-xl hover:bg-white hover:text-black">
                <ZoomOut size={20} />
              </Button>
              <div className="w-px h-8 bg-zinc-800 mx-1" />
              <Button variant="ghost" size="icon" onMouseDown={(e) => e.stopPropagation()} onClick={() => resetTransform()} className="rounded-xl hover:bg-white hover:text-black">
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
    </div>
  );
};

export default GoalMindMap;