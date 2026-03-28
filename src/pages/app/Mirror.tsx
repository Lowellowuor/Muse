import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, Sparkles, BarChart2, Layers, BookOpen, TrendingUp, Share2, 
   Flame, Brain, Calendar, Star,  Copy, Check, X
} from 'lucide-react';
import { useItemsStore } from '../../store/useItemsStore';
import { useRoomsStore, useTotalArtifacts, useRoomCount } from '../../store/useRoomsStore';
import { useJournalStore } from '../../store/useJournalStore';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{ 
            y: [`${p.y}%`, `${p.y - 30}%`],
            opacity: [0, 0.2, 0],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute w-0.5 h-0.5 rounded-full bg-white/70/20"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

// Stats Card Component with animated counter
function StatsCard({ stat, index, delay }: { stat: { label: string; value: number; icon: any; color: string; bg: string }; index: number; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 800;
      const increment = stat.value / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: delay + index * 0.05, duration: 0.5 }}
      className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
    >
      <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <stat.icon size={18} className={stat.color} />
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-white font-mono">{count}</p>
        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mt-1">{stat.label}</p>
      </div>
    </motion.div>
  );
}

// Insight Card Component
function InsightCard({ text, color, delay }: { text: string; color: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="flex gap-4 group cursor-pointer"
    >
      <motion.div 
        whileHover={{ scale: 1.2 }}
        className={`mt-1 w-2 h-2 rounded-full ${color} shrink-0 group-hover:scale-150 transition-transform`}
      />
      <p className="text-gray-300 leading-relaxed font-serif italic text-base md:text-lg group-hover:text-white transition-colors">
        "{text}"
      </p>
    </motion.div>
  );
}

// Top Room Card
function TopRoomCard({ room, count, onClick }: { room: any; count: number; onClick: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80/10 to-white/80/5 border border-white/80/20 p-5 cursor-pointer group"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/80/20 blur-3xl rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} className="text-white/70" />
          <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Most Active</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/70 transition-colors">{room.name}</h3>
        <p className="text-xs text-gray-400 font-serif italic mb-3 line-clamp-2">{room.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-500">{count} artifacts this week</span>
          <span className="text-[10px] text-white/70 group-hover:translate-x-1 transition-transform">Explore →</span>
        </div>
      </div>
    </motion.div>
  );
}

// Week Progress Component
function WeekProgress() {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  
  const today = new Date();
  const daysPassed = Math.min(6, Math.max(0, Math.floor((today.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24))));
  const progress = (daysPassed / 6) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 mb-8"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-gray-500" />
          <span className="text-[9px] font-mono text-gray-500">Week Progress</span>
        </div>
        <span className="text-[9px] text-gray-600">
          {startOfWeek.toLocaleDateString()} - {endOfWeek.toLocaleDateString()}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-full bg-gradient-to-r from-white/80 to-white/80 rounded-full"
        />
      </div>
      <div className="flex justify-between mt-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <span key={day} className={`text-[8px] font-mono ${i === daysPassed ? 'text-white/70' : 'text-gray-600'}`}>
            {day}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Mood Distribution Component
function MoodDistribution({ entries }: { entries: any[] }) {
  const moodCounts = entries.reduce((acc, e) => {
    const mood = e.customMood || e.mood;
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (topMoods.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-white/[0.02] border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain size={12} className="text-white/70" />
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Top Moods</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topMoods.map(([mood, count]) => (
          <span key={mood} className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 border border-white/10">
            {mood} • {count}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Share Modal Component
function ShareModal({ onClose, stats }: { onClose: () => void; stats: { artifacts: number; journal: number; rooms: number } }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`My Muse Weekly Mirror: ${stats.artifacts} artifacts, ${stats.journal} journal entries, ${stats.rooms} rooms explored. #Muse #WeeklyMirror`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md z-10"
      >
        <div className="absolute -inset-4 bg-white/80/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative bg-gradient-to-br from-[#0f0f14] to-[#0a0a0f] border border-white/10 rounded-2xl p-6 overflow-hidden shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <X size={14} />
          </button>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80/10 border border-white/80/20 mb-4">
              <Sparkles size={12} className="text-white/70" />
              <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Share Your Week</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Weekly Mirror</h3>
            <p className="text-xs text-gray-500 mt-2 font-serif italic">Share your creative journey with the world</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <span className="text-xs text-gray-400">Artifacts saved</span>
              <span className="text-sm font-bold text-white">{stats.artifacts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <span className="text-xs text-gray-400">Journal entries</span>
              <span className="text-sm font-bold text-white">{stats.journal}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <span className="text-xs text-gray-400">Rooms explored</span>
              <span className="text-sm font-bold text-white">{stats.rooms}</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-white/80 to-white/80 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Share Text'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Mirror() {
  const navigate = useNavigate();
  const items = useItemsStore(s => s.items);
  const rooms = useRoomsStore(s => s.rooms);
  const entries = useJournalStore(s => s.entries);
  const totalArtifacts = useTotalArtifacts();
  const roomCount = useRoomCount();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const now = Date.now();
  const weekItems = useMemo(() => items.filter(i => now - i.createdAt < ONE_WEEK_MS), [items]);
  const weekEntries = useMemo(() => entries.filter(e => now - e.createdAt < ONE_WEEK_MS), [entries]);

  // Top room by activity this week
  const roomCounts = weekItems.reduce<Record<string, number>>((acc, i) => {
    acc[i.roomId] = (acc[i.roomId] || 0) + 1; 
    return acc;
  }, {});
  const topRoomId = Object.keys(roomCounts).sort((a, b) => roomCounts[b] - roomCounts[a])[0];
  const topRoom = rooms.find(r => r.id === topRoomId);

  const stats = [
    { label: 'Artifacts saved', value: weekItems.length, icon: Layers, color: 'text-white/70', bg: 'bg-white/80/10' },
    { label: 'Journal entries', value: weekEntries.length, icon: BookOpen, color: 'text-white/70', bg: 'bg-white/80/10' },
    { label: 'Rooms explored', value: new Set(weekItems.map(i => i.roomId)).size, icon: BarChart2, color: 'text-white/70', bg: 'bg-white/80/10' },
    { label: 'Public artifacts', value: weekItems.filter(i => i.isPublic).length, icon: TrendingUp, color: 'text-white/70', bg: 'bg-white/80/10' },
  ];

  const insights = [
    topRoom
      ? `You've been deeply exploring "${topRoom.name}" this week. ${roomCounts[topRoomId] || 0} artifacts captured.`
      : 'Start adding artifacts to rooms to see weekly insights here.',
    weekEntries.length > 0
      ? `You reflected ${weekEntries.length} time${weekEntries.length > 1 ? 's' : ''} in your Journal this week. That's meaningful.`
      : 'Try writing a journal entry — it sharpens clarity.',
    weekItems.length >= 5
      ? `You've been intentional — ${weekItems.length} items curated this week. Pattern recognition is forming.`
      : 'Collect more artifacts this week to start seeing patterns in your thinking.',
    totalArtifacts > 0
      ? `Across all time, you've curated ${totalArtifacts} artifacts across ${roomCount} rooms. A growing universe of ideas.`
      : 'Your collection is waiting to grow. Every artifact adds to your creative fingerprint.',
  ];

  const shareStats = {
    artifacts: weekItems.length,
    journal: weekEntries.length,
    rooms: new Set(weekItems.map(i => i.roomId)).size,
  };

  return (
    <div className="min-h-screen bg-[#050508] pb-24 overflow-hidden">
      <FloatingParticles />
      
      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/80/8 blur-[120px] rounded-full" />
      </motion.div>

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mirrorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mirrorGrid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 text-sm font-bold uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-xl bg-white/80/20 flex items-center justify-center"
            >
              <Sparkles size={20} className="text-white/70" />
            </motion.div>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">Weekly Mirror</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            This Week{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-500 italic font-serif">
              in Muse.
            </span>
          </h1>
          <p className="text-gray-500 font-serif italic text-base md:text-lg leading-relaxed max-w-xl">
            A curated reflection on your curation — the patterns your selections reveal about you.
          </p>
        </motion.div>

        {/* Week Progress */}
        <WeekProgress />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} stat={stat} index={i} delay={0.2} />
          ))}
        </div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/80/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Brain size={16} className="text-white/70" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Curator's Insights</h2>
            </div>
            <div className="space-y-5">
              {insights.map((text, i) => (
                <InsightCard 
                  key={i} 
                  text={text} 
                  color={i === 0 ? 'bg-white/70' : i === 1 ? 'bg-white/70' : i === 2 ? 'bg-white/70' : 'bg-white/70'}
                  delay={0.4 + i * 0.05}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Room Activity */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={12} className="text-white/70" />
                <h2 className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Room Activity This Week</h2>
              </div>
              <div className="space-y-2">
                {rooms.slice(0, 5).map(room => {
                  const count = roomCounts[room.id] || 0;
                  const max = Math.max(...Object.values(roomCounts), 1);
                  const pct = Math.round((count / max) * 100);
                  return (
                    <motion.button
                      key={room.id}
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => navigate(`/rooms/${room.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer text-left group"
                    >
                      <span className="text-xs font-medium text-white w-28 truncate shrink-0">{room.name}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="h-full bg-gradient-to-r from-white/80 to-white/80 rounded-full" 
                        />
                      </div>
                      <span className="text-[9px] font-mono text-gray-500 shrink-0 w-12 text-right">{count} items</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Top Room */}
            {topRoom && (
              <TopRoomCard 
                room={topRoom} 
                count={roomCounts[topRoomId]} 
                onClick={() => navigate(`/rooms/${topRoom.id}`)} 
              />
            )}
            
            {/* Mood Distribution */}
            <MoodDistribution entries={weekEntries} />
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Flame size={12} className="text-white/70" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Creative Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">12 <span className="text-xs text-gray-500">days</span></p>
              <p className="text-[9px] text-gray-600 mt-1">Keep going! You're building momentum.</p>
            </motion.div>
          </div>
        </div>

        {/* Share CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-bold uppercase tracking-widest text-[10px] rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 size={14} /> Share Your Week
          </motion.button>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} stats={shareStats} />}
      </AnimatePresence>
    </div>
  );
}