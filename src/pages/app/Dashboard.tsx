import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, ArrowRight, MessageSquare, Lock, Globe, Plus, 
  Brain, Compass, Flame, Star, Zap, BookOpen
} from 'lucide-react';
import { useRoomsStore, type RoomTheme, useRoomCount, useTotalArtifacts } from '../../store/useRoomsStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useConnectionsStore } from '../../store/useConnectionsStore';
import CreateRoomModal from '../../components/modals/CreateRoomModal';
import CommunityPulseStrip from '../../components/threads/CommunityPulseStrip';

const themeGradients: Record<RoomTheme, string> = {  
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
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

// Stats Card Component
function StatsCard({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: any; color: string; bg: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 800;
      const increment = value / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      className="bg-white/5 rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-300 border border-white/10"
    >
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
        <Icon size={18} className="text-white/80" />
      </div>
      <p className="text-2xl font-bold text-white font-mono">{count}</p>
      <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </motion.div>
  );
}

// Weekly Mirror Widget
function WeeklyMirrorWidget({ onClick }: { onClick: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const entries = useJournalStore(state => state.entries);
  const weekEntries = entries.filter(e => Date.now() - e.createdAt < 7 * 24 * 60 * 60 * 1000);
  const insight = weekEntries.length > 0 
    ? `You've written ${weekEntries.length} journal entr${weekEntries.length === 1 ? 'y' : 'ies'} this week.`
    : 'Start journaling to see weekly insights.';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group relative overflow-hidden bg-gradient-to-br from-[#1c1c1c] to-[#0f0f14] rounded-3xl p-6 border border-white/10 shadow-lg cursor-pointer hover:border-white/30 transition-all duration-500"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 blur-3xl rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      <div className="flex items-center gap-2 mb-4">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={20} className="text-white/80" />
        </motion.div>
        <h3 className="font-semibold text-white tracking-tight">Weekly Mirror</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4 font-serif italic leading-relaxed">
        "{insight}"
      </p>
      <div className="flex items-center gap-2 text-xs font-medium text-white/80 group-hover:translate-x-1 transition-transform">
        Reflect now <ArrowRight size={14} />
      </div>
    </motion.div>
  );
}

// Community Hub Widget
function CommunityHubWidget({ onClick, circles }: { onClick: () => void; circles: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const activeCircles = circles.filter(c => c.contributions?.length > 0).length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.25, duration: 0.5, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group bg-gradient-to-br from-[#1c1c1c] to-[#0f0f14] rounded-3xl p-6 border border-white/10 shadow-lg cursor-pointer hover:border-white/30 transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-white/80" />
            <h3 className="font-bold text-white tracking-tight">Community Hub</h3>
          </div>
          <motion.span 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white/10 text-white/80 text-[9px] uppercase tracking-widest px-2 py-1 rounded-md font-bold shadow-sm"
          >
            {activeCircles} Active Circles
          </motion.span>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 leading-relaxed font-serif italic">
          {circles.length > 0 
            ? `You and the community are exploring ${circles[0]?.theme || 'silence'}. ${activeCircles} circles are actively discussing.`
            : 'Join a circle to start meaningful conversations.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
          <div className="flex -space-x-2">
            {circles.slice(0, 2).map((circle, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1c1c1c] bg-white/20 flex items-center justify-center text-[10px] font-bold text-white/60">
                {circle.name?.charAt(0) || 'C'}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#1c1c1c] bg-white/5 flex items-center justify-center text-[9px] font-bold text-gray-500">
              +{Math.max(0, circles.length - 2)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/80 group-hover:translate-x-1 transition-transform">
            Enter Dialogue <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Room Card Component
function RoomCard({ room, onClick }: { room: any; onClick: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const glowClass = themeGradients[room.themeColor] || themeGradients.white;

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="relative h-56 rounded-3xl overflow-hidden cursor-pointer group shadow-xl border border-white/10 hover:border-white/30 transition-all duration-500 w-full text-left"
    >
      <img src={room.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-70" />
      
      {/* Double Gradient System */}
      <div className={`absolute inset-0 bg-gradient-to-t ${glowClass} via-black/60 to-black opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      
      {/* Pinned Badge */}
      {room.pinned && (
        <div className="absolute top-3 left-3 z-10 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-bold text-white/80 border border-white/20 flex items-center gap-1">
          <Star size={8} fill="currentColor" /> Pinned
        </div>
      )}
      
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex justify-end">
          {room.isPublic ? (
            <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] uppercase tracking-widest font-bold text-white border border-white/20 flex items-center gap-1">
              <Globe size={10} /> Public
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] uppercase tracking-widest font-bold text-gray-400 border border-white/10 flex items-center gap-1">
              <Lock size={10} /> Private
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white mb-1 drop-shadow-lg group-hover:text-white transition-colors">
            {room.name}
          </h3>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 drop-shadow-md">
            {room.count} Artifacts
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const rooms = useRoomsStore(state => state.rooms);
  const roomCount = useRoomCount();
  const totalArtifacts = useTotalArtifacts();
  const { circles } = useConnectionsStore();
  const [showCreate, setShowCreate] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { label: 'Rooms', value: roomCount, icon: Compass, color: 'text-white/80', bg: 'bg-white/10' },
    { label: 'Artifacts', value: totalArtifacts, icon: Star, color: 'text-white/80', bg: 'bg-white/10' },
    { label: 'Streak', value: 12, icon: Flame, color: 'text-white/80', bg: 'bg-white/10' },
    { label: 'Insights', value: 8, icon: Brain, color: 'text-white/80', bg: 'bg-white/10' },
  ];

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

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dashboardGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboardGrid)" />
        </svg>
      </div>

      {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
      
      <div className="max-w-7xl mx-auto pb-24 md:pb-10 min-h-full relative z-10">
        <div className="px-6 md:px-10 pt-6">
          <CommunityPulseStrip />
        </div>
      
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 md:px-10 mt-6 mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">
            Welcome back
          </h1>
          <p className="text-gray-500 font-serif italic">Your creative universe awaits.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="px-6 md:px-10 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, idx) => (
              <StatsCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      
        {/* Dynamic Top Realm: Contemplation Feed */}
        <section className="mb-12 px-6 md:px-10">
          <header className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain size={14} className="text-white/60" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Contemplation</h2>
              </div>
              <p className="text-xs text-gray-500">Your latest patterns and insights.</p>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <WeeklyMirrorWidget onClick={() => navigate('/mirror')} />
            <CommunityHubWidget onClick={() => navigate('/connections')} circles={circles} />
          </div>
        </section>

        {/* The Foundations: Cinematic Rooms Gallery */}
        <section className="px-6 md:px-10">
          <header className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass size={14} className="text-white/60" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Your Rooms</h2>
              </div>
              <p className="text-xs text-gray-500">Highly personalized and expressive curation spaces.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/rooms')} 
                className="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                View All
              </button>
              <motion.button 
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreate(true)} 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <Plus size={14} />
              </motion.button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {rooms.slice(0, 6).map((room) => (
              <RoomCard 
                key={room.id}
                room={room}
                onClick={() => navigate(`/rooms/${room.id}`)}
              />
            ))}
            
            {/* Create Room Card */}
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setShowCreate(true)}
              className="relative h-56 bg-gradient-to-br from-[#1c1c1c] to-[#0f0f14] border-2 border-dashed border-white/10 rounded-3xl hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group w-full"
            >
              <motion.div 
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 rounded-full border-2 border-dashed border-gray-600 group-hover:border-white/40 flex items-center justify-center mb-3 transition-all duration-300"
              >
                <Plus size={22} className="text-gray-500 group-hover:text-white/80 transition-colors" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white/80 transition-colors">
                Create Expressive Room
              </span>
              <p className="text-[8px] text-gray-600 mt-1 font-serif italic">Curate your thoughts and ideas</p>
            </motion.button>
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-serif italic">No rooms yet. Create your first expressive space to start curating.</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-12 px-6 md:px-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={12} className="text-white/70" />
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Quick Actions</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Create Room', 'Write Journal', 'Start Thread', 'Join Circle'].map((action, i) => (
              <motion.button
                key={action}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (action === 'Create Room') setShowCreate(true);
                  if (action === 'Write Journal') navigate('/journal');
                  if (action === 'Start Thread') navigate('/create');
                  if (action === 'Join Circle') navigate('/connections');
                }}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}