import { useState } from 'react';
import { X, FolderLock, Palette, Zap, Archive, Users } from 'lucide-react';
import { RoomType } from '../../../types';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, type: RoomType) => void;
}

const roomTypes = [
  { type: 'vault' as const, icon: FolderLock, label: 'Vault', description: 'Personal storage', color: 'from-gray-500 to-gray-600' },
  { type: 'gallery' as const, icon: Palette, label: 'Gallery', description: 'Visual collection', color: 'from-purple-500 to-pink-500' },
  { type: 'studio' as const, icon: Zap, label: 'Studio', description: 'Active projects', color: 'from-amber-500 to-orange-500' },
  { type: 'archive' as const, icon: Archive, label: 'Archive', description: 'Reference material', color: 'from-blue-500 to-cyan-500' },
  { type: 'collab' as const, icon: Users, label: 'Collab', description: 'Shared spaces', color: 'from-emerald-500 to-teal-500' },
];

export default function CreateRoomModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RoomType>('vault');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim(), type);
    setName('');
    setDescription('');
    setType('vault');
    onClose();
  };

  const selectedType = roomTypes.find(rt => rt.type === type);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111318] border border-white/10 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${selectedType?.color} bg-opacity-20`}>
              {selectedType && <selectedType.icon size={18} className="text-white" />}
            </div>
            <h2 className="text-xl font-bold text-white">Create New Room</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Room Type Selection */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Room Type</label>
            <div className="grid grid-cols-2 gap-2">
              {roomTypes.map(rt => {
                const Icon = rt.icon;
                return (
                  <button
                    key={rt.type}
                    onClick={() => setType(rt.type)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      type === rt.type
                        ? `bg-gradient-to-r ${rt.color} border-transparent text-white`
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    <div className="text-left">
                      <p className="text-xs font-medium">{rt.label}</p>
                      <p className="text-[9px] opacity-70">{rt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
            autoFocus
          />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
          />
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50"
            >
              Create Room
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-white/20 rounded-xl text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}