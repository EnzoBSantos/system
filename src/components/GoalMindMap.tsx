"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Goal, GoalRequirement } from '@/types/goals';
import { Plus, Edit2, Target, Zap, Rocket, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface GoalMindMapProps {
  goal: Goal;
  onAddRequirement: () => void;
  onEditNode: (type: 'goal' | 'requirement', id?: string) => void;
}

const GoalMindMap = ({ goal, onAddRequirement, onEditNode }: GoalMindMapProps) => {
  return (
    <div className="relative min-h-[600px] w-full flex items-center justify-center p-12 overflow-visible">
      {/* Linhas de conexão (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {goal.requirements?.map((req, idx) => {
          // Lógica simples para distribuir os nós em círculo
          const angle = (idx / (goal.requirements?.length || 1)) * 2 * Math.PI;
          const x2 = 50 + Math.cos(angle) * 35;
          const y2 = 50 + Math.sin(angle) * 35;
          
          return (
            <motion.line
              key={req.id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              x1="50%" y1="50%"
              x2={`${x2}%`} y2={`${y2}%`}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* Nó Central (A Meta) */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative z-10"
      >
        <button 
          onClick={() => onEditNode('goal')}
          className="w-40 h-40 rounded-full bg-white text-black flex flex-col items-center justify-center p-6 text-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform group"
        >
          <Target size={24} className="mb-2" />
          <span className="text-sm font-black leading-tight lowercase">{goal.title}</span>
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white p-2 rounded-full border border-zinc-800">
            <Edit2 size={12} />
          </div>
        </button>
      </motion.div>

      {/* Nós Periféricos (Requisitos/Pilares) */}
      {goal.requirements?.map((req, idx) => {
        const angle = (idx / (goal.requirements?.length || 1)) * 2 * Math.PI;
        const x = Math.cos(angle) * 35;
        const y = Math.sin(angle) * 35;

        return (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, x: `${x}vw`, y: `${y}vh` }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="absolute z-10"
          >
            <div className="group relative">
              <button 
                onClick={() => onEditNode('requirement', req.id)}
                className={cn(
                  "w-32 h-32 rounded-[2rem] border-2 flex flex-col items-center justify-center p-4 text-center transition-all hover:scale-105",
                  req.is_completed 
                    ? "bg-zinc-900 border-white/20 opacity-60" 
                    : "bg-black border-zinc-800 hover:border-white/40"
                )}
              >
                {req.is_completed ? <CheckCircle2 size={20} className="mb-2 text-white" /> : <Rocket size={20} className="mb-2 text-zinc-500" />}
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{req.title}</span>
                
                {req.first_action && !req.is_completed && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 bg-zinc-900 border border-zinc-800 rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">next step</p>
                    <p className="text-[10px] lowercase font-medium text-white line-clamp-2">{req.first_action}</p>
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* Botão Adicionar Pilar (Flutuante) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-0 right-0"
      >
        <Button 
          onClick={onAddRequirement}
          className="h-14 px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 lowercase font-bold gap-2"
        >
          <Plus size={18} /> add pilar
        </Button>
      </motion.div>
    </div>
  );
};

export default GoalMindMap;