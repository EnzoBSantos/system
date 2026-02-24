"use client";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  why: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  deadline: string;
  status: 'active' | 'completed';
  xp: number;
  level: number;
  created_at: string;
  requirements?: GoalRequirement[];
}

export interface GoalRequirement {
  id: string;
  goal_id: string;
  title: string;
  first_action: string;
  weekly_commitment: string;
  deadline: string;
  is_completed: boolean;
}