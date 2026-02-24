"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Target } from 'lucide-react';

const schema = z.object({
  title: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  first_action: z.string().optional(),
  weekly_commitment: z.string().optional(),
});

interface RequirementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

const RequirementDialog = ({ isOpen, onClose, onSubmit, initialData, mode }: RequirementDialogProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { title: '', first_action: '', weekly_commitment: '' }
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || { title: '', first_action: '', weekly_commitment: '' });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-zinc-950 border-zinc-800 text-white p-8 rounded-[2.5rem] outline-none shadow-2xl">
        <DialogHeader>
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            {mode === 'create' ? <Rocket className="text-white" size={28} /> : <Target className="text-white" size={28} />}
          </div>
          <DialogTitle className="text-3xl font-black lowercase tracking-tighter">
            {mode === 'create' ? 'launch new pillar' : 'refine pillar details'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              pillar name
            </Label>
            <Input
              {...register('title')}
              placeholder="e.g., Daily Meditation"
              className="bg-zinc-900 border-zinc-800 h-14 px-5 rounded-2xl focus:border-white transition-all text-lg font-medium"
            />
            {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              first step (description)
            </Label>
            <Textarea
              {...register('first_action')}
              placeholder="What is the first small action?"
              className="bg-zinc-900 border-zinc-800 min-h-[100px] p-5 rounded-2xl focus:border-white transition-all text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              weekly rhythm
            </Label>
            <Input
              {...register('weekly_commitment')}
              placeholder="e.g., 3 times per week"
              className="bg-zinc-900 border-zinc-800 h-14 px-5 rounded-2xl focus:border-white transition-all text-base"
            />
          </div>

          <DialogFooter className="pt-6 gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-xl h-12 px-6 text-zinc-500 hover:text-white font-bold lowercase"
            >
              cancel
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-xl bg-white text-black hover:bg-zinc-200 font-black lowercase text-lg shadow-lg"
            >
              {mode === 'create' ? 'add pillar' : 'save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementDialog;