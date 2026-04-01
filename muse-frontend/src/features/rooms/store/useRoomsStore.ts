import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Room, Artifact, RoomActivity, RoomStats, RoomType } from '../../../types';
import { roomTemplates } from '../../../lib/roomTemplates';

interface RoomsState {
  rooms: Room[];
  activities: RoomActivity[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedType: RoomType | null;
  
  // Room CRUD
  fetchRooms: () => Promise<void>;
  addRoom: (name: string, description: string, type?: RoomType, template?: typeof roomTemplates[0]) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  duplicateRoom: (id: string) => void;
  archiveRoom: (id: string) => void;
  togglePinRoom: (id: string) => void;
  
  // Artifact management
  addArtifact: (roomId: string, artifact: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteArtifact: (roomId: string, artifactId: string) => void;
  updateArtifact: (roomId: string, artifactId: string, updates: Partial<Artifact>) => void;
  getRoomArtifacts: (roomId: string) => Artifact[];
  
  // Stats & insights
  getRoomStats: (roomId: string) => RoomStats;
  getRoomInsights: (roomId: string) => string[];
  getRecentActivity: (roomId?: string) => RoomActivity[];
  
  // Filters
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: RoomType | null) => void;
  clearFilters: () => void;
  
  // Helpers
  getRoomById: (id: string) => Room | undefined;
  getFilteredRooms: () => Room[];
  getArtifactTypes: () => string[];
}

export const useRoomsStore = create<RoomsState>()(
  persist(
    (set, get) => ({
      rooms: [],
      activities: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedType: null,

      fetchRooms: async () => {
        set({ loading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch rooms', loading: false });
        }
      },

      addRoom: (name, description, type = 'vault', template) => {
        const newRoom: Room = {
          id: Date.now().toString(),
          name,
          description,
          type,
          icon: template?.icon || '📁',
          tags: template?.suggestedTags || [],
          artifacts: [],
          pinned: false,
          isArchived: false,
          collaborators: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          count: 0,
        };
        
        set((state) => ({
          rooms: [newRoom, ...state.rooms],
          activities: [
            {
              id: Date.now().toString(),
              roomId: newRoom.id,
              action: 'create',
              userId: 'current-user',
              timestamp: Date.now(),
            },
            ...state.activities,
          ],
        }));
      },

      updateRoom: (id, data) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === id ? { ...room, ...data, updatedAt: Date.now() } : room
          ),
        }));
      },

      deleteRoom: (id) => {
        set((state) => ({
          rooms: state.rooms.filter(room => room.id !== id),
        }));
      },

      duplicateRoom: (id) => {
        const original = get().rooms.find(r => r.id === id);
        if (original) {
          const duplicated: Room = {
            ...original,
            id: Date.now().toString(),
            name: `${original.name} (Copy)`,
            artifacts: original.artifacts.map(a => ({ ...a, id: Date.now().toString() + Math.random() })),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            pinned: false,
          };
          set((state) => ({
            rooms: [duplicated, ...state.rooms],
          }));
        }
      },

      archiveRoom: (id) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === id ? { ...room, isArchived: !room.isArchived, updatedAt: Date.now() } : room
          ),
        }));
      },

      togglePinRoom: (id) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === id ? { ...room, pinned: !room.pinned, updatedAt: Date.now() } : room
          ),
        }));
      },

      addArtifact: (roomId, artifact) => {
        const newArtifact: Artifact = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...artifact,
        };
        
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId
              ? {
                  ...room,
                  artifacts: [newArtifact, ...room.artifacts],
                  count: room.artifacts.length + 1,
                  updatedAt: Date.now(),
                }
              : room
          ),
          activities: [
            {
              id: Date.now().toString(),
              roomId,
              action: 'add_artifact',
              artifactId: newArtifact.id,
              userId: 'current-user',
              timestamp: Date.now(),
            },
            ...state.activities,
          ],
        }));
      },

      deleteArtifact: (roomId, artifactId) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId
              ? {
                  ...room,
                  artifacts: room.artifacts.filter(a => a.id !== artifactId),
                  count: room.artifacts.length - 1,
                  updatedAt: Date.now(),
                }
              : room
          ),
        }));
      },

      updateArtifact: (roomId, artifactId, updates) => {
        set((state) => ({
          rooms: state.rooms.map(room =>
            room.id === roomId
              ? {
                  ...room,
                  artifacts: room.artifacts.map(a =>
                    a.id === artifactId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
                  ),
                  updatedAt: Date.now(),
                }
              : room
          ),
        }));
      },

      getRoomArtifacts: (roomId) => {
        const room = get().rooms.find(r => r.id === roomId);
        return room?.artifacts || [];
      },

      getRoomStats: (roomId) => {
        const room = get().rooms.find(r => r.id === roomId);
        if (!room) {
          return {
            totalArtifacts: 0,
            artifactBreakdown: { note: 0, image: 0, link: 0, audio: 0, quote: 0, document: 0 },
            mostUsedTags: [],
            lastActive: '',
            wordCount: 0,
          };
        }
        
        const breakdown: Record<Artifact['type'], number> = {
          note: 0,
          image: 0,
          link: 0,
          audio: 0,
          quote: 0,
          document: 0,
        };
        
        const tagCount: Record<string, number> = {};
        let wordCount = 0;
        
        room.artifacts.forEach(artifact => {
          breakdown[artifact.type]++;
          artifact.tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
          wordCount += artifact.content.split(/\s+/).filter(Boolean).length;
        });
        
        const mostUsedTags = Object.entries(tagCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]) => tag);
        
        return {
          totalArtifacts: room.artifacts.length,
          artifactBreakdown: breakdown,
          mostUsedTags,
          lastActive: new Date(room.updatedAt).toLocaleDateString(),
          wordCount,
        };
      },

      getRoomInsights: (roomId) => {
        const room = get().rooms.find(r => r.id === roomId);
        if (!room || room.artifacts.length === 0) {
          return ['Add some artifacts to see AI insights'];
        }
        
        const stats = get().getRoomStats(roomId);
        const insights: string[] = [];
        
        if (stats.totalArtifacts > 10) {
          insights.push(`You have ${stats.totalArtifacts} artifacts in this room. Great progress!`);
        }
        
        if (stats.mostUsedTags.length > 0) {
          insights.push(`Top themes: ${stats.mostUsedTags.slice(0, 3).join(', ')}`);
        }
        
        const recentArtifacts = room.artifacts.slice(0, 3);
        if (recentArtifacts.length > 0) {
          insights.push(`Recently added: ${recentArtifacts.map(a => a.title).join(', ')}`);
        }
        
        return insights;
      },

      getRecentActivity: (roomId) => {
        let activities = get().activities;
        if (roomId) {
          activities = activities.filter(a => a.roomId === roomId);
        }
        return activities.slice(0, 10);
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedType: (type) => set({ selectedType: type }),
      clearFilters: () => set({ searchQuery: '', selectedType: null }),

      getRoomById: (id) => {
        return get().rooms.find(r => r.id === id);
      },

      getFilteredRooms: () => {
        const { rooms, searchQuery, selectedType } = get();
        let filtered = rooms.filter(r => !r.isArchived);
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(query) ||
            r.description.toLowerCase().includes(query) ||
            r.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        if (selectedType) {
          filtered = filtered.filter(r => r.type === selectedType);
        }
        
        return [...filtered].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
      },

      getArtifactTypes: () => {
        return ['note', 'image', 'link', 'audio', 'quote', 'document'];
      },
    }),
    {
      name: 'muse-rooms-storage',
      version: 1,
    }
  )
);