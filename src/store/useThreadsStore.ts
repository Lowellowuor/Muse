import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThreadMood = 'contemplative' | 'curious' | 'dark' | 'hopeful' | 'urgent' | 'serene' | 'playful' | 'melancholic';

export interface Thread {
  id: string;
  title: string;
  description: string;
  thesis: string; // The core question/idea this thread explores
  mood: ThreadMood;
  coverImage: string;
  itemIds: string[];
  isPublic: boolean;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ThreadsState {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  addThread: (data: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'itemIds' | 'viewCount' | 'likeCount' | 'commentCount' | 'tags'> & { tags?: string[] }) => Thread;
  getThread: (id: string) => Thread | undefined;
  updateThread: (id: string, updates: Partial<Omit<Thread, 'id' | 'createdAt'>>) => void;
  deleteThread: (id: string) => void;
  duplicateThread: (id: string) => Thread | null;
  
  // Item management
  addItemToThread: (threadId: string, itemId: string) => void;
  removeItemFromThread: (threadId: string, itemId: string) => void;
  addItemsToThread: (threadId: string, itemIds: string[]) => void;
  clearThreadItems: (threadId: string) => void;
  
  // Privacy & visibility
  toggleThreadPrivacy: (id: string) => void;
  setThreadPublic: (id: string, isPublic: boolean) => void;
  
  // Engagement
  incrementViewCount: (id: string) => void;
  incrementLikeCount: (id: string) => void;
  decrementLikeCount: (id: string) => void;
  incrementCommentCount: (id: string) => void;
  
  // Tags
  addTagToThread: (id: string, tag: string) => void;
  removeTagFromThread: (id: string, tag: string) => void;
  
  // Sorting & filtering
  getThreadsByMood: (mood: ThreadMood) => Thread[];
  getThreadsByTag: (tag: string) => Thread[];
  getPublicThreads: () => Thread[];
  getPrivateThreads: () => Thread[];
  getRecentThreads: (limit?: number) => Thread[];
  getPopularThreads: (limit?: number) => Thread[];
  
  // Stats
  getTotalThreads: () => number;
  getTotalItemsAcrossThreads: () => number;
  
  // Helpers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Mood colors for UI
export const moodColors: Record<ThreadMood, { bg: string; text: string; border: string; glow: string }> = {
  contemplative: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/20' },
  curious: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
  dark: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', glow: 'shadow-slate-500/20' },
  hopeful: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
  urgent: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'shadow-rose-500/20' },
  serene: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', glow: 'shadow-sky-500/20' },
  playful: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
  melancholic: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
};

// Mood icons mapping
export const moodIcons: Record<ThreadMood, string> = {
  contemplative: '🧠',
  curious: '🔍',
  dark: '🌙',
  hopeful: '🌟',
  urgent: '⚡',
  serene: '🌊',
  playful: '🎈',
  melancholic: '🍂',
};

// Helper to generate unique ID
const generateId = (): string => {
  return `th_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

// Initial threads data
const initialThreads: Thread[] = [
  {
    id: 't1',
    title: 'Themes of Isolation',
    description: 'Connections between brutalist structure and ambient rain.',
    thesis: 'Can physical and sonic isolation produce the same emotional architecture — a feeling of being entirely alone, but totally safe and insulated from the noise?',
    mood: 'contemplative',
    coverImage: 'https://images.unsplash.com/photo-1509460913899-515f1df34fea?auto=format&fit=crop&w=1200&q=80',
    itemIds: ['101', '102'],
    isPublic: true,
    tags: ['isolation', 'brutalism', 'ambient', 'architecture'],
    viewCount: 1247,
    likeCount: 89,
    commentCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: 't2',
    title: 'Digital Detox',
    description: 'Thoughts on escaping the algorithmic void through tech-minimalism.',
    thesis: 'What does it mean to be intentional in a world designed to capture every idle second of attention?',
    mood: 'urgent',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    itemIds: ['103', '105'],
    isPublic: false,
    tags: ['minimalism', 'digital', 'attention', 'intentionality'],
    viewCount: 845,
    likeCount: 56,
    commentCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: 't3',
    title: 'The Aesthetic of Restraint',
    description: 'What happens when you remove everything that doesn\'t belong?',
    thesis: 'Dieter Rams and ambient composers share the same philosophy: remove everything until what remains is only what is necessary.',
    mood: 'serene',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c3a14f57?auto=format&fit=crop&w=1200&q=80',
    itemIds: ['104'],
    isPublic: true,
    tags: ['design', 'minimalism', 'philosophy', 'dieter-rams'],
    viewCount: 2341,
    likeCount: 167,
    commentCount: 23,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
];

export const useThreadsStore = create<ThreadsState>()(
  persist(
    (set, get) => ({
      threads: initialThreads,
      isLoading: false,
      error: null,

      // ========== CRUD OPERATIONS ==========
      
      addThread: (data) => {
        const now = new Date();
        const newThread: Thread = {
          ...data,
          id: generateId(),
          itemIds: [],
          tags: data.tags || [],
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          isPublic: data.isPublic ?? false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ threads: [newThread, ...state.threads] }));
        return newThread;
      },

      getThread: (id) => {
        return get().threads.find(t => t.id === id);
      },

      updateThread: (id, updates) => set((state) => ({
        threads: state.threads.map(t => 
          t.id === id 
            ? { ...t, ...updates, updatedAt: new Date() } 
            : t
        )
      })),

      deleteThread: (id) => set((state) => ({
        threads: state.threads.filter(t => t.id !== id)
      })),

      duplicateThread: (id) => {
        const thread = get().getThread(id);
        if (!thread) return null;
        
        const newThread = get().addThread({
          title: `${thread.title} (Copy)`,
          description: thread.description,
          thesis: thread.thesis,
          mood: thread.mood,
          coverImage: thread.coverImage,
          isPublic: false,
          tags: thread.tags,
        });
        return newThread;
      },

      // ========== ITEM MANAGEMENT ==========
      
      addItemToThread: (threadId, itemId) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === threadId && !t.itemIds.includes(itemId)
            ? { ...t, itemIds: [...t.itemIds, itemId], updatedAt: new Date() }
            : t
        )
      })),

      removeItemFromThread: (threadId, itemId) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === threadId
            ? { ...t, itemIds: t.itemIds.filter(i => i !== itemId), updatedAt: new Date() }
            : t
        )
      })),

      addItemsToThread: (threadId, itemIds) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === threadId
            ? { 
                ...t, 
                itemIds: [...new Set([...t.itemIds, ...itemIds])],
                updatedAt: new Date() 
              }
            : t
        )
      })),

      clearThreadItems: (threadId) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === threadId
            ? { ...t, itemIds: [], updatedAt: new Date() }
            : t
        )
      })),

      // ========== PRIVACY & VISIBILITY ==========
      
      toggleThreadPrivacy: (id) => set((state) => ({
        threads: state.threads.map(t => 
          t.id === id 
            ? { ...t, isPublic: !t.isPublic, updatedAt: new Date() } 
            : t
        )
      })),

      setThreadPublic: (id, isPublic) => set((state) => ({
        threads: state.threads.map(t => 
          t.id === id 
            ? { ...t, isPublic, updatedAt: new Date() } 
            : t
        )
      })),

      // ========== ENGAGEMENT ==========
      
      incrementViewCount: (id) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === id
            ? { ...t, viewCount: t.viewCount + 1 }
            : t
        )
      })),

      incrementLikeCount: (id) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === id
            ? { ...t, likeCount: t.likeCount + 1, updatedAt: new Date() }
            : t
        )
      })),

      decrementLikeCount: (id) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === id
            ? { ...t, likeCount: Math.max(0, t.likeCount - 1), updatedAt: new Date() }
            : t
        )
      })),

      incrementCommentCount: (id) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === id
            ? { ...t, commentCount: t.commentCount + 1, updatedAt: new Date() }
            : t
        )
      })),

      // ========== TAGS ==========
      
      addTagToThread: (id, tag) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === id && !t.tags.includes(tag)
            ? { ...t, tags: [...t.tags, tag], updatedAt: new Date() }
            : t
        )
      })),

      removeTagFromThread: (id, tag) => set((state) => ({
        threads: state.threads.map(t =>
          t.id === id
            ? { ...t, tags: t.tags.filter(tg => tg !== tag), updatedAt: new Date() }
            : t
        )
      })),

      // ========== SORTING & FILTERING ==========
      
      getThreadsByMood: (mood) => {
        return get().threads.filter(t => t.mood === mood);
      },

      getThreadsByTag: (tag) => {
        return get().threads.filter(t => t.tags.includes(tag));
      },

      getPublicThreads: () => {
        return get().threads.filter(t => t.isPublic);
      },

      getPrivateThreads: () => {
        return get().threads.filter(t => !t.isPublic);
      },

      getRecentThreads: (limit = 10) => {
        return [...get().threads]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      },

      getPopularThreads: (limit = 10) => {
        return [...get().threads]
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, limit);
      },

      // ========== STATS ==========
      
      getTotalThreads: () => {
        return get().threads.length;
      },

      getTotalItemsAcrossThreads: () => {
        return get().threads.reduce((total, thread) => total + thread.itemIds.length, 0);
      },

      // ========== HELPERS ==========
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({ threads: initialThreads, isLoading: false, error: null }),
    }),
    {
      name: 'muse-threads-storage',
      partialize: (state) => ({
        threads: state.threads.map(thread => ({
          ...thread,
          createdAt: thread.createdAt.toISOString(),
          updatedAt: thread.updatedAt.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.threads) {
          state.threads = state.threads.map(thread => ({
            ...thread,
            createdAt: new Date(thread.createdAt as any),
            updatedAt: new Date(thread.updatedAt as any),
          }));
        }
      },
    }
  )
);

// ========== SELECTOR HOOKS ==========

export const useThreads = () => useThreadsStore((state) => state.threads);
export const useThreadById = (id: string) => useThreadsStore((state) => 
  state.threads.find(t => t.id === id)
);
export const usePublicThreads = () => useThreadsStore((state) => 
  state.threads.filter(t => t.isPublic)
);
export const useThreadsByMood = (mood: ThreadMood) => useThreadsStore((state) => 
  state.threads.filter(t => t.mood === mood)
);
export const useRecentThreads = (limit = 5) => useThreadsStore((state) => 
  [...state.threads]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
);
export const usePopularThreads = (limit = 5) => useThreadsStore((state) => 
  [...state.threads]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
);
export const useThreadCount = () => useThreadsStore((state) => state.threads.length);
export const useTotalThreadItems = () => useThreadsStore((state) => 
  state.threads.reduce((total, thread) => total + thread.itemIds.length, 0)
);