"use client";

import React from 'react';
import { LayoutDashboard, CheckCircle2, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'habits' | 'pomodoro';

interface MobileNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  const navItems = [
    { id: 'dashboard', label: 'daily', icon: LayoutDashboard },
    { id: 'habits', label: 'rituals', icon: CheckCircle2 },
    { id: 'pomodoro', label: 'focus', icon: Timer },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-6 pb-8 pt-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "text-white" : "text-zinc-500"
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all",
                isActive ? "bg-white text-black scale-110" : "bg-transparent"
              )}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;