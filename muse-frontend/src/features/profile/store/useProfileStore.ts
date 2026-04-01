import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, CreativeStats, Achievement, Activity, CreativeSignature } from '../types';
import { MoodType } from '../../../types';

// Import icons for achievements
import { 
  FileText, Flame, BookOpen, MessageCircle, Home, 
  Trophy, Target, Heart, Zap, Brain, Star, Award,
  Calendar, Users, FolderOpen, ThumbsUp, Eye, Rocket,
  Sparkles, TrendingUp, Package, Lightbulb, Sun, Moon
} from 'lucide-react';

interface ProfileState {
  profile: UserProfile | null;
  stats: CreativeStats | null;
  achievements: Achievement[];
  activities: Activity[];
  creativeSignature: CreativeSignature | null;
  isLoading: boolean;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAvatar: (avatar: string) => void;
  getAchievements: () => Achievement[];
  getRecentActivities: (limit?: number) => Activity[];
  getLevelProgress: () => number;
}

// Icon mapping for achievements (storing icon names as strings, but mapping to components)
export const achievementIcons: Record<string, any> = {
  'FileText': FileText,
  'Flame': Flame,
  'BookOpen': BookOpen,
  'MessageCircle': MessageCircle,
  'Home': Home,
  'Trophy': Trophy,
  'Target': Target,
  'Heart': Heart,
  'Zap': Zap,
  'Brain': Brain,
  'Star': Star,
  'Award': Award,
  'Calendar': Calendar,
  'Users': Users,
  'FolderOpen': FolderOpen,
  'ThumbsUp': ThumbsUp,
  'Eye': Eye,
  'Rocket': Rocket,
  'Sparkles': Sparkles,
  'TrendingUp': TrendingUp,
  'Package': Package,
  'Lightbulb': Lightbulb,
  'Sun': Sun,
  'Moon': Moon,
};

// Helper function to get icon component by name
export const getAchievementIcon = (iconName: string) => {
  return achievementIcons[iconName] || Award;
};

// Dummy profile data
const dummyProfile: UserProfile = {
  id: '1',
  name: 'Alex Chen',
  username: '@alexcreates',
  email: 'alex@muse.com',
  avatar: '',
  bio: 'Creative technologist exploring the intersection of AI and human creativity. Building tools for the next generation of creators.',
  location: 'San Francisco, CA',
  joinDate: '2024-01-15',
  website: 'https://alexcreates.dev',
  twitter: '@alexcreates',
  github: 'alexcreates',
  creativeStatement: 'I believe creativity is the most human thing we do, and AI should amplify, not replace it.',
};

const dummyStats: CreativeStats = {
  totalWords: 28450,
  currentStreak: 12,
  longestStreak: 28,
  totalThreads: 8,
  totalRooms: 4,
  totalArtifacts: 47,
  totalLikesReceived: 156,
  totalReplies: 89,
  totalViews: 3450,
  rank: 'Artisan',
  level: 7,
  nextLevelProgress: 65,
};

const dummyAchievements: Achievement[] = [
  { id: '1', title: 'First Words', description: 'Write your first 100 words', icon: 'FileText', unlockedAt: '2024-01-15', progress: 100, target: 100, category: 'words' },
  { id: '2', title: '7-Day Streak', description: 'Write for 7 days in a row', icon: 'Flame', unlockedAt: '2024-01-22', progress: 7, target: 7, category: 'streak' },
  { id: '3', title: '10K Words', description: 'Reach 10,000 total words', icon: 'BookOpen', unlockedAt: '2024-02-10', progress: 10000, target: 10000, category: 'words' },
  { id: '4', title: 'Community Starter', description: 'Create your first thread', icon: 'MessageCircle', unlockedAt: '2024-01-20', progress: 1, target: 1, category: 'community' },
  { id: '5', title: 'Room Curator', description: 'Create 3 rooms', icon: 'Home', unlockedAt: '2024-02-01', progress: 3, target: 3, category: 'rooms' },
  { id: '6', title: '30-Day Streak', description: 'Write for 30 days in a row', icon: 'Trophy', progress: 12, target: 30, category: 'streak' },
  { id: '7', title: '50K Words', description: 'Reach 50,000 total words', icon: 'Target', progress: 28450, target: 50000, category: 'words' },
  { id: '8', title: 'Engagement Master', description: 'Receive 100 likes', icon: 'Heart', unlockedAt: '2024-02-15', progress: 156, target: 100, category: 'engagement' },
  { id: '9', title: 'Creative Visionary', description: 'Write 50 journal entries', icon: 'Star', progress: 24, target: 50, category: 'words' },
  { id: '10', title: 'Thread Master', description: 'Create 10 threads', icon: 'MessageCircle', progress: 8, target: 10, category: 'community' },
];

const dummyActivities: Activity[] = [
  { id: '1', type: 'journal', title: 'The Future of AI', description: 'Wrote a new journal entry', timestamp: new Date().toISOString(), link: '/journal', metadata: { wordCount: 450, mood: 'inspired' } },
  { id: '2', type: 'thread', title: 'Creative Blocks Discussion', description: 'Started a new thread', timestamp: new Date(Date.now() - 86400000).toISOString(), link: '/threads', metadata: { likes: 12, replies: 5 } },
  { id: '3', type: 'room', title: 'AI Lab', description: 'Created a new room', timestamp: new Date(Date.now() - 172800000).toISOString(), link: '/rooms' },
  { id: '4', type: 'achievement', title: '7-Day Streak', description: 'Unlocked a new achievement', timestamp: new Date(Date.now() - 259200000).toISOString(), link: '/profile' },
  { id: '5', type: 'artifact', title: 'Mind Map', description: 'Added artifact to Creative Lab', timestamp: new Date(Date.now() - 345600000).toISOString(), link: '/rooms' },
  { id: '6', type: 'journal', title: 'Morning Reflections', description: 'Wrote a reflective entry', timestamp: new Date(Date.now() - 432000000).toISOString(), link: '/journal', metadata: { wordCount: 320, mood: 'reflective' } },
];

const dummyCreativeSignature: CreativeSignature = {
  dominantMood: 'inspired',
  peakHour: 21,
  favoriteTags: ['ai', 'creativity', 'future', 'innovation', 'design'],
  writingStyle: 'descriptive',
  uniqueInsight: 'Your writing peaks when exploring future-oriented topics',
  recommendation: 'Consider creating a dedicated room for your AI explorations',
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: dummyProfile,
      stats: dummyStats,
      achievements: dummyAchievements,
      activities: dummyActivities,
      creativeSignature: dummyCreativeSignature,
      isLoading: false,

      fetchProfile: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : state.profile,
        }));
      },

      updateAvatar: (avatar) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, avatar } : state.profile,
        }));
      },

      getAchievements: () => {
        return get().achievements;
      },

      getRecentActivities: (limit = 10) => {
        return get().activities.slice(0, limit);
      },

      getLevelProgress: () => {
        return get().stats?.nextLevelProgress || 0;
      },
    }),
    {
      name: 'muse-profile-storage',
      version: 1,
    }
  )
);

// Export types for use in components
export type { UserProfile, CreativeStats, Achievement, Activity, CreativeSignature };

// Default export for convenience
export default useProfileStore;