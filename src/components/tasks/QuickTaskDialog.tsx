"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskInput from './TaskInput';
import { Task } from '@/types/tasks';

interface QuickTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (task?: Task) => void;
}

const QuickTaskDialog = ({ open, onOpenChange, onTaskCreated }: QuickTaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white rounded-[2.5rem] p-8 max-w-lg outline-none">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-black tracking-tighter lowercase">capture ritual.</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <TaskInput 
            onTaskCreated={(task) => {
              onTaskCreated(task);
              onOpenChange(false);
            }} 
          />
        </div>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center mt-6">
          tip: use !p1 for priority, #project for context
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default QuickTaskDialog;