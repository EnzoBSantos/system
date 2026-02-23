"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Habit } from '@/types/app';
import { Plus } from 'lucide-react';

interface AddHabitDialogProps {
  onAdd: (habit: Omit<Habit, 'id' | 'completedDays' | 'createdAt' | 'streak' | 'longestStreak'>) => void;
}

const AddHabitDialog = ({ onAdd }: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [category, setCategory] = useState<Category>('Health');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({
      name,
      emoji,
      category,
      frequency,
      color: '#ffffff'
    });
    
    setName('');
    setEmoji('✨');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl px-8 h-14 font-bold text-xs uppercase tracking-widest bg-white hover:bg-zinc-200 text-black">
          <Plus size={18} className="mr-2" /> new ritual
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-zinc-800 text-white sm:max-w-[450px] rounded-[2.5rem] p-10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black tracking-tighter lowercase">begin a practice.</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <div className="space-y-3">
            <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">ritual name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="meditation..."
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl px-6 focus:ring-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">symbol</Label>
              <Input 
                value={emoji} 
                onChange={(e) => setEmoji(e.target.value)} 
                className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-center text-2xl"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">sphere</Label>
              <Select value={category} onValueChange={(val: Category) => setCategory(val)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl">
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xl h-16 rounded-[1.5rem] tracking-tight lowercase">
            set intention.
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;