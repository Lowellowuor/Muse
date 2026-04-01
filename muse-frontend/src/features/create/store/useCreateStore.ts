import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentTemplate, RecentCreation, Draft, AIWriterState } from '../types';
import { MoodType } from '../../../types';
import { ThreadType, ThreadMood } from '../../threads/types';

// Import icons for templates
import { 
  Moon, Zap, MessageCircle, Palette, Library, Lightbulb, 
  Calendar, HelpCircle, Sparkles, Brain, FolderOpen, 
  FileText, Plus, Heart, Star, Trophy, Award 
} from 'lucide-react';

interface CreateState {
  // State
  recentCreations: RecentCreation[];
  drafts: Draft[];
  aiWriter: AIWriterState;
  isGenerating: boolean;
  templates: ContentTemplate[];
  
  // Actions
  addRecentCreation: (creation: Omit<RecentCreation, 'id' | 'createdAt'>) => void;
  saveDraft: (draft: Omit<Draft, 'id' | 'savedAt'>) => void;
  deleteDraft: (id: string) => void;
  getDraftsByType: (type: string) => Draft[];
  generateAIContent: (prompt: string, tone: string, length: string) => Promise<string>;
  clearAIWriter: () => void;
  setAITone: (tone: AIWriterState['tone']) => void;
  setAILength: (length: AIWriterState['length']) => void;
  getTemplatesByType: (type: string) => ContentTemplate[];
}

// Templates data with real icon components (store icon name as string for serialization)
export const templates: ContentTemplate[] = [
  {
    id: '1',
    name: 'Daily Reflection',
    description: 'End-of-day journal entry for personal growth',
    type: 'journal',
    icon: 'Moon',
    preview: 'Today I learned...',
    tags: ['reflection', 'daily', 'growth'],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Idea Storm',
    description: 'Brainstorm and capture creative ideas',
    type: 'note',
    icon: 'Zap',
    preview: 'What if we could...',
    tags: ['brainstorm', 'ideas', 'creative'],
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Discussion Starter',
    description: 'Engage your community with a thoughtful question',
    type: 'thread',
    icon: 'MessageCircle',
    preview: 'What are your thoughts on...',
    tags: ['discussion', 'community', 'engagement'],
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Mood Board',
    description: 'Curate visual inspiration for your project',
    type: 'room',
    icon: 'Palette',
    preview: 'A collection of inspiring visuals...',
    tags: ['visual', 'inspiration', 'design'],
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Research Note',
    description: 'Document findings and insights',
    type: 'artifact',
    icon: 'Library',
    preview: 'Key takeaways from...',
    tags: ['research', 'learning', 'notes'],
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Quick Capture',
    description: 'Save an idea before you forget it',
    type: 'idea',
    icon: 'Lightbulb',
    preview: 'Idea: ...',
    tags: ['quick', 'capture', 'idea'],
    isFeatured: false,
  },
  {
    id: '7',
    name: 'Weekly Review',
    description: 'Reflect on your week and plan ahead',
    type: 'journal',
    icon: 'Calendar',
    preview: 'This week I accomplished...',
    tags: ['weekly', 'review', 'planning'],
    isFeatured: false,
  },
  {
    id: '8',
    name: 'Q&A Session',
    description: 'Ask the community for advice or opinions',
    type: 'thread',
    icon: 'HelpCircle',
    preview: 'Has anyone tried...',
    tags: ['question', 'advice', 'community'],
    isFeatured: false,
  },
];

// Icon mapping for components to use
export const templateIcons: Record<string, any> = {
  Moon,
  Zap,
  MessageCircle,
  Palette,
  Library,
  Lightbulb,
  Calendar,
  HelpCircle,
  Sparkles,
  Brain,
  FolderOpen,
  FileText,
  Plus,
  Heart,
  Star,
  Trophy,
  Award,
};

export const useCreateStore = create<CreateState>()(
  persist(
    (set, get) => ({
      // Initial State
      recentCreations: [],
      drafts: [],
      templates: templates,
      aiWriter: {
        prompt: '',
        generatedContent: '',
        isGenerating: false,
        tone: 'casual',
        length: 'medium',
      },
      isGenerating: false,

      // ========== RECENT CREATIONS ==========
      addRecentCreation: (creation) => {
        const newCreation: RecentCreation = {
          ...creation,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          recentCreations: [newCreation, ...state.recentCreations.slice(0, 9)],
        }));
      },

      // ========== DRAFTS MANAGEMENT ==========
      saveDraft: (draft) => {
        const newDraft: Draft = {
          ...draft,
          id: Date.now().toString(),
          savedAt: new Date().toISOString(),
        };
        set((state) => ({
          drafts: [newDraft, ...state.drafts],
        }));
      },

      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter(d => d.id !== id),
        }));
      },

      getDraftsByType: (type) => {
        return get().drafts.filter(d => d.type === type);
      },

      // ========== AI WRITER ==========
      generateAIContent: async (prompt, tone, length) => {
        set({ isGenerating: true });
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const toneStyles = {
          professional: 'formal and business-appropriate',
          casual: 'conversational and friendly',
          inspiring: 'motivational and uplifting',
          reflective: 'thoughtful and introspective',
        };
        
        const lengthMap = {
          short: '2-3 sentences',
          medium: '1-2 paragraphs',
          long: '3-4 paragraphs',
        };
        
        const generatedContent = `Based on your prompt "${prompt}", here's ${toneStyles[tone as keyof typeof toneStyles]} content in ${lengthMap[length]}:\n\n${prompt.charAt(0).toUpperCase() + prompt.slice(1)} is a fascinating topic that deserves deep exploration. When we consider the implications, several key insights emerge. First, this approach challenges conventional thinking. Second, it opens new possibilities for creative expression. Finally, it encourages us to rethink our assumptions.\n\nAs we continue to explore this space, remember that every great idea starts with a single thought. What matters most is taking that first step and allowing your creativity to flow naturally.`;
        
        set({ 
          isGenerating: false,
          aiWriter: { 
            prompt, 
            generatedContent, 
            isGenerating: false, 
            tone: tone as AIWriterState['tone'], 
            length: length as AIWriterState['length']
          }
        });
        
        return generatedContent;
      },

      clearAIWriter: () => {
        set({
          aiWriter: {
            prompt: '',
            generatedContent: '',
            isGenerating: false,
            tone: 'casual',
            length: 'medium',
          },
        });
      },

      setAITone: (tone) => {
        set((state) => ({
          aiWriter: { ...state.aiWriter, tone }
        }));
      },

      setAILength: (length) => {
        set((state) => ({
          aiWriter: { ...state.aiWriter, length }
        }));
      },

      // ========== TEMPLATES ==========
      getTemplatesByType: (type) => {
        return get().templates.filter(t => t.type === type);
      },
    }),
    {
      name: 'muse-create-storage',
      version: 1,
    }
  )
);

// Export types for use in components
export type { ContentTemplate, RecentCreation, Draft, AIWriterState };

// Helper function to get icon component by name
export const getTemplateIcon = (iconName: string) => {
  return templateIcons[iconName] || Sparkles;
};

// Default export for convenience
export default useCreateStore;