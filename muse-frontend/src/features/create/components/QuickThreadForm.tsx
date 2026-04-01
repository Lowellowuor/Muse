import { useState } from 'react';
import { X, Sparkles, MessageCircle, HelpCircle, Library, Zap, Brain, Sun, Moon, Cloud, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThreadType, ThreadMood } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; type: ThreadType; mood: ThreadMood; tags: string[] }) => void;
}

const threadTypes: { value: ThreadType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'discussion', label: 'Discussion', icon: MessageCircle, color: 'from-blue-500 to-cyan-500' },
  { value: 'question', label: 'Question', icon: HelpCircle, color: 'from-purple-500 to-pink-500' },
  { value: 'resource', label: 'Resource', icon: Library, color: 'from-emerald-500 to-teal-500' },
  { value: 'poll', label: 'Poll', icon: Heart, color: 'from-orange-500 to-red-500' },
  { value: 'announcement', label: 'Announcement', icon: Zap, color: 'from-yellow-500 to-amber-500' },
];

const threadMoods: { value: ThreadMood; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'curious', label: 'Curious', icon: Search, color: 'from-cyan-500 to-blue-500' },
  { value: 'contemplative', label: 'Contemplative', icon: Brain, color: 'from-purple-500 to-indigo-500' },
  { value: 'hopeful', label: 'Hopeful', icon: Sun, color: 'from-amber-500 to-orange-500' },
  { value: 'urgent', label: 'Urgent', icon: Zap, color: 'from-red-500 to-pink-500' },
  { value: 'dark', label: 'Dark', icon: Moon, color: 'from-gray-600 to-gray-800' },
  { value: 'serene', label: 'Serene', icon: Cloud, color: 'from-teal-500 to-cyan-500' },
];

// Import Search icon since it's used above
import { Search } from 'lucide-react';

export default function QuickThreadForm({ isOpen, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ThreadType>('discussion');
  const [mood, setMood] = useState<ThreadMood>('curious');
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
      onSubmit({ title: title.trim(), content: content.trim(), type, mood, tags });
      setTitle('');
      setContent('');
      setTags([]);
      setType('discussion');
      setMood('curious');
      onClose();
    }
  };

  const selectedMood = threadMoods.find(m => m.value === mood);
  const selectedType = threadTypes.find(t => t.value === type);

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
            <h2 className="text-lg font-bold text-white">Start a Thread</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Thread Type Selection */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Thread Type</label>
            <div className="grid grid-cols-2 gap-2">
              {threadTypes.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                      type === t.value
                        ? `bg-gradient-to-r ${t.color} border-transparent text-white`
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="text-xs">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread Mood Selection */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Thread Mood</label>
            <div className="grid grid-cols-3 gap-2">
              {threadMoods.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                      mood === m.value
                        ? `bg-gradient-to-r ${m.color} border-transparent text-white`
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread title"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
            autoFocus
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to discuss?"
            rows={4}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
          />
          
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="Press Enter to add tags"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
            />
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
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="flex-1 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50"
            >
              Create Thread
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