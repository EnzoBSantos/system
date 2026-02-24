"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, GoalRequirement } from '@/types/goals';
import { Edit2, Target, Rocket, CheckCircle2, Trash2, ZoomIn, ZoomOut, Maximize, Move, Info, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface GoalMindMapProps {
  goal: Goal;
  onEditNode: (type: 'goal' | 'requirement', id?: string) => void;
  onCreateChild: (e: React.MouseEvent, parentId?: string) => void;
  onDeleteRequirement: (id: string) => void;
}

const GoalMindMap = ({ goal, onEditNode, onCreateChild, onDeleteRequirement }: GoalMindMapProps) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [showGoalContent, setShowGoalContent] = useState(true);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  // Centraliza o mapa sempre que o objetivo mudar ou o componente montar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (transformRef.current) {
        transformRef.current.centerView(0.8);
      }
    }, 300); // Delay maior para garantir que o container esteja pronto
    return () => clearTimeout(timer);
  }, [goal.id]);

  const toggleNodeExpansion = (id: string) => {
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
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            d={`M ${parentX} ${parentY} C ${parentX} ${(parentY + currentY) / 2}, ${currentX} ${(parentY + currentY) / 2}, ${currentX} ${currentY}`}
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeOpacity="0.15"
            strokeDasharray="10,10"
          />
        </svg>

        <motion.div
          layout
          initial={{ opacity: 0, y: y - 50 }}
          animate={{ opacity: 1, x: x, y: y }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="absolute z-40"
          style={{ left: 2000, top: 2000 }}
        >
          <div className="group relative -translate-x-1/2 -translate-y-1/2">
            <motion.div 
              layout
              onClick={() => toggleNodeExpansion(req.id)}
              className={cn(
                "rounded-[3.5rem] border-2 flex flex-col transition-all duration-500 relative overflow-hidden cursor-pointer",
                req.is_completed 
                  ? "bg-zinc-900/50 border-white/10" 
                  : "bg-black border-zinc-800 hover:border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]",
                isExpanded ? "w-[400px] min-h-[300px] p-8" : "w-56 h-56 p-6 items-center justify-center text-center",
                level > 0 && "scale-90"
              )}
            >
              <div className={cn("flex flex-col h-full pointer-events-none", !isExpanded && "items-center justify-center")}>
                {req.is_completed ? (
                  <CheckCircle2 size={isExpanded ? 32 : 40} className={cn(isExpanded ? "mb-4" : "mb-3", "text-white/50")} />
                ) : (
                  <Rocket size={isExpanded ? 32 : 40} className={cn(isExpanded ? "mb-4" : "mb-3", "text-zinc-600")} />
                )}
                
                <h4 className={cn(
                  "font-black lowercase leading-tight",
                  isExpanded ? "text-2xl text-left" : "text-sm line-clamp-3 px-2"
                )}>
                  {req.title}
                </h4>

                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-6 flex-1"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Info size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">pillar strategy</span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed lowercase">
                        {req.first_action || "no strategy defined yet."}
                      </p>
                    </div>
                    
                    <div className="pt-6 mt-auto flex gap-3 border-t border-white/5">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onEditNode('requirement', req.id); }}
                        className="flex-1 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black font-bold lowercase gap-2 pointer-events-auto"
                      >
                        <Edit2 size={14} /> refine
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onDeleteRequirement(req.id); }}
                        className="w-12 h-12 rounded-2xl bg-zinc-900/50 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 pointer-events-auto"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Floating Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-[60]">
                <Button 
                  size="icon" 
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onCreateChild(e, req.id); }}
                  className="w-10 h-10 rounded-xl bg-white text-black hover:bg-zinc-200 shadow-xl border-2 border-black/10 pointer-events-auto"
                  title="Add sub-pillar"
                >
                  <Plus size={20} />
                </Button>
                {!isExpanded && (
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onEditNode('requirement', req.id); }}
                    className="w-10 h-10 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white pointer-events-auto"
                  >
                    <Edit2 size={16} />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {children.map((child, cidx) => {
          const totalChildren = children.length;
          const spread = 600; // Espaçamento horizontal total
          const startX = -(spread * (totalChildren - 1)) / 2;
          const cx = x + startX + (cidx * spread);
          const cy = y + 450; // Sempre abaixo (vertical)
          
          return renderPillarNode(child, cx, cy, currentX, currentY, level + 1);
        })}
      </React.Fragment>
    );
  };

  const rootPillars = getPillars(null);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none" />

      <TransformWrapper
        ref={transformRef}
        initialScale={0.8}
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
                {/* Central Goal Node */}
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
                        "w-64 h-64 rounded-full flex flex-col items-center justify-center p-12 text-center shadow-[0_0_80px_rgba(255,255,255,0.15)] transition-all duration-700 relative z-10",
                        showGoalContent 
                          ? "bg-white text-black scale-100" 
                          : "bg-zinc-900 text-white scale-90 border-2 border-zinc-800"
                      )}
                    >
                      <Target size={48} className={cn("mb-4 transition-transform duration-700", !showGoalContent && "rotate-180")} />
                      <span className="text-lg font-black leading-tight lowercase px-4 line-clamp-3">{goal.title}</span>
                    </button>
                    
                    <div className="absolute -bottom-4 -right-4 z-20">
                       <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                       >
                         <Button 
                            size="icon" 
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => onCreateChild(e)}
                            className="w-16 h-16 rounded-full bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] border-4 border-black"
                          >
                            <Plus size={32} />
                          </Button>
                       </motion.div>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showGoalContent && rootPillars.map((req, idx) => {
                    const totalRootPillars = rootPillars.length;
                    const spread = 700; // Espaçamento horizontal para o primeiro nível
                    const startX = -(spread * (totalRootPillars - 1)) / 2;
                    const x = startX + (idx * spread);
                    const y = 500; // Começa abaixo do objetivo central
                    
                    return renderPillarNode(req, x, y, 2000, 2000, 0);
                  })}
                </AnimatePresence>
              </div>
            </TransformComponent>

            {/* Controls */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-zinc-950/90 backdrop-blur-2xl border border-white/5 p-3 rounded-[2rem] shadow-2xl">
              <Button variant="ghost" size="icon" onMouseDown={(e) => e.stopPropagation()} onClick={() => zoomIn()} className="w-12 h-12 rounded-2xl hover:bg-white hover:text-black transition-all">
                <ZoomIn size={22} />
              </Button>
              <Button variant="ghost" size="icon" onMouseDown={(e) => e.stopPropagation()} onClick={() => zoomOut()} className="w-12 h-12 rounded-2xl hover:bg-white hover:text-black transition-all">
                <ZoomOut size={22} />
              </Button>
              <div className="w-px h-10 bg-zinc-800 mx-2" />
              <Button variant="ghost" size="icon" onMouseDown={(e) => e.stopPropagation()} onClick={() => resetTransform()} className="w-12 h-12 rounded-2xl hover:bg-white hover:text-black transition-all">
                <Maximize size={22} />
              </Button>
              <div className="flex items-center gap-3 px-6 border-l border-zinc-800 ml-2">
                <Move size={18} className="text-zinc-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">pan canvas</span>
              </div>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default GoalMindMap;