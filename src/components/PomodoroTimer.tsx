"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Moon, Settings2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PomodoroSession, Habit } from '@/types/app';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PomodoroTimerProps {
  onComplete: (session: Omit<PomodoroSession, 'id' | 'timestamp'>) => void;
  habits: Habit[];
}

type Mode = 'focus' | 'short-break' | 'long-break';

const PomodoroTimer = ({ onComplete, habits }: PomodoroTimerProps) => {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<Mode>('focus');
  
  // Custom durations in minutes
  const [durations, setDurations] = useState({
    'focus': 25,
    'short-break': 5,
    'long-break': 15
  });
  
  const [timeLeft, setTimeLeft] = useState(durations['focus'] * 60);
  const [isActive, setIsActive] = useState(false);
  const [linkedHabitId, setLinkedHabitId] = useState<string | undefined>();
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const configs = {
    'focus': { label: 'focus', icon: Zap },
    'short-break': { label: 'rest', icon: Coffee },
    'long-break': { label: 'deep rest', icon: Moon },
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

  // Update time left when durations change and timer is NOT active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(durations[mode] * 60);
    }
  }, [durations, mode, isActive]);

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
      duration: durations[mode],
      habitId: mode === 'focus' ? linkedHabitId : undefined
    });

    if (mode === 'focus') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      if (newCount % 4 === 0) {
        setMode('long-break');
      } else {
        setMode('short-break');
      }
    } else {
      setMode('focus');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateDuration = (m: Mode, value: string) => {
    const mins = parseInt(value) || 1;
    setDurations(prev => ({ ...prev, [m]: mins }));
  };

  const progress = timeLeft / (durations[mode] * 60);
  const currentConfig = configs[mode];
  
  const circleSize = isMobile ? 240 : 320;
  const radius = circleSize / 2 - 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="max-w-md mx-auto space-y-8 lg:space-y-12 py-6 lg:py-12 relative">
      <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-3">
        {(['focus', 'short-break', 'long-break'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setIsActive(false);
            }}
            className={cn(
              "px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl font-bold text-[10px] lg:text-xs uppercase tracking-widest transition-all",
              mode === m 
                ? "bg-white text-black" 
                : "bg-zinc-900 text-zinc-500 hover:text-white"
            )}
          >
            {configs[m].label}
          </button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800 ml-1">
              <Settings2 size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-zinc-950 border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <div className="space-y-6">
              <h4 className="text-sm font-black tracking-tighter lowercase text-white">timer settings.</h4>
              <div className="space-y-4">
                {(['focus', 'short-break', 'long-break'] as Mode[]).map((m) => (
                  <div key={m} className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{configs[m].label} (mins)</Label>
                    <Input 
                      type="number" 
                      value={durations[m]} 
                      onChange={(e) => updateDuration(m, e.target.value)}
                      className="bg-zinc-900 border-zinc-800 h-10 rounded-xl focus:ring-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div 
        className="relative mx-auto" 
        style={{ width: circleSize, height: circleSize }}
      >
        <svg 
          className="w-full h-full transform -rotate-90"
          viewBox={`0 0 ${circleSize} ${circleSize}`}
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="#1c1c1e"
            strokeWidth="4"
          />
          <motion.circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
          <currentConfig.icon size={isMobile ? 24 : 32} className="text-zinc-500" />
          <span className={cn(
            "font-black tracking-tighter tabular-nums",
            isMobile ? "text-6xl" : "text-8xl"
          )}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {mode === 'focus' ? `cycle ${pomodoroCount + 1} / 4` : 'breathing'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 lg:gap-10">
        <div className="flex items-center gap-6 lg:gap-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetTimer}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-900"
            aria-label="Reset timer"
          >
            <RotateCcw size={20} />
          </Button>
          
          <Button 
            onClick={toggleTimer}
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-white hover:bg-zinc-200 text-black shadow-2xl transition-transform active:scale-95"
            aria-label={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? <Pause size={32} lg-size={40} fill="currentColor" /> : <Play size={32} lg-size={40} className="ml-1" fill="currentColor" />}
          </Button>

          <div className="w-12 lg:w-14" />
        </div>

        {mode === 'focus' && (
          <div className="w-full space-y-3 px-4">
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