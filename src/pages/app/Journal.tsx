import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Flame, Target, BookOpen, ArrowRight, Sparkles, 
  BarChart3, Calendar, Download, Star, X, Heart, Clock, 
  TrendingUp, Activity, Smile, Frown, Zap, Wind, 
  Moon, Sun, Coffee, Compass, Eye, Trash2, Edit3,
  Filter, Sliders, ChevronDown, Check, Circle, MoreHorizontal
} from 'lucide-react';
import { useJournalStore, type JournalMood, type JournalEntry } from '../../store/useJournalStore';

// Mood configuration with icons instead of emojis
export const moodConfig: Record<JournalMood, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  reflective:  { label: 'Reflective',  color: '#8b5cf6', icon: Moon, bg: 'bg-white/80/10' },
  grounded:    { label: 'Grounded',    color: '#10b981', icon: Coffee, bg: 'bg-white/80/10' },
  anxious:     { label: 'Anxious',     color: '#f43f5e', icon: Zap, bg: 'bg-white/80/10' },
  grateful:    { label: 'Grateful',    color: '#f59e0b', icon: Star, bg: 'bg-white/80/10' },
  melancholic: { label: 'Melancholic', color: '#64748b', icon: Wind, bg: 'bg-slate-500/10' },
  charged:     { label: 'Charged',     color: '#06b6d4', icon: Activity, bg: 'bg-white/80/10' },
  empty:       { label: 'Empty',       color: '#374151', icon: Circle, bg: 'bg-gray-500/10' },
  alive:       { label: 'Alive',       color: '#84cc16', icon: Sun, bg: 'bg-lime-500/10' },
  inspired:    { label: 'Inspired',    color: '#e879f9', icon: Sparkles, bg: 'bg-fuchsia-500/10' },
  nostalgic:   { label: 'Nostalgic',   color: '#fb923c', icon: Clock, bg: 'bg-orange-500/10' },
  focused:     { label: 'Focused',     color: '#38bdf8', icon: Target, bg: 'bg-sky-500/10' },
  tender:      { label: 'Tender',      color: '#f472b6', icon: Heart, bg: 'bg-pink-500/10' },
  curious:     { label: 'Curious',     color: '#14b8a6', icon: Compass, bg: 'bg-teal-500/10' },
  peaceful:    { label: 'Peaceful',    color: '#94a3b8', icon: Smile, bg: 'bg-slate-400/10' },
  restless:    { label: 'Restless',    color: '#ea580c', icon: Wind, bg: 'bg-orange-600/10' },
  custom:      { label: 'Other',       color: '#9ca3af', icon: Circle, bg: 'bg-gray-500/10' },
};

function timeFormat(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function excerpt(body: string, chars = 160): string {
  const text = body.replace(/\n+/g, ' ').trim();
  return text.length > chars ? text.slice(0, chars) + '…' : text;
}

const PROMPTS: string[] = [
  "What's one thing you observed today that felt significant?",
  "What's a thought you've been circling back to lately?",
  "What are you currently learning or unlearning?",
  "What does your intuition tell you about tomorrow?",
  "What's something you want to remember from today?",
];

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
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
            opacity: [0, 0.1, 0],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

// Journal Entry Card Component
function JournalCard({ entry, index, getTitle, onSelect }: { 
  entry: JournalEntry; 
  index: number; 
  getTitle: (e: JournalEntry) => string;
  onSelect: () => void;
}) {
  const cfg = moodConfig[entry.mood] || moodConfig.reflective;
  const title = getTitle(entry);
  const MoodIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className="break-inside-avoid group relative bg-gradient-to-br from-[#111318] to-[#0f0f14] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-white/20 hover:bg-[#15181e] transition-all duration-300"
    >
      {entry.isFavorited && (
        <div className="absolute top-5 right-5 z-20">
          <Star size={14} fill="#f59e0b" className="text-[#f59e0b]" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${cfg.color}20` }}
          >
            <MoodIcon size={14} style={{ color: cfg.color }} />
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            {timeFormat(entry.updatedAt)}
          </span>
        </div>

        <h3 className="text-white font-semibold text-lg leading-tight tracking-tight mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
          {title || <span className="opacity-40 italic">Untitled</span>}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt(entry.body)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500">{entry.wordCount} words</span>
            {entry.tags?.length > 0 && (
              <div className="flex items-center gap-1">
                {entry.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ArrowRight size={12} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Journal() {
  const navigate = useNavigate();
  const entries = useJournalStore(state => state.entries);
  const addEntry = useJournalStore(state => state.addEntry);
  const getTitle = useJournalStore(state => state.getTitle);
  const getStreak = useJournalStore(state => state.getStreak);
  const getTodayWordCount = useJournalStore(state => state.getTodayWordCount);
  const dailyWordGoal = useJournalStore(state => state.dailyWordGoal);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState<JournalMood | 'all'>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const streak = getStreak();
  const todayWords = getTodayWordCount();
  const goalProgress = Math.min(100, (todayWords / dailyWordGoal) * 100);

  const filtered = entries.filter(e => {
    const matchSearch = search === '' ||
      e.body.toLowerCase().includes(search.toLowerCase()) ||
      getTitle(e).toLowerCase().includes(search.toLowerCase()) ||
      e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchMood = filterMood === 'all' || e.mood === filterMood;
    const matchFav = !showFavorites || e.isFavorited;
    return matchSearch && matchMood && matchFav;
  });

  const moodStats = useMemo(() => {
    const stats: Record<string, number> = {};
    entries.forEach(e => {
      stats[e.mood] = (stats[e.mood] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const handleNewEntry = () => {
    const entry = addEntry();
    navigate(`/journal/${entry.id}`);
  };

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col justify-center items-center px-6 relative overflow-hidden">
        <FloatingParticles />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8"
        >
          <BookOpen size={36} className="text-white/60" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-light mb-3 text-white"
        >
          Journal
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center max-w-md mb-8"
        >
          A private space for reflection and thought.
        </motion.p>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewEntry}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Write First Entry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      <FloatingParticles />
      
      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full" />
      </motion.div>

      <div className="relative z-10 px-6 md:px-10 pt-8 pb-20 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-light text-white mb-1">Journal</h1>
            <p className="text-gray-500 text-sm">Daily reflections and thoughts</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <Flame size={14} className={streak > 0 ? "text-orange-400" : "text-gray-600"} />
              <span className="text-sm text-white">{streak}</span>
              <span className="text-[10px] text-gray-500">day streak</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <Target size={14} className="text-white/60" />
              <span className="text-sm text-white">{todayWords}</span>
              <span className="text-[10px] text-gray-500">/{dailyWordGoal}</span>
            </div>

            <button
              onClick={handleNewEntry}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
              New Entry
            </button>
          </div>
        </motion.div>

        {/* Insights Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInsights(!showInsights)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors mb-6"
        >
          <BarChart3 size={12} />
          {showInsights ? 'Hide Insights' : 'Show Insights'}
        </motion.button>

        {/* Insights Panel */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mood Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs font-medium text-gray-400 mb-4 flex items-center gap-2">
                    <Activity size={12} /> Mood Distribution
                  </h3>
                  <div className="space-y-3">
                    {moodStats.slice(0, 5).map(([mood, count]) => {
                      const cfg = moodConfig[mood as JournalMood] || moodConfig.reflective;
                      const percent = Math.round((count / entries.length) * 100);
                      const MoodIcon = cfg.icon;
                      return (
                        <div key={mood} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-2 text-gray-400">
                              <MoodIcon size={12} style={{ color: cfg.color }} />
                              {cfg.label}
                            </span>
                            <span className="text-gray-500">{count}</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full rounded-full" 
                              style={{ backgroundColor: cfg.color }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs font-medium text-gray-400 mb-4 flex items-center gap-2">
                    <TrendingUp size={12} /> Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total entries</span>
                      <span className="text-white">{entries.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total words</span>
                      <span className="text-white">{entries.reduce((sum, e) => sum + e.wordCount, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Favorites</span>
                      <span className="text-white">{entries.filter(e => e.isFavorited).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className={`relative flex items-center border ${isSearchFocused ? 'border-white/20' : 'border-white/10'} bg-white/5 rounded-xl transition-all`}>
            <Search size={16} className="absolute left-4 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search entries..."
              className="w-full bg-transparent pl-10 pr-12 py-3 text-white text-sm placeholder-gray-600 focus:outline-none"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              showFavorites 
                ? 'bg-white/10 text-white border border-white/20' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Star size={12} />
            Favorites
          </button>

          <div className="w-px h-4 bg-white/10" />

          <button
            onClick={() => { setFilterMood('all'); setShowFavorites(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              filterMood === 'all' && !showFavorites
                ? 'bg-white text-black'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            All
          </button>

          {(Object.entries(moodConfig) as [JournalMood, typeof moodConfig[JournalMood]][])
            .filter(([m]) => m !== 'custom')
            .slice(0, 6)
            .map(([mood, cfg]) => {
              const MoodIcon = cfg.icon;
              return (
                <button
                  key={mood}
                  onClick={() => setFilterMood(filterMood === mood ? 'all' : mood)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    filterMood === mood
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <MoodIcon size={12} />
                  {cfg.label}
                </button>
              );
            })}
        </motion.div>

        {/* Prompt of the Day */}
        {!search && !showFavorites && filterMood === 'all' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div 
              onClick={handleNewEntry}
              className="group cursor-pointer flex items-center gap-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-white/60" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Writing Prompt</p>
                <p className="text-white text-sm">"{PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length]}"</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          </motion.div>
        )}

        {/* Journal Feed */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={32} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">No entries found</p>
            <button 
              onClick={() => { setSearch(''); setFilterMood('all'); setShowFavorites(false); }} 
              className="mt-3 text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((entry, i) => (
              <JournalCard 
                key={entry.id}
                entry={entry}
                index={i}
                getTitle={getTitle}
                onSelect={() => navigate(`/journal/${entry.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}