"use client";

import React from 'react';
import { LayoutDashboard, CheckCircle2, Timer, Target, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'habits' | 'pomodoro' | 'goals' | 'tasks';

interface MobileNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  const navItems = [
    { id: 'dashboard', label: 'daily', icon: LayoutDashboard },
    { id: 'tasks', label: 'tasks', icon: ListTodo },
    { id: 'habits', label: 'rituals', icon: CheckCircle2 },
    { id: 'goals', label: 'vision', icon: Target },
    { id: 'pomodoro', label: 'focus', icon: Timer },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-4 pb-6 pt-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-white" : "text-zinc-500"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive ? "bg-white text-black" : "bg-transparent"
              )}>
                <Icon size={18} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-[0.1em]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;