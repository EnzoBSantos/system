"use client";

import React from 'react';
import { LayoutDashboard, CheckCircle2, Timer, Settings, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'habits' | 'pomodoro';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckCircle2 },
    { id: 'pomodoro', label: 'Focus', icon: Timer },
  ];

  return (
    <div className="w-full lg:w-64 border-r border-border h-full bg-background flex flex-col p-6 space-y-8">
      <div className="flex items-center space-x-3 px-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Flame className="text-primary-foreground" size={18} />
        </div>
        <h1 className="text-2xl font-serif text-primary tracking-tight">Aura</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border">
        <div className="bg-muted/30 p-4 rounded-xl space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Mindset</p>
          <p className="text-sm font-serif italic text-foreground/80">"Consistency is the companion of excellence."</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;