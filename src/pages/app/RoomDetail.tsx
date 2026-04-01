import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRoomsStore, type RoomTheme } from '../../store/useRoomsStore';
import { useItemsStore } from '../../store/useItemsStore';
import {
  ArrowLeft, Globe, Lock, Palette, Check, Camera,
  Edit2, Share2, Plus, ExternalLink, Trash2, X,
  Sparkles, BookOpen, Link2, Star, Eye, EyeOff,
  MoreVertical, Copy, Pin, PinOff, Zap, Flame
} from 'lucide-react';
import EditRoomModal from '../../components/modals/EditRoomModal';

const themeMapping: Record<RoomTheme, {
  border: string; shadow: string; text: string; bg: string; fill: string; glow: string; gradient: string;
}> = {
  
  
  
  
  
  
};

const paletteColors: { name: RoomTheme; hex: string }[] = [
  { name: 'white', hex: '#ffffff' }, 
   
   
];

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
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
          className="absolute w-0.5 h-0.5 rounded-full bg-white/20"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

// Artifact Card Component
function ArtifactCard({ item, theme, onDelete, index }: { 
  item: any; 
  theme: any; 
  onDelete: () => void;
  index: number;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  
  const getHostname = (url: string) => {
    try { return new URL(url).hostname.replace('www.', ''); } 
    catch { return url.split('/')[2] || url; }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-gradient-to-br from-white/[0.02] to-white/[0.01] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-xl"
    >
      {/* Visual Header with Animated Gradient */}
      <div className="relative h-28 bg-white/5 overflow-hidden">
        <motion.div 
          animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 0.2 : 0.1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-30"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/5 to-transparent" />
        <a 
          href={item.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink size={13} />
        </a>
        <div className="absolute bottom-3 left-3">
          <div className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[8px] font-bold text-white/60">
            {item.type || 'link'}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-bold text-base leading-tight mb-2 text-white/90 group-hover:text-white transition-colors line-clamp-2">
          {item.title}
        </h4>
        {item.note && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3 font-serif italic border-l-2 border-white/10 pl-3">
            "{item.note}"
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <a 
            href={item.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] uppercase font-bold tracking-wider truncate max-w-[65%] text-white/60 hover:text-white/80 cursor-pointer flex items-center gap-1"
          >
            <Link2 size={10} />
            {getHostname(item.sourceUrl)}
          </a>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Stats Bar Component
function StatsBar({ itemCount }: { itemCount: number; theme: any }) {
  const stats = [
    { label: 'Artifacts', value: itemCount, icon: BookOpen },
    { label: 'Views', value: 124, icon: Eye },
    { label: 'Insights', value: 8, icon: Sparkles },
    { label: 'Energy', value: 94, icon: Zap },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + idx * 0.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <stat.icon size={12} className="text-white/60" />
          <span className="text-[10px] font-mono text-gray-400">
            <span className="text-white font-bold">{stat.value}</span> {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const room = useRoomsStore(state => state.rooms.find(r => r.id === id));
  const updateRoomTheme = useRoomsStore(state => state.updateRoomTheme);
  const updateRoomCover = useRoomsStore(state => state.updateRoomCover);
  const toggleRoomPrivacy = useRoomsStore(state => state.toggleRoomPrivacy);
  const updateRoomCount = useRoomsStore(state => state.updateRoomCount);

  const allItems = useItemsStore(state => state.items);
  const items = React.useMemo(() => allItems.filter(i => i.roomId === id), [allItems, id]);
  const addItem = useItemsStore(state => state.addItem);
  const deleteItem = useItemsStore(state => state.deleteItem);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addError, setAddError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!room) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-500"
      >
        <BookOpen size={32} />
      </motion.div>
      <p className="text-2xl font-bold text-white tracking-tight">Room not found.</p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/rooms')} 
        className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:shadow-lg transition-all"
      >
        Back to Rooms
      </motion.button>
    </div>
  );

  const theme = themeMapping[room.themeColor] || themeMapping.indigo;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateRoomCover(room.id, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (!newTitle.trim()) { setAddError('Title is required.'); return; }
    if (!newUrl.trim()) { setAddError('URL / link is required.'); return; }
    let sourceUrl = newUrl.trim();
    if (!/^https?:\/\//.test(sourceUrl)) sourceUrl = 'https://' + sourceUrl;
    
    addItem({ 
      roomId: room.id, 
      title: newTitle.trim(), 
      sourceUrl, 
      note: newNote.trim() || undefined, 
      isPublic: false,
      type: 'link',
      tags: []
    });
    updateRoomCount(room.id, 1);
    
    setNewTitle(''); setNewUrl(''); setNewNote(''); setAddError('');
    setShowAddItem(false);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
    updateRoomCount(room.id, -1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  return (
    <>
      <FloatingParticles />
      
      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full" />
      </motion.div>

      {isEditOpen && (
        <EditRoomModal
          room={room}
          onClose={() => setIsEditOpen(false)}
          onDeleted={() => navigate('/rooms')}
        />
      )}

      <div className="pb-24 md:pb-10 min-h-screen bg-black relative overflow-hidden">
        {/* Ambient theme glow */}
        <div className="fixed inset-0 pointer-events-none bg-white/5 blur-3xl opacity-20 transition-colors duration-1000" />

        {/* HERO HEADER */}
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-[52vh] min-h-[400px] overflow-hidden group"
        >
          {room.coverImage ? (
            <motion.img 
              src={room.coverImage} 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

          {/* Hidden file input for cover upload */}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          {/* Camera upload btn */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl cursor-pointer opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Camera size={18} />
          </motion.button>

          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto w-full z-10">
            {/* Top row */}
            <div className="flex justify-between items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)} 
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg cursor-pointer"
              >
                <ArrowLeft size={18} />
              </motion.button>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleRoomPrivacy(room.id)}
                  className={`px-3.5 py-2 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer ${room.isPublic ? 'bg-white/10 border-white/20 text-white' : 'bg-black/50 border-white/10 text-gray-400'}`}
                >
                  {room.isPublic ? <><Globe size={12} className="text-white/80" /> Public</> : <><Lock size={12} /> Private</>}
                </motion.button>
              </div>
            </div>

            {/* Bottom info glass plate */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 blur-2xl opacity-30 mix-blend-overlay pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 drop-shadow-xl"
                  >
                    {room.name}
                  </motion.h1>
                  {room.description && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-300 font-serif italic text-base md:text-lg max-w-2xl leading-relaxed line-clamp-2"
                    >
                      {room.description}
                    </motion.p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Palette - Simplified for B&W */}
                  <div className="relative">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPaletteOpen(!isPaletteOpen)} 
                      className="w-11 h-11 rounded-full backdrop-blur-lg border border-white/10 flex items-center justify-center transition-all shadow-xl cursor-pointer bg-black/50 hover:bg-white/10"
                    >
                      <Palette size={18} className="text-white/80" />
                    </motion.button>
                  </div>

                  {/* Edit */}
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditOpen(true)} 
                    className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-lg border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all shadow-xl cursor-pointer"
                  >
                    <Edit2 size={17} />
                  </motion.button>

                  {/* Share with Tooltip */}
                  <div className="relative">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 size={15} /> Share
                    </motion.button>
                    <AnimatePresence>
                      {showShareTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-[10px] text-white whitespace-nowrap border border-white/10"
                        >
                          Link copied!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="p-6 md:p-10 max-w-7xl mx-auto relative z-10 -mt-4">
          {/* Room Contemplation / Curator's Note */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 relative"
          >
            <div className="absolute -inset-4 bg-white/5 blur-2xl opacity-20 rounded-[3rem] pointer-events-none" />
            <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/50" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Room Contemplation</h2>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/50" />
              </div>
              <p className="text-xl md:text-2xl font-serif italic text-gray-300 leading-relaxed max-w-3xl">
                {room.description || "This space is currently waiting for your intellectual blueprint. What themes will you explore here?"}
              </p>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <StatsBar itemCount={items.length} theme={theme} />

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 text-sm font-bold uppercase tracking-widest text-white/80"
            >
              <Sparkles size={12} />
              {items.length} {items.length === 1 ? 'Artifact' : 'Artifacts'}
            </motion.span>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold uppercase tracking-widest transition-all cursor-pointer active:scale-95"
            >
              <Plus size={16} /> Add to Room
            </motion.button>
          </div>

          {/* Add Item Form */}
          <AnimatePresence>
            {showAddItem && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="mb-8 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl opacity-30 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-white tracking-tight flex items-center gap-2">
                      <Plus size={16} className="text-white/80" /> Add to Room
                    </h3>
                    <button onClick={() => { setShowAddItem(false); setAddError(''); }} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Title *</label>
                      <input 
                        value={newTitle} 
                        onChange={e => { setNewTitle(e.target.value); setAddError(''); }}
                        placeholder="Article title, song name…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">URL / Link *</label>
                      <input 
                        value={newUrl} 
                        onChange={e => { setNewUrl(e.target.value); setAddError(''); }}
                        placeholder="https://…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Your Note</label>
                    <textarea 
                      value={newNote} 
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Why does this matter to you?"
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm font-serif italic focus:outline-none focus:border-white/30 transition-all resize-none"
                    />
                  </div>
                  {addError && <p className="text-white/70 text-xs mb-3 font-medium">{addError}</p>}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddItem}
                    className="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm text-white transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95 shadow-lg bg-white/20 hover:bg-white/30"
                  >
                    Save to Room
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Items Grid */}
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/5"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 bg-white/5 rounded-3xl mb-6 flex items-center justify-center"
              >
                <Plus size={28} className="text-white/60" />
              </motion.div>
              <p className="text-white text-xl font-bold tracking-tight mb-2">This room is empty.</p>
              <p className="text-gray-400 font-serif italic text-sm mb-6">Start adding links, articles, music — anything you want to keep.</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddItem(true)}
                className="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm text-white cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-all bg-white/20 hover:bg-white/30"
              >
                Add First Artifact
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <ArtifactCard
                  key={item.id}
                  item={item}
                  theme={theme}
                  onDelete={() => handleDeleteItem(item.id)}
                  index={index}
                />
              ))}

              {/* Quick Add Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: items.length * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setShowAddItem(true)}
                className="h-full min-h-[220px] border-2 border-dashed border-white/10 rounded-3xl hover:border-white/30 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
              >
                <motion.div 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 group-hover:border-white/40 flex items-center justify-center transition-colors"
                >
                  <Plus size={20} className="text-gray-500 group-hover:text-white/80 transition-colors" />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white/80 transition-colors">
                  Add Artifact
                </span>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}