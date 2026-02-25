export type BlockType = 'HEADING' | 'TEXT' | 'IMAGE' | 'BUTTON';

export interface LessonBlock {
  id: string;
  type: BlockType;
  content: string;
  placeholder?: string;
}

export interface LessonPage {
  id: string;
  title: string;
  blocks: LessonBlock[];
}

export interface FullLesson {
  id?: string;
  title: string;
  pages: LessonPage[];
}