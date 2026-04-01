import { MoodType } from '../../threads/types';

export interface WritingAnalytics {
  mostProductiveHour: number;
  mostProductiveDay: string;
  averageWordsPerSession: number;
  writingConsistency: number;
  totalSessionsThisWeek: number;
  bestStreak: number;
}

export interface MoodTrend {
  mood: MoodType;
  count: number;
  percentage: number;
  averageWords: number;
  bestTimeOfDay: string;
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  confidence: number;
  example: string;
  actionableTip: string;
}

export interface Recommendation {
  id: string;
  type: 'prompt' | 'room' | 'thread' | 'action' | 'connection';
  title: string;
  description: string;
  reason: string;
  actionLink: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ProgressMetric {
  label: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface WeeklyDigest {
  week: string;
  summary: string;
  highlights: string[];
  achievements: string[];
  suggestions: string[];
  moodOverview: string;
}

export interface CreativityScore {
  overall: number;
  consistency: number;
  depth: number;
  originality: number;
  engagement: number;
  history: { date: string; score: number }[];
}

export interface ActionableTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  completed?: boolean;
}