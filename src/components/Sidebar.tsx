"use client";

import React from 'react';
import { LayoutDashboard, CheckCircle2, Timer, Flame, Bird } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'habits' | 'pomodoro';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'daily', icon: LayoutDashboard },
    { id: 'habits', label: 'rituals', icon: CheckCircle2 },
    { id: 'pomodoro', label: 'focus', icon: Timer },
  ];

  return (
    <div className="w-full lg:w-72 border-r border-border h-full bg-black flex flex-col p-8 space-y-12">
      <div className="flex items-center space-x-3 px-2">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
          <Bird className="text-black" size={22} />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter lowercase">aura.</h1>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-white text-black" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              )}
            >
              <Icon size={20} className={cn("transition-transform group-hover:scale-110")} />
              <span className="font-semibold text-lg">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-border">
        <div className="bg-zinc-900 p-6 rounded-3xl space-y-3">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">inspiration</p>
          <p className="text-sm font-medium leading-relaxed italic">"what you think, you become."</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;