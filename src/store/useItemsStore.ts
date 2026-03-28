import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ItemType = 'article' | 'video' | 'music' | 'image' | 'podcast' | 'quote' | 'note' | 'link' | 'book';
export type ItemStatus = 'saved' | 'read' | 'archived' | 'favorited';

export interface Item {
  id: string;
  roomId: string;
  title: string;
  sourceUrl: string;
  note?: string;
  type: ItemType;
  status: ItemStatus;
  tags: string[];
  imageUrl?: string;
  author?: string;
  publishedDate?: Date;
  readTime?: number; // in minutes
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount'>) => Item;
  getItem: (id: string) => Item | undefined;
  getItemsByRoom: (roomId: string) => Item[];
  updateItem: (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt'>>) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => Item | null;
  
  // Item actions
  toggleItemPublic: (id: string) => void;
  toggleItemFavorite: (id: string) => void;
  archiveItem: (id: string) => void;
  restoreItem: (id: string) => void;
  markAsRead: (id: string) => void;
  incrementViewCount: (id: string) => void;
  incrementLikeCount: (id: string) => void;
  decrementLikeCount: (id: string) => void;
  
  // Tag management
  addTagToItem: (id: string, tag: string) => void;
  removeTagFromItem: (id: string, tag: string) => void;
  
  // Bulk operations
  addItemsToRoom: (roomId: string, itemIds: string[]) => void;
  removeItemsFromRoom: (roomId: string, itemIds: string[]) => void;
  deleteItemsByRoom: (roomId: string) => void;
  archiveItemsByRoom: (roomId: string) => void;
  
  // Stats & filtering
  getItemsByType: (type: ItemType) => Item[];
  getItemsByStatus: (status: ItemStatus) => Item[];
  getItemsByTag: (tag: string) => Item[];
  getRecentItems: (limit?: number) => Item[];
  getFavoriteItems: () => Item[];
  getArchivedItems: () => Item[];
  getItemsByDateRange: (start: Date, end: Date) => Item[];
  getTotalItemsCount: () => number;
  getTotalItemsByRoom: (roomId: string) => number;
  
  // Search
  searchItems: (query: string) => Item[];
  
  // Helpers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Item type colors for UI
export const itemTypeColors: Record<ItemType, { bg: string; text: string; border: string; icon: string }> = {
  article: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: '📄' },
  video: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: '🎬' },
  music: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🎵' },
  image: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '🖼️' },
  podcast: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: '🎙️' },
  quote: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: '💬' },
  note: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: '📝' },
  link: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: '🔗' },
  book: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', icon: '📚' },
};

// Item status colors
export const itemStatusColors: Record<ItemStatus, { bg: string; text: string; border: string }> = {
  saved: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  read: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
  favorited: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
};

// Helper to generate unique ID
const generateId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

// Helper to extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
};

// Mock items with new structure
const mockItems: Item[] = [
  {
    id: '101',
    roomId: 'visuals-architect',
    title: 'Brutalist Architecture Concept - Tokyo',
    sourceUrl: 'https://pinterest.com/pin/brutalist-tokyo',
    note: 'The stark concrete feels isolating but serene.',
    type: 'image',
    status: 'saved',
    tags: ['architecture', 'brutalism', 'tokyo'],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    author: 'Pinterest',
    isPublic: false,
    viewCount: 124,
    likeCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '102',
    roomId: 'music-ambience',
    title: 'Ambient Rain Mix - 4 Hours',
    sourceUrl: 'https://youtube.com/watch?v=ambient-rain',
    note: 'Listened while viewing the concrete designs.',
    type: 'music',
    status: 'favorited',
    tags: ['ambient', 'rain', 'focus'],
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    author: 'YouTube',
    readTime: 240,
    isPublic: true,
    viewCount: 2341,
    likeCount: 167,
    createdAt: new Date(Date.now() - 86400000 * 1),
    updatedAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: '103',
    roomId: 'ideas-articles',
    title: 'The Age of Algorithmic Anxiety',
    sourceUrl: 'https://theatlantic.com/tech/anxiety',
    note: 'Exactly why I started using Muse. Grounding.',
    type: 'article',
    status: 'read',
    tags: ['anxiety', 'algorithm', 'digital-wellness'],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80',
    author: 'The Atlantic',
    readTime: 12,
    isPublic: false,
    viewCount: 845,
    likeCount: 56,
    createdAt: new Date(Date.now() - 4000000),
    updatedAt: new Date(Date.now() - 4000000),
  },
  {
    id: '104',
    roomId: 'visuals-architect',
    title: 'Dieter Rams - 10 Principles',
    sourceUrl: 'https://vitsoe.com/10-principles',
    note: 'Less, but better. Always.',
    type: 'article',
    status: 'saved',
    tags: ['design', 'minimalism', 'dieter-rams'],
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c3a14f57?auto=format&fit=crop&w=600&q=80',
    author: 'Vitsoe',
    readTime: 8,
    isPublic: false,
    viewCount: 523,
    likeCount: 34,
    createdAt: new Date(Date.now() - 20000000),
    updatedAt: new Date(Date.now() - 20000000),
  },
  {
    id: '105',
    roomId: 'technology',
    title: 'AI and The Future of Solitude',
    sourceUrl: 'https://wired.com/ai-solitude',
    note: 'Interesting juxtaposition against the community pods.',
    type: 'article',
    status: 'saved',
    tags: ['AI', 'solitude', 'future'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    author: 'Wired',
    readTime: 10,
    isPublic: true,
    viewCount: 987,
    likeCount: 72,
    createdAt: new Date(Date.now() - 1000000),
    updatedAt: new Date(Date.now() - 1000000),
  },
];

export const useItemsStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      items: mockItems,
      isLoading: false,
      error: null,

      // ========== CRUD OPERATIONS ==========
      
      addItem: (item) => {
        const now = new Date();
        const newItem: Item = { 
          ...item, 
          id: generateId(),
          viewCount: 0,
          likeCount: 0,
          status: 'saved',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ items: [newItem, ...state.items] }));
        return newItem;
      },

      getItem: (id) => {
        return get().items.find(item => item.id === id);
      },

      getItemsByRoom: (roomId) => {
        return get().items.filter(item => item.roomId === roomId);
      },

      updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, ...updates, updatedAt: new Date() } 
            : item
        )
      })),

      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      duplicateItem: (id) => {
        const original = get().getItem(id);
        if (!original) return null;
        
        const now = new Date();
        const newItem: Item = {
          ...original,
          id: generateId(),
          title: `${original.title} (Copy)`,
          status: 'saved',
          viewCount: 0,
          likeCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({ items: [newItem, ...state.items] }));
        return newItem;
      },

      // ========== ITEM ACTIONS ==========
      
      toggleItemPublic: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, isPublic: !item.isPublic, updatedAt: new Date() } 
            : item
        )
      })),

      toggleItemFavorite: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { 
                ...item, 
                status: item.status === 'favorited' ? 'saved' : 'favorited',
                updatedAt: new Date() 
              } 
            : item
        )
      })),

      archiveItem: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, status: 'archived', updatedAt: new Date() } 
            : item
        )
      })),

      restoreItem: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, status: 'saved', updatedAt: new Date() } 
            : item
        )
      })),

      markAsRead: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id && item.status !== 'archived'
            ? { ...item, status: 'read', updatedAt: new Date() } 
            : item
        )
      })),

      incrementViewCount: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, viewCount: item.viewCount + 1 } 
            : item
        )
      })),

      incrementLikeCount: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, likeCount: item.likeCount + 1, updatedAt: new Date() } 
            : item
        )
      })),

      decrementLikeCount: (id) => set((state) => ({
        items: state.items.map(item => 
          item.id === id 
            ? { ...item, likeCount: Math.max(0, item.likeCount - 1), updatedAt: new Date() } 
            : item
        )
      })),

      // ========== TAG MANAGEMENT ==========
      
      addTagToItem: (id, tag) => set((state) => ({
        items: state.items.map(item =>
          item.id === id && !item.tags.includes(tag)
            ? { ...item, tags: [...item.tags, tag], updatedAt: new Date() }
            : item
        )
      })),

      removeTagFromItem: (id, tag) => set((state) => ({
        items: state.items.map(item =>
          item.id === id
            ? { ...item, tags: item.tags.filter(t => t !== tag), updatedAt: new Date() }
            : item
        )
      })),

      // ========== BULK OPERATIONS ==========
      
      addItemsToRoom: (roomId, itemIds) => set((state) => ({
        items: state.items.map(item =>
          itemIds.includes(item.id)
            ? { ...item, roomId, updatedAt: new Date() }
            : item
        )
      })),

      removeItemsFromRoom: (roomId, itemIds) => set((state) => ({
        items: state.items.map(item =>
          item.roomId === roomId && itemIds.includes(item.id)
            ? { ...item, roomId: 'unassigned', updatedAt: new Date() }
            : item
        )
      })),

      deleteItemsByRoom: (roomId) => set((state) => ({
        items: state.items.filter(item => item.roomId !== roomId)
      })),

      archiveItemsByRoom: (roomId) => set((state) => ({
        items: state.items.map(item =>
          item.roomId === roomId
            ? { ...item, status: 'archived', updatedAt: new Date() }
            : item
        )
      })),

      // ========== STATS & FILTERING ==========
      
      getItemsByType: (type) => {
        return get().items.filter(item => item.type === type);
      },

      getItemsByStatus: (status) => {
        return get().items.filter(item => item.status === status);
      },

      getItemsByTag: (tag) => {
        return get().items.filter(item => item.tags.includes(tag));
      },

      getRecentItems: (limit = 10) => {
        return [...get().items]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      },

      getFavoriteItems: () => {
        return get().items.filter(item => item.status === 'favorited');
      },

      getArchivedItems: () => {
        return get().items.filter(item => item.status === 'archived');
      },

      getItemsByDateRange: (start, end) => {
        return get().items.filter(item => 
          item.createdAt >= start && item.createdAt <= end
        );
      },

      getTotalItemsCount: () => {
        return get().items.length;
      },

      getTotalItemsByRoom: (roomId) => {
        return get().items.filter(item => item.roomId === roomId).length;
      },

      // ========== SEARCH ==========
      
      searchItems: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().items.filter(item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          (item.note && item.note.toLowerCase().includes(lowerQuery)) ||
          item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          (item.author && item.author.toLowerCase().includes(lowerQuery))
        );
      },

      // ========== HELPERS ==========
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({ items: mockItems, isLoading: false, error: null }),
    }),
    {
      name: 'muse-items-storage',
      partialize: (state) => ({
        items: state.items.map(item => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          publishedDate: item.publishedDate?.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          state.items = state.items.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt as any),
            updatedAt: new Date(item.updatedAt as any),
            publishedDate: item.publishedDate ? new Date(item.publishedDate as any) : undefined,
          }));
        }
      },
    }
  )
);

// ========== SELECTOR HOOKS ==========

export const useItems = () => useItemsStore((state) => state.items);
export const useItemById = (id: string) => useItemsStore((state) => 
  state.items.find(item => item.id === id)
);
export const useItemsByRoom = (roomId: string) => useItemsStore((state) => 
  state.items.filter(item => item.roomId === roomId)
);
export const useFavoriteItems = () => useItemsStore((state) => 
  state.items.filter(item => item.status === 'favorited')
);
export const useRecentItems = (limit = 5) => useItemsStore((state) => 
  [...state.items]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
);
export const useItemsByType = (type: ItemType) => useItemsStore((state) => 
  state.items.filter(item => item.type === type)
);
export const useTotalItemsCount = () => useItemsStore((state) => state.items.length);
export const useTotalItemsByRoom = (roomId: string) => useItemsStore((state) => 
  state.items.filter(item => item.roomId === roomId).length
);