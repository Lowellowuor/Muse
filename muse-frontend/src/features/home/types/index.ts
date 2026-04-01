export interface Activity {
  id: string;
  type: 'journal' | 'room' | 'thread' | 'artifact';
  title: string;
  preview: string;
  mood?: string;
  timestamp: string;
  icon: string;
}

export interface TrendingItem {
  id: string;
  name: string;
  type: 'room' | 'thread' | 'creator';
  icon: string;
  metrics: {
    views?: number;
    artifacts?: number;
    members?: number;
    replies?: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  progress: number;
  target: number;
  color: string;
  unlocked?: boolean;
}

export interface HomeStats {
  streak: number;
  longestStreak: number;
  totalEntries: number;
  totalWords: number;
  weeklyGoal: number;
  weeklyProgress: number;
  achievements: Achievement[];
}

export interface Suggestion {
  id: string;
  type: 'prompt' | 'room' | 'thread' | 'action';
  title: string;
  description: string;
  icon: any;
  action: () => void;
}