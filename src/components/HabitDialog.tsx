"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, CheckCircle2, Wind, Droplets, Smile, Star, Sun, Flame 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ICONS = [
  'Sparkles', 'Zap', 'Heart', 'Brain', 'BookOpen', 'Dumbbell', 'Moon', 'Coffee', 
  'Timer', 'CheckCircle2', 'Wind', 'Droplets', 'Smile', 'Star', 'Sun', 'Flame'
];

const ICON_MAP: Record<string, any> = {
  Sparkles, Zap, Heart, Brain, BookOpen, Dumbbell, Moon, Coffee, 
  Timer, CheckCircle2, Wind, Droplets, Smile, Star, Sun, Flame
};

const HabitDialog = ({ isOpen, onClose, onSuccess }: HabitDialogProps) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(ICONS[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast({ title: "unauthorized", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('habits').insert({
      name,
      emoji: selectedEmoji,
      user_id: userData.user.id,
      completed_days: [],
      streak: 0,
      longest_streak: 0
    });

    if (error) {
      toast({ title: "error creating ritual", variant: "destructive" });
    } else {
      toast({ title: "ritual defined." });
      setName('');
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-[2.5rem] max-w-md p-10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black lowercase tracking-tighter">new ritual.</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ritual name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="meditation, reading, workout..."
              className="h-14 bg-zinc-900 border-zinc-800 rounded-2xl focus:ring-white/20 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">choose symbol</label>
            <div className="grid grid-cols-4 gap-4">
              {ICONS.map((iconName) => {
                const Icon = ICON_MAP[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedEmoji(iconName)}
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2",
                      selectedEmoji === iconName 
                        ? "bg-white text-black border-white shadow-xl scale-110" 
                        : "bg-zinc-900 text-zinc-600 border-transparent hover:border-zinc-800"
                    )}
                  >
                    <Icon size={24} />
                  </button>
                );
              })}
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-zinc-200 font-bold text-lg lowercase transition-all active:scale-95 shadow-xl"
          >
            {loading ? "defining..." : "establish ritual"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitDialog;