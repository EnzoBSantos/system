"use client";

import React, { useState } from 'react';
import { LayoutList, LayoutGrid, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Tasks = () => {
  const [view, setView] = useState<'list' | 'board'>('list');

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">workflow</h2>
          <h1 className="text-6xl font-extrabold tracking-tighter lowercase">the grind.</h1>
        </div>
        
        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <button 
            onClick={() => setView('list')}
            className={cn(
              "px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
              view === 'list' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <LayoutList size={14} /> list
          </button>
          <button 
            onClick={() => setView('board')}
            className={cn(
              "px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
              view === 'board' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <LayoutGrid size={14} /> board
          </button>
        </div>
      </header>

      <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center text-zinc-800">
          <LayoutList size={40} />
        </div>
        <div className="space-y-2">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">phase 1 initialized.</p>
          <p className="text-zinc-600 font-medium">database schema and nlp parser are active. ready for phase 2 components.</p>
        </div>
      </div>
    </div>
  );
};

export default Tasks;