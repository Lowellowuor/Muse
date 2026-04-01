import { useState } from 'react';
import { Pin, Trash2, Copy, Archive, MoreVertical, FileText, Image, Link as LinkIcon, Mic, Quote, File } from 'lucide-react';
import { Room } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  room: Room;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onClick: (id: string) => void;
}

const artifactIcons = {
  note: FileText,
  image: Image,
  link: LinkIcon,
  audio: Mic,
  quote: Quote,
  document: File,
};

export default function RoomCard({ room, onPin, onDelete, onDuplicate, onArchive, onClick }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  
  const getArtifactIcon = (type: string) => {
    const Icon = artifactIcons[type as keyof typeof artifactIcons] || FileText;
    return <Icon size={12} className="text-gray-500" />;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all relative cursor-pointer"
      onClick={() => onClick(room.id)}
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={14} className="text-gray-400" />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-0 mt-2 w-36 bg-[#111318] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(room.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:bg-white/10 flex items-center gap-2"
              >
                <Copy size={12} /> Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(room.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:bg-white/10 flex items-center gap-2"
              >
                <Archive size={12} /> Archive
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this room?')) onDelete(room.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Pin Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin(room.id);
        }}
        className="absolute top-4 left-4 p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
      >
        <Pin size={14} className={room.pinned ? 'text-white fill-white' : 'text-gray-400'} />
      </button>
      
      {/* Room Icon */}
      <div className="text-5xl mb-4">{room.icon}</div>
      
      {/* Room Info */}
      <h3 className="text-xl font-bold text-white mb-2 pr-8">{room.name}</h3>
      {room.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{room.description}</p>
      )}
      
      {/* Tags */}
      {room.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {room.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] text-gray-500">#{tag}</span>
          ))}
        </div>
      )}
      
      {/* Stats */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          {Object.entries(room.artifacts.reduce((acc, a) => {
            acc[a.type] = (acc[a.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)).slice(0, 3).map(([type, count]) => (
            <div key={type} className="flex items-center gap-1">
              {getArtifactIcon(type)}
              <span className="text-xs text-gray-500">{count}</span>
            </div>
          ))}
          {room.artifacts.length > 3 && (
            <span className="text-xs text-gray-600">+{room.artifacts.length - 3}</span>
          )}
        </div>
        <span className="text-xs text-gray-600">
          {new Date(room.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}