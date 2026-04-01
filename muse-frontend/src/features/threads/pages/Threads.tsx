import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bell } from 'lucide-react';
import { useThreadsStore } from '../store/useThreadsStore';
import ThreadCard from '../components/ThreadCard';
import ThreadFilters from '../components/ThreadFilters';
import CreateThreadModal from '../components/CreateThreadModal';
import NotificationBadge from '../components/NotificationBadge';
import { motion } from 'framer-motion';

export default function Threads() {
  const navigate = useNavigate();
  const { 
    getFilteredThreads, 
    addThread, 
    getStats,
    notifications,
    getUnreadCount,
    markNotificationRead
  } = useThreadsStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  
  const threads = getFilteredThreads();
  const stats = getStats();
  const featuredThread = threads.find(t => t.isPinned) || threads[0];
  const unreadCount = getUnreadCount();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {featuredThread && (
        <div className="relative h-[45vh] mb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 md:px-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">
                  {featuredThread.isPinned ? 'PINNED DISCUSSION' : 'FEATURED THREAD'}
                </span>
                <span className="text-xs text-gray-400">{featuredThread.replyCount} replies</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{featuredThread.title}</h1>
              <p className="text-gray-300 text-lg mb-6 line-clamp-2">{featuredThread.content}</p>
              <button 
                onClick={() => navigate(`/threads/${featuredThread.id}`)}
                className="px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition"
              >
                Join Discussion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-16 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">All Discussions</h2>
          <p className="text-sm text-gray-400">{stats.totalThreads} threads • {stats.totalReplies} replies</p>
        </div>
        <div className="flex gap-3">
          <NotificationBadge 
            notifications={notifications} 
            unreadCount={unreadCount}
            onMarkRead={markNotificationRead}
            onNavigate={navigate}
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition flex items-center gap-2"
          >
            <Plus size={18} /> New Thread
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 md:px-16 mb-8">
        <ThreadFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          selectedMood={selectedMood}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
          onMoodChange={setSelectedMood}
          onClearFilters={() => {
            setSearchQuery('');
            setSelectedType(null);
            setSelectedMood(null);
          }}
        />
      </div>

      {/* Threads List */}
      <div className="px-6 md:px-16 pb-16 space-y-4">
        {threads.map(thread => (
          <ThreadCard 
            key={thread.id} 
            thread={thread} 
            onClick={(id) => navigate(`/threads/${id}`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {threads.length === 0 && (
        <div className="text-center py-20">
          <MessageCircle size={64} className="text-white/20 mx-auto mb-4" />
          <p className="text-gray-400">No threads found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
          >
            Start a Discussion
          </button>
        </div>
      )}

      {/* Create Modal */}
      <CreateThreadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={addThread}
      />
    </div>
  );
}