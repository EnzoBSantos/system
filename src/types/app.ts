export type Category = 'Health' | 'Work' | 'Mindfulness' | 'Learning' | 'Custom';

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: Category;
  frequency: 'daily' | 'weekdays' | 'weekends';
  completedDays: string[]; // ISO dates
  createdAt: string;
  streak: number;
  longestStreak: number;
};

export type PomodoroSession = {
  id: string;
  timestamp: string;
  duration: number;
  type: 'focus' | 'short-break' | 'long-break';
  habitId?: string;
};

export type AppState = {
  habits: Habit[];
  sessions: PomodoroSession[];
};