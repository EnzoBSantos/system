"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TimerSettings from './TimerSettings';

interface PomodoroTimerProps {
  mini?: boolean;
  onSessionComplete?: (duration: number) => void;
}

const PomodoroTimer = ({ mini = false, onSessionComplete }: PomodoroTimerProps) => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onSessionComplete?.(type === 'work' ? workTime : breakTime);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, type, onSessionComplete, workTime, breakTime]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setTimeLeft((type === 'work' ? workTime : breakTime) * 60);
  };

  const updateTimes = (newWork: number, newBreak: number) => {
    setWorkTime(newWork);
    setBreakTime(newBreak);
    if (!isActive) {
      setTimeLeft((type === 'work' ? newWork : newBreak) * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (mini) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-3xl font-bold tracking-tighter tabular-nums">{formatTime(timeLeft)}</h4>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{type}</p>
        </div>
        <div className="flex gap-1">
          <Button size="icon" onClick={toggle} className="rounded-full bg-white text-black hover:bg-zinc-200">
            {isActive ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button size="icon" variant="ghost" onClick={reset} className="rounded-full text-zinc-500 hover:text-white">
            <RotateCcw size={18} />
          </Button>
          <TimerSettings workTime={workTime} breakTime={breakTime} onSave={updateTimes} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 text-center space-y-8 relative">
      <div className="absolute top-8 right-8">
        <TimerSettings workTime={workTime} breakTime={breakTime} onSave={updateTimes} />
      </div>

      <div className="flex justify-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => { setType('work'); setTimeLeft(workTime * 60); setIsActive(false); }}
          className={cn("rounded-2xl lowercase font-bold", type === 'work' ? "bg-white/10 text-white" : "text-zinc-500")}
        >
          <Brain size={18} className="mr-2" /> focus
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => { setType('break'); setTimeLeft(breakTime * 60); setIsActive(false); }}
          className={cn("rounded-2xl lowercase font-bold", type === 'break' ? "bg-white/10 text-white" : "text-zinc-500")}
        >
          <Coffee size={18} className="mr-2" /> break
        </Button>
      </div>

      <div className="relative inline-block">
        <h2 className="text-8xl font-black tracking-tighter tabular-nums">{formatTime(timeLeft)}</h2>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button 
          size="lg" 
          onClick={toggle}
          className="h-16 px-10 rounded-[2rem] bg-white text-black hover:bg-zinc-200 text-xl font-bold lowercase transition-all"
        >
          {isActive ? 'pause' : 'start flow'}
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={reset}
          className="h-16 w-16 rounded-[2rem] text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <RotateCcw size={24} />
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;