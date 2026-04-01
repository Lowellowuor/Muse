import { useState } from 'react';
import { X, Sparkles, Zap, Brain, Cloud, Search, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { MoodType } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; mood: MoodType; tags: string[] }) => void;
}

const moods: { value: MoodType; icon: React.ElementType; label: string; color: string }[] = [
  { value: 'inspired', icon: Zap, label: 'Inspired', color: 'from-amber-500 to-orange-500' },
  { value: 'reflective', icon: Brain, label: 'Reflective', color: 'from-blue-500 to-indigo-500' },
  { value: 'peaceful', icon: Cloud, label: 'Peaceful', color: 'from-emerald-500 to-teal-500' },
  { value: 'curious', icon: Search, label: 'Curious', color: 'from-cyan-500 to-blue-500' },
  { value: 'energetic', icon: Sun, label: 'Energetic', color: 'from-purple-500 to-pink-500' },
];

export default function QuickJournalForm({ isOpen, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('reflective');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({ title: title.trim(), content: content.trim(), mood, tags });
      setTitle('');
      setContent('');
      setTags([]);
      setMood('reflective');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111318] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#111318] border-b border-white/10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-white" />
            <h2 className="text-lg font-bold text-white">Quick Journal Entry</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
            autoFocus
          />
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">How are you feeling?</label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                      mood === m.value
                        ? `bg-gradient-to-br ${m.color} text-white`
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Icon size={18} />
                    <div className="text-[10px]">{m.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tags</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Press Enter to add tags"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                    #{tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            rows={5}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="flex-1 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50"
            >
              Save Entry
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/20 rounded-xl text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}