import { MoodType } from '../../threads/types';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  website?: string;
  twitter?: string;
  github?: string;
  creativeStatement: string;
}

export interface CreativeStats {
  totalWords: number;
  currentStreak: number;
  longestStreak: number;
  totalThreads: number;
  totalRooms: number;
  totalArtifacts: number;
  totalLikesReceived: number;
  totalReplies: number;
  totalViews: number;
  rank: string;
  level: number;
  nextLevelProgress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: 'streak' | 'words' | 'community' | 'rooms' | 'engagement';
}

export interface Activity {
  id: string;
  type: 'journal' | 'thread' | 'room' | 'artifact' | 'achievement' | 'like';
  title: string;
  description: string;
  timestamp: string;
  link: string;
  metadata?: {
    wordCount?: number;
    mood?: MoodType;
    likes?: number;
    replies?: number;
  };
}

export interface CreativeSignature {
  dominantMood: MoodType;
  peakHour: number;
  favoriteTags: string[];
  writingStyle: 'concise' | 'descriptive' | 'analytical' | 'poetic';
  uniqueInsight: string;
  recommendation: string;
}