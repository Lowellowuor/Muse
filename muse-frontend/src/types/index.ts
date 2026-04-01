export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: MoodType;
  tags: string[];
  wordCount: number;
  aiSummary?: string;
  sentiment?: number;
}

export type MoodType = 'inspired' | 'reflective' | 'anxious' | 'peaceful' | 'energetic';

export interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'summary';
  content: string;
  date: string;
}

export interface Stats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  averageMood: number;
  mostActiveHour: number;
}
// Room-related types

export type RoomType = 'vault' | 'gallery' | 'studio' | 'archive' | 'collab';

export interface Artifact {
  id: string;
  type: 'note' | 'image' | 'link' | 'audio' | 'quote' | 'document';
  title: string;
  content: string;
  metadata?: {
    url?: string;
    imageUrl?: string;
    duration?: number;
    author?: string;
    source?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  type: RoomType;
  icon: string;
  coverImage?: string;
  tags: string[];
  artifacts: Artifact[];
  pinned: boolean;
  isArchived: boolean;
  collaborators: string[];
  createdAt: number;
  updatedAt: number;
  count: number;
}

export interface RoomTemplate {
  name: string;
  description: string;
  icon: string;
  type: RoomType;
  suggestedTags: string[];
}

export interface RoomActivity {
  id: string;
  roomId: string;
  action: 'create' | 'add_artifact' | 'delete_artifact' | 'update' | 'share';
  artifactId?: string;
  userId: string;
  timestamp: number;
}

export interface RoomStats {
  totalArtifacts: number;
  artifactBreakdown: Record<Artifact['type'], number>;
  mostUsedTags: string[];
  lastActive: string;
  wordCount: number;
}