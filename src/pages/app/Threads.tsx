import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Plus,
  Layers,
  ChevronRight,
  Sparkles,
  Globe,
  Lock,
  Users,
  MessageCircle,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Brain,
  Flame,
  Compass
} from 'lucide-react';
import { useThreadsStore } from '../../store/useThreadsStore';
import { useConnectionsStore, type ActiveCircle } from '../../store/useConnectionsStore';
import { useUserStore } from '../../store/useUserStore';

// Floating decorative elements
const FloatingDecorations = () => {
  const decorations = [
    { icon: Brain, delay: 0, x: "5%", y: "20%", size: 24, color: "text-white/70/20" },
    { icon: MessageCircle, delay: 2, x: "85%", y: "15%", size: 28, color: "text-white/70/20" },
    { icon: Sparkles, delay: 4, x: "10%", y: "70%", size: 20, color: "text-white/70/20" },
    { icon: Compass, delay: 1, x: "90%", y: "80%", size: 26, color: "text-white/70/20" },
    { icon: TrendingUp, delay: 3, x: "45%", y: "90%", size: 22, color: "text-white/70/20" },
    { icon: Star, delay: 5, x: "75%", y: "40%", size: 24, color: "text-white/70/20" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1, y: [el.y, `calc(${el.y} + 25px)`, el.y], x: [el.x, `calc(${el.x} + 20px)`, el.x] }}
          transition={{ delay: el.delay, duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', left: el.x, top: el.y }}
          className={`${el.color} drop-shadow-2xl`}
        >
          <el.icon size={el.size} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  );
};

// Stats Bar Component
function StatsBar({ activeView, circleCount, threadCount }: { activeView: string; circleCount: number; threadCount: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="flex flex-wrap gap-4 mb-8"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        {activeView === 'community' ? (
          <Users size={14} className="text-white/70" />
        ) : (
          <Lock size={14} className="text-white/70" />
        )}
        <span className="text-xs font-mono text-gray-400">
          {activeView === 'community' ? `${circleCount} Active Circles` : `${threadCount} Private Weaves`}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <Flame size={14} className="text-white/70" />
        <span className="text-xs font-mono text-gray-400">12 Day Streak</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <MessageCircle size={14} className="text-white/70" />
        <span className="text-xs font-mono text-gray-400">24 New Contributions</span>
      </div>
    </motion.div>
  );
}

// Community Dialogue Card with enhanced design
function CommunityDialogueCard({ circle, onClick, index }: { circle: ActiveCircle; onClick: () => void; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/80/30 shadow-2xl transition-all duration-500"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f14] to-[#0a0a0f]" />
      {circle.coverImage && (
        <img 
          src={circle.coverImage} 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700"
        />
      )}
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        animate={{ 
          background: [
            'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
            'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%)',
            'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80/20 border border-white/80/30 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Active Dialogue</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <Clock size={10} className="text-gray-500" />
            <span className="text-[9px] text-gray-400">{circle.recentActivity}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-mono text-white/70/60">#{circle.theme.toLowerCase()}</span>
            {circle.pinned && (
              <Star size={10} className="text-white/70 fill-white/70/50" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-white/70 transition-colors duration-300">
            {circle.name}
          </h3>
          <p className="text-sm text-gray-400 font-serif italic line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            "{circle.description}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex -space-x-2">
            {circle.members.slice(0, 3).map((member, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 overflow-hidden"
              >
                {member.charAt(0)}
              </div>
            ))}
            {circle.memberCount > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-white/10 flex items-center justify-center text-[9px] font-bold text-gray-400 backdrop-blur-sm">
                +{circle.memberCount - 3}
              </div>
            )}
          </div>
          
          <motion.div 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/70"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Enter Dialogue <ChevronRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Private Weave Card with enhanced design
function PrivateWeaveCard({ thread, onClick, index }: { thread: any; onClick: () => void; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const itemCount = thread.itemIds?.length || 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/80/30 shadow-2xl transition-all duration-500"
    >
      {/* Background Image */}
      {thread.coverImage ? (
        <motion.img 
          src={thread.coverImage} 
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1f] to-[#0f0f14]" />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
            <Lock size={12} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Private Weave</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <Layers size={10} className="text-gray-500" />
            <span className="text-[9px] text-gray-400">{itemCount} artifacts</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-mono text-white/70/60">
              {thread.mood || 'contemplative'} mood
            </span>
            {thread.isPublic === false && (
              <Lock size={8} className="text-gray-500" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-white/70 transition-colors duration-300">
            {thread.title}
          </h3>
          <p className="text-sm text-gray-300 font-serif italic line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {thread.thesis || thread.description}
          </p>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-white/10">
          <motion.div 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/70 transition-all"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Weave Deeper <ChevronRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Create Card Component
function CreateCard({ onClick, isCommunity }: { onClick: () => void; isCommunity: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group relative h-80 rounded-3xl border-2 border-dashed border-white/10 hover:border-white/80/40 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center backdrop-blur-sm"
    >
      <motion.div 
        whileHover={{ rotate: 90, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 group-hover:border-white/70 flex items-center justify-center mb-4 transition-all duration-300"
      >
        <Plus size={24} className="text-gray-500 group-hover:text-white/70 transition-colors" />
      </motion.div>
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white/70 transition-colors">
        {isCommunity ? 'Start a New Circle' : 'Create Private Weave'}
      </span>
      <p className="text-[10px] text-gray-600 mt-2 font-serif italic max-w-[200px] text-center">
        {isCommunity 
          ? 'Invite collaborators to explore themes together' 
          : 'Synthesize your personal artifacts into a thread'}
      </p>
    </motion.div>
  );
}

export default function Threads() {
  const navigate = useNavigate();
  const personalThreads = useThreadsStore(state => state.threads);
  const { circles } = useConnectionsStore();
  const { soloMode } = useUserStore();
  const [activeView, setActiveView] = useState<'community' | 'private'>(soloMode ? 'private' : 'community');
  const [showCreate, setShowCreate] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync activeView with soloMode if it changes
  useEffect(() => {
    if (soloMode && activeView === 'community') {
      setActiveView('private');
    }
  }, [soloMode, activeView]);

  return (
    <div className="min-h-screen bg-[#050508] pb-24 overflow-hidden">
      <FloatingDecorations />

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
            <pattern id="threadsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#threadsGrid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/80/20 to-white/80/20 border border-white/80/30 flex items-center justify-center">
                  <Layers size={20} className="text-white/70" />
                </div>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em]">Dialogue Portal</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold tracking-tight"
              >
                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-500">Thematic.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 font-serif italic mt-3 max-w-xl"
              >
                {activeView === 'community' 
                  ? 'Join collective intelligence. Explore themes with fellow thinkers.'
                  : 'Your personal synthesis space. Weave your artifacts into meaningful threads.'}
              </motion.p>
            </div>

            {/* View Toggle */}
            {!soloMode && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-sm"
              >
                <button
                  onClick={() => setActiveView('community')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${activeView === 'community' ? 'bg-gradient-to-r from-white/80 to-white/80 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Globe size={14} /> Community
                </button>
                <button
                  onClick={() => setActiveView('private')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${activeView === 'private' ? 'bg-gradient-to-r from-white/80 to-white/80 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Lock size={14} /> Private Weaves
                </button>
              </motion.div>
            )}
          </div>

          {/* Stats Bar */}
          <StatsBar 
            activeView={activeView} 
            circleCount={circles.length} 
            threadCount={personalThreads.length} 
          />
        </motion.header>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'community' ? (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {circles.map((circle, idx) => (
                <CommunityDialogueCard 
                  key={circle.id} 
                  circle={circle} 
                  onClick={() => navigate(`/threads/${circle.id}?type=circle`)}
                  index={idx}
                />
              ))}
              
              <CreateCard 
                onClick={() => setShowCreate(true)} 
                isCommunity={true} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="private"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {personalThreads.map((thread, idx) => (
                <PrivateWeaveCard 
                  key={thread.id} 
                  thread={thread} 
                  onClick={() => navigate(`/threads/${thread.id}`)}
                  index={idx}
                />
              ))}
              
              <CreateCard 
                onClick={() => setShowCreate(true)} 
                isCommunity={false} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State Hint for No Content */}
        {activeView === 'community' && circles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/80/10 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-white/70" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No circles yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Be the first to start a dialogue. Create a circle around a theme you're passionate about.
            </p>
          </motion.div>
        )}

        {activeView === 'private' && personalThreads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/80/10 flex items-center justify-center mx-auto mb-4">
              <Layers size={32} className="text-white/70" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No private weaves yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start weaving your thoughts. Create a private thread to synthesize your artifacts.
            </p>
          </motion.div>
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
    </div>
  );
}