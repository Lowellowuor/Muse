import { motion } from 'framer-motion';
import { MessageCircle, Heart, Eye, Pin, Lock, Zap, Brain, Heart as HeartIcon, Cloud, Sun, Moon, CheckCircle } from 'lucide-react';
import { Thread } from '../types';
import { useState } from 'react';

interface Props {
  thread: Thread;
  onClick: (id: string) => void;
  currentUserId?: string;
}

const moodIcons = {
  contemplative: Moon,
  curious: Zap,
  dark: Cloud,
  hopeful: Sun,
  urgent: HeartIcon,
  serene: Brain,
};

const moodColors = {
  contemplative: 'from-purple-500/30 to-indigo-500/20',
  curious: 'from-cyan-500/30 to-blue-500/20',
  dark: 'from-gray-500/30 to-gray-600/20',
  hopeful: 'from-emerald-500/30 to-green-500/20',
  urgent: 'from-red-500/30 to-pink-500/20',
  serene: 'from-teal-500/30 to-cyan-500/20',
};

export default function ThreadCard({ thread, onClick, currentUserId }: Props) {
  const MoodIcon = moodIcons[thread.mood];
  const [isLiked, setIsLiked] = useState(thread.likedBy?.includes(currentUserId || '') || false);
  
  const timeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Call store like method
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative p-6 rounded-2xl bg-white/5 border hover:border-white/30 transition-all cursor-pointer ${
        thread.isPinned ? 'border-white/20 bg-white/[0.07]' : 'border-white/10'
      }`}
      onClick={() => onClick(thread.id)}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {thread.isPinned && <Pin size={14} className="text-white" />}
        {thread.isLocked && <Lock size={14} className="text-gray-500" />}
        {thread.type === 'question' && thread.replies.some(r => r.isAnswer) && (
          <CheckCircle size={14} className="text-green-400" />
        )}
      </div>
      
      <div className="flex items-start gap-4">
        {/* Mood Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moodColors[thread.mood]} flex items-center justify-center shrink-0`}>
          <MoodIcon size={20} className="text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Meta info */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-gray-300 capitalize">
              {thread.type}
            </span>
            <span className="text-xs text-gray-500">{timeAgo(thread.createdAt)}</span>
            <span className="text-xs text-gray-500">• by {thread.author.name}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{thread.title}</h3>
          
          {/* Content preview */}
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{thread.content}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {thread.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] text-gray-500">#{tag}</span>
            ))}
            {thread.tags.length > 3 && (
              <span className="text-[10px] text-gray-600">+{thread.tags.length - 3}</span>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MessageCircle size={12} />
              <span>{thread.replyCount} replies</span>
            </div>
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${isLiked ? 'text-red-400' : 'hover:text-white'}`}
            >
              <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{thread.likes}</span>
            </button>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{thread.views}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}