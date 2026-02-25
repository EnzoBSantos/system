export type Priority = 1 | 2 | 3 | 4;
export type TaskStatus = 'open' | 'completed';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  color: string;
  is_inbox: boolean;
  created_at: string;
}

export interface Section {
  id: string;
  project_id: string;
  name: string;
  order: number;
}

export interface Label {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  section_id: string | null;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  priority_level: Priority;
  status: TaskStatus;
  recurring_rule: string | null;
  created_at: string;
  labels?: string[];
}

export interface UserKarma {
  user_id: string;
  total_score: number;
  daily_streak: number;
  last_completed_at: string | null;
}