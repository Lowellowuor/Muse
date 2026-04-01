import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentTemplate, RecentCreation, Draft, AIWriterState } from '../types';

interface CreateState {
  // State
  recentCreations: RecentCreation[];
  drafts: Draft[];
  aiWriter: AIWriterState;
  isGenerating: boolean;
  
  // Actions
  addRecentCreation: (creation: Omit<RecentCreation, 'id' | 'createdAt'>) => void;
  saveDraft: (draft: Omit<Draft, 'id' | 'savedAt'>) => void;
  deleteDraft: (id: string) => void;
  getDraftsByType: (type: string) => Draft[];
  generateAIContent: (prompt: string, tone: string, length: string) => Promise<string>;
  clearAIWriter: () => void;
  setAITone: (tone: AIWriterState['tone']) => void;
  setAILength: (length: AIWriterState['length']) => void;
}

// ============================================
// EXPORT TEMPLATES - This is what you need!
// ============================================
export const templates: ContentTemplate[] = [
  {
    id: '1',
    name: 'Daily Reflection',
    description: 'End-of-day journal entry for personal growth',
    type: 'journal',
    icon: '🌙',
    preview: 'Today I learned...',
    tags: ['reflection', 'daily', 'growth'],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Idea Storm',
    description: 'Brainstorm and capture creative ideas',
    type: 'note',
    icon: '⚡',
    preview: 'What if we could...',
    tags: ['brainstorm', 'ideas', 'creative'],
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Discussion Starter',
    description: 'Engage your community with a thoughtful question',
    type: 'thread',
    icon: '💬',
    preview: 'What are your thoughts on...',
    tags: ['discussion', 'community', 'engagement'],
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Mood Board',
    description: 'Curate visual inspiration for your project',
    type: 'room',
    icon: '🎨',
    preview: 'A collection of inspiring visuals...',
    tags: ['visual', 'inspiration', 'design'],
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Research Note',
    description: 'Document findings and insights',
    type: 'artifact',
    icon: '📚',
    preview: 'Key takeaways from...',
    tags: ['research', 'learning', 'notes'],
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Quick Capture',
    description: 'Save an idea before you forget it',
    type: 'idea',
    icon: '💡',
    preview: 'Idea: ...',
    tags: ['quick', 'capture', 'idea'],
    isFeatured: false,
  },
];

// ============================================
// EXPORT THE STORE
// ============================================
export const useCreateStore = create<CreateState>()(
  persist(
    (set, get) => ({
      recentCreations: [],
      drafts: [],
      aiWriter: {
        prompt: '',
        generatedContent: '',
        isGenerating: false,
        tone: 'casual',
        length: 'medium',
      },
      isGenerating: false,

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

      generateAIContent: async (prompt, tone, length) => {
        set({ isGenerating: true });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const lengthMap = {
          short: '2-3 sentences',
          medium: '1-2 paragraphs',
          long: '3-4 paragraphs',
        };
        
        const generatedContent = `Based on your prompt "${prompt}", here's some ${tone} content in ${lengthMap[length]}:\n\nThis is an AI-generated response that captures the essence of your request. The tone is ${tone} and the length is set to ${length}. You can edit this content to better fit your needs.`;
        
        set({ 
          isGenerating: false,
          aiWriter: { 
            prompt, 
            generatedContent, 
            isGenerating: false, 
            tone, 
            length 
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
    }),
    {
      name: 'muse-create-storage',
      version: 1,
    }
  )
);

// ============================================
// DEFAULT EXPORT FOR FLEXIBILITY
// ============================================
export default useCreateStore;