"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckCircle2, Timer, Target, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUOTES } from '@/lib/quotes';
import PillarLogo from './PillarLogo';

type Tab = 'dashboard' | 'habits' | 'pomodoro' | 'goals' | 'tasks';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'daily', icon: LayoutDashboard },
    { id: 'tasks', label: 'tasks', icon: ListTodo },
    { id: 'habits', label: 'rituals', icon: CheckCircle2 },
    { id: 'goals', label: 'vision', icon: Target },
    { id: 'pomodoro', label: 'focus', icon: Timer },
  ];

  return (
    <div className="hidden lg:flex w-72 border-r border-border h-full bg-black flex-col p-8 space-y-12 shrink-0">
      <div className="flex items-center space-x-3 px-2">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
          <PillarLogo className="text-black" size={22} />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter lowercase">pillar.</h1>
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
        <div className="bg-zinc-900 p-6 rounded-[2rem] space-y-4">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">inspiration</p>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-relaxed italic text-zinc-100">"{quote.text}"</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">— {quote.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;