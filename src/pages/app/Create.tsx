import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
   Sparkles, BookOpen, Layers, Globe, 
  Music, Image as ImageIcon, 
  ArrowRight, Link2, Layout, Lock, X,
  Brain, Flame,
  Check
} from 'lucide-react';
import { useRoomsStore } from '../../store/useRoomsStore';
import { useItemsStore } from '../../store/useItemsStore';
import { useJournalStore } from '../../store/useJournalStore';
import CreateRoomModal from '../../components/modals/CreateRoomModal';
import CreateThreadModal from '../../components/modals/CreateThreadModal';

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{ 
            y: [`${p.y}%`, `${p.y - 40}%`],
            opacity: [0, 0.2, 0],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute w-0.5 h-0.5 rounded-full bg-white/70/20"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

// Quick Seed Success Toast
function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-white/80/20 border border-white/80/30 rounded-2xl backdrop-blur-md flex items-center gap-2 shadow-2xl"
    >
      <Check size={16} className="text-white/70" />
      <span className="text-xs font-medium text-white/70">{message}</span>
    </motion.div>
  );
}

// Creation Card Component
function CreationCard({ 
  icon, title, description, actionText, color, onClick, badge, badgeColor 
}: { 
  icon: icon; title: string; description: string; actionText: string; color: string; onClick: () => void; badge?: string; badgeColor?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={`group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-${color}/40 transition-all duration-500 shadow-2xl`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b from-${color}/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
      
      {/* Glow Effect */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${color}/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center z-10">
        {badge && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-1 rounded-full ${badgeColor || 'bg-white/80/20'} border border-white/10 mb-4 text-[9px] font-bold uppercase tracking-wider`}
          >
            {badge}
          </motion.div>
        )}
        
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-all duration-500 shadow-xl`}
        >
          <Icon size={36} className={`text-${color}`} />
        </motion.div>
        
        <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-white">{title}</h3>
        <p className="text-gray-400 font-serif italic mb-6 text-base leading-relaxed px-4">{description}</p>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white group-hover:bg-${color} group-hover:text-black group-hover:border-${color} transition-all cursor-pointer`}
        >
          {actionText}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, onClick, index }: { 
  icon: any; title: string; description: string; onClick: () => void; index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="p-6 bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer group shadow-lg"
    >
      <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl mb-4 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <Icon size={18} className="text-gray-400 group-hover:text-white/80 transition-colors" />
      </div>
      <h4 className="text-lg font-bold mb-2 text-white group-hover:text-white/80 transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed font-serif italic">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-[9px] text-gray-600 group-hover:text-white/80 transition-colors">
        Explore <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}

export default function Create() {
  const navigate = useNavigate();
  const rooms = useRoomsStore(state => state.rooms);
  const addItem = useItemsStore(state => state.addItem);
  const addJournalEntry = useJournalStore(state => state.addEntry);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showCreateThread, setShowCreateThread] = useState(false);
  
  // Quick Seed state
  const [seedUrl, setSeedUrl] = useState('');
  const [seedRoomId, setSeedRoomId] = useState(rooms[0]?.id || '');
  const [isSeeding, setIsSeeding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [seedIsPublic, setSeedIsPublic] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleQuickSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedUrl || !seedRoomId) return;

    setIsSeeding(true);
    
    setTimeout(() => {
      addItem({
        roomId: seedRoomId,
        title: seedUrl.includes('http') ? new URL(seedUrl).hostname.replace('www.', '') : 'Quick Note',
        sourceUrl: seedUrl.startsWith('http') ? seedUrl : `https://google.com/search?q=${encodeURIComponent(seedUrl)}`,
        note: `Quickly seeded from the Create Hub.`,
        isPublic: seedIsPublic,
        type: 'link',
        tags: []
      });
      
      setIsSeeding(false);
      setSuccessMessage(`Added to ${rooms.find(r => r.id === seedRoomId)?.name || 'room'}`);
      setShowSuccess(true);
      setSeedUrl('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleStartJournal = (isPublic: boolean = false) => {
    const entry = addJournalEntry('reflective', isPublic);
    navigate(`/journal/${entry.id}`);
  };

  const creationCards = [
    { icon: Layout, title: 'Expressive Room', description: 'Build a new cinematic container for a specific area of interest.', actionText: 'Choose Intent', color: 'white/80', onClick: () => setShowCreateRoom(true), badge: 'New Container' },
    { icon: Layers, title: 'Thematic Thread', description: 'Synthesize existing artifacts into a structured intellectual output.', actionText: 'Synthesize', color: 'white/80', onClick: () => setShowCreateThread(true), badge: 'Weave Ideas' },
    { icon: BookOpen, title: 'Introspective Entry', description: 'Dive into a raw writing flow. Private, dated, and moody.', actionText: 'Start Writing', color: 'white/80', onClick: () => handleStartJournal(false), badge: 'Journal' },
  ];

  const features = [
    { icon: ImageIcon, title: 'Mood Board Engine', description: 'Turn a Room or Thread into a high-fidelity visual grid for export.', onClick: () => navigate('/rooms') },
    { icon: Music, title: 'Atmospheric Exports', description: 'Sync Room soundtracks directly into Spotify or Apple Music playlists.', onClick: () => navigate('/connections') },
    { icon: Globe, title: 'Portrait Preview', description: 'Render your public persona. Curate what the world sees of your collection.', onClick: () => navigate('/settings') },
    { icon: Brain, title: 'Weekly Mirror', description: 'AI-curated reflection on your week. Patterns you didn\'t see.', onClick: () => navigate('/mirror') },
  ];

  return (
    <div className="min-h-screen bg-[#050508] pb-24 md:pb-10 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/80/8 blur-[120px] rounded-full" />
      </motion.div>

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="createGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#createGrid)" />
        </svg>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && <SuccessToast message={successMessage} onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showCreateRoom && <CreateRoomModal onClose={() => setShowCreateRoom(false)} />}
        {showCreateThread && <CreateThreadModal onClose={() => setShowCreateThread(false)} />}
      </AnimatePresence>

      <div className="relative z-10 p-6 md:p-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-start"
        >
          <div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4"
            >
              <Sparkles size={12} className="text-white/80" />
              <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Create Flow</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Create Hub</h1>
            <p className="text-gray-500 font-serif italic text-base max-w-xl leading-relaxed">
              What are you bringing into the world today? Choose your intention and start your flow.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
          >
            <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
          </motion.button>
        </motion.header>

        {/* SECTION 1: QUICK SEED (CAPTURE) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="relative group">
            <div className="absolute inset-x-0 -bottom-2 h-1 bg-white/80/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <form 
              onSubmit={handleQuickSeed}
              className="relative p-1 bg-white/[0.03] border border-white/10 group-focus-within:border-white/80/40 rounded-3xl flex flex-col md:flex-row items-center gap-2 transition-all duration-500 backdrop-blur-xl overflow-hidden"
            >
              {/* Scanline Effect */}
              <AnimatePresence>
                {isSeeding && (
                  <motion.div 
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm z-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="flex-1 flex items-center pl-6 w-full">
                <Link2 size={20} className={seedUrl ? "text-white/80" : "text-gray-600"} />
                <input 
                  value={seedUrl}
                  onChange={e => setSeedUrl(e.target.value)}
                  placeholder="Paste a URL or write a quick thought..."
                  className="w-full bg-transparent py-5 text-base font-medium text-white placeholder-gray-700 focus:outline-none px-3"
                />
              </div>

              <div className="w-full md:w-auto flex flex-row items-center gap-2 p-1.5 h-full relative z-30">
                <select 
                  value={seedRoomId}
                  onChange={e => setSeedRoomId(e.target.value)}
                  className="bg-white/5 border border-white/10 text-gray-400 text-[9px] font-bold uppercase tracking-widest px-4 py-3 rounded-xl focus:outline-none focus:border-white/80/30 transition-all cursor-pointer appearance-none pr-8"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'rgba(156, 163, 175, 0.5)\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id} className="bg-[#111]">{room.name}</option>
                  ))}
                </select>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!seedUrl || isSeeding}
                  className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-lg ${showSuccess ? 'bg-white/80 text-white' : 'bg-gradient-to-r from-white to-white/80 text-white hover:shadow-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed'}`}
                >
                  {isSeeding ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : showSuccess ? (
                    <><Check size={12} /> Seeded</>
                  ) : (
                    <>Seed <Sparkles size={12} /></>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
          
          <div className="mt-4 px-4 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Fast-capture any artifact into your permanent collection.</p>
              
              <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-full border border-white/5">
                <button 
                  type="button"
                  onClick={() => setSeedIsPublic(false)}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${!seedIsPublic ? 'bg-white/10 text-white' : 'text-gray-600'}`}
                >
                  <Lock size={9} />
                  <span className="text-[7px] font-bold uppercase tracking-widest">Solo</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setSeedIsPublic(true)}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${seedIsPublic ? 'bg-white/80/20 text-white/80' : 'text-gray-600'}`}
                >
                  <Globe size={9} />
                  <span className="text-[7px] font-bold uppercase tracking-widest">Public</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/70 animate-pulse" />
              <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Scanning Engine Active</span>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: INTENTIONAL PILLARS (LARGE CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {creationCards.map((card, idx) => (
            <CreationCard key={card.title} {...card} />
          ))}
        </div>

        {/* SECTION 3: SYNTHESIS OUTPUTS (SECONDARY GRID) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Sparkles size={14} className="text-white/80" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Synthesis & Output</h2>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, idx) => (
              <FeatureCard key={feature.title} {...feature} index={idx} />
            ))}
          </div>
        </motion.section>

        {/* Quick Inspiration Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <div className="flex items-center gap-2 mb-6">
            <Flame size={12} className="text-white/70" />
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Quick Inspiration</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Capture a thought', 'Save an article', 'Journal a feeling', 'Start a room', 'Weave a thread', 'Share insight'].map((prompt, i) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (prompt === 'Capture a thought') document.querySelector('input')?.focus();
                  if (prompt === 'Journal a feeling') handleStartJournal(false);
                  if (prompt === 'Start a room') setShowCreateRoom(true);
                  if (prompt === 'Weave a thread') setShowCreateThread(true);
                  if (prompt === 'Share insight') navigate('/connections');
                }}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-400 hover:text-white hover:border-white/80/30 transition-all"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}