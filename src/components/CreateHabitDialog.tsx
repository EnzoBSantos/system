"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, Timer, Wind, Droplets, Smile, Star, Sun, Flame } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

interface CreateHabitDialogProps {
  onSuccess: () => void;
}

const ICONS = [
  { id: 'Sparkles', icon: Sparkles },
  { id: 'Zap', icon: Zap },
  { id: 'Heart', icon: Heart },
  { id: 'Brain', icon: Brain },
  { id: 'BookOpen', icon: BookOpen },
  { id: 'Dumbbell', icon: Dumbbell },
  { id: 'Moon', icon: Moon },
  { id: 'Coffee', icon: Coffee },
  { id: 'Timer', icon: Timer },
  { id: 'Wind', icon: Wind },
  { id: 'Droplets', icon: Droplets },
  { id: 'Smile', icon: Smile },
  { id: 'Star', icon: Star },
  { id: 'Sun', icon: Sun },
  { id: 'Flame', icon: Flame },
];

const CreateHabitDialog = ({ onSuccess }: CreateHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('Sparkles');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from('habits').insert([
        { 
          name: name.trim(), 
          user_id: user.id,
          emoji: selectedEmoji,
          completed_days: [],
          streak: 0
        }
      ]);

      if (error) throw error;

      toast({ title: "ritual initialized." });
      setName('');
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({ title: "failed to create ritual", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-zinc-200 transition-all text-lg font-bold lowercase gap-2"
        >
          <Plus size={24} />
          add new ritual
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-900 rounded-[3rem] max-w-md p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-extrabold tracking-tighter lowercase">new ritual.</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium lowercase">
            set the intention for your next habit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="meditation, gym, reading..."
              className="h-14 rounded-2xl bg-zinc-900 border-zinc-800 focus:border-white transition-all text-lg lowercase"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">visual symbol</label>
            <div className="grid grid-cols-5 gap-3">
              {ICONS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedEmoji(id)}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    selectedEmoji === id 
                      ? "bg-white text-black scale-110" 
                      : "bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCreate}
          disabled={isLoading || !name.trim()}
          className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-bold lowercase"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "create ritual"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHabitDialog;