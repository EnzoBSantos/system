"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Timer, Target, ListTodo, Plus, X, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'dashboard' | 'habits' | 'pomodoro' | 'goals' | 'tasks';

interface MobileNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onOpenGoalFlow: () => void;
  onQuickTask: () => void;
}

const MobileNav = ({ activeTab, setActiveTab, onOpenGoalFlow, onQuickTask }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const leftItems = [
    { id: 'dashboard', label: 'daily', icon: LayoutDashboard },
    { id: 'tasks', label: 'tasks', icon: ListTodo },
  ];

  const rightItems = [
    { id: 'goals', label: 'vision', icon: Target },
    { id: 'pomodoro', label: 'focus', icon: Timer },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center px-6 pb-32">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <div className="relative w-full max-w-sm space-y-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={() => { onQuickTask(); setIsOpen(false); }}
                className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between group active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                    <ListTodo className="text-zinc-400 group-hover:text-white" size={20} />
                  </div>
                  <span className="text-lg font-bold lowercase tracking-tight">create a task.</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center">
                  <Plus size={16} />
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 }}
                onClick={() => { onOpenGoalFlow(); setIsOpen(false); }}
                className="w-full bg-white text-black p-6 rounded-[2rem] flex items-center justify-between group active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
                    <Rocket className="text-black" size={20} />
                  </div>
                  <span className="text-lg font-black lowercase tracking-tight">set a new goal.</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
                  <Plus size={16} />
                </div>
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-black/80 backdrop-blur-2xl border-t border-zinc-900 px-6 pb-8 pt-4">
        <div className="flex justify-between items-center max-w-md mx-auto relative">
          
          <div className="flex gap-8">
            {leftItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300",
                  activeTab === item.id ? "text-white" : "text-zinc-600"
                )}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="absolute left-1/2 -top-12 -translate-x-1/2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90",
                isOpen ? "bg-zinc-800 text-white rotate-45" : "bg-white text-black"
              )}
            >
              <Plus size={32} strokeWidth={3} />
            </button>
          </div>

          <div className="flex gap-8">
            {rightItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300",
                  activeTab === item.id ? "text-white" : "text-zinc-600"
                )}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </div>

        </div>
      </nav>
    </>
  );
};

export default MobileNav;