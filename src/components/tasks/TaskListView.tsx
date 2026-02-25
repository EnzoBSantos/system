"use client";

import React from 'react';
import { Task } from '@/types/tasks';
import TaskItem from '@/components/tasks/TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListViewProps {
  tasks: Task[];
  onToggle: (id: string, status: 'open' | 'completed') => void;
  onDelete: (id: string) => void;
  title: string;
}

const TaskListView = ({ tasks, onToggle, onDelete, title }: TaskListViewProps) => {
  const openTasks = tasks.filter(t => t.status === 'open');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] px-2">{title} — {openTasks.length}</h3>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {openTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] px-2">Completed</h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs lowercase">Silence. Everything is in order.</p>
        </div>
      )}
    </div>
  );
};

export default TaskListView;