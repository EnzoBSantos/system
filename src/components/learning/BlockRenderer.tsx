"use client";

import React from 'react';
import { LessonBlock } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface BlockRendererProps {
  block: LessonBlock;
  onAction: () => void;
}

const BlockRenderer = ({ block, onAction }: BlockRendererProps) => {
  // Support both legacy uppercase and new lowercase types during transition
  const type = block.type.toLowerCase();
  const content = block.value || (block as any).content;

  switch (type) {
    case 'heading':
      return (
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tighter lowercase text-white leading-[0.9] mb-8"
        >
          {content}
        </motion.h2>
      );

    case 'paragraph':
    case 'text':
      return (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-zinc-400 font-medium lowercase leading-relaxed mb-8"
        >
          {content}
        </motion.p>
      );

    case 'image':
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-900 mb-12"
        >
          <img 
            src={content} 
            alt="Lesson visual" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      );

    case 'button':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8"
        >
          <Button 
            onClick={onAction}
            className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-zinc-200 text-2xl font-black tracking-tight lowercase transition-transform active:scale-95 shadow-xl"
          >
            {content || 'Continue'}
          </Button>
        </motion.div>
      );

    default:
      return null;
  }
};

export default BlockRenderer;