import { useState } from 'react';
import { X, FileText, Image, Link as LinkIcon, Mic, Quote, File } from 'lucide-react';
import { Artifact } from '../../../types';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (artifact: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const artifactTypes = [
  { type: 'note' as const, icon: FileText, label: 'Note', emoji: '📝' },
  { type: 'image' as const, icon: Image, label: 'Image', emoji: '🖼️' },
  { type: 'link' as const, icon: LinkIcon, label: 'Link', emoji: '🔗' },
  { type: 'audio' as const, icon: Mic, label: 'Audio', emoji: '🎤' },
  { type: 'quote' as const, icon: Quote, label: 'Quote', emoji: '💬' },
  { type: 'document' as const, icon: File, label: 'Document', emoji: '📄' },
];

export default function AddArtifactModal({ isOpen, onClose, onAdd }: Props) {
  const [artifactType, setArtifactType] = useState<Artifact['type']>('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

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
    onAdd({
      type: artifactType,
      title: title.trim(),
      content: content.trim(),
      tags,
    });
    setTitle('');
    setContent('');
    setTags([]);
    setArtifactType('note');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111318] border border-white/10 rounded-2xl max-w-lg w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add Artifact</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        {/* Type Selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {artifactTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.type}
                onClick={() => setArtifactType(type.type)}
                className={`p-3 rounded-xl border transition-all ${
                  artifactType === type.type
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-1">{type.emoji}</div>
                <p className="text-xs text-gray-400">{type.label}</p>
              </button>
            );
          })}
        </div>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-3 focus:outline-none focus:border-white/40"
          autoFocus
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={4}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-3 focus:outline-none focus:border-white/40 resize-none"
        />
        
        <div className="flex items-center gap-2 mb-4">
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
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-white">×</button>
              </span>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="flex-1 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50"
          >
            Add Artifact
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-white/20 rounded-xl text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}