import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, CheckCircle, Flag, MoreVertical, Reply as ReplyIcon } from 'lucide-react';
import { Reply } from '../types';

interface Props {
  reply: Reply;
  threadId: string;
  isAnswer?: boolean;
  currentUserId?: string;
  onLike: (replyId: string) => void;
  onMarkAnswer?: (replyId: string) => void;
  onReply: (content: string, parentId: string) => void;
  depth?: number;
}

export default function ReplyCard({ 
  reply, 
  threadId, 
  isAnswer, 
  currentUserId, 
  onLike, 
  onMarkAnswer, 
  onReply,
  depth = 0 
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(reply.likedBy?.includes(currentUserId || '') || false);

  const timeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(reply.id);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent, reply.id);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative ${depth > 0 ? 'ml-8 md:ml-12 mt-3' : 'mt-4'}`}
    >
      <div className={`p-4 rounded-xl ${isAnswer ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}>
        {/* Answer Badge */}
        {isAnswer && (
          <div className="absolute -top-2 left-4 px-2 py-0.5 bg-emerald-500 rounded-full text-[10px] text-white flex items-center gap-1">
            <CheckCircle size={10} /> Accepted Answer
          </div>
        )}
        
        <div className="flex items-start gap-3">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
            {reply.author.name.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Author & time */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-medium text-white">{reply.author.name}</span>
              <span className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</span>
              {reply.isEdited && <span className="text-[10px] text-gray-600">(edited)</span>}
            </div>
            
            {/* Content */}
            <p className="text-gray-300 text-sm leading-relaxed">{reply.content}</p>
            
            {/* Actions */}
            <div className="flex items-center gap-3 mt-2">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition ${isLiked ? 'text-red-400' : 'text-gray-500 hover:text-white'}`}
              >
                <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{reply.likes}</span>
              </button>
              
              <button 
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition"
              >
                <ReplyIcon size={12} />
                <span>Reply</span>
              </button>
              
              {onMarkAnswer && !isAnswer && (
                <button 
                  onClick={() => onMarkAnswer(reply.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition"
                >
                  <CheckCircle size={12} />
                  <span>Mark as Answer</span>
                </button>
              )}
            </div>
            
            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-3 py-1 bg-white text-black rounded-lg text-xs font-medium hover:bg-white/90 transition disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 border border-white/20 rounded-lg text-xs text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Nested replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="mt-2">
          {reply.replies.map(nestedReply => (
            <ReplyCard
              key={nestedReply.id}
              reply={nestedReply}
              threadId={threadId}
              currentUserId={currentUserId}
              onLike={onLike}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}