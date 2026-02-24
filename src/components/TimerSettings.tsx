"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface TimerSettingsProps {
  workTime: number;
  breakTime: number;
  onSave: (work: number, breakTime: number) => void;
}

const TimerSettings = ({ workTime, breakTime, onSave }: TimerSettingsProps) => {
  const [tempWork, setTempWork] = useState(workTime);
  const [tempBreak, setTempBreak] = useState(breakTime);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(tempWork, tempBreak);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800">
          <Settings size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[2rem] p-8 max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter lowercase">timer config.</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">focus (min)</Label>
            <Input 
              type="number" 
              value={tempWork} 
              onChange={(e) => setTempWork(Number(e.target.value))}
              className="bg-zinc-800 border-zinc-700 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">break (min)</Label>
            <Input 
              type="number" 
              value={tempBreak} 
              onChange={(e) => setTempBreak(Number(e.target.value))}
              className="bg-zinc-800 border-zinc-700 rounded-xl"
            />
          </div>
          <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-xl h-12 lowercase">
            update durations.
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimerSettings;