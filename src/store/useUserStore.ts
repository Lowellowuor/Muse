import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  createdAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  gender?: string;
  birthDate?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  links: UserLink[];
  publicSettings: {
    showProfile: boolean;
    showLocation: boolean;
    showRooms: boolean;
    showThreads: boolean;
    showInsights: boolean;
    showActivity: boolean;
  };
  preferences: {
    theme: 'dark' | 'light' | 'system';
    notifications: boolean;
    emailDigest: boolean;
    language: string;
    defaultPrivacy: 'public' | 'private';
  };
  stats: {
    totalRooms: number;
    totalArtifacts: number;
    totalThreads: number;
    journalEntries: number;
    streakDays: number;
    lastActive: Date;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface UserState {
  user: User | null;
  soloMode: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  
  // Mode toggles
  toggleSoloMode: () => void;
  
  // Profile methods
  updateProfile: (updates: Partial<User>) => void;
  updateAvatar: (avatarUrl: string) => void;
  updateBio: (bio: string) => void;
  updateLocation: (location: string) => void;
  
  // Privacy methods
  togglePublicSetting: (setting: keyof User['publicSettings']) => void;
  setDefaultPrivacy: (privacy: 'public' | 'private') => void;
  
  // Links methods
  addLink: (link: Omit<UserLink, 'id' | 'createdAt'>) => void;
  updateLink: (id: string, updates: Partial<Omit<UserLink, 'id'>>) => void;
  removeLink: (id: string) => void;
  
  // Stats methods
  incrementStat: (stat: keyof User['stats'], increment?: number) => void;
  updateStreak: () => void;
  updateLastActive: () => void;
  
  // Preferences
  updatePreferences: (updates: Partial<User['preferences']>) => void;
  
  // Helpers
  reset: () => void;
  clearError: () => void;
}

// Default user preferences
const defaultPreferences = {
  theme: 'dark' as const,
  notifications: true,
  emailDigest: false,
  language: 'en',
  defaultPrivacy: 'private' as const,
};

// Default stats
const defaultStats = {
  totalRooms: 0,
  totalArtifacts: 0,
  totalThreads: 0,
  journalEntries: 0,
  streakDays: 0,
  lastActive: new Date(),
  createdAt: new Date(),
};

// Helper to generate unique ID
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 10);
};

// Mock user data
const mockUser: User = {
  id: 'user_x',
  email: 'alex@muse.app',
  name: 'Alex Rivera',
  username: '@alex',
  gender: 'Non-binary',
  birthDate: '1998-06-15',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&h=400&q=80',
  bio: 'Curating the intersection of brutalist architecture and ambient soundscapes.',
  location: 'Berlin / Digital',
  links: [
    { 
      id: 'l1', 
      title: 'Portfolio', 
      url: 'https://alexrivera.design',
      icon: 'globe',
      createdAt: new Date('2024-01-15')
    },
    { 
      id: 'l2', 
      title: 'Spotify', 
      url: 'https://open.spotify.com/user/alexr',
      icon: 'music',
      createdAt: new Date('2024-01-20')
    }
  ],
  publicSettings: {
    showProfile: true,
    showLocation: true,
    showRooms: true,
    showThreads: true,
    showInsights: true,
    showActivity: true,
  },
  preferences: defaultPreferences,
  stats: {
    totalRooms: 7,
    totalArtifacts: 156,
    totalThreads: 12,
    journalEntries: 34,
    streakDays: 12,
    lastActive: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: mockUser,
      soloMode: true,
      isLoading: false,
      error: null,
      isAuthenticated: true,

      // ========== AUTH METHODS ==========
      
      login: async (email, password) => {
        if (!email || typeof email !== 'string') {
          set({ error: 'Invalid email provided', isLoading: false });
          throw new Error('Invalid email provided');
        }

        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const emailParts = email.split('@');
          const nameFromEmail = emailParts[0] || 'User';
          const usernameFromEmail = `@${nameFromEmail.toLowerCase()}`;
          
          const newUser: User = {
            id: generateId(),
            email: email,
            name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
            username: usernameFromEmail,
            links: [],
            publicSettings: {
              showProfile: true,
              showLocation: true,
              showRooms: true,
              showThreads: true,
              showInsights: true,
              showActivity: true,
            },
            preferences: defaultPreferences,
            stats: {
              ...defaultStats,
              createdAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({ user: newUser, isLoading: false, error: null, isAuthenticated: true });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      register: async (email, name, password) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const newUser: User = {
            id: generateId(),
            email,
            name,
            username: `@${name.toLowerCase().replace(/\s/g, '')}`,
            links: [],
            publicSettings: {
              showProfile: true,
              showLocation: true,
              showRooms: true,
              showThreads: true,
              showInsights: true,
              showActivity: true,
            },
            preferences: defaultPreferences,
            stats: {
              ...defaultStats,
              createdAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({ user: newUser, isLoading: false, error: null, isAuthenticated: true });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      logout: () => set({ 
        user: null, 
        error: null, 
        isLoading: false, 
        isAuthenticated: false 
      }),
      
      // ========== MODE TOGGLES ==========
      
      toggleSoloMode: () => set((state) => ({ soloMode: !state.soloMode })),
      
      // ========== PROFILE METHODS ==========
      
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          ...updates, 
          updatedAt: new Date() 
        } : null
      })),
      
      updateAvatar: (avatarUrl) => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          avatarUrl, 
          updatedAt: new Date() 
        } : null
      })),
      
      updateBio: (bio) => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          bio, 
          updatedAt: new Date() 
        } : null
      })),
      
      updateLocation: (location) => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          location, 
          updatedAt: new Date() 
        } : null
      })),
      
      // ========== PRIVACY METHODS ==========
      
      togglePublicSetting: (setting) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            publicSettings: {
              ...state.user.publicSettings,
              [setting]: !state.user.publicSettings[setting]
            },
            updatedAt: new Date()
          }
        };
      }),
      
      setDefaultPrivacy: (privacy) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            defaultPrivacy: privacy
          },
          updatedAt: new Date()
        } : null
      })),
      
      // ========== LINKS METHODS ==========
      
      addLink: (link) => set((state) => {
        if (!state.user) return state;
        const newLink: UserLink = { 
          ...link, 
          id: generateId(),
          createdAt: new Date()
        };
        const currentLinks = state.user.links || [];
        return {
          user: {
            ...state.user,
            links: [...currentLinks, newLink],
            updatedAt: new Date()
          }
        };
      }),
      
      updateLink: (id, updates) => set((state) => {
        if (!state.user) return state;
        const currentLinks = state.user.links || [];
        return {
          user: {
            ...state.user,
            links: currentLinks.map(l => 
              l.id === id ? { ...l, ...updates } : l
            ),
            updatedAt: new Date()
          }
        };
      }),
      
      removeLink: (id) => set((state) => {
        if (!state.user) return state;
        const currentLinks = state.user.links || [];
        return {
          user: {
            ...state.user,
            links: currentLinks.filter(l => l.id !== id),
            updatedAt: new Date()
          }
        };
      }),
      
      // ========== STATS METHODS ==========
      
      incrementStat: (stat, increment = 1) => set((state) => {
        if (!state.user) return state;
        const currentValue = state.user.stats[stat] as number;
        return {
          user: {
            ...state.user,
            stats: {
              ...state.user.stats,
              [stat]: Math.max(0, currentValue + increment)
            },
            updatedAt: new Date()
          }
        };
      }),
      
      updateStreak: () => set((state) => {
        if (!state.user) return state;
        const lastActive = new Date(state.user.stats.lastActive);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = state.user.stats.streakDays;
        if (daysDiff === 1) {
          newStreak += 1;
        } else if (daysDiff > 1) {
          newStreak = 0;
        }
        
        return {
          user: {
            ...state.user,
            stats: {
              ...state.user.stats,
              streakDays: newStreak
            },
            updatedAt: new Date()
          }
        };
      }),
      
      updateLastActive: () => set((state) => ({
        user: state.user ? {
          ...state.user,
          stats: {
            ...state.user.stats,
            lastActive: new Date()
          },
          updatedAt: new Date()
        } : null
      })),
      
      // ========== PREFERENCES ==========
      
      updatePreferences: (updates) => set((state) => ({
        user: state.user ? {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...updates
          },
          updatedAt: new Date()
        } : null
      })),
      
      // ========== HELPERS ==========
      
      reset: () => set({
        user: mockUser,
        soloMode: true,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      }),
      
      clearError: () => set({ error: null }),
      
    }),
    {
      name: 'muse-user-storage',
      partialize: (state) => ({
        user: state.user ? {
          ...state.user,
          createdAt: state.user.createdAt?.toISOString(),
          updatedAt: state.user.updatedAt?.toISOString(),
          stats: {
            ...state.user.stats,
            lastActive: state.user.stats.lastActive?.toISOString(),
            createdAt: state.user.stats.createdAt?.toISOString(),
          },
          links: state.user.links?.map(link => ({
            ...link,
            createdAt: link.createdAt?.toISOString(),
          })),
        } : null,
        soloMode: state.soloMode,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          // Convert dates back from ISO strings
          state.user.createdAt = new Date(state.user.createdAt as any);
          state.user.updatedAt = new Date(state.user.updatedAt as any);
          if (state.user.stats) {
            state.user.stats.lastActive = new Date(state.user.stats.lastActive as any);
            state.user.stats.createdAt = new Date(state.user.stats.createdAt as any);
          }
          if (state.user.links) {
            state.user.links = state.user.links.map(link => ({
              ...link,
              createdAt: link.createdAt ? new Date(link.createdAt as any) : undefined,
            }));
          }
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useSoloMode = () => useUserStore((state) => state.soloMode);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useUserStats = () => useUserStore((state) => state.user?.stats);
export const useUserPreferences = () => useUserStore((state) => state.user?.preferences);
export const useUserPublicSettings = () => useUserStore((state) => state.user?.publicSettings);