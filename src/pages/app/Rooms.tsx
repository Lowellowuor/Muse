import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Globe, Lock, Plus, Sparkles, ArrowRight, Compass, Brain, Palette, 
  Music, BookOpen, MoreVertical, Copy, Trash2, Pin, PinOff, 
  Eye, EyeOff, RefreshCw, FolderOpen, Star, Search,
  Grid3x3, LayoutGrid, List, X, ChevronDown, Zap, Flame, TrendingUp
} from 'lucide-react';
import { useRoomsStore, type RoomTheme, useRoomCount, useTotalArtifacts } from '../../store/useRoomsStore';
import CreateRoomModal from '../../components/modals/CreateRoomModal';

// Theme configurations - Black & White theme
const themeGradients: Record<RoomTheme, string> = {
  
  emerald: 'from-white/90/40 via-white/90/20',
  amber: 'from-white/90/40 via-white/90/20',
  rose: 'from-white/90/40 via-white/90/20',
  cyan: 'from-white/70/40 via-white/70/20',
  slate: 'from-slate-600/40 via-slate-600/20',
  violet: 'from-white/90/40 via-white/90/20',
  pink: 'from-pink-600/40 via-pink-600/20',
  orange: 'from-orange-600/40 via-orange-600/20',
};

const themeColors: Record<RoomTheme, string> = {
  indigo: 'text-white/80 border-white/70/30',
  emerald: 'text-white/70 border-white/70/30',
  amber: 'text-white/70 border-white/70/30',
  rose: 'text-white/70 border-white/70/30',
  cyan: 'text-white/70 border-white/70/30',
  slate: 'text-slate-400 border-slate-400/30',
  violet: 'text-white/70 border-white/70/30',
  pink: 'text-pink-400 border-pink-400/30',
  orange: 'text-orange-400 border-orange-400/30',
};

// Remove themeGlows if not used, or add the missing themes
const themeGlows: Record<RoomTheme, string> = {
  indigo: 'shadow-white/10',
  emerald: 'shadow-white/80/20',
  amber: 'shadow-white/80/20',
  rose: 'shadow-white/80/20',
  cyan: 'shadow-white/80/20',
  slate: 'shadow-slate-500/20',
  violet: 'shadow-white/80/20',
  pink: 'shadow-pink-500/20',
  orange: 'shadow-orange-500/20',
};

// Floating decorative elements (no changes needed)
const FloatingDecorations = () => {
  const decorations = [
    { icon: Sparkles, delay: 0, x: "5%", y: "15%", size: 20, color: "text-white/80/20" },
    { icon: Compass, delay: 2, x: "92%", y: "25%", size: 24, color: "text-white/70/20" },
    { icon: Brain, delay: 4, x: "15%", y: "75%", size: 28, color: "text-white/70/20" },
    { icon: Palette, delay: 1, x: "85%", y: "85%", size: 22, color: "text-white/70/20" },
    { icon: Music, delay: 3, x: "45%", y: "10%", size: 26, color: "text-white/70/20" },
    { icon: BookOpen, delay: 5, x: "75%", y: "45%", size: 20, color: "text-white/70/20" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1, y: [el.y, `calc(${el.y} + 20px)`, el.y], x: [el.x, `calc(${el.x} + 15px)`, el.x] }}
          transition={{ delay: el.delay, duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', left: el.x, top: el.y }}
          className={`${el.color} drop-shadow-2xl`}
        >
          <el.icon size={el.size} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  );
};

// Room Menu Component (no changes needed)
function RoomMenu({ room, onClose }: { room: any; onClose: () => void }) {
  const toggleRoomPinned = useRoomsStore(state => state.toggleRoomPinned);
  const toggleRoomPrivacy = useRoomsStore(state => state.toggleRoomPrivacy);
  const duplicateRoom = useRoomsStore(state => state.duplicateRoom);
  const deleteRoom = useRoomsStore(state => state.deleteRoom);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      deleteRoom(room.id);
      onClose();
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute top-12 right-4 z-20 bg-[#1a1a1f] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[170px] backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => { toggleRoomPinned(room.id); onClose(); }}
        className="w-full px-4 py-2.5 text-left text-xs text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2.5"
      >
        {room.pinned ? <PinOff size={12} /> : <Pin size={12} />}
        {room.pinned ? 'Unpin Room' : 'Pin Room'}
      </button>
      <button
        onClick={() => { toggleRoomPrivacy(room.id); onClose(); }}
        className="w-full px-4 py-2.5 text-left text-xs text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2.5"
      >
        {room.isPublic ? <EyeOff size={12} /> : <Eye size={12} />}
        {room.isPublic ? 'Make Private' : 'Make Public'}
      </button>
      <button
        onClick={() => { duplicateRoom(room.id); onClose(); }}
        className="w-full px-4 py-2.5 text-left text-xs text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2.5"
      >
        <Copy size={12} />
        Duplicate Room
      </button>
      <div className="h-px bg-white/10 my-1" />
      <button
        onClick={handleDelete}
        className={`w-full px-4 py-2.5 text-left text-xs transition-colors flex items-center gap-2.5 ${showConfirm ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:bg-white/5'}`}
      >
        <Trash2 size={12} />
        {showConfirm ? 'Click again to confirm' : 'Delete Room'}
      </button>
    </motion.div>
  );
}

// Room Card Component - fixed the themeColor access
function RoomCard({ room, onClick, index }: { room: any; onClick: () => void; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Fixed: properly access themeColor with fallback
  const glowClass = themeGradients[room.themeColor as RoomTheme] || themeGradients.indigo;
  const themeColor = themeColors[room.themeColor as RoomTheme] || themeColors.indigo;

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative h-72 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500"
    >
      {/* Background Image with Parallax */}
      {room.coverImage ? (
        <motion.img 
          src={room.coverImage} 
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] to-[#0f0f14]" />
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${glowClass} via-[#0a0a0a]/60 to-[#0a0a0a] opacity-70 group-hover:opacity-90 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

      {/* Pinned Badge */}
      {room.pinned && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="absolute top-4 left-4 z-10 bg-white/80/20 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-white/70 border border-white/80/30 flex items-center gap-1"
        >
          <Star size={8} fill="currentColor" />
          Pinned
        </motion.div>
      )}

      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <MoreVertical size={12} />
        </motion.button>
        <AnimatePresence>
          {showMenu && <RoomMenu room={room} onClose={() => setShowMenu(false)} />}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border ${room.isPublic ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}
          >
            {room.isPublic ? (
              <span className="flex items-center gap-1"><Globe size={10} /> Public</span>
            ) : (
              <span className="flex items-center gap-1"><Lock size={10} /> Private</span>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring" }}
            className={`text-[10px] font-mono ${themeColor}`}
          >
            {room.count} artifacts
          </motion.div>
        </div>

        <div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="text-2xl font-bold tracking-tight text-white mb-2 drop-shadow-lg"
          >
            {room.name}
          </motion.h3>
          
          {room.description && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-sm font-serif italic line-clamp-2 leading-relaxed"
            >
              {room.description}
            </motion.p>
          )}
          
          {/* Tags */}
          {room.tags && room.tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-1 mt-2"
            >
              {room.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500">
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-[10px] text-gray-400">Explore room</span>
            <ArrowRight size={12} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty State Component (no changes needed)
function EmptyState({ onCreate }: { onCreate: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center py-20"
    >
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-white/80/20 to-white/80/20 flex items-center justify-center mx-auto mb-6 border border-white/10"
      >
        <FolderOpen size={32} className="text-white/80" />
      </motion.div>
      <h3 className="text-xl font-bold tracking-tight mb-2">No rooms yet</h3>
      <p className="text-gray-500 font-serif italic text-sm mb-6">Create your first expressive curation space</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreate}
        className="px-6 py-3 bg-gradient-to-r from-white/80 to-white/80 text-white font-semibold text-sm rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all cursor-pointer flex items-center gap-2 mx-auto"
      >
        <Plus size={16} />
        Create Your First Room
      </motion.button>
    </motion.div>
  );
}

// Stats Bar Component (no changes needed)
function StatsBar() {
  const roomCount = useRoomCount();
  const totalArtifacts = useTotalArtifacts();
  const getPublicRooms = useRoomsStore(state => state.getPublicRooms);
  const getPinnedRooms = useRoomsStore(state => state.getPinnedRooms);
  
  const publicCount = getPublicRooms().length;
  const pinnedCount = getPinnedRooms().length;

  const stats = [
    { label: 'Rooms', value: roomCount, icon: FolderOpen, color: 'text-white/80' },
    { label: 'Pinned', value: pinnedCount, icon: Star, color: 'text-white/70' },
    { label: 'Public', value: publicCount, icon: Globe, color: 'text-white/70' },
    { label: 'Artifacts', value: totalArtifacts, icon: Sparkles, color: 'text-white/70' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap gap-3 mb-8"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 + idx * 0.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
        >
          <stat.icon size={12} className={stat.color} />
          <span className="text-[10px] font-mono text-gray-400">
            <span className="text-white font-bold">{stat.value}</span> {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Search Bar Component (no changes needed)
function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <motion.div 
      animate={{ width: isExpanded ? 280 : 40 }}
      className="relative"
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => {
          if (query === '') setIsExpanded(false);
        }}
        placeholder="Search rooms..."
        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/80/50 transition-all"
      />
      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </motion.div>
  );
}

export default function Rooms() {
  const navigate = useNavigate();
  const rooms = useRoomsStore(state => state.rooms);
  const reset = useRoomsStore(state => state.reset);
  const [showCreate, setShowCreate] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPinned, setFilterPinned] = useState(false);
  const [filterPublic, setFilterPublic] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleReset = () => {
    if (showResetConfirm) {
      reset();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  // Filter and sort rooms
  const filteredRooms = rooms.filter(room => {
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterPinned && !room.pinned) return false;
    if (filterPublic && !room.isPublic) return false;
    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <AnimatePresence>
        {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>

      {/* Floating Decorations */}
      <FloatingDecorations />

      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full" />
      </motion.div>

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="roomGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roomGrid)" />
        </svg>
      </div>

      <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 relative z-10">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/80/20 mb-4"
              >
                <Sparkles size={12} className="text-white/80" />
                <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Curate • Express • Create</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                Your Rooms
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 font-serif italic"
              >
                Expressive, personal curation spaces for everything you collect.
              </motion.p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterPinned(!filterPinned)}
                  className={`p-2 rounded-xl transition-all ${filterPinned ? 'bg-white/80/20 text-white/70 border border-white/80/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                >
                  <Star size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterPublic(!filterPublic)}
                  className={`p-2 rounded-xl transition-all ${filterPublic ? 'bg-white/80/20 text-white/70 border border-white/80/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                >
                  <Globe size={16} />
                </motion.button>
                {(filterPinned || filterPublic) && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => { setFilterPinned(false); setFilterPublic(false); }}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </div>

              <SearchBar onSearch={setSearchQuery} />
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className={`hidden md:flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full transition-all cursor-pointer ${showResetConfirm ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <RefreshCw size={14} className={showResetConfirm ? 'animate-spin' : ''} />
                {showResetConfirm ? 'Click to confirm' : 'Reset'}
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white/80 to-white/80 text-white text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all cursor-pointer"
              >
                <Plus size={16} />
                New Room
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Stats Bar */}
        {rooms.length > 0 && <StatsBar />}

        {/* Rooms Grid */}
        {sortedRooms.length === 0 ? (
          searchQuery || filterPinned || filterPublic ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Search size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-serif italic">No rooms match your filters</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterPinned(false); setFilterPublic(false); }}
                className="mt-4 text-white/80 text-sm hover:text-white/70 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <EmptyState onCreate={() => setShowCreate(true)} />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedRooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
            
            {/* Create New Room Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: sortedRooms.length * 0.05, duration: 0.5, type: "spring" }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setShowCreate(true)}
              className="relative h-72 bg-transparent border-2 border-dashed border-white/10 rounded-3xl hover:border-white/40 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm"
            >
              <motion.div 
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 group-hover:border-white/70 flex items-center justify-center mb-4 transition-all duration-300"
              >
                <Plus size={24} className="text-gray-500 group-hover:text-white/80 transition-colors" />
              </motion.div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white/80 transition-colors">Create New Room</span>
              <p className="text-[10px] text-gray-600 mt-2 font-serif italic max-w-[200px] text-center">Curate your thoughts, ideas, and inspirations</p>
            </motion.div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}