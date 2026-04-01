export type ContentType = 'journal' | 'thread' | 'room' | 'artifact' | 'note' | 'idea';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: ContentType;
  icon: string;
  preview: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface RecentCreation {
  id: string;
  type: ContentType;
  title: string;
  preview: string;
  createdAt: string;
  link: string;
}

export interface Draft {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  savedAt: string;
}

export interface AIWriterState {
  prompt: string;
  generatedContent: string;
  isGenerating: boolean;
  tone: 'professional' | 'casual' | 'inspiring' | 'reflective';
  length: 'short' | 'medium' | 'long';
}