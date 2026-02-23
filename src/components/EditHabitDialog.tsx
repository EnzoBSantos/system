"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Habit } from '@/types/app';
import { 
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, CheckCircle2, Wind, Droplets, Smile, Star, Sun, Flame 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditHabitDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
}

const AVAILABLE_ICONS = [
  { id: 'Sparkles', icon: Sparkles },
  { id: 'Zap', icon: Zap },
  { id: 'Heart', icon: Heart },
  { id: 'Brain', icon: Brain },
  { id: 'BookOpen', icon: BookOpen },
  { id: 'Dumbbell', icon: Dumbbell },
  { id: 'Moon', icon: Moon },
  { id: 'Coffee', icon: Coffee },
  { id: 'Timer', icon: Timer },
  { id: 'CheckCircle2', icon: CheckCircle2 },
  { id: 'Wind', icon: Wind },
  { id: 'Droplets', icon: Droplets },
  { id: 'Smile', icon: Smile },
  { id: 'Star', icon: Star },
  { id: 'Sun', icon: Sun },
  { id: 'Flame', icon: Flame },
];

const EditHabitDialog = ({ habit, open, onOpenChange, onUpdate }: EditHabitDialogProps) => {
  const [name, setName] = useState(habit.name);
  const [selectedIcon, setSelectedIcon] = useState(habit.emoji);
  const [category, setCategory] = useState<Category>(habit.category);

  useEffect(() => {
    if (open) {
      setName(habit.name);
      setSelectedIcon(habit.emoji);
      setCategory(habit.category);
    }
  }, [open, habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onUpdate(habit.id, {
      name,
      emoji: selectedIcon,
      category,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-zinc-800 text-white sm:max-w-[480px] rounded-[2.5rem] p-8 md:p-10 outline-none">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl font-black tracking-tighter lowercase">refine ritual.</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <div className="space-y-3">
            <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">ritual name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="meditation..."
              className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl px-6 focus:ring-white text-lg lowercase font-medium"
            />
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">symbol</Label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <ScrollArea className="h-32">
                <div className="grid grid-cols-4 gap-3">
                  {AVAILABLE_ICONS.map(({ id, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedIcon(id)}
                      className={cn(
                        "h-12 w-full rounded-xl flex items-center justify-center transition-all duration-300",
                        selectedIcon === id 
                          ? "bg-white text-black scale-105" 
                          : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                      )}
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">sphere</Label>
            <Select value={category} onValueChange={(val: Category) => setCategory(val)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl px-6 text-lg font-medium lowercase">
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

          <Button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xl h-16 rounded-[1.5rem] tracking-tight lowercase mt-4 transition-transform active:scale-95">
            save changes.
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabitDialog;