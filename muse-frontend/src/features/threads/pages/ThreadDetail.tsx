import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Eye, Pin, Lock, Share2, Flag, MoreVertical } from 'lucide-react';
import { useThreadsStore } from '../store/useThreadsStore';
import ReplyCard from '../components/ReplyCard';
import ReplyForm from '../components/ReplyForm';
import ThreadInsights from '../components/ThreadInsights';
import ThreadAnalytics from '../components/ThreadAnalytics';
import { motion } from 'framer-motion';

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    threads, 
    getThread, 
    addReply, 
    likeThread, 
    likeReply, 
    markAsAnswer, 
    togglePin, 
    toggleLock,
    generateAISummary,
    analyzeSentiment,
    getRelatedThreads,
    getStats,
    incrementViews,
    isFollowing,
    followThread,
    unfollowThread
  } = useThreadsStore();
  
  const thread = getThread(id || '');
  const [isLiked, setIsLiked] = useState(false);
  const currentUserId = 'current-user';

  useEffect(() => {
    if (thread && id) {
      incrementViews(id);
    }
  }, [thread, id]);

  if (!thread) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Thread not found</p>
        <button onClick={() => navigate('/threads')} className="mt-4 text-white underline">Back to Threads</button>
      </div>
    );
  }

  const stats = getStats();
  const relatedThreads = getRelatedThreads(thread.id);
  const isFollowingThread = isFollowing(thread.id, currentUserId);

  const handleLike = () => {
    setIsLiked(!isLiked);
    likeThread(thread.id, currentUserId);
  };

  const handleReply = (content: string, parentId?: string) => {
    addReply(thread.id, content, parentId);
  };

  const timeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/threads')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="capitalize">{thread.type}</span>
            <span>•</span>
            <span>{timeAgo(thread.createdAt)}</span>
            <span>•</span>
            <span>by {thread.author.name}</span>
          </div>
        </div>

        {/* Thread Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {thread.isPinned && <Pin size={16} className="text-white" />}
            {thread.isLocked && <Lock size={16} className="text-gray-500" />}
            <div className="flex gap-2">
              {thread.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500">#{tag}</span>
              ))}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{thread.title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{thread.content}</p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b border-white/10">
            <button onClick={handleLike} className={`flex items-center gap-2 transition ${isLiked ? 'text-red-400' : 'hover:text-white'}`}>
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{thread.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span>{thread.replyCount} replies</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{thread.views} views</span>
            </div>
            <button
              onClick={() => isFollowingThread ? unfollowThread(thread.id, currentUserId) : followThread(thread.id, currentUserId)}
              className="ml-auto px-3 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 transition"
            >
              {isFollowingThread ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Replies */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white">{thread.replyCount} Responses</h2>
            
            {/* Reply Form */}
            {!thread.isLocked && (
              <ReplyForm onSubmit={(content) => handleReply(content)} />
            )}
            
            {/* Replies List */}
            <div className="space-y-4">
              {thread.replies.map(reply => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  threadId={thread.id}
                  isAnswer={reply.isAnswer}
                  currentUserId={currentUserId}
                  onLike={(replyId) => likeReply(thread.id, replyId, currentUserId)}
                  onMarkAnswer={thread.type === 'question' ? (replyId) => markAsAnswer(thread.id, replyId) : undefined}
                  onReply={(content, parentId) => handleReply(content, parentId)}
                />
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights (Phase 3) */}
            <ThreadInsights
              threadId={thread.id}
              aiSummary={thread.aiSummary}
              sentiment={thread.sentiment}
              onGenerateSummary={() => generateAISummary(thread.id)}
              onAnalyzeSentiment={() => analyzeSentiment(thread.id)}
            />
            
            {/* Analytics (Phase 4) */}
            <ThreadAnalytics stats={stats} />
            
            {/* Related Threads (Phase 3) */}
            {relatedThreads.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Related Threads</h3>
                <div className="space-y-2">
                  {relatedThreads.map(rt => (
                    <button
                      key={rt.id}
                      onClick={() => navigate(`/threads/${rt.id}`)}
                      className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition"
                    >
                      <p className="text-sm text-white line-clamp-1">{rt.title}</p>
                      <p className="text-[10px] text-gray-500">{rt.replyCount} replies</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}