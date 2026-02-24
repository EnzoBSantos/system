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
import { Rocket, Target } from 'lucide-react';

const schema = z.object({
  title: z.string().min(2, "Title is too short").max(50, "Title is too long"),
});

interface RequirementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string }) => void;
  initialData?: { title: string };
  mode: 'create' | 'edit';
}

const RequirementDialog = ({ isOpen, onClose, onSubmit, initialData, mode }: RequirementDialogProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { title: '' }
  });

  React.useEffect(() => {
    if (isOpen) reset(initialData || { title: '' });
  }, [isOpen, initialData, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white p-8 rounded-[2rem]">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            {mode === 'create' ? <Rocket className="text-white" size={24} /> : <Target className="text-white" size={24} />}
          </div>
          <DialogTitle className="text-2xl font-black lowercase tracking-tight">
            {mode === 'create' ? 'add vision pilar' : 'edit pilar details'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              pilar name
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Financial Freedom"
              className="bg-zinc-900/50 border-zinc-800 h-14 px-5 rounded-2xl focus:ring-white/20 focus:border-white/20 transition-all text-lg font-medium"
            />
            {errors.title && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white"
            >
              cancel
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-xl bg-white text-black hover:bg-zinc-200 font-black lowercase text-base"
            >
              {mode === 'create' ? 'launch pilar' : 'save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementDialog;