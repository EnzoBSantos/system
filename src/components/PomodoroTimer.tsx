"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PomodoroTimerProps {
  onSessionComplete: () => void;
}

const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<'focus' | 'break'>('focus');
  const { toast } = useToast();

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(type === 'focus' ? 25 * 60 : 5 * 60);
  }, [type]);

  const saveSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('pomodoro_sessions').insert([
      {
        user_id: user.id,
        duration: type === 'focus' ? 25 : 5,
        type: type,
        timestamp: new Date().toISOString()
      }
    ]);

    if (!error) {
      onSessionComplete();
    }
  };

  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      saveSession();
      toast({
        title: type === 'focus' ? "Focus complete." : "Break complete.",
        description: type === 'focus' ? "Time for a well-deserved rest." : "Ready to align again?",
      });
      setType(type === 'focus' ? 'break' : 'focus');
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, type]);

  useEffect(() => {
    resetTimer();
  }, [type, resetTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-12 py-12">
      <div className="flex gap-4 p-2 bg-zinc-900 rounded-[2rem] border border-zinc-800">
        <button
          onClick={() => setType('focus')}
          className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] transition-all font-bold lowercase tracking-tight ${
            type === 'focus' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Zap size={18} />
          focus
        </button>
        <button
          onClick={() => setType('break')}
          className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] transition-all font-bold lowercase tracking-tight ${
            type === 'break' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Coffee size={18} />
          break
        </button>
      </div>

      <div className="relative flex flex-col items-center justify-center space-y-8">
        <motion.div 
          key={timeLeft}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[12rem] md:text-[16rem] font-black tracking-tighter leading-none select-none tabular-nums"
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="flex items-center gap-6">
          <Button
            size="icon"
            variant="outline"
            onClick={resetTimer}
            className="w-16 h-16 rounded-full border-zinc-800 hover:bg-zinc-900 text-zinc-400"
          >
            <RotateCcw size={24} />
          </Button>
          
          <Button
            onClick={() => setIsActive(!isActive)}
            className="w-32 h-32 rounded-full bg-white text-black hover:bg-zinc-200 transition-transform active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            {isActive ? <Pause size={48} /> : <Play size={48} className="ml-2" />}
          </Button>

          <div className="w-16 h-16" /> {/* Spacer for symmetry */}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] w-full text-center space-y-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">current mission</p>
        <h3 className="text-2xl font-bold lowercase tracking-tight">
          {type === 'focus' ? 'sharpen your mind.' : 'recharge your soul.'}
        </h3>
      </div>
    </div>
  );
};

export default PomodoroTimer;