import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Heart, Globe, Edit2, 
  Trash2, X, Check, MoreVertical, Copy, Eye, EyeOff,
  Calendar, Clock, Tag, Brain, Save, Quote, 
  Sparkles, FolderOpen, Hash, Moon, Zap, Circle, Sun,
  Target, Search, Wind, Lightbulb
} from 'lucide-react';
import { useJournalStore, type JournalMood, moodColors } from '../../store/useJournalStore';

// Mood prompts with clean structure
const moodPrompts: Record<JournalMood, string[]> = {
  reflective: [
    "What patterns have you noticed in your thoughts lately?",
    "What would you tell your past self about today?",
    "What's a belief you're questioning right now?"
  ],
  grounded: [
    "What's anchoring you today?",
    "Name three things that feel solid in your life right now.",
    "What physical sensations are you aware of?"
  ],
  anxious: [
    "What's the smallest thing you can control right now?",
    "If this feeling had a shape, what would it look like?",
    "What would safety feel like in this moment?"
  ],
  grateful: [
    "What surprised you today?",
    "Who or what made your day lighter?",
    "What's something you almost missed but noticed?"
  ],
  melancholic: [
    "What memory are you carrying with you today?",
    "What does this feeling want you to remember?",
    "What beauty exists in this sadness?"
  ],
  charged: [
    "What's demanding your attention right now?",
    "If this energy had a voice, what would it say?",
    "What action wants to emerge from this feeling?"
  ],
  empty: [
    "What would presence feel like in this space?",
    "What are you waiting for?",
    "What would fill this emptiness, even slightly?"
  ],
  alive: [
    "What made you feel most present today?",
    "What's sparking your curiosity right now?",
    "Where did you feel most yourself today?"
  ],
  inspired: [
    "What idea wants to be explored?",
    "Who or what is calling to you right now?",
    "What would you create if you couldn't fail?"
  ],
  nostalgic: [
    "What moment from the past feels close today?",
    "What would you tell your younger self?",
    "What from then still lives in you now?"
  ],
  focused: [
    "What's one thing that deserves your full attention?",
    "What distractions can you set aside?",
    "What would clarity look like right now?"
  ],
  tender: [
    "What needs gentle attention today?",
    "Who could you offer kindness to?",
    "What would softness feel like right now?"
  ],
  curious: [
    "What question is your mind circling around?",
    "What would you like to understand better?",
    "What's something you've been wondering about lately?"
  ],
  peaceful: [
    "Where do you feel most at ease?",
    "What brings you calm right now?",
    "What does stillness feel like in your body?"
  ],
  restless: [
    "What's asking to move within you?",
    "Where do you feel the urge to go?",
    "What change wants to happen?"
  ],
  custom: [
    "What's on your mind today?",
    "What wants to be written?",
    "Start anywhere. Let it flow."
  ]
};

// Helper to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 15 + 10,
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

// Mood Selector Component
function MoodSelector({ selectedMood, onSelect, customMood, setCustomMood }: { 
  selectedMood: JournalMood; 
  onSelect: (mood: JournalMood) => void;
  customMood: string;
  setCustomMood: (mood: string) => void;
}) {
  const moods: { value: JournalMood; label: string; icon: React.ElementType }[] = [
    { value: 'reflective', label: 'Reflective', icon: Brain },
    { value: 'grounded', label: 'Grounded', icon: FolderOpen },
    { value: 'anxious', label: 'Anxious', icon: Sparkles },
    { value: 'grateful', label: 'Grateful', icon: Heart },
    { value: 'melancholic', label: 'Melancholic', icon: Moon },
    { value: 'charged', label: 'Charged', icon: Zap },
    { value: 'empty', label: 'Empty', icon: Circle },
    { value: 'alive', label: 'Alive', icon: Sun },
    { value: 'inspired', label: 'Inspired', icon: Lightbulb },
    { value: 'nostalgic', label: 'Nostalgic', icon: Clock },
    { value: 'focused', label: 'Focused', icon: Target },
    { value: 'tender', label: 'Tender', icon: Heart },
    { value: 'curious', label: 'Curious', icon: Search },
    { value: 'peaceful', label: 'Peaceful', icon: Wind },
    { value: 'restless', label: 'Restless', icon: Zap },
    { value: 'custom', label: 'Custom', icon: Edit2 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {moods.map((mood) => {
        const isSelected = selectedMood === mood.value;
        const MoodIcon = mood.icon;
        return (
          <button
            key={mood.value}
            onClick={() => onSelect(mood.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              isSelected 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <MoodIcon size={12} />
            <span>{mood.label}</span>
          </button>
        );
      })}
      {selectedMood === 'custom' && (
        <input
          type="text"
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          placeholder="Enter your mood..."
          className="px-3 py-1.5 rounded-lg text-xs bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
          autoFocus
        />
      )}
    </div>
  );
}

// Prompt Suggestions Component
function PromptSuggestions({ mood, onSelectPrompt }: { mood: JournalMood; onSelectPrompt: (prompt: string) => void }) {
  const prompts = moodPrompts[mood] || moodPrompts.reflective;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <Quote size={12} className="text-gray-500" />
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Writing Prompts</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(prompt)}
            className="text-xs text-left text-gray-400 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Tag Input Component
function TagInput({ tags, onAddTag, onRemoveTag }: { 
  tags: string[]; 
  onAddTag: (tag: string) => void; 
  onRemoveTag: (tag: string) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddTag(inputValue.trim().toLowerCase());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-gray-300 text-xs"
        >
          <Hash size={10} />
          {tag}
          <button onClick={() => onRemoveTag(tag)} className="hover:text-white ml-1">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag..."
        className="flex-1 min-w-[80px] bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
}

// Menu Component
function EntryMenu({ onClose, onDelete, onDuplicate, onTogglePrivacy, isPublic }: { 
  onClose: () => void; 
  onDelete: () => void; 
  onDuplicate: () => void;
  onTogglePrivacy: () => void;
  isPublic: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
      onClose();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-12 right-4 z-20 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[150px]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onDuplicate}
        className="w-full px-4 py-2 text-left text-xs text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2"
      >
        <Copy size={12} /> Duplicate
      </button>
      <button
        onClick={onTogglePrivacy}
        className="w-full px-4 py-2 text-left text-xs text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2"
      >
        {isPublic ? <EyeOff size={12} /> : <Eye size={12} />}
        {isPublic ? 'Make Private' : 'Make Public'}
      </button>
      <div className="h-px bg-white/10 my-1" />
      <button
        onClick={handleDelete}
        className={`w-full px-4 py-2 text-left text-xs transition-colors flex items-center gap-2 ${
          showConfirm ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:bg-white/5'
        }`}
      >
        <Trash2 size={12} />
        {showConfirm ? 'Confirm Delete' : 'Delete'}
      </button>
    </motion.div>
  );
}

export default function JournalEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const entry = useJournalStore(state => state.entries.find(e => e.id === id));
  const updateEntry = useJournalStore(state => state.updateEntry);
  const deleteEntry = useJournalStore(state => state.deleteEntry);
  const toggleFavorite = useJournalStore(state => state.toggleFavorite);
  const toggleEntryPrivacy = useJournalStore(state => state.toggleEntryPrivacy);
  const duplicateEntry = useJournalStore(state => state.duplicateEntry);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalMood>('reflective');
  const [customMood, setCustomMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setBody(entry.body);
      setSelectedMood(entry.mood);
      setCustomMood(entry.customMood || '');
      setTags(entry.tags || []);
    }
  }, [entry]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050508]">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
        >
          <BookOpen size={32} className="text-gray-500" />
        </motion.div>
        <p className="text-white text-lg">Entry not found</p>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/journal')} 
          className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Back to Journal
        </motion.button>
      </div>
    );
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = () => {
    updateEntry(entry.id, {
      title,
      body,
      mood: selectedMood,
      customMood: selectedMood === 'custom' ? customMood : undefined,
      tags,
    });
    setIsEditing(false);
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSelectPrompt = (prompt: string) => {
    setBody(prev => prev ? `${prev}\n\n${prompt}` : prompt);
  };

  const handleDuplicate = () => {
    const newEntry = duplicateEntry(entry.id);
    if (newEntry) {
      navigate(`/journal/${newEntry.id}`);
    }
    setShowMenu(false);
  };

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

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/journal')} 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </motion.button>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-500" />
            <div>
              <h1 className="text-sm font-medium text-white">
                {entry.title || 'Untitled'}
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span>{formatDate(entry.createdAt)}</span>
                <span>•</span>
                <span>{wordCount} words</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFavorite(entry.id)}
            className="p-2 rounded-lg transition-all"
          >
            <Heart size={16} className={entry.isFavorited ? 'fill-white text-white' : 'text-gray-500'} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
          >
            {isEditing ? <Check size={14} className="text-white" /> : <Edit2 size={14} className="text-gray-400" />}
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 bg-white/5 border border-white/10 rounded-lg"
            >
              <MoreVertical size={14} className="text-gray-400" />
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <EntryMenu
                  onClose={() => setShowMenu(false)}
                  onDelete={() => deleteEntry(entry.id)}
                  onDuplicate={handleDuplicate}
                  onTogglePrivacy={() => toggleEntryPrivacy(entry.id)}
                  isPublic={entry.isPublic}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
              className="w-full text-3xl font-light bg-transparent border-none focus:outline-none text-white placeholder-gray-700"
              autoFocus
            />

            {/* Mood Selector */}
            <MoodSelector
              selectedMood={selectedMood}
              onSelect={setSelectedMood}
              customMood={customMood}
              setCustomMood={setCustomMood}
            />

            {/* Prompt Suggestions */}
            <PromptSuggestions mood={selectedMood} onSelectPrompt={handleSelectPrompt} />

            {/* Body Textarea */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your thoughts..."
              rows={12}
              className="w-full bg-transparent border-none focus:outline-none text-gray-300 text-base leading-relaxed placeholder-gray-700 resize-none"
            />

            {/* Tags Input */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-2 flex items-center gap-2">
                <Tag size={10} /> Tags
              </label>
              <TagInput tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Save size={14} /> Save
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Title */}
            <h1 className="text-3xl font-light text-white">
              {entry.title || 'Untitled'}
            </h1>

            {/* Mood Badge */}
            <div className="flex items-center gap-2">
              <Brain size={12} className="text-gray-500" />
              <span className="text-xs text-gray-400">
                {entry.customMood || entry.mood}
              </span>
            </div>

            {/* Body */}
            <div className="prose prose-invert max-w-none">
              {entry.body.split('\n').map((paragraph, i) => (
                <p key={i} className="text-gray-300 text-base leading-relaxed mb-4">
                  {paragraph || '\u00A0'}
                </p>
              ))}
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {entry.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-white/5 text-gray-500">
                    <Hash size={8} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Stats */}
            <div className="flex items-center gap-4 pt-4 text-gray-600 text-xs border-t border-white/10">
              <div className="flex items-center gap-1">
                <Calendar size={10} />
                <span>{formatDate(entry.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={10} />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={10} />
                <span>{wordCount} words</span>
              </div>
              {entry.isPublic && (
                <div className="flex items-center gap-1">
                  <Globe size={10} />
                  <span>Public</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}