import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoomTheme = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate' | 'violet' | 'pink' | 'orange';

export interface Room {
  id: string;
  name: string;
  count: number;
  description: string;
  coverImage: string;
  themeColor: RoomTheme;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  pinned?: boolean;
  featured?: boolean;
  viewCount?: number;
  likeCount?: number;
}

interface RoomsState {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  
  // Room CRUD operations
  addRoom: (name: string, description: string, themeColor: RoomTheme, coverImage?: string, isPublic?: boolean, tags?: string[]) => Room;
  getRoom: (id: string) => Room | undefined;
  updateRoom: (id: string, updates: Partial<Omit<Room, 'id' | 'createdAt'>>) => void;
  updateRoomTheme: (id: string, themeColor: RoomTheme) => void;
  updateRoomCover: (id: string, coverImage: string) => void;
  updateRoomCount: (id: string, increment: number) => void;
  updateRoomViewCount: (id: string) => void;
  updateRoomLikeCount: (id: string, increment: number) => void;
  toggleRoomPrivacy: (id: string) => void;
  toggleRoomPinned: (id: string) => void;
  toggleRoomFeatured: (id: string) => void;
  deleteRoom: (id: string) => void;
  duplicateRoom: (id: string) => Room | null;
  
  // Tag management
  addTagToRoom: (id: string, tag: string) => void;
  removeTagFromRoom: (id: string, tag: string) => void;
  
  // Bulk operations
  reorderRooms: (fromIndex: number, toIndex: number) => void;
  clearAllRooms: () => void;
  archiveRoom: (id: string) => void;
  restoreRoom: (id: string) => void;
  
  // Stats & filtering
  getTotalArtifacts: () => number;
  getPublicRooms: () => Room[];
  getPrivateRooms: () => Room[];
  getPinnedRooms: () => Room[];
  getFeaturedRooms: () => Room[];
  getRoomsByTag: (tag: string) => Room[];
  getRoomsByTheme: (theme: RoomTheme) => Room[];
  getRecentRooms: (limit?: number) => Room[];
  getPopularRooms: (limit?: number) => Room[];
  
  // Search
  searchRooms: (query: string) => Room[];
  
  // Helpers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Theme colors for UI
export const themeColors: Record<RoomTheme, { bg: string; text: string; border: string; glow: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'shadow-rose-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
  slate: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', glow: 'shadow-slate-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', glow: 'shadow-violet-500/20' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', glow: 'shadow-pink-500/20' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', glow: 'shadow-orange-500/20' },
};

// Default cover images for each theme
const defaultCoverImages: Record<RoomTheme, string> = {
  indigo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  emerald: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=1200&q=80',
  amber: 'https://images.unsplash.com/photo-1545244585-61019661cd89?auto=format&fit=crop&w=1200&q=80',
  rose: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
  cyan: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  slate: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  violet: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=1200&q=80',
  pink: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
  orange: 'https://images.unsplash.com/photo-1545244585-61019661cd89?auto=format&fit=crop&w=1200&q=80',
};

// Generate a unique ID
const generateId = (): string => {
  return `room_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};

// Initial rooms data
const initialRooms: Room[] = [
  { 
    id: 'music-ambience', 
    name: 'Music & Ambience', 
    count: 24, 
    description: 'Sonic architectures for deep focus, creative flow, and emotional resonance. Curated mixes, ambient vinyl drops, and live session captures.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'indigo',
    isPublic: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
    tags: ['music', 'ambient', 'focus', 'vinyl'],
    pinned: true,
    featured: true,
    viewCount: 1247,
    likeCount: 89,
  },
  { 
    id: 'visuals-architect', 
    name: 'Visuals & Architect', 
    count: 18, 
    description: 'Brutalist structures, striking interior lighting, glassmorphic interfaces, and raw typographic studies. A highly sensitive visual collection.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'slate',
    isPublic: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-15'),
    tags: ['architecture', 'design', 'brutalism', 'typography'],
    pinned: true,
    featured: false,
    viewCount: 845,
    likeCount: 56,
  },
  { 
    id: 'ideas-articles', 
    name: 'Ideas & Articles', 
    count: 42, 
    description: 'Long-form philosophical essays, psychological breakdowns, software architecture manifestos, and deeply contemplative digital poetry.',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'emerald',
    isPublic: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-18'),
    tags: ['philosophy', 'psychology', 'software', 'essays'],
    pinned: false,
    featured: true,
    viewCount: 2341,
    likeCount: 167,
  },
  { 
    id: 'humor', 
    name: 'Humor & Irreverence', 
    count: 5, 
    description: 'Because the weight of the algorithmic void is too heavy without a moment of absolute absurdity.',
    coverImage: 'https://images.unsplash.com/photo-1545244585-61019661cd89?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'amber',
    isPublic: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-10'),
    tags: ['humor', 'memes', 'absurdity'],
    pinned: false,
    featured: false,
    viewCount: 523,
    likeCount: 34,
  },
  { 
    id: 'technology', 
    name: 'Technology', 
    count: 11, 
    description: 'Next-generation framework drops, Rust optimizations, agentic AI developments, and raw compute infrastructure.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'cyan',
    isPublic: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-22'),
    tags: ['tech', 'AI', 'rust', 'programming'],
    pinned: false,
    featured: false,
    viewCount: 987,
    likeCount: 72,
  },
  { 
    id: 'romance', 
    name: 'Romance & Tragedy', 
    count: 8, 
    description: 'The agonizing beauty of human connection captured through cinema stills, heartbreaking quotes, and deep reflection.',
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'rose',
    isPublic: false,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-05'),
    tags: ['romance', 'cinema', 'quotes', 'reflection'],
    pinned: false,
    featured: false,
    viewCount: 634,
    likeCount: 45,
  },
  { 
    id: 'sports', 
    name: 'Physical Pursuits', 
    count: 3, 
    description: 'Elite performance tracking, climbing routes, kinesthetic mastery, and the art of physical endurance.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'indigo',
    isPublic: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-12'),
    tags: ['sports', 'fitness', 'climbing', 'endurance'],
    pinned: false,
    featured: false,
    viewCount: 312,
    likeCount: 28,
  },
];

export const useRoomsStore = create<RoomsState>()(
  persist(
    (set, get) => ({
      rooms: initialRooms,
      isLoading: false,
      error: null,

      // ========== ROOM CRUD OPERATIONS ==========
      
      addRoom: (name, description, themeColor, coverImage = '', isPublic = false, tags = []) => {
        const now = new Date();
        const newRoom: Room = {
          id: generateId(),
          name,
          description,
          themeColor,
          count: 0,
          coverImage: coverImage || defaultCoverImages[themeColor],
          isPublic,
          createdAt: now,
          updatedAt: now,
          tags,
          pinned: false,
          featured: false,
          viewCount: 0,
          likeCount: 0,
        };
        set((state) => ({ rooms: [newRoom, ...state.rooms] }));
        return newRoom;
      },

      getRoom: (id) => {
        return get().rooms.find(room => room.id === id);
      },

      updateRoom: (id, updates) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, ...updates, updatedAt: new Date() } 
            : room
        )
      })),

      updateRoomTheme: (id, themeColor) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, themeColor, updatedAt: new Date() } 
            : room
        )
      })),

      updateRoomCover: (id, coverImage) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, coverImage, updatedAt: new Date() } 
            : room
        )
      })),

      updateRoomCount: (id, increment) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, count: Math.max(0, room.count + increment), updatedAt: new Date() } 
            : room
        )
      })),

      updateRoomViewCount: (id) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, viewCount: (room.viewCount || 0) + 1 }
            : room
        )
      })),

      updateRoomLikeCount: (id, increment) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, likeCount: Math.max(0, (room.likeCount || 0) + increment), updatedAt: new Date() }
            : room
        )
      })),

      toggleRoomPrivacy: (id) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, isPublic: !room.isPublic, updatedAt: new Date() } 
            : room
        )
      })),

      toggleRoomPinned: (id) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, pinned: !room.pinned, updatedAt: new Date() } 
            : room
        )
      })),

      toggleRoomFeatured: (id) => set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id 
            ? { ...room, featured: !room.featured, updatedAt: new Date() } 
            : room
        )
      })),

      deleteRoom: (id) => set((state) => ({
        rooms: state.rooms.filter(room => room.id !== id)
      })),

      duplicateRoom: (id) => {
        const roomToDuplicate = get().getRoom(id);
        if (!roomToDuplicate) return null;
        
        const newRoom = get().addRoom(
          `${roomToDuplicate.name} (Copy)`,
          roomToDuplicate.description,
          roomToDuplicate.themeColor,
          roomToDuplicate.coverImage,
          false,
          roomToDuplicate.tags
        );
        return newRoom;
      },

      // ========== TAG MANAGEMENT ==========
      
      addTagToRoom: (id, tag) => set((state) => ({
        rooms: state.rooms.map(room =>
          room.id === id && !room.tags?.includes(tag)
            ? { ...room, tags: [...(room.tags || []), tag], updatedAt: new Date() }
            : room
        )
      })),

      removeTagFromRoom: (id, tag) => set((state) => ({
        rooms: state.rooms.map(room =>
          room.id === id
            ? { ...room, tags: (room.tags || []).filter(t => t !== tag), updatedAt: new Date() }
            : room
        )
      })),

      // ========== BULK OPERATIONS ==========
      
      reorderRooms: (fromIndex, toIndex) => set((state) => {
        const newRooms = [...state.rooms];
        const [movedRoom] = newRooms.splice(fromIndex, 1);
        newRooms.splice(toIndex, 0, movedRoom);
        return { rooms: newRooms };
      }),

      clearAllRooms: () => set({ rooms: [] }),

      archiveRoom: (id) => set((state) => ({
        rooms: state.rooms.map(room =>
          room.id === id
            ? { ...room, isPublic: false, pinned: false, updatedAt: new Date() }
            : room
        )
      })),

      restoreRoom: (id) => set((state) => ({
        rooms: state.rooms.map(room =>
          room.id === id
            ? { ...room, isPublic: true, updatedAt: new Date() }
            : room
        )
      })),

      // ========== STATS & FILTERING ==========
      
      getTotalArtifacts: () => {
        return get().rooms.reduce((total, room) => total + room.count, 0);
      },

      getPublicRooms: () => {
        return get().rooms.filter(room => room.isPublic);
      },

      getPrivateRooms: () => {
        return get().rooms.filter(room => !room.isPublic);
      },

      getPinnedRooms: () => {
        return get().rooms.filter(room => room.pinned);
      },

      getFeaturedRooms: () => {
        return get().rooms.filter(room => room.featured);
      },

      getRoomsByTag: (tag) => {
        return get().rooms.filter(room => room.tags?.includes(tag));
      },

      getRoomsByTheme: (theme) => {
        return get().rooms.filter(room => room.themeColor === theme);
      },

      getRecentRooms: (limit = 10) => {
        return [...get().rooms]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      },

      getPopularRooms: (limit = 10) => {
        return [...get().rooms]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, limit);
      },

      // ========== SEARCH ==========
      
      searchRooms: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().rooms.filter(room =>
          room.name.toLowerCase().includes(lowerQuery) ||
          room.description.toLowerCase().includes(lowerQuery) ||
          room.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      },

      // ========== HELPERS ==========
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({ rooms: initialRooms, isLoading: false, error: null }),
    }),
    {
      name: 'muse-rooms-storage',
      partialize: (state) => ({
        rooms: state.rooms.map(room => ({
          ...room,
          createdAt: room.createdAt?.toISOString(),
          updatedAt: room.updatedAt?.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.rooms) {
          state.rooms = state.rooms.map(room => ({
            ...room,
            createdAt: new Date(room.createdAt as any),
            updatedAt: new Date(room.updatedAt as any),
          }));
        }
      },
    }
  )
);

// ========== SELECTOR HOOKS ==========

export const useRooms = () => useRoomsStore((state) => state.rooms);
export const usePinnedRooms = () => useRoomsStore((state) => state.rooms.filter(room => room.pinned));
export const useFeaturedRooms = () => useRoomsStore((state) => state.rooms.filter(room => room.featured));
export const usePublicRooms = () => useRoomsStore((state) => state.rooms.filter(room => room.isPublic));
export const useRoomCount = () => useRoomsStore((state) => state.rooms.length);
export const useTotalArtifacts = () => useRoomsStore((state) => 
  state.rooms.reduce((total, room) => total + room.count, 0)
);
export const useRoomById = (id: string) => useRoomsStore((state) => 
  state.rooms.find(room => room.id === id)
);
export const useRoomsByTheme = (theme: RoomTheme) => useRoomsStore((state) => 
  state.rooms.filter(room => room.themeColor === theme)
);
export const useRoomsByTag = (tag: string) => useRoomsStore((state) => 
  state.rooms.filter(room => room.tags?.includes(tag))
);
export const useRecentRooms = (limit = 5) => useRoomsStore((state) => 
  [...state.rooms]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
);
export const usePopularRooms = (limit = 5) => useRoomsStore((state) => 
  [...state.rooms]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit)
);