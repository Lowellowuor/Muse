export type ThreadType = 'discussion' | 'question' | 'resource' | 'poll' | 'announcement';
export type ThreadMood = 'contemplative' | 'curious' | 'dark' | 'hopeful' | 'urgent' | 'serene';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  joinDate?: string;
}

export interface Reply {
  id: string;
  content: string;
  author: Author;
  likes: number;
  likedBy?: string[];
  isAnswer?: boolean;
  isEdited?: boolean;
  replies?: Reply[];
  createdAt: string;
  updatedAt?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  type: ThreadType;
  mood: ThreadMood;
  author: Author;
  roomId?: string;
  tags: string[];
  isPublic: boolean;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  likes: number;
  likedBy?: string[];
  replyCount: number;
  replies: Reply[];
  aiSummary?: string;
  sentiment?: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  relatedThreads?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ThreadStats {
  totalThreads: number;
  totalReplies: number;
  totalViews: number;
  totalLikes: number;
  activeThreads: number;
  topContributors: Author[];
  mostActiveTag: string;
  weeklyGrowth: number;
}

export interface Notification {
  id: string;
  type: 'reply' | 'like' | 'mention' | 'answer';
  threadId: string;
  threadTitle: string;
  fromUser: Author;
  read: boolean;
  createdAt: string;
}

export interface FollowedThread {
  threadId: string;
  userId: string;
  createdAt: string;
}