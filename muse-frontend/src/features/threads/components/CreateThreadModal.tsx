import { useState } from 'react';
import { X, Zap, Brain, Heart, Cloud, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThreadType, ThreadMood } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (thread: any) => void;
}

const threadTypes: { value: ThreadType; label: string; icon: string; description: string }[] = [
  { value: 'discussion', label: 'Discussion', icon: '💬', description: 'Open-ended conversation' },
  { value: 'question', label: 'Question', icon: '❓', description: 'Seeking answers/advice' },
  { value: 'resource', label: 'Resource', icon: '📚', description: 'Sharing knowledge' },
  { value: 'poll', label: 'Poll', icon: '📊', description: 'Community voting' },
  { value: 'announcement', label: 'Announcement', icon: '📢', description: 'Important updates' },
];

const threadMoods: { value: ThreadMood; label: string; icon: any; color: string }[] = [
  { value: 'curious', label: 'Curious', icon: Zap, color: 'from-cyan-500 to-blue-500' },
  { value: 'contemplative', label: 'Contemplative', icon: Brain, color: 'from-purple-500 to-indigo-500' },
  { value: 'hopeful', label: 'Hopeful', icon: Sun, color: 'from-emerald-500 to-green-500' },
  { value: 'urgent', label: 'Urgent', icon: Heart, color: 'from-red-500 to-pink-500' },
  { value: 'dark', label: 'Dark', icon: Cloud, color: 'from-gray-500 to-gray-600' },
  { value: 'serene', label: 'Serene', icon: Moon, color: 'from-teal-500 to-cyan-500' },
];

export default function CreateThreadModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ThreadType>('discussion');
  const [mood, setMood] = useState<ThreadMood>('curious');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    
    onCreate({
      title: title.trim(),
      content: content.trim(),
      type,
      mood,
      tags,
      isPublic,
      author: { id: 'current-user', name: 'You', avatar: '' },
    });
    
    setTitle('');
    setContent('');
    setTags([]);
    setType('discussion');
    setMood('curious');
    onClose();
  };

  const selectedMood = threadMoods.find(m => m.value === mood)!;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111318] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#111318] border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Start a New Thread</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Thread Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">Thread Type</label>
            <div className="grid grid-cols-5 gap-2">
              {threadTypes.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    type === t.value ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <p className="text-xs text-gray-300">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Thread Mood */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">Thread Mood</label>
            <div className="grid grid-cols-3 gap-2">
              {threadMoods.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                      mood === m.value ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <span className="text-sm text-white">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to discuss?"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-white/40"
              autoFocus
            />
          </div>
          
          {/* Content */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or insights..."
              rows={6}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 resize-none"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Tags</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tags (press Enter)"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/40"
              />
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
          
          {/* Visibility */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-sm font-medium text-white">Public Thread</p>
              <p className="text-xs text-gray-400">Anyone can view and participate</p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition ${isPublic ? 'bg-white' : 'bg-white/20'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-black transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="flex-1 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50"
            >
              Create Thread
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-white/20 rounded-xl text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}