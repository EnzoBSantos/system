"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PomodoroSession, Habit } from '@/types/app';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PomodoroTimerProps {
  onComplete: (session: Omit<PomodoroSession, 'id' | 'timestamp'>) => void;
  habits: Habit[];
}

type Mode = 'focus' | 'short-break' | 'long-break';

const PomodoroTimer = ({ onComplete, habits }: PomodoroTimerProps) => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [linkedHabitId, setLinkedHabitId] = useState<string | undefined>();
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const configs = {
    'focus': { label: 'focus', time: 25 * 60, icon: Zap, color: 'text-white' },
    'short-break': { label: 'rest', time: 5 * 60, icon: Coffee, color: 'text-zinc-500' },
    'long-break': { label: 'deep rest', time: 15 * 60, icon: Moon, color: 'text-zinc-500' },
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
      oscillator.start();
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {}

    onComplete({
      type: mode,
      duration: configs[mode].time / 60,
      habitId: mode === 'focus' ? linkedHabitId : undefined
    });

    if (mode === 'focus') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      if (newCount % 4 === 0) {
        setMode('long-break');
        setTimeLeft(15 * 60);
      } else {
        setMode('short-break');
        setTimeLeft(5 * 60);
      }
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(configs[mode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / configs[mode].time;
  const currentConfig = configs[mode];

  return (
    <div className="max-w-md mx-auto space-y-12 py-12">
      <div className="flex justify-center gap-3">
        {(['focus', 'short-break', 'long-break'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setTimeLeft(configs[m].time);
              setIsActive(false);
            }}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all",
              mode === m 
                ? "bg-white text-black" 
                : "bg-zinc-900 text-zinc-500 hover:text-white"
            )}
          >
            {configs[m].label}
          </button>
        ))}
      </div>

      <div className="relative w-80 h-80 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="#1c1c1e"
            strokeWidth="4"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeDasharray="880"
            animate={{ strokeDashoffset: 880 * (1 - progress) }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <currentConfig.icon size={32} className="text-zinc-500" />
          <span className="text-8xl font-black tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {mode === 'focus' ? `cycle ${pomodoroCount + 1} / 4` : 'breathing'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetTimer}
            className="w-14 h-14 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-900"
          >
            <RotateCcw size={24} />
          </Button>
          
          <Button 
            onClick={toggleTimer}
            className="w-24 h-24 rounded-[2rem] bg-white hover:bg-zinc-200 text-black shadow-2xl transition-transform active:scale-95"
          >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="ml-1" fill="currentColor" />}
          </Button>

          <div className="w-14" />
        </div>

        {mode === 'focus' && (
          <div className="w-full space-y-3">
            <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 block text-center">link to ritual</Label>
            <Select value={linkedHabitId} onValueChange={setLinkedHabitId}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white rounded-2xl h-14 px-6">
                <SelectValue placeholder="General Focus" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                <SelectItem value="none">None</SelectItem>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.emoji} {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;