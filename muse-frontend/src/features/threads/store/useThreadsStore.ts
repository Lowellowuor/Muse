import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Thread, Reply, ThreadStats, ThreadType, ThreadMood, Notification, FollowedThread } from '../types';

interface ThreadsState {
  // State
  threads: Thread[];
  currentThread: Thread | null;
  followedThreads: FollowedThread[];
  notifications: Notification[];
  isLoading: boolean;
  searchQuery: string;
  selectedType: ThreadType | null;
  selectedMood: ThreadMood | null;
  
  // Phase 1: CRUD Operations
  fetchThreads: () => Promise<void>;
  addThread: (thread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'replyCount' | 'replies' | 'likedBy'>) => void;
  getThread: (id: string) => Thread | undefined;
  updateThread: (id: string, updates: Partial<Thread>) => void;
  deleteThread: (id: string) => void;
  
  // Phase 1: Reply System
  addReply: (threadId: string, content: string, parentReplyId?: string) => void;
  editReply: (threadId: string, replyId: string, content: string) => void;
  deleteReply: (threadId: string, replyId: string) => void;
  
  // Phase 1: Engagement
  likeThread: (threadId: string, userId: string) => void;
  likeReply: (threadId: string, replyId: string, userId: string) => void;
  
  // Phase 1: Search & Filters
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: ThreadType | null) => void;
  setSelectedMood: (mood: ThreadMood | null) => void;
  clearFilters: () => void;
  getFilteredThreads: () => Thread[];
  
  // Phase 2: Thread Management
  togglePin: (threadId: string) => void;
  toggleLock: (threadId: string) => void;
  markAsAnswer: (threadId: string, replyId: string) => void;
  addTag: (threadId: string, tag: string) => void;
  removeTag: (threadId: string, tag: string) => void;
  
  // Phase 3: AI Features
  generateAISummary: (threadId: string) => Promise<string>;
  analyzeSentiment: (threadId: string) => Promise<{ score: number; label: string; confidence: number }>;
  getRelatedThreads: (threadId: string) => Thread[];
  generateReplySuggestions: (threadId: string) => Promise<string[]>;
  
  // Phase 4: Community Features
  followThread: (threadId: string, userId: string) => void;
  unfollowThread: (threadId: string, userId: string) => void;
  isFollowing: (threadId: string, userId: string) => boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: () => number;
  getStats: () => ThreadStats;
  incrementViews: (threadId: string) => void;
}

// Dummy data for threads
const dummyThreads: Thread[] = [
  {
    id: '1',
    title: 'How is AI reshaping creative workflows?',
    content: 'I\'ve been exploring how AI tools are changing the way we approach creative work. From generating ideas to executing complex tasks, the landscape is shifting rapidly. What are your thoughts?',
    type: 'discussion',
    mood: 'curious',
    author: { id: 'u1', name: 'Alex Chen', avatar: '', bio: 'Creative technologist', joinDate: '2024-01-01' },
    tags: ['ai', 'creativity', 'future'],
    isPublic: true,
    isPinned: true,
    isLocked: false,
    views: 1234,
    likes: 89,
    likedBy: [],
    replyCount: 12,
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Best practices for digital journaling?',
    content: 'Looking for tips and techniques to make digital journaling more effective. What tools and habits work for you?',
    type: 'question',
    mood: 'hopeful',
    author: { id: 'u2', name: 'Sarah Johnson', avatar: '', bio: 'Writer & creator', joinDate: '2024-01-15' },
    tags: ['journaling', 'productivity', 'habits'],
    isPublic: true,
    isPinned: false,
    isLocked: false,
    views: 567,
    likes: 34,
    likedBy: [],
    replyCount: 8,
    replies: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'The future of creative communities',
    content: 'How do you see online creative communities evolving over the next 5 years? What features would you love to see?',
    type: 'discussion',
    mood: 'contemplative',
    author: { id: 'u3', name: 'Marcus Wright', avatar: '', bio: 'Community builder', joinDate: '2024-01-10' },
    tags: ['community', 'future', 'collaboration'],
    isPublic: true,
    isPinned: false,
    isLocked: false,
    views: 892,
    likes: 56,
    likedBy: [],
    replyCount: 15,
    replies: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const useThreadsStore = create<ThreadsState>()(
  persist(
    (set, get) => ({
      // Initial State
      threads: dummyThreads,
      currentThread: null,
      followedThreads: [],
      notifications: [],
      isLoading: false,
      searchQuery: '',
      selectedType: null,
      selectedMood: null,

      // ========== PHASE 1: CRUD OPERATIONS ==========
      fetchThreads: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
      },

      addThread: (threadData) => {
        const newThread: Thread = {
          ...threadData,
          id: Date.now().toString(),
          views: 0,
          likes: 0,
          likedBy: [],
          replyCount: 0,
          replies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ threads: [newThread, ...state.threads] }));
        
        // Add notification for followers (Phase 4)
        const followers = get().followedThreads.filter(f => f.threadId === newThread.id);
        followers.forEach(follower => {
          get().addNotification({
            type: 'reply',
            threadId: newThread.id,
            threadTitle: newThread.title,
            fromUser: newThread.author,
            toUserId: follower.userId,
          });
        });
      },

      getThread: (id) => get().threads.find(t => t.id === id),

      updateThread: (id, updates) => {
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      deleteThread: (id) => {
        set((state) => ({
          threads: state.threads.filter(t => t.id !== id),
        }));
      },

      // ========== PHASE 1: REPLY SYSTEM ==========
      addReply: (threadId, content, parentReplyId) => {
        const newReply: Reply = {
          id: Date.now().toString(),
          content,
          author: { id: 'current-user', name: 'You', avatar: '' },
          likes: 0,
          likedBy: [],
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          threads: state.threads.map(t => {
            if (t.id !== threadId) return t;
            
            let updatedReplies = [...t.replies];
            if (parentReplyId) {
              // Nested reply
              const addNestedReply = (replies: Reply[]): Reply[] => {
                return replies.map(r => {
                  if (r.id === parentReplyId) {
                    return { ...r, replies: [...(r.replies || []), newReply] };
                  }
                  if (r.replies) {
                    return { ...r, replies: addNestedReply(r.replies) };
                  }
                  return r;
                });
              };
              updatedReplies = addNestedReply(updatedReplies);
            } else {
              updatedReplies = [newReply, ...updatedReplies];
            }
            
            return {
              ...t,
              replies: updatedReplies,
              replyCount: t.replyCount + 1,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
        
        // Add notification (Phase 4)
        const thread = get().threads.find(t => t.id === threadId);
        if (thread && thread.author.id !== 'current-user') {
          get().addNotification({
            type: 'reply',
            threadId,
            threadTitle: thread.title,
            fromUser: { id: 'current-user', name: 'You', avatar: '' },
            toUserId: thread.author.id,
          });
        }
      },

      editReply: (threadId, replyId, content) => {
        set((state) => ({
          threads: state.threads.map(t => {
            if (t.id !== threadId) return t;
            
            const editReplyContent = (replies: Reply[]): Reply[] => {
              return replies.map(r => {
                if (r.id === replyId) {
                  return { ...r, content, isEdited: true, updatedAt: new Date().toISOString() };
                }
                if (r.replies) {
                  return { ...r, replies: editReplyContent(r.replies) };
                }
                return r;
              });
            };
            
            return { ...t, replies: editReplyContent(t.replies), updatedAt: new Date().toISOString() };
          }),
        }));
      },

      deleteReply: (threadId, replyId) => {
        set((state) => ({
          threads: state.threads.map(t => {
            if (t.id !== threadId) return t;
            
            const deleteReplyContent = (replies: Reply[]): Reply[] => {
              return replies.filter(r => {
                if (r.id === replyId) return false;
                if (r.replies) {
                  r.replies = deleteReplyContent(r.replies);
                }
                return true;
              });
            };
            
            const newReplies = deleteReplyContent(t.replies);
            return {
              ...t,
              replies: newReplies,
              replyCount: newReplies.length,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // ========== PHASE 1: ENGAGEMENT ==========
      likeThread: (threadId, userId) => {
        set((state) => ({
          threads: state.threads.map(t => {
            if (t.id !== threadId) return t;
            const hasLiked = t.likedBy?.includes(userId) || false;
            return {
              ...t,
              likes: hasLiked ? t.likes - 1 : t.likes + 1,
              likedBy: hasLiked 
                ? (t.likedBy?.filter(id => id !== userId) || [])
                : [...(t.likedBy || []), userId],
            };
          }),
        }));
        
        // Add notification (Phase 4)
        const thread = get().threads.find(t => t.id === threadId);
        if (thread && thread.author.id !== userId) {
          get().addNotification({
            type: 'like',
            threadId,
            threadTitle: thread.title,
            fromUser: { id: userId, name: 'Someone', avatar: '' },
            toUserId: thread.author.id,
          });
        }
      },

      likeReply: (threadId, replyId, userId) => {
        set((state) => ({
          threads: state.threads.map(t => {
            if (t.id !== threadId) return t;
            
            const updateReplyLikes = (replies: Reply[]): Reply[] => {
              return replies.map(r => {
                if (r.id === replyId) {
                  const hasLiked = r.likedBy?.includes(userId) || false;
                  return {
                    ...r,
                    likes: hasLiked ? r.likes - 1 : r.likes + 1,
                    likedBy: hasLiked
                      ? (r.likedBy?.filter(id => id !== userId) || [])
                      : [...(r.likedBy || []), userId],
                  };
                }
                if (r.replies) {
                  return { ...r, replies: updateReplyLikes(r.replies) };
                }
                return r;
              });
            };
            
            return { ...t, replies: updateReplyLikes(t.replies) };
          }),
        }));
      },

      // ========== PHASE 1: SEARCH & FILTERS ==========
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedType: (type) => set({ selectedType: type }),
      setSelectedMood: (mood) => set({ selectedMood: mood }),
      clearFilters: () => set({ searchQuery: '', selectedType: null, selectedMood: null }),

      getFilteredThreads: () => {
        const { threads, searchQuery, selectedType, selectedMood } = get();
        let filtered = [...threads];
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(query) ||
            t.content.toLowerCase().includes(query) ||
            t.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        if (selectedType) filtered = filtered.filter(t => t.type === selectedType);
        if (selectedMood) filtered = filtered.filter(t => t.mood === selectedMood);
        
        // Sort: pinned first, then by date
        return filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      },

      // ========== PHASE 2: THREAD MANAGEMENT ==========
      togglePin: (threadId) => {
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId ? { ...t, isPinned: !t.isPinned, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      toggleLock: (threadId) => {
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId ? { ...t, isLocked: !t.isLocked, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      markAsAnswer: (threadId, replyId) => {
        set((state) => ({
          threads: state.threads.map(t => {
            if (t.id !== threadId) return t;
            
            const updateReplies = (replies: Reply[]): Reply[] => {
              return replies.map(r => ({
                ...r,
                isAnswer: r.id === replyId,
                replies: r.replies ? updateReplies(r.replies) : undefined,
              }));
            };
            
            return { ...t, replies: updateReplies(t.replies), updatedAt: new Date().toISOString() };
          }),
        }));
        
        // Add notification for answer (Phase 4)
        const thread = get().threads.find(t => t.id === threadId);
        if (thread && thread.type === 'question') {
          get().addNotification({
            type: 'answer',
            threadId,
            threadTitle: thread.title,
            fromUser: { id: 'system', name: 'System', avatar: '' },
            toUserId: thread.author.id,
          });
        }
      },

      addTag: (threadId, tag) => {
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId && !t.tags.includes(tag)
              ? { ...t, tags: [...t.tags, tag], updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      removeTag: (threadId, tag) => {
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId
              ? { ...t, tags: t.tags.filter(tg => tg !== tag), updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      // ========== PHASE 3: AI FEATURES ==========
      generateAISummary: async (threadId) => {
        const thread = get().threads.find(t => t.id === threadId);
        if (!thread) return '';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const summary = `This discussion explores ${thread.title.toLowerCase()}. Key themes include ${thread.tags.join(', ')}. The community has contributed ${thread.replyCount} thoughtful responses.`;
        
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId ? { ...t, aiSummary: summary } : t
          ),
        }));
        
        return summary;
      },

      analyzeSentiment: async (threadId) => {
        const thread = get().threads.find(t => t.id === threadId);
        if (!thread) return { score: 0, label: 'neutral', confidence: 0 };
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const sentimentMap = {
          curious: { score: 0.3, label: 'positive', confidence: 0.7 },
          hopeful: { score: 0.5, label: 'positive', confidence: 0.8 },
          contemplative: { score: 0, label: 'neutral', confidence: 0.6 },
          urgent: { score: -0.2, label: 'negative', confidence: 0.7 },
          dark: { score: -0.4, label: 'negative', confidence: 0.7 },
          serene: { score: 0.2, label: 'positive', confidence: 0.7 },
        };
        
        const result = sentimentMap[thread.mood];
        
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId ? { ...t, sentiment: { score: result.score, label: result.label as any, confidence: result.confidence } } : t
          ),
        }));
        
        return result;
      },

      getRelatedThreads: (threadId) => {
        const thread = get().threads.find(t => t.id === threadId);
        if (!thread) return [];
        
        return get().threads
          .filter(t => t.id !== threadId && t.tags.some(tag => thread.tags.includes(tag)))
          .slice(0, 3);
      },

      generateReplySuggestions: async (threadId) => {
        const thread = get().threads.find(t => t.id === threadId);
        if (!thread) return [];
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const suggestions = [
          `That's an interesting perspective on ${thread.tags[0] || 'this topic'}. I'd add that...`,
          `Based on my experience with ${thread.tags[0] || 'this'}, I've found that...`,
          `Great point! Have you considered looking at it from this angle...`,
        ];
        
        return suggestions;
      },

      // ========== PHASE 4: COMMUNITY FEATURES ==========
      followThread: (threadId, userId) => {
        set((state) => ({
          followedThreads: [...state.followedThreads, { threadId, userId, createdAt: new Date().toISOString() }],
        }));
      },

      unfollowThread: (threadId, userId) => {
        set((state) => ({
          followedThreads: state.followedThreads.filter(f => !(f.threadId === threadId && f.userId === userId)),
        }));
      },

      isFollowing: (threadId, userId) => {
        return get().followedThreads.some(f => f.threadId === threadId && f.userId === userId);
      },

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },

      getStats: () => {
        const { threads } = get();
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const threadsThisWeek = threads.filter(t => new Date(t.createdAt).getTime() > weekAgo).length;
        const threadsLastWeek = 5;
        
        return {
          totalThreads: threads.length,
          totalReplies: threads.reduce((sum, t) => sum + t.replyCount, 0),
          totalViews: threads.reduce((sum, t) => sum + t.views, 0),
          totalLikes: threads.reduce((sum, t) => sum + t.likes, 0),
          activeThreads: threads.filter(t => {
            const daysSinceUpdate = (now - new Date(t.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceUpdate < 7;
          }).length,
          topContributors: [],
          mostActiveTag: 'ai',
          weeklyGrowth: threadsThisWeek - threadsLastWeek,
        };
      },

      incrementViews: (threadId) => {
        set((state) => ({
          threads: state.threads.map(t =>
            t.id === threadId ? { ...t, views: t.views + 1 } : t
          ),
        }));
      },
    }),
    {
      name: 'muse-threads-storage',
      version: 1,
    }
  )
);