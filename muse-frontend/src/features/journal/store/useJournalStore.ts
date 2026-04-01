import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JournalEntry, AIInsight, Stats, MoodType } from '../../../types';

interface JournalState {
  entries: JournalEntry[];
  insights: AIInsight[];
  isLoading: boolean;
  searchQuery: string;
  selectedMood: MoodType | null;
  
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date' | 'wordCount'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  getStats: () => Stats;
  getFilteredEntries: () => JournalEntry[];
  generateAIInsights: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedMood: (mood: MoodType | null) => void;
  clearFilters: () => void;
  getEntryCount: () => number;
  getRecentEntries: (limit: number) => JournalEntry[];
  getEntriesByMood: (mood: MoodType) => JournalEntry[];
  getEntriesByTag: (tag: string) => JournalEntry[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      insights: [],
      isLoading: false,
      searchQuery: '',
      selectedMood: null,

      addEntry: (entry) => {
        const wordCount = entry.content.trim().split(/\s+/).filter(Boolean).length;
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          wordCount,
          tags: entry.tags || [],
          mood: entry.mood || 'reflective',
          title: entry.title,
          content: entry.content,
          aiSummary: entry.aiSummary,
          sentiment: entry.sentiment,
        };
        
        set((state) => ({
          entries: [newEntry, ...state.entries]
        }));
        
        // Generate AI insights after adding entry
        setTimeout(() => get().generateAIInsights(), 100);
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter(e => e.id !== id)
        }));
        
        // Regenerate insights after deletion
        get().generateAIInsights();
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map(e => 
            e.id === id ? { ...e, ...updates } : e
          )
        }));
        
        // Regenerate insights after update
        get().generateAIInsights();
      },

      getStats: () => {
        const { entries } = get();
        
        if (entries.length === 0) {
          return {
            totalEntries: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalWords: 0,
            averageMood: 0,
            mostActiveHour: new Date().getHours(),
          };
        }
        
        const sortedEntries = [...entries].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        let currentStreak = 0;
        let longestStreak = 0;
        let streakCount = 1;
        let lastDate: Date | null = null;
        
        // Calculate streaks
        for (let i = 0; i < sortedEntries.length; i++) {
          const entryDate = new Date(sortedEntries[i].date);
          entryDate.setHours(0, 0, 0, 0);
          
          if (lastDate) {
            const diffDays = Math.floor((entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              streakCount++;
              currentStreak = Math.max(currentStreak, streakCount);
            } else if (diffDays > 1) {
              streakCount = 1;
            }
          } else {
            streakCount = 1;
            currentStreak = 1;
          }
          
          longestStreak = Math.max(longestStreak, streakCount);
          lastDate = entryDate;
        }
        
        // Calculate most active hour
        const hourCounts: Record<number, number> = {};
        entries.forEach(entry => {
          const hour = new Date(entry.date).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        let mostActiveHour = 12;
        let maxCount = 0;
        Object.entries(hourCounts).forEach(([hour, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostActiveHour = parseInt(hour);
          }
        });
        
        // Calculate average mood (1-5 scale)
        const moodValues: Record<MoodType, number> = {
          anxious: 1,
          reflective: 2,
          peaceful: 3,
          inspired: 4,
          energetic: 5,
        };
        
        const avgMood = entries.reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / entries.length;
        
        return {
          totalEntries: entries.length,
          currentStreak,
          longestStreak,
          totalWords: entries.reduce((sum, e) => sum + e.wordCount, 0),
          averageMood: parseFloat(avgMood.toFixed(1)),
          mostActiveHour,
        };
      },

      getFilteredEntries: () => {
        const { entries, searchQuery, selectedMood } = get();
        let filtered = [...entries];
        
        if (searchQuery && searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(e => 
            e.title.toLowerCase().includes(query) ||
            e.content.toLowerCase().includes(query) ||
            e.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        if (selectedMood) {
          filtered = filtered.filter(e => e.mood === selectedMood);
        }
        
        return filtered;
      },

      generateAIInsights: () => {
        const { entries } = get();
        
        if (entries.length === 0) {
          set({ insights: [] });
          return;
        }
        
        const insights: AIInsight[] = [];
        
        // Pattern insight (if enough entries)
        if (entries.length >= 3) {
          const recentEntries = entries.slice(0, 7);
          const moodCounts: Record<string, number> = {};
          recentEntries.forEach(e => {
            moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
          });
          
          let dominantMood: MoodType = 'reflective';
          let maxCount = 0;
          Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
              maxCount = count;
              dominantMood = mood as MoodType;
            }
          });
          
          const moodMessages: Record<MoodType, string> = {
            inspired: 'creativity and inspiration',
            reflective: 'deep thought and introspection',
            anxious: 'some anxiety or concern',
            peaceful: 'calm and contentment',
            energetic: 'high energy and motivation',
          };
          
          insights.push({
            id: `pattern-${Date.now()}`,
            type: 'pattern',
            content: `I notice you've been experiencing ${moodMessages[dominantMood]} in your recent entries. This pattern might reveal important emotional trends.`,
            date: new Date().toISOString(),
          });
        }
        
        // Writing consistency insight
        const totalEntries = entries.length;
        const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);
        const avgWordsPerEntry = Math.round(totalWords / totalEntries);
        
        insights.push({
          id: `consistency-${Date.now()}`,
          type: 'suggestion',
          content: `You've written ${totalEntries} entries totaling ${totalWords.toLocaleString()} words. Your average entry length is ${avgWordsPerEntry} words. Keep building this momentum!`,
          date: new Date().toISOString(),
        });
        
        // Reflection prompt based on recent content
        insights.push({
          id: `prompt-${Date.now()}`,
          type: 'summary',
          content: `Reflection prompt: What patterns are emerging in your life that you hadn't noticed before? Consider how your feelings today connect to your entries from last week.`,
          date: new Date().toISOString(),
        });
        
        // Keep only latest 3 insights
        set({ insights: insights.slice(0, 3) });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedMood: (mood) => {
        set({ selectedMood: mood });
      },

      clearFilters: () => {
        set({ searchQuery: '', selectedMood: null });
      },

      getEntryCount: () => {
        return get().entries.length;
      },

      getRecentEntries: (limit) => {
        return get().entries.slice(0, limit);
      },

      getEntriesByMood: (mood) => {
        return get().entries.filter(e => e.mood === mood);
      },

      getEntriesByTag: (tag) => {
        return get().entries.filter(e => e.tags.includes(tag));
      },
    }),
    {
      name: 'muse-journal-storage',
      version: 1,
    }
  )
);