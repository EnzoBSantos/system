"use client";

export type Category = 'Health' | 'Work' | 'Mindfulness' | 'Learning' | 'Custom';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  category: Category;
  frequency?: string;
  color?: string;
  completed_days: string[];
  streak: number;
  longest_streak?: number;
  created_at?: string;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  habit_id?: string;
  duration: number;
  type: 'work' | 'short-break' | 'long-break';
  timestamp: string;
}