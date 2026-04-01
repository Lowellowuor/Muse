import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  sharedThemes: string[];
  status: 'Online' | 'Reflecting' | 'Deep Focus' | 'Offline' | 'Away';
  lastActive?: Date;
  mutualConnections?: number;
  sharedRooms?: string[];
  insights?: string[];
}

export type DialogueTone = 'Reflect' | 'Build' | 'Ask' | 'Challenge' | 'Synthesize';

export interface CircleContribution {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  tone: DialogueTone;
  timestamp: Date;
  likes: number;
  replies?: CircleContribution[];
  isEdited?: boolean;
}

export interface ActiveCircle {
  id: string;
  name: string;
  theme: string;
  description: string;
  coverImage?: string;
  members: string[];
  memberCount: number;
  recentActivity: string;
  contributions: CircleContribution[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  pinned?: boolean;
}

export interface CommunityRoom {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  isJoined?: boolean;
  category: 'Architecture' | 'Sound' | 'Identity' | 'Technology' | 'Philosophy' | 'Art' | 'Writing';
  tags: string[];
  createdAt: Date;
}

export interface Insight {
  id: string;
  text: string;
  type: 'connection' | 'theme' | 'activity' | 'suggestion';
  timestamp: Date;
  isRead: boolean;
}

interface ConnectionsState {
  collaborators: Collaborator[];
  circles: ActiveCircle[];
  communityRooms: CommunityRoom[];
  insights: Insight[];
  activeThemes: string[];
  isLoading: boolean;
  error: string | null;
  
  // Circle operations
  joinCircle: (circleId: string) => void;
  leaveCircle: (circleId: string) => void;
  createCircle: (data: Omit<ActiveCircle, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'memberCount' | 'contributions' | 'recentActivity'>) => ActiveCircle;
  getCircle: (id: string) => ActiveCircle | undefined;
  updateCircle: (id: string, updates: Partial<Omit<ActiveCircle, 'id' | 'createdAt'>>) => void;
  deleteCircle: (id: string) => void;
  
  // Contributions
  addContribution: (circleId: string, text: string, tone: DialogueTone) => void;
  addReply: (circleId: string, contributionId: string, text: string, tone: DialogueTone) => void;
  likeContribution: (circleId: string, contributionId: string) => void;
  deleteContribution: (circleId: string, contributionId: string) => void;
  
  // Community rooms
  joinCommunityRoom: (roomId: string) => void;
  leaveCommunityRoom: (roomId: string) => void;
  
  // Insights
  markInsightAsRead: (insightId: string) => void;
  addInsight: (text: string, type: Insight['type']) => void;
  
  // Stats & filtering
  getCirclesByTheme: (theme: string) => ActiveCircle[];
  getCirclesByTag: (tag: string) => ActiveCircle[];
  getCollaboratorsByTheme: (theme: string) => Collaborator[];
  getRecentContributions: (limit?: number) => CircleContribution[];
  getTrendingThemes: (limit?: number) => { theme: string; count: number }[];
  
  // Search
  searchCircles: (query: string) => ActiveCircle[];
  searchCollaborators: (query: string) => Collaborator[];
  
  // Helpers
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Tone colors for UI
export const toneColors: Record<DialogueTone, { bg: string; text: string; border: string; icon: string }> = {
  Reflect: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', icon: '💭' },
  Build: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🏗️' },
  Ask: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '❓' },
  Challenge: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: '⚡' },
  Synthesize: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: '🔗' },
};

// Helper to generate unique ID
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

// Mock data
const now = new Date();

const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: 'c1',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'Architectural Philosopher',
    bio: 'Exploring the intersection of brutalism and digital ethics.',
    sharedThemes: ['Brutalism', 'Silence', 'Scale'],
    status: 'Deep Focus',
    lastActive: new Date(now.getTime() - 3600000),
    mutualConnections: 3,
    sharedRooms: ['Music & Ambience', 'Visuals & Architect'],
  },
  {
    id: 'c2',
    name: 'Elena Rossi',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    role: 'Ambient Soundscaper',
    bio: 'Mapping emotional resonance in urban environments.',
    sharedThemes: ['Reverb', 'Memory', 'Urban Voids'],
    status: 'Online',
    lastActive: new Date(now.getTime() - 300000),
    mutualConnections: 5,
    sharedRooms: ['Music & Ambience', 'Ideas & Articles'],
  },
  {
    id: 'c3',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'Interface Poet',
    bio: 'Crafting semantic layers for human-machine intimacy.',
    sharedThemes: ['Typography', 'Intent', 'Identity'],
    status: 'Reflecting',
    lastActive: new Date(now.getTime() - 7200000),
    mutualConnections: 2,
    sharedRooms: ['Ideas & Articles', 'Technology'],
  },
];

const MOCK_CIRCLES: ActiveCircle[] = [
  {
    id: 'circle-1',
    name: 'The Silence Engine',
    theme: 'Silence',
    description: 'A study on digital voids and the cognitive value of non-activity.',
    coverImage: 'https://images.unsplash.com/photo-1509460913899-515f1df34fea?auto=format&fit=crop&w=800&q=80',
    members: ['David Chen', 'Elena Rossi', 'You'],
    memberCount: 12,
    recentActivity: '5m ago',
    tags: ['silence', 'cognition', 'digital-wellness'],
    isPublic: true,
    createdAt: new Date(now.getTime() - 86400000 * 7),
    updatedAt: new Date(now.getTime() - 3600000),
    createdBy: 'c1',
    pinned: true,
    contributions: [
      {
        id: 'con-1',
        authorId: 'c1',
        authorName: 'David Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'I think we overestimate the need for constant "flow". Sometimes the most productive state is the void between tasks.',
        tone: 'Reflect',
        timestamp: new Date(now.getTime() - 7200000),
        likes: 8,
      },
      {
        id: 'con-2',
        authorId: 'c2',
        authorName: 'Elena Rossi',
        authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
        text: 'Exactly. In sound design, the "negative space" is what gives the transients their power. Silence isn\'t empty; it\'s structural.',
        tone: 'Build',
        timestamp: new Date(now.getTime() - 3600000),
        likes: 12,
      },
    ],
  },
  {
    id: 'circle-2',
    name: 'Digital Identity Matrix',
    theme: 'Identity',
    description: 'Analyzing how curated digital spaces reshape the internal sense of self.',
    coverImage: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=800&q=80',
    members: ['Marcus Thorne', 'You'],
    memberCount: 8,
    recentActivity: '1h ago',
    tags: ['identity', 'curation', 'self'],
    isPublic: true,
    createdAt: new Date(now.getTime() - 86400000 * 14),
    updatedAt: new Date(now.getTime() - 3600000 * 5),
    createdBy: 'c3',
    pinned: false,
    contributions: [
      {
        id: 'con-3',
        authorId: 'c3',
        authorName: 'Marcus Thorne',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        text: 'If our rooms are mirrors, then our threads are the paths we take through the glass. Does a multi-faceted UI encourage a multi-faceted self?',
        tone: 'Ask',
        timestamp: new Date(now.getTime() - 18000000),
        likes: 15,
      },
    ],
  },
];

const MOCK_COMMUNITY_ROOMS: CommunityRoom[] = [
  {
    id: 'cr1',
    name: 'Archive of Voids',
    description: 'A shared collection of minimalist architecture and spatial gaps.',
    coverImage: 'https://images.unsplash.com/photo-1509460913899-515f1df34fea?auto=format&fit=crop&w=800&q=80',
    memberCount: 45,
    isJoined: false,
    category: 'Architecture',
    tags: ['architecture', 'minimalism', 'voids'],
    createdAt: new Date(now.getTime() - 86400000 * 30),
  },
  {
    id: 'cr2',
    name: 'Sonic Synthesis',
    description: 'Experimental audio patterns and generative theory.',
    coverImage: 'https://images.unsplash.com/photo-1514467958098-de5b34812076?auto=format&fit=crop&w=800&q=80',
    memberCount: 89,
    isJoined: true,
    category: 'Sound',
    tags: ['audio', 'generative', 'experimental'],
    createdAt: new Date(now.getTime() - 86400000 * 45),
  },
];

const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'insight-1',
    text: 'Connection density has increased by 14% around the "Silence" theme this week.',
    type: 'connection',
    timestamp: new Date(now.getTime() - 86400000),
    isRead: false,
  },
  {
    id: 'insight-2',
    text: 'You and David Chen are achieving 92% thematic resonance on "Brutalism".',
    type: 'theme',
    timestamp: new Date(now.getTime() - 172800000),
    isRead: true,
  },
  {
    id: 'insight-3',
    text: '3 new contributors joined "Digital Identity Matrix" after your last synthesis.',
    type: 'activity',
    timestamp: new Date(now.getTime() - 259200000),
    isRead: false,
  },
];

export const useConnectionsStore = create<ConnectionsState>()(
  persist(
    (set, get) => ({
      collaborators: MOCK_COLLABORATORS,
      circles: MOCK_CIRCLES,
      communityRooms: MOCK_COMMUNITY_ROOMS,
      insights: MOCK_INSIGHTS,
      activeThemes: ['Silence', 'Brutalism', 'Identity', 'Urban Voids', 'Scale', 'Memory', 'Reverb', 'Typography'],
      isLoading: false,
      error: null,

      // ========== CIRCLE OPERATIONS ==========
      
      joinCircle: (circleId) => {
        set((state) => ({
          circles: state.circles.map(c => 
            c.id === circleId && !c.members.includes('You')
              ? { ...c, members: [...c.members, 'You'], memberCount: c.memberCount + 1, updatedAt: new Date() }
              : c
          )
        }));
      },

      leaveCircle: (circleId) => {
        set((state) => ({
          circles: state.circles.map(c => 
            c.id === circleId && c.members.includes('You')
              ? { ...c, members: c.members.filter(m => m !== 'You'), memberCount: c.memberCount - 1, updatedAt: new Date() }
              : c
          )
        }));
      },

      createCircle: (data) => {
        const nowDate = new Date();
        const newCircle: ActiveCircle = {
          ...data,
          id: generateId(),
          members: [data.createdBy === 'me' ? 'You' : data.createdBy],
          memberCount: 1,
          contributions: [],
          recentActivity: 'Just created',
          createdAt: nowDate,
          updatedAt: nowDate,
        };
        set((state) => ({ circles: [newCircle, ...state.circles] }));
        return newCircle;
      },

      getCircle: (id) => {
        return get().circles.find(c => c.id === id);
      },

      updateCircle: (id, updates) => set((state) => ({
        circles: state.circles.map(c => 
          c.id === id 
            ? { ...c, ...updates, updatedAt: new Date() } 
            : c
        )
      })),

      deleteCircle: (id) => set((state) => ({
        circles: state.circles.filter(c => c.id !== id)
      })),

      // ========== CONTRIBUTIONS ==========
      
      addContribution: (circleId, text, tone) => {
        const newContribution: CircleContribution = {
          id: generateId(),
          authorId: 'me',
          authorName: 'You',
          text,
          tone,
          timestamp: new Date(),
          likes: 0,
        };
        set((state) => ({
          circles: state.circles.map(c => 
            c.id === circleId 
              ? { ...c, contributions: [...c.contributions, newContribution], recentActivity: 'Just now', updatedAt: new Date() }
              : c
          )
        }));
      },

      addReply: (circleId, contributionId, text, tone) => {
        const newReply: CircleContribution = {
          id: generateId(),
          authorId: 'me',
          authorName: 'You',
          text,
          tone,
          timestamp: new Date(),
          likes: 0,
        };
        set((state) => ({
          circles: state.circles.map(c => 
            c.id === circleId 
              ? {
                  ...c,
                  contributions: c.contributions.map(cont =>
                    cont.id === contributionId
                      ? { ...cont, replies: [...(cont.replies || []), newReply] }
                      : cont
                  ),
                  updatedAt: new Date()
                }
              : c
          )
        }));
      },

      likeContribution: (circleId, contributionId) => set((state) => ({
        circles: state.circles.map(c => 
          c.id === circleId 
            ? {
                ...c,
                contributions: c.contributions.map(cont =>
                  cont.id === contributionId
                    ? { ...cont, likes: cont.likes + 1 }
                    : cont
                ),
                updatedAt: new Date()
              }
            : c
        )
      })),

      deleteContribution: (circleId, contributionId) => set((state) => ({
        circles: state.circles.map(c => 
          c.id === circleId 
            ? {
                ...c,
                contributions: c.contributions.filter(cont => cont.id !== contributionId),
                updatedAt: new Date()
              }
            : c
        )
      })),

      // ========== COMMUNITY ROOMS ==========
      
      joinCommunityRoom: (roomId) => set((state) => ({
        communityRooms: state.communityRooms.map(room =>
          room.id === roomId && !room.isJoined
            ? { ...room, isJoined: true, memberCount: room.memberCount + 1 }
            : room
        )
      })),

      leaveCommunityRoom: (roomId) => set((state) => ({
        communityRooms: state.communityRooms.map(room =>
          room.id === roomId && room.isJoined
            ? { ...room, isJoined: false, memberCount: room.memberCount - 1 }
            : room
        )
      })),

      // ========== INSIGHTS ==========
      
      markInsightAsRead: (insightId) => set((state) => ({
        insights: state.insights.map(insight =>
          insight.id === insightId ? { ...insight, isRead: true } : insight
        )
      })),

      addInsight: (text, type) => {
        const newInsight: Insight = {
          id: generateId(),
          text,
          type,
          timestamp: new Date(),
          isRead: false,
        };
        set((state) => ({ insights: [newInsight, ...state.insights] }));
      },

      // ========== STATS & FILTERING ==========
      
      getCirclesByTheme: (theme) => {
        return get().circles.filter(c => c.theme.toLowerCase().includes(theme.toLowerCase()));
      },

      getCirclesByTag: (tag) => {
        return get().circles.filter(c => c.tags.includes(tag.toLowerCase()));
      },

      getCollaboratorsByTheme: (theme) => {
        return get().collaborators.filter(c => 
          c.sharedThemes.some(t => t.toLowerCase().includes(theme.toLowerCase()))
        );
      },

      getRecentContributions: (limit = 10) => {
        const allContributions = get().circles.flatMap(c => 
          c.contributions.map(cont => ({ ...cont, circleName: c.name, circleId: c.id }))
        );
        return allContributions
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit);
      },

      getTrendingThemes: (limit = 5) => {
        const themeCount: Record<string, number> = {};
        get().circles.forEach(circle => {
          themeCount[circle.theme] = (themeCount[circle.theme] || 0) + circle.memberCount;
        });
        return Object.entries(themeCount)
          .map(([theme, count]) => ({ theme, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
      },

      // ========== SEARCH ==========
      
      searchCircles: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().circles.filter(circle =>
          circle.name.toLowerCase().includes(lowerQuery) ||
          circle.description.toLowerCase().includes(lowerQuery) ||
          circle.theme.toLowerCase().includes(lowerQuery) ||
          circle.tags.some(tag => tag.includes(lowerQuery))
        );
      },

      searchCollaborators: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().collaborators.filter(collab =>
          collab.name.toLowerCase().includes(lowerQuery) ||
          collab.role.toLowerCase().includes(lowerQuery) ||
          collab.bio.toLowerCase().includes(lowerQuery) ||
          collab.sharedThemes.some(theme => theme.toLowerCase().includes(lowerQuery))
        );
      },

      // ========== HELPERS ==========
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({
        collaborators: MOCK_COLLABORATORS,
        circles: MOCK_CIRCLES,
        communityRooms: MOCK_COMMUNITY_ROOMS,
        insights: MOCK_INSIGHTS,
        activeThemes: ['Silence', 'Brutalism', 'Identity', 'Urban Voids', 'Scale', 'Memory', 'Reverb', 'Typography'],
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'muse-connections-storage',
      partialize: (state) => ({
        circles: state.circles.map(circle => ({
          ...circle,
          createdAt: circle.createdAt.toISOString(),
          updatedAt: circle.updatedAt.toISOString(),
          contributions: circle.contributions.map(cont => ({
            ...cont,
            timestamp: cont.timestamp.toISOString(),
          })),
        })),
        insights: state.insights.map(insight => ({
          ...insight,
          timestamp: insight.timestamp.toISOString(),
        })),
        communityRooms: state.communityRooms.map(room => ({
          ...room,
          createdAt: room.createdAt.toISOString(),
        })),
        collaborators: state.collaborators.map(collab => ({
          ...collab,
          lastActive: collab.lastActive?.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.circles) {
          state.circles = state.circles.map(circle => ({
            ...circle,
            createdAt: new Date(circle.createdAt as any),
            updatedAt: new Date(circle.updatedAt as any),
            contributions: circle.contributions.map(cont => ({
              ...cont,
              timestamp: new Date(cont.timestamp as any),
            })),
          }));
        }
        if (state?.insights) {
          state.insights = state.insights.map(insight => ({
            ...insight,
            timestamp: new Date(insight.timestamp as any),
          }));
        }
        if (state?.communityRooms) {
          state.communityRooms = state.communityRooms.map(room => ({
            ...room,
            createdAt: new Date(room.createdAt as any),
          }));
        }
        if (state?.collaborators) {
          state.collaborators = state.collaborators.map(collab => ({
            ...collab,
            lastActive: collab.lastActive ? new Date(collab.lastActive as any) : undefined,
          }));
        }
      },
    }
  )
);

// ========== SELECTOR HOOKS ==========

export const useCircles = () => useConnectionsStore((state) => state.circles);
export const useCircleById = (id: string) => useConnectionsStore((state) => 
  state.circles.find(c => c.id === id)
);
export const useCollaborators = () => useConnectionsStore((state) => state.collaborators);
export const useCommunityRooms = () => useConnectionsStore((state) => state.communityRooms);
export const useInsights = () => useConnectionsStore((state) => state.insights);
export const useUnreadInsights = () => useConnectionsStore((state) => 
  state.insights.filter(i => !i.isRead)
);
export const useTrendingThemes = () => useConnectionsStore((state) => state.getTrendingThemes());