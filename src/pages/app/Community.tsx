import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  Users, Shield, Sparkles, ChevronRight, ArrowLeft,
  Brain, Network, Compass, Clock, Check,
  X, Info, Circle, Activity
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

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
            opacity: [0, 0.15, 0],
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

// Pod Card Component
function PodCard({ pod, index, onJoin }: { pod: any; index: number; onJoin: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${pod.bg} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${pod.bg} rounded-xl flex items-center justify-center`}>
          <pod.icon size={22} className={pod.color} />
        </div>
        <span className="text-[9px] font-mono text-gray-600">{pod.members} members</span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/80 transition-colors">{pod.name}</h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{pod.description}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-1">
          <Activity size={10} className="text-white/60" />
          <span className="text-[9px] text-gray-500">{pod.activity} active</span>
        </div>
        <motion.button 
          whileHover={{ x: 3 }}
          onClick={(e) => { e.stopPropagation(); onJoin(); }}
          className="text-[10px] text-white/60 font-medium flex items-center gap-1 hover:text-white transition-colors"
        >
          Join <ChevronRight size={10} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, index }: { icon: any; title: string; description: string; color: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
      className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={18} className="text-white/80" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-[10px] text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Join Modal Component
function JoinModal({ onClose, podName }: { onClose: () => void; podName?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md z-10"
      >
        <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full pointer-events-none" />
        <div className="relative bg-gradient-to-br from-[#0f0f14] to-[#0a0a0f] border border-white/10 rounded-2xl p-6 overflow-hidden shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <X size={14} />
          </button>
          
          {!submitted ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
                  <Users size={12} className="text-white/80" />
                  <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Join Pod</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">Join {podName || 'a Pod'}</h3>
                <p className="text-xs text-gray-500 mt-2 font-serif italic">Connect with like-minded creators</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/30 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all"
                >
                  Join Waitlist →
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-white/80" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">You're on the list!</h3>
              <p className="text-xs text-gray-500">We'll notify you when your pod is ready.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const { soloMode, toggleSoloMode } = useUserStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedPod, setSelectedPod] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleJoinPod = (podName: string) => {
    setSelectedPod(podName);
    setShowJoinModal(true);
  };

  const features = [
    { icon: Brain, title: "Pattern-Based Matching", description: "Connected based on your actual consumption patterns, not just declared interests.", color: "bg-white/10" },
    { icon: Network, title: "Intimate Groups", description: "Pods of exactly 10-15 people for deep, focused dialogue.", color: "bg-white/10" },
    { icon: Shield, title: "Privacy First", description: "Your activity stays within your pod. No public feeds.", color: "bg-white/10" },
    { icon: Clock, title: "Rhythmic Engagement", description: "Synchronized reflection cycles, not constant notifications.", color: "bg-white/10" },
  ];

  const pods = [
    { name: "Silence & Architecture", description: "Exploring the intersection of brutalist spaces and ambient soundscapes.", members: 12, activity: "8 active", icon: Compass, color: "text-white/80", bg: "bg-white/10" },
    { name: "Digital Identity", description: "How curated spaces reshape our sense of self and authenticity.", members: 9, activity: "6 active", icon: Brain, color: "text-white/80", bg: "bg-white/10" },
    { name: "Systems Thinking", description: "Complexity, ecology, and the patterns that connect everything.", members: 14, activity: "11 active", icon: Network, color: "text-white/80", bg: "bg-white/10" },
    { name: "Temporal Art", description: "Memory, archives, and the aesthetics of time.", members: 8, activity: "5 active", icon: Clock, color: "text-white/80", bg: "bg-white/10" },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <FloatingParticles />
      
      <AnimatePresence>
        {showJoinModal && <JoinModal onClose={() => setShowJoinModal(false)} podName={selectedPod || undefined} />}
      </AnimatePresence>
      
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
            <pattern id="communityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#communityGrid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 text-sm font-bold uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"
            >
              <Users size={24} className="text-white/80" />
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Community</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            Interest <span className="text-white/60">Pods</span>
          </h1>
          <p className="text-gray-500 font-serif italic text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Instead of sprawling public algorithms, Muse unites you in intimate, focus-driven engagement pods.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </motion.div>

        {/* Main Content */}
        {soloMode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-3xl p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 border border-white/20"
                >
                  <Shield size={32} className="text-white/60" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-3">Solo Mode is Active</h2>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md mx-auto">
                  You are completely invisible to the network right now. Disable Solo Mode to discover your matching pods.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSoloMode}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-white/90 transition-all cursor-pointer"
                >
                  Disable Solo Mode
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Pods Grid */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-white/60" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Recommended for you</h2>
                </div>
                <span className="text-[9px] text-gray-600">Based on your consumption patterns</span>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {pods.map((pod, i) => (
                  <PodCard key={pod.name} pod={pod} index={i} onJoin={() => handleJoinPod(pod.name)} />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={14} className="text-white/60" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">How It Works</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-2xl">
                  Instead of sprawling public algorithms screaming for your attention, Muse unites you in closed, 
                  focus-driven engagement pods of exactly 10-15 people sharing your exact contemplative patterns.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-1">
                    <Circle size={8} className="text-white/60 fill-white/60" />
                    <span className="text-[9px] text-gray-500">Pattern-based matching</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle size={8} className="text-white/60 fill-white/60" />
                    <span className="text-[9px] text-gray-500">Intimate groups of 10-15</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle size={8} className="text-white/60 fill-white/60" />
                    <span className="text-[9px] text-gray-500">Rhythmic engagement cycles</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Waitlist CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJoinPod("General")}
                className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
              >
                <Sparkles size={14} /> Join the Waitlist
              </motion.button>
              <p className="text-[9px] text-gray-600 mt-4 font-serif italic">
                Limited pods available. Be among the first to experience collective intelligence.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}