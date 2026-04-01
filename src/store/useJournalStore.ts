import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JournalMood =
  | 'reflective'
  | 'grounded'
  | 'anxious'
  | 'grateful'
  | 'melancholic'
  | 'charged'
  | 'empty'
  | 'alive'
  | 'inspired'
  | 'nostalgic'
  | 'focused'
  | 'tender'
  | 'curious'
  | 'peaceful'
  | 'restless'
  | 'custom';

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: JournalMood;
  customMood?: string;
  tags: string[];
  linkedItemIds: string[];
  linkedRoomIds?: string[];
  prompt?: string;
  isFavorited: boolean;
  isPublic: boolean;
  wordCount: number;
  readingTime?: number;
  weather?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface JournalState {
  entries: JournalEntry[];
  dailyWordGoal: number;
  isLoading: boolean;
  error: string | null;
  
  // Settings
  setDailyWordGoal: (goal: number) => void;
  
  // CRUD operations
  addEntry: (mood?: JournalMood, isPublic?: boolean, prompt?: string) => JournalEntry;
  getEntry: (id: string) => JournalEntry | undefined;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  duplicateEntry: (id: string) => JournalEntry | null;
  
  // Entry actions
  toggleFavorite: (id: string) => void;
  toggleEntryPrivacy: (id: string) => void;
  addTagToEntry: (id: string, tag: string) => void;
  removeTagFromEntry: (id: string, tag: string) => void;
  linkItem: (entryId: string, itemId: string) => void;
  unlinkItem: (entryId: string, itemId: string) => void;
  
  // Bulk operations
  deleteAllEntries: () => void;
  archiveEntriesOlderThan: (days: number) => void;
  
  // Stats
  getTitle: (entry: JournalEntry) => string;
  getStreak: () => number;
  getTodayWordCount: () => number;
  getTotalWordCount: () => number;
  getEntriesByMood: (mood: JournalMood) => JournalEntry[];
  getEntriesByTag: (tag: string) => JournalEntry[];
  getEntriesByDateRange: (start: Date, end: Date) => JournalEntry[];
  getRecentEntries: (limit?: number) => JournalEntry[];
  getFavoriteEntries: () => JournalEntry[];
  getPublicEntries: () => JournalEntry[];
  getMoodDistribution: () => Record<JournalMood, number>;
  
  // Search
  searchEntries: (query: string) => JournalEntry[];
  
  // Helpers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Mood colors for UI
export const moodColors: Record<JournalMood, { bg: string; text: string; border: string; icon: string }> = {
  reflective: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', icon: '🧠' },
  grounded: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🌱' },
  anxious: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: '🌀' },
  grateful: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '🙏' },
  melancholic: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: '🌙' },
  charged: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: '⚡' },
  empty: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', icon: '🌫️' },
  alive: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: '✨' },
  inspired: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', icon: '💡' },
  nostalgic: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: '📷' },
  focused: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: '🎯' },
  tender: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', icon: '💗' },
  curious: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', icon: '🔍' },
  peaceful: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', icon: '🌊' },
  restless: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '🌪️' },
  custom: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: '✏️' },
};

// Helper to count words
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Helper to calculate reading time (approx 200 words per minute)
const calculateReadingTime = (wordCount: number): number => {
  return Math.max(1, Math.ceil(wordCount / 200));
};

// Helper to get title from body
const extractTitle = (body: string): string => {
  const firstLine = body.split('\n').find(l => l.trim()) || '';
  return firstLine.slice(0, 60) || 'Untitled';
};

// Generate unique ID
const generateId = (): string => {
  return `entry_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

// Initial seed date
const now = new Date();

// Mock entries
const mockEntries: JournalEntry[] = [
  {
    id: 'j1',
    title: 'On brutalist architecture and silence',
    body: `I've been contemplating the heavy intersection of brutalist architecture and ambient noise.

There's something incredibly grounding about raw concrete. It doesn't pretend to be anything else — it is just structure and shadows. When you pair that stark visual with the 4-hour ambient rain mix I collected yesterday, it completely changes the atmosphere of the room. It builds a kind of "cognitive fortress."

The Atlantic article really nailed it: our brains are so over-stimulated by vibrant, algorithmic content that these "heavy" or "dull" themes actually feel lightweight and healing to us now. The friction of the concrete is the point.

I want to sit inside that feeling longer. Not fix it. Not analyze it. Just inhabit it.`,
    mood: 'reflective',
    tags: ['architecture', 'silence', 'ambient'],
    linkedItemIds: [],
    isFavorited: false,
    isPublic: false,
    wordCount: 122,
    readingTime: 1,
    createdAt: new Date(now.getTime() - 86400000 * 3),
    updatedAt: new Date(now.getTime() - 86400000 * 3),
  },
  {
    id: 'j2',
    title: 'The problem with infinite feeds',
    body: `Today I felt it again — that restless scrolling without actually absorbing anything. I consumed maybe 200 pieces of content and retained almost none of it.

What does it mean to actually receive something? The difference between reading a long-form article slowly and scanning a feed at speed is not just quantity — it's a different mode of consciousness entirely.

One mode builds something. The other erodes it.

I wonder if that's why collecting feels so different. Each thing I save to Muse is a choice. A small declaration that this mattered, at least in this moment.`,
    mood: 'anxious',
    tags: ['attention', 'digital', 'intentionality'],
    linkedItemIds: ['103'],
    isFavorited: false,
    isPublic: false,
    wordCount: 107,
    readingTime: 1,
    createdAt: new Date(now.getTime() - 86400000 * 1),
    updatedAt: new Date(now.getTime() - 86400000 * 1),
  },
  {
    id: 'j3',
    title: 'Grateful for the ordinary',
    body: `Strange day. Nothing happened, really. Made coffee slowly. Watched the light shift across the wall for a while. Listened to something quiet.

There was no algorithm serving me anything. No notifications. Just the immediate texture of the hour.

I felt, weirdly, very full.

Maybe the cure for everything is just being somewhere specific, paying attention to nothing in particular.`,
    mood: 'grateful',
    tags: ['slowness', 'presence', 'gratitude'],
    linkedItemIds: [],
    isFavorited: true,
    isPublic: false,
    wordCount: 68,
    readingTime: 1,
    createdAt: new Date(now.getTime() - 3600000 * 2),
    updatedAt: new Date(now.getTime() - 3600000 * 2),
  },
];

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: mockEntries,
      dailyWordGoal: 300,
      isLoading: false,
      error: null,

      // ========== SETTINGS ==========
      
      setDailyWordGoal: (goal) => set({ dailyWordGoal: goal }),

      // ========== CRUD OPERATIONS ==========
      
      addEntry: (mood = 'reflective', isPublic = false, prompt) => {
        const nowDate = new Date();
        const newEntry: JournalEntry = {
          id: generateId(),
          title: '',
          body: '',
          mood,
          tags: [],
          linkedItemIds: [],
          isFavorited: false,
          isPublic,
          wordCount: 0,
          readingTime: 0,
          prompt,
          createdAt: nowDate,
          updatedAt: nowDate,
        };
        set(state => ({ entries: [newEntry, ...state.entries] }));
        return newEntry;
      },

      getEntry: (id) => {
        return get().entries.find(e => e.id === id);
      },

      updateEntry: (id, updates) => set(state => ({
        entries: state.entries.map(e => {
          if (e.id !== id) return e;
          
          const merged = { ...e, ...updates, updatedAt: new Date() };
          
          // Auto-generate title from body if title not provided
          if (!updates.title && updates.body !== undefined) {
            merged.title = extractTitle(updates.body);
          }
          
          // Update word count and reading time if body changed
          if (updates.body !== undefined) {
            merged.wordCount = countWords(updates.body);
            merged.readingTime = calculateReadingTime(merged.wordCount);
          }
          
          return merged;
        })
      })),

      deleteEntry: (id) => set(state => ({
        entries: state.entries.filter(e => e.id !== id)
      })),

      duplicateEntry: (id) => {
        const original = get().getEntry(id);
        if (!original) return null;
        
        const nowDate = new Date();
        const newEntry: JournalEntry = {
          ...original,
          id: generateId(),
          title: `${original.title} (Copy)`,
          isFavorited: false,
          createdAt: nowDate,
          updatedAt: nowDate,
        };
        
        set(state => ({ entries: [newEntry, ...state.entries] }));
        return newEntry;
      },

      // ========== ENTRY ACTIONS ==========
      
      toggleFavorite: (id) => set(state => ({
        entries: state.entries.map(e => 
          e.id === id ? { ...e, isFavorited: !e.isFavorited, updatedAt: new Date() } : e
        )
      })),
      
      toggleEntryPrivacy: (id) => set(state => ({
        entries: state.entries.map(e => 
          e.id === id ? { ...e, isPublic: !e.isPublic, updatedAt: new Date() } : e
        )
      })),

      addTagToEntry: (id, tag) => set(state => ({
        entries: state.entries.map(e =>
          e.id === id && !e.tags.includes(tag)
            ? { ...e, tags: [...e.tags, tag], updatedAt: new Date() }
            : e
        )
      })),

      removeTagFromEntry: (id, tag) => set(state => ({
        entries: state.entries.map(e =>
          e.id === id
            ? { ...e, tags: e.tags.filter(t => t !== tag), updatedAt: new Date() }
            : e
        )
      })),

      linkItem: (entryId, itemId) => set(state => ({
        entries: state.entries.map(e =>
          e.id === entryId && !e.linkedItemIds.includes(itemId)
            ? { ...e, linkedItemIds: [...e.linkedItemIds, itemId], updatedAt: new Date() }
            : e
        )
      })),

      unlinkItem: (entryId, itemId) => set(state => ({
        entries: state.entries.map(e =>
          e.id === entryId
            ? { ...e, linkedItemIds: e.linkedItemIds.filter(id => id !== itemId), updatedAt: new Date() }
            : e
        )
      })),

      // ========== BULK OPERATIONS ==========
      
      deleteAllEntries: () => set({ entries: [] }),

      archiveEntriesOlderThan: (days) => set(state => ({
        entries: state.entries.filter(e => {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          return e.createdAt >= cutoff;
        })
      })),

      // ========== STATS ==========
      
      getTitle: (entry) =>
        entry.title ||
        extractTitle(entry.body) ||
        'Untitled',

      getStreak: () => {
        const { entries } = get();
        if (!entries.length) return 0;
        
        const days = new Set(
          entries.map(e => e.createdAt.toDateString())
        );
        
        let streak = 0;
        const d = new Date();
        while (days.has(d.toDateString())) {
          streak++;
          d.setDate(d.getDate() - 1);
        }
        return streak;
      },

      getTodayWordCount: () => {
        const { entries } = get();
        const today = new Date().toDateString();
        return entries
          .filter(e => e.createdAt.toDateString() === today)
          .reduce((sum, e) => sum + e.wordCount, 0);
      },

      getTotalWordCount: () => {
        const { entries } = get();
        return entries.reduce((sum, e) => sum + e.wordCount, 0);
      },

      getEntriesByMood: (mood) => {
        return get().entries.filter(e => e.mood === mood);
      },

      getEntriesByTag: (tag) => {
        return get().entries.filter(e => e.tags.includes(tag));
      },

      getEntriesByDateRange: (start, end) => {
        return get().entries.filter(e => 
          e.createdAt >= start && e.createdAt <= end
        );
      },

      getRecentEntries: (limit = 10) => {
        return [...get().entries]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      },

      getFavoriteEntries: () => {
        return get().entries.filter(e => e.isFavorited);
      },

      getPublicEntries: () => {
        return get().entries.filter(e => e.isPublic);
      },

      getMoodDistribution: () => {
        const distribution: Record<JournalMood, number> = {} as Record<JournalMood, number>;
        get().entries.forEach(entry => {
          distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
        });
        return distribution;
      },

      // ========== SEARCH ==========
      
      searchEntries: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().entries.filter(entry =>
          entry.title.toLowerCase().includes(lowerQuery) ||
          entry.body.toLowerCase().includes(lowerQuery) ||
          entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      },

      // ========== HELPERS ==========
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({ 
        entries: mockEntries, 
        dailyWordGoal: 300, 
        isLoading: false, 
        error: null 
      }),
    }),
    {
      name: 'muse-journal-storage',
      partialize: (state) => ({
        entries: state.entries.map(entry => ({
          ...entry,
          createdAt: entry.createdAt.toISOString(),
          updatedAt: entry.updatedAt.toISOString(),
        })),
        dailyWordGoal: state.dailyWordGoal,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.entries) {
          state.entries = state.entries.map(entry => ({
            ...entry,
            createdAt: new Date(entry.createdAt as any),
            updatedAt: new Date(entry.updatedAt as any),
          }));
        }
      },
    }
  )
);

// ========== SELECTOR HOOKS ==========

export const useEntries = () => useJournalStore((state) => state.entries);
export const useEntryById = (id: string) => useJournalStore((state) => 
  state.entries.find(e => e.id === id)
);
export const useFavoriteEntries = () => useJournalStore((state) => 
  state.entries.filter(e => e.isFavorited)
);
export const useRecentEntries = (limit = 5) => useJournalStore((state) => 
  [...state.entries]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
);
export const useEntriesByMood = (mood: JournalMood) => useJournalStore((state) => 
  state.entries.filter(e => e.mood === mood)
);
export const useStreak = () => useJournalStore((state) => state.getStreak());
export const useTodayWordCount = () => useJournalStore((state) => state.getTodayWordCount());
export const useTotalWordCount = () => useJournalStore((state) => state.getTotalWordCount());
export const useDailyWordGoal = () => useJournalStore((state) => state.dailyWordGoal);
export const useWordGoalProgress = () => {
  const todayWordCount = useJournalStore((state) => state.getTodayWordCount());
  const goal = useJournalStore((state) => state.dailyWordGoal);
  return Math.min(100, Math.round((todayWordCount / goal) * 100));
};