// src/features/journal/pages/Journal.tsx
import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, TrendingUp, Sparkles, ChevronLeft, ChevronRight, 
  Mic, X, Zap, Brain, Heart, Cloud, Sun, Moon, Star, 
  BookOpen, Clock, Calendar, Award, Flame, Type, Eye
} from 'lucide-react';
import { useJournalStore } from '../store/useJournalStore';
import MoodSelector from '../components/MoodSelector';
import InsightsPanel from '../components/InsightsPanel';
import VoiceRecorder from '../components/VoiceRecorder';
import SearchModal from '../components/SearchModal';
import { MoodType } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy data for preview
const dummyEntries = [
  {
    id: '1',
    title: 'The Future of Creative AI',
    content: 'Exploring how artificial intelligence is reshaping the way we create, think, and express ourselves. The boundaries between human and machine creativity are blurring.',
    mood: 'inspired' as MoodType,
    tags: ['ai', 'creativity', 'future'],
    date: '2024-01-15T10:00:00Z',
    wordCount: 245,
  },
  {
    id: '2',
    title: 'Morning Reflections',
    content: 'Woke up with a sense of clarity. The morning light felt different today. Maybe it\'s the start of something new.',
    mood: 'peaceful' as MoodType,
    tags: ['morning', 'reflection', 'peace'],
    date: '2024-01-14T08:30:00Z',
    wordCount: 128,
  },
  {
    id: '3',
    title: 'Overcoming Creative Blocks',
    content: 'Sometimes the best way to break through is to step away. Today I learned that rest is productive too.',
    mood: 'reflective' as MoodType,
    tags: ['creativity', 'growth', 'mindset'],
    date: '2024-01-13T15:20:00Z',
    wordCount: 189,
  },
  {
    id: '4',
    title: 'Late Night Coding Session',
    content: 'The code finally clicked at 2 AM. There\'s something magical about solving complex problems when the world is asleep.',
    mood: 'energetic' as MoodType,
    tags: ['coding', 'night', 'achievement'],
    date: '2024-01-12T02:00:00Z',
    wordCount: 312,
  },
  {
    id: '5',
    title: 'Anxiety Before Presentation',
    content: 'Big presentation tomorrow. The pressure is building but I know I\'m prepared. Just need to trust the process.',
    mood: 'anxious' as MoodType,
    tags: ['work', 'presentation', 'growth'],
    date: '2024-01-11T20:45:00Z',
    wordCount: 167,
  },
];

// Mood icon mapping
const moodIcons = {
  inspired: Zap,
  reflective: Brain,
  anxious: Heart,
  peaceful: Cloud,
  energetic: Sun,
};

const moodColors = {
  inspired: 'from-amber-500/30 to-orange-500/20',
  reflective: 'from-blue-500/30 to-indigo-500/20',
  anxious: 'from-red-500/30 to-pink-500/20',
  peaceful: 'from-emerald-500/30 to-teal-500/20',
  energetic: 'from-purple-500/30 to-fuchsia-500/20',
};

export default function Journal() {
  // Use dummy data for preview
  const [entries, setEntries] = useState(dummyEntries);
  const [insights] = useState([
    { id: '1', type: 'pattern', content: 'You tend to write more creatively during late night hours.', date: new Date().toISOString() },
    { id: '2', type: 'suggestion', content: 'Your inspired moods often lead to longer, more detailed entries.', date: new Date().toISOString() },
    { id: '3', type: 'summary', content: 'This week shows a pattern of creative exploration. Keep going!', date: new Date().toISOString() },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('reflective');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [heroEntry, setHeroEntry] = useState(dummyEntries[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate stats from dummy data
  const currentStats = {
    totalEntries: entries.length,
    currentStreak: 5,
    longestStreak: 12,
    totalWords: entries.reduce((sum, e) => sum + e.wordCount, 0),
    averageMood: 3.5,
    mostActiveHour: 22,
  };

  // Group entries by month
  const entriesByMonth = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowForm(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        mood,
        tags,
        date: new Date().toISOString(),
        wordCount: content.trim().split(/\s+/).length,
      };
      setEntries([newEntry, ...entries]);
      setTitle('');
      setContent('');
      setTags([]);
      setMood('reflective');
      setShowForm(false);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setContent(prev => prev + (prev ? ' ' : '') + text);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const scrollRow = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getFilteredEntries = () => {
    let filtered = entries;
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedMood) {
      filtered = filtered.filter(e => e.mood === selectedMood);
    }
    return filtered;
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {heroEntry && entries.length > 0 && (
        <div className="relative h-[65vh] md:h-[70vh] mb-12 group">
          <div className={`absolute inset-0 bg-gradient-to-r ${moodColors[heroEntry.mood]} z-10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
          
          <div className="absolute inset-0 flex items-center z-20 px-6 md:px-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white font-medium tracking-wide">
                  FEATURED ENTRY
                </span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = moodIcons[heroEntry.mood];
                    return <Icon size={20} className="text-white" />;
                  })()}
                  <span className="text-sm text-gray-300">
                    {new Date(heroEntry.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                {heroEntry.title}
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-3 max-w-xl">
                {heroEntry.content}
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition transform hover:scale-105 flex items-center gap-2">
                  <BookOpen size={18} />
                  Continue Reading
                </button>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Entry
                </button>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
      )}

      {/* Stats Row */}
      <div className="px-6 md:px-16 mb-10">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          <motion.div whileHover={{ y: -5 }} className="min-w-[180px] p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition">
            <BookOpen size={28} className="text-white mb-2" />
            <p className="text-3xl font-bold text-white">{currentStats.totalEntries}</p>
            <p className="text-xs text-gray-400 mt-1">Total Entries</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="min-w-[180px] p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition">
            <Flame size={28} className="text-orange-400 mb-2" />
            <p className="text-3xl font-bold text-white">{currentStats.currentStreak}</p>
            <p className="text-xs text-gray-400 mt-1">Day Streak</p>
            <p className="text-[10px] text-gray-600">Longest: {currentStats.longestStreak}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="min-w-[180px] p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition">
            <Type size={28} className="text-white mb-2" />
            <p className="text-3xl font-bold text-white">{currentStats.totalWords.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Total Words</p>
          </motion.div>
          <motion.button whileHover={{ y: -5 }} className="min-w-[180px] p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-white/30 transition group text-left">
            <Sparkles size={28} className="text-white mb-2 group-hover:scale-110 transition" />
            <p className="text-sm font-medium text-white">AI Insights</p>
            <p className="text-xs text-gray-400">View your patterns</p>
          </motion.button>
          <motion.button 
            whileHover={{ y: -5 }}
            onClick={() => setShowSearch(true)}
            className="min-w-[180px] p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition group text-left"
          >
            <Search size={28} className="text-white mb-2 group-hover:scale-110 transition" />
            <p className="text-sm font-medium text-white">Search</p>
            <p className="text-xs text-gray-400">Ctrl+K to search</p>
          </motion.button>
        </div>
      </div>

      {/* New Entry Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111318] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#111318] border-b border-white/10 p-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Write Your Thoughts</h3>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-white/40"
                  autoFocus
                />
                
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">How are you feeling?</label>
                  <MoodSelector selected={mood} onSelect={setMood} />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Tags</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add tags (press Enter)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/40"
                    />
                    <VoiceRecorder onTranscription={handleVoiceTranscription} />
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                          #{tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={8}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 resize-none"
                />
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={!title.trim() || !content.trim()}
                    className="flex-1 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50"
                  >
                    Save Entry
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-white/20 rounded-xl text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Rows - Netflix Style */}
      <div className="space-y-10 pb-16">
        {Object.entries(entriesByMonth).map(([month, monthEntries]) => (
          <div key={month} className="relative group/row">
            <div className="flex justify-between items-center px-6 md:px-16 mb-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{month}</h2>
              <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition">
                <button onClick={() => scrollRow('left')} className="p-2 bg-black/60 rounded-full hover:bg-white/20 backdrop-blur-sm transition">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => scrollRow('right')} className="p-2 bg-black/60 rounded-full hover:bg-white/20 backdrop-blur-sm transition">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-16"
              style={{ scrollBehavior: 'smooth' }}
            >
              {monthEntries.map((entry, index) => {
                const MoodIcon = moodIcons[entry.mood];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="min-w-[260px] md:min-w-[300px] group/card cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${moodColors[entry.mood]} opacity-30`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <MoodIcon size={24} className="text-white" />
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this entry?')) deleteEntry(entry.id);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover/card:opacity-100 transition hover:bg-red-500/50"
                      >
                        <X size={12} className="text-white" />
                      </button>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{entry.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2">{entry.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Type size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{entry.wordCount} words</span>
                          <span className="text-xs text-gray-600">•</span>
                          <Calendar size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] text-gray-500">#{tag}</span>
                            ))}
                            {entry.tags.length > 2 && (
                              <span className="text-[9px] text-gray-600">+{entry.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Right Sidebar - AI Insights */}
      <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-80 z-40">
        <div className="space-y-4">
          <InsightsPanel insights={insights} />
          
          <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-white" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total entries</span>
                <span className="text-white font-bold">{currentStats.totalEntries}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total words</span>
                <span className="text-white font-bold">{currentStats.totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current streak</span>
                <span className="text-white font-bold">{currentStats.currentStreak} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Longest streak</span>
                <span className="text-white font-bold">{currentStats.longestStreak} days</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Award size={16} className="text-white" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Writing Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">• <Sparkles size={12} /> Write without judgment</li>
              <li className="flex items-center gap-2">• <Heart size={12} /> Be specific about emotions</li>
              <li className="flex items-center gap-2">• <Eye size={12} /> Include sensory details</li>
              <li className="flex items-center gap-2">• <Star size={12} /> End with one insight</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Quick Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowForm(true)}
          className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
        >
          <Plus size={24} className="text-black" />
        </button>
      </div>

      {/* Voice Recorder Floating Button */}
      <div className="fixed bottom-6 left-6 z-50 lg:hidden">
        <VoiceRecorder onTranscription={handleVoiceTranscription} />
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        entries={entries}
        onSearch={(query, mood) => {
          setSearchQuery(query);
          setSelectedMood(mood);
        }}
      />

      {/* Empty State */}
      {entries.length === 0 && !showForm && (
        <div className="text-center py-32">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-6"
          >
            <BookOpen size={80} className="text-white/20 mx-auto" />
          </motion.div>
          <p className="text-gray-400 text-lg mb-3">Your journal is waiting</p>
          <p className="text-gray-500 text-sm mb-6">Start capturing your thoughts and reflections</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Write First Entry
          </button>
        </div>
      )}
    </div>
  );
}