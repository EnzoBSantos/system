"use client";

export type BlockType = 'heading' | 'paragraph' | 'image' | 'button';

export interface LessonBlock {
  type: BlockType;
  value: string; // Text content or Image URL
}

export interface LessonPage {
  id: string;
  title: string;
  blocks: LessonBlock[];
}

// This represents the JSONB payload
export type LessonContent = LessonPage[];

export interface LessonSavePayload {
  title: string;
  content: LessonContent;
  order?: number;
}