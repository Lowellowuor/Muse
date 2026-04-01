import { create } from 'zustand';
import { HomeStats, Activity, TrendingItem, Suggestion, Achievement } from '../types';
import { FileText, FolderOpen, MessageCircle, Zap, Brain, Palette, Flame, BookOpen, Home } from 'lucide-react';

// Dummy data with real icon components
const dummyActivities: Activity[] = [
  { 
    id: '1', 
    type: 'journal', 
    title: 'The Future of Creative AI', 
    preview: 'Exploring how AI is reshaping creativity...', 
    mood: 'inspired', 
    timestamp: new Date().toISOString(), 
    icon: 'FileText' 
  },
  { 
    id: '2', 
    type: 'room', 
    title: 'Added to Creative Lab', 
    preview: 'New artifact: Mind Map visualization', 
    timestamp: new Date(Date.now() - 3600000).toISOString(), 
    icon: 'FolderOpen' 
  },
  { 
    id: '3', 
    type: 'thread', 
    title: 'Started discussion', 
    preview: 'How do you overcome creative blocks?', 
    timestamp: new Date(Date.now() - 7200000).toISOString(), 
    icon: 'MessageCircle' 
  },
];

const dummyTrending: TrendingItem[] = [
  { 
    id: '1', 
    name: 'Creative Ideation Lab', 
    type: 'room', 
    icon: 'Zap', 
    metrics: { members: 234, artifacts: 89 } 
  },
  { 
    id: '2', 
    name: 'AI & Creativity', 
    type: 'thread', 
    icon: 'Brain', 
    metrics: { replies: 45, views: 1234 } 
  },
  { 
    id: '3', 
    name: 'Visual Inspiration Hub', 
    type: 'room', 
    icon: 'Palette', 
    metrics: { members: 567, artifacts: 234 } 
  },
];

const dummyAchievements: Achievement[] = [
  { 
    id: '1', 
    name: '7 Day Streak', 
    description: 'Write for 7 days in a row', 
    icon: 'Flame', 
    progress: 7, 
    target: 7, 
    color: 'from-orange-500 to-red-500', 
    unlocked: true 
  },
  { 
    id: '2', 
    name: 'First 10K Words', 
    description: 'Reach 10,000 total words', 
    icon: 'BookOpen', 
    progress: 7500, 
    target: 10000, 
    color: 'from-blue-500 to-cyan-500' 
  },
  { 
    id: '3', 
    name: 'Room Creator', 
    description: 'Create 3 rooms', 
    icon: 'Home', 
    progress: 2, 
    target: 3, 
    color: 'from-purple-500 to-pink-500' 
  },
];

// Icon mapping for string references
export const iconMap = {
  FileText,
  FolderOpen,
  MessageCircle,
  Zap,
  Brain,
  Palette,
  Flame,
  BookOpen,
  Home,
};

export const useHomeStore = create<HomeState>((set, get) => ({
  stats: {
    streak: 7,
    longestStreak: 12,
    totalEntries: 24,
    totalWords: 8750,
    weeklyGoal: 5000,
    weeklyProgress: 3200,
    achievements: dummyAchievements,
  },
  recentActivities: dummyActivities,
  trendingItems: dummyTrending,
  suggestions: [],
  isLoading: false,

  fetchHomeData: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  updateWeeklyGoal: (goal) => {
    set((state) => ({
      stats: { ...state.stats, weeklyGoal: goal }
    }));
  },

  recordActivity: (activity) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      recentActivities: [newActivity, ...state.recentActivities.slice(0, 9)]
    }));
  },
}));