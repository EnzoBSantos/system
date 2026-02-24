"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, GoalRequirement } from '@/types/goals';
import { Plus, Edit2, Target, Zap, Rocket, CheckCircle2, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

  // Filtramos os requisitos para o mapa (podemos adicionar lógica de hierarquia no futuro)
  const requirements = goal.requirements || [];

  return (
    <div className="relative min-h-[700px] w-full flex items-center justify-center p-20 overflow-visible select-none">
      {/* Linhas de conexão dinâmicas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {requirements.map((req, idx) => {
          if (isNodeHidden(req.id) || !showGoalContent) return null;
          
          const angle = (idx / (requirements.length || 1)) * 2 * Math.PI;
          // Coordenadas calculadas para coincidir com a posição absoluta dos nós
          const x2 = 50 + Math.cos(angle) * 35;
          const y2 = 50 + Math.sin(angle) * 35;
          
          return (
            <motion.line
              key={`line-${req.id}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              x1="50%" y1="50%"
              x2={`${x2}%`} y2={`${y2}%`}
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.15"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>

      {/* Nó Central (A Meta / Visão) */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative z-50"
      >
        <div className="relative group">
          <button 
            onClick={() => setShowGoalContent(!showGoalContent)}
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
          
          {/* Ações flutuantes do Nó Central */}
          <div className="absolute -top-4 -right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onEditNode('goal'); }}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black"
            >
              <Edit2 size={14} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Pilares (Requisitos) */}
      <AnimatePresence>
        {showGoalContent && requirements.map((req, idx) => {
          const angle = (idx / (requirements.length || 1)) * 2 * Math.PI;
          const x = Math.cos(angle) * 35;
          const y = Math.sin(angle) * 35;
          const isHidden = isNodeHidden(req.id);

          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: isHidden ? 0.4 : 1, 
                scale: isHidden ? 0.8 : 1,
                x: `${x}vw`, 
                y: `${y}vh` 
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="absolute z-40"
            >
              <div className="group relative">
                <div 
                  className={cn(
                    "w-36 h-36 rounded-[2.5rem] border-2 flex flex-col items-center justify-center p-5 text-center transition-all duration-300 relative",
                    req.is_completed 
                      ? "bg-zinc-900/50 border-white/10" 
                      : isHidden 
                        ? "bg-zinc-950 border-zinc-900" 
                        : "bg-black border-zinc-800 group-hover:border-white/40"
                  )}
                >
                  {/* Botão de Toggle Visibility (Ocultar) */}
                  <button 
                    onClick={(e) => toggleNodeVisibility(req.id, e)}
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 z-10"
                  >
                    {isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>

                  <div className={cn("transition-all duration-300", isHidden && "blur-sm opacity-20")}>
                    {req.is_completed ? <CheckCircle2 size={24} className="mb-2 text-white/50" /> : <Rocket size={24} className="mb-2 text-zinc-600" />}
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight block">{req.title}</span>
                  </div>

                  {/* Detalhes ao passar o mouse */}
                  {!isHidden && (
                    <div className="absolute inset-0 bg-black/90 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                       <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          onClick={() => onEditNode('requirement', req.id)}
                          className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          size="icon" 
                          onClick={() => onDeleteRequirement(req.id)}
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

      {/* Botão de Adicionar Pilar (Corrigido para evitar bolhas e criação múltipla) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-12 right-12 z-[60]"
      >
        <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddRequirement(e);
          }}
          className="h-16 px-8 rounded-3xl bg-white text-black hover:bg-zinc-200 shadow-2xl font-black lowercase gap-3 text-lg"
        >
          <Plus size={24} /> add vision pilar
        </Button>
      </motion.div>
    </div>
  );
};

export default GoalMindMap;