import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ArrowRight, X, Sparkles, ChevronDown, Shield, Zap,  
  Lock, Eye, Download, MessageCircle, Brain, 
  Music, Palette, BookOpen, PenTool, Share2, Star, Play, 
  Compass, Fingerprint, Infinity, Layers, Network, Image, Camera
} from 'lucide-react';
import museLogo from '../../assets/muse-logo.png';

// ─── Data ───────────────────────────────────────────────────────────────────────
const WAITLIST_COUNT = 8427;
const PATTERNS_DISCOVERED = 156234;

// ─── Featured Insights ─────────────────────────────────────────────────────────
const FEATURED_INSIGHTS = [
  { title: "You return to melancholy themes", type: "Emotional", plays: "268K" },
  { title: "Brutalist visual aesthetic", type: "Visual", plays: "106K" },
  { title: "Consciousness & AI ethics", type: "Intellectual", plays: "110K" },
  { title: "Ambient soundscapes", type: "Sonic", plays: "264K" },
  { title: "Temporal fascination", type: "Theme", plays: "375K" },
  { title: "Analog nostalgia", type: "Aesthetic", plays: "129K" },
  { title: "Solitude as creative fuel", type: "Psychological", plays: "386K" },
  { title: "Systems thinking", type: "Cognitive", plays: "87K" },
];

// ─── The Three Phases ───────────────────────────────────────────────────────────
const PHASES = [
  { icon: Compass, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Consume', subtitle: 'What you take in', description: 'Connect your platforms — Spotify, TikTok, Pinterest, YouTube, Twitter. Muse sees everything you save, watch, and listen to.', stat: '7+ platforms' },
  { icon: Brain, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Contemplate', subtitle: 'What it reveals', description: 'Muse finds the patterns across platforms. Your aesthetic, your themes, your intellectual diet — the self no single algorithm sees.', stat: '156K patterns discovered' },
  { icon: PenTool, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Create', subtitle: 'What you make', description: 'Start with your own voice already primed. Your themes, your aesthetic, your language — creation becomes inevitable.', stat: 'Create with yourself' },
];

// ─── Features ───────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Compass, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Aggregate Everything', description: 'Connect Spotify, TikTok, Pinterest, YouTube, Twitter. Muse sees what you consume across all platforms.' },
  { icon: Network, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Find Your Patterns', description: 'Discover the meta-themes, aesthetics, and tensions that run through everything you save and watch.' },
  { icon: Eye, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Know Yourself Honestly', description: 'Your consumption fingerprint doesn\'t lie. Muse shows you who you actually are, not who you perform.' },
  { icon: PenTool, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Create From Yourself', description: 'Start writing, making, or sharing with your own voice, aesthetic, and themes already primed.' },
  { icon: Share2, color: 'text-sky-400', bg: 'bg-sky-500/10', title: 'Share Your Portrait', description: 'Your Muse Card — one link that shows your sonic, visual, intellectual, and creative identity.' },
  { icon: Shield, color: 'text-white/70', bg: 'bg-white/80/10', title: 'Privacy First', description: 'Your data stays yours. You control exactly what becomes visible in your public portrait.' },
];

// ─── Platforms ──────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { name: 'Spotify', icon: Music, color: 'text-white/70', bg: 'bg-white/80/10' },
  { name: 'TikTok', icon: Music, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { name: 'Pinterest', icon: Image, color: 'text-white/70', bg: 'bg-white/80/10' },
  { name: 'YouTube', icon: Play, color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'Twitter', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Instagram', icon: Camera, color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

// ─── Testimonials ────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "Muse showed me patterns I'd been living for years but never saw.", author: "Dr. Sarah Chen", role: "Cognitive Scientist", rating: 5 },
  { quote: "I thought I knew my taste. Muse proved me wrong.", author: "Marcus Thompson", role: "Creative Director", rating: 5 },
  { quote: "Finally, a tool that helps me understand myself instead of just feeding me more content.", author: "Elena Rodriguez", role: "Writer & Artist", rating: 5 },
];

// ─── Trust Badges ────────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { name: "Product Hunt #1", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  { name: "4.9 ★ App Store", bg: "bg-white/80/10", text: "text-white/70", border: "border-white/80/20" },
  { name: "Featured in Wired", bg: "bg-white/80/10", text: "text-white/70", border: "border-white/80/20" },
  { name: "Privacy Certified", bg: "bg-white/80/10", text: "text-white/70", border: "border-white/80/20" },
];

// ─── Auth Modal ─────────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose }: { mode: 'login' | 'signup'; onClose: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localMode, setLocalMode] = useState(mode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('muse_user', JSON.stringify({ name: name || 'Muse User', email, isAuthenticated: true }));
    navigate('/dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-md z-10">
        <div className="absolute -inset-4 bg-white/80/10 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-gradient-to-br from-[#0a0a0f] to-[#0f0f14] border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/80/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/80/20 blur-[80px] rounded-full" />
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all z-10"><X size={14} /></button>
          <div className="relative z-10">
            <div className="text-center mb-6">
              <motion.div animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80/10 border border-white/80/20 mb-4"><Sparkles size={12} className="text-white/70" /><span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{localMode === 'login' ? 'Welcome Back' : 'Join Muse'}</span></motion.div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{localMode === 'login' ? 'Sign in to Muse' : 'Create your account'}</h2>
              <p className="text-sm text-gray-500 mt-2 font-serif italic">{localMode === 'login' ? 'Continue your creative journey.' : 'Start knowing yourself honestly.'}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {localMode === 'signup' && (<div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Your Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="What shall we call you?" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/80/50 focus:ring-1 focus:ring-white/80/30 transition-all text-sm" required /></div>)}
              <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/80/50 focus:ring-1 focus:ring-white/80/30 transition-all text-sm" required /></div>
              <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white/80/50 focus:ring-1 focus:ring-white/80/30 transition-all text-sm" required /></div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-white/80 to-white/80 text-white font-semibold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all cursor-pointer">{localMode === 'login' ? 'Sign In →' : 'Create Account →'}</motion.button>
            </form>
            <p className="text-center text-xs text-gray-600 mt-6">{localMode === 'login' ? "Don't have an account? " : "Already have an account? "}<button onClick={() => setLocalMode(localMode === 'login' ? 'signup' : 'login')} className="text-white/70 hover:text-white/70 transition-colors font-semibold cursor-pointer">{localMode === 'login' ? 'Sign up' : 'Log in'}</button></p>
            <p className="text-center text-[10px] text-gray-700 mt-4 font-serif italic">Demo mode — any credentials work</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Floating Elements ──────────────────────────────────────────────────────────
function FloatingElements() {
  const elements = [
    { icon: Music, delay: 0, x: "10%", y: "20%", size: 24, color: "text-white/70/30" },
    { icon: Brain, delay: 2, x: "85%", y: "15%", size: 32, color: "text-white/70/30" },
    { icon: Palette, delay: 4, x: "15%", y: "70%", size: 28, color: "text-white/70/30" },
    { icon: Network, delay: 1, x: "75%", y: "80%", size: 36, color: "text-sky-400/30" },
    { icon: Sparkles, delay: 3, x: "45%", y: "90%", size: 20, color: "text-white/70/30" },
    { icon: Compass, delay: 5, x: "5%", y: "50%", size: 28, color: "text-white/70/30" },
    { icon: Share2, delay: 2.5, x: "92%", y: "60%", size: 26, color: "text-white/70/30" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1, y: [el.y, `calc(${parseFloat(el.y)} + 3%)`, el.y], x: [el.x, `calc(${parseFloat(el.x)} + 2%)`, el.x] }}
          transition={{ delay: el.delay, duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', left: el.x, top: el.y }}
          className={`${el.color} drop-shadow-2xl`}
        >
          <el.icon size={el.size} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Animated Background ────────────────────────────────────────────────────────
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 50%)",
            "radial-gradient(circle at 80% 70%, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 50%)",
            "radial-gradient(circle at 40% 80%, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 50%)",
            "radial-gradient(circle at 70% 20%, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 50%)",
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=2070&auto=format')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
    </div>
  );
}

// ─── Feature Card ───────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const Icon = feature.icon;
  
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.08, duration: 0.6 }} whileHover={{ y: -8, scale: 1.02 }} className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 cursor-default backdrop-blur-sm">
      <div className={`absolute -top-20 -right-20 w-40 h-40 ${feature.bg} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}><Icon size={20} className={feature.color} /></div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

// ─── Phase Card ────────────────────────────────────────────────────────────────
function PhaseCard({ phase, index }: { phase: typeof PHASES[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const Icon = phase.icon;
  
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.15, duration: 0.6 }} whileHover={{ y: -5 }} className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 text-center backdrop-blur-sm">
      <div className={`w-14 h-14 ${phase.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}><Icon size={26} className={phase.color} /></div>
      <h3 className={`text-xl font-bold mb-1 ${phase.color}`}>{phase.title}</h3>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">{phase.subtitle}</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{phase.description}</p>
      <p className="text-[10px] font-mono text-gray-600">{phase.stat}</p>
    </motion.div>
  );
}

// ─── Main Landing Component ─────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('muse_user');
    if (user) { const userData = JSON.parse(user); if (userData.isAuthenticated) navigate('/dashboard'); }
  }, [navigate]);

  return (
    <div className="bg-[#050508] text-white font-sans overflow-hidden">
      <AnimatePresence>{authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}</AnimatePresence>
      <AnimatedBackground />
      <FloatingElements />
      <motion.div className="fixed pointer-events-none z-10" animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }} transition={{ type: "spring", damping: 30, stiffness: 100 }}>
        <div className="w-[600px] h-[600px] bg-gradient-to-r from-white/80/20 to-white/80/20 blur-[120px] rounded-full" />
      </motion.div>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(79,70,229,0.3)" strokeWidth="0.5"/></pattern>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4F46E5" stopOpacity="0.6"/><stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/></radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <motion.circle animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} cx="50%" cy="30%" r="200" fill="url(#grad)" />
        </svg>
      </div>

      <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, type: "spring" }} className="fixed top-0 left-0 w-full px-6 md:px-12 py-5 flex justify-between items-center z-[100] backdrop-blur-xl bg-[#050508]/40 border-b border-white/5">
        <div className="flex items-center gap-2">
          <motion.img whileHover={{ scale: 1.05, rotate: 5 }} src={museLogo} alt="Muse" className="h-7 w-7 object-contain rounded-lg" />
          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Muse</motion.span>
        </div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4">
          <button onClick={() => setAuthMode('login')} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors hidden sm:block">Log in</button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthMode('signup')} className="text-xs font-bold bg-gradient-to-r from-white/80 to-white/80 text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all cursor-pointer">Get Started →</motion.button>
        </motion.div>
      </motion.header>

      <div ref={containerRef} className="h-screen overflow-y-scroll overflow-x-hidden scroll-smooth" style={{ scrollbarWidth: 'none' }}>

        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center relative text-center px-6 py-20 z-20">
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative">
            <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
              {TRUST_BADGES.map((badge, i) => (<motion.span key={badge.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ scale: 1.05 }} className={`px-3 py-1 rounded-full ${badge.bg} ${badge.text} border ${badge.border} text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm`}>{badge.name}</motion.span>))}
            </div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
              We don't have a<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 via-white/70 to-white/70 bg-[length:200%_auto] animate-gradient">content problem.</span><br />We have a self-knowledge problem.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mt-6 font-serif italic leading-relaxed">Muse turns your consumption fingerprint into a creative identity. Aggregate. Discover. Create from yourself.</motion.p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthMode('signup')} className="group px-8 py-4 bg-gradient-to-r from-white/80 to-white/80 text-white font-bold text-sm rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all cursor-pointer">Get Started<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthMode('login')} className="px-8 py-4 bg-white/5 border border-white/10 text-gray-400 font-bold text-sm rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-2 backdrop-blur-sm"><Play size={14} />Watch Demo</motion.button>
            </div>
            <div className="flex items-center gap-6 mt-12">
              <div className="flex items-center gap-2"><div className="flex -space-x-2">{[...Array(4)].map((_, i) => (<motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.05 }} className="w-7 h-7 rounded-full bg-gradient-to-br from-white/80 to-white/80 border-2 border-[#050508] flex items-center justify-center"><Sparkles size={10} className="text-white" /></motion.div>))}</div><span className="text-xs text-gray-500"><span className="text-white font-semibold">{WAITLIST_COUNT.toLocaleString()}</span>+ active users</span></div>
              <div className="w-px h-4 bg-white/10" /><div className="flex items-center gap-1"><Brain size={14} className="text-white/70" /><span className="text-xs text-gray-500">{PATTERNS_DISCOVERED.toLocaleString()}+ patterns discovered</span></div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
              {PLATFORMS.map((p, i) => {
                const PlatformIcon = p.icon;
                return (
                  <motion.div key={p.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.03 }} whileHover={{ scale: 1.05 }} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${p.bg} border border-white/10 backdrop-blur-sm`}>
                    <PlatformIcon size={12} className={p.color} />
                    <span className="text-[10px] font-medium text-gray-400">{p.name}</span>
                  </motion.div>
                );
              })}
              <span className="text-[10px] text-gray-600 ml-2">+ more coming</span>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-700 z-20"><span className="text-[9px] font-bold uppercase tracking-widest">Scroll to explore</span><ChevronDown size={14} /></motion.div>
        </section>

        {/* Three Phases */}
        <section className="py-28 px-6 md:px-12 max-w-6xl mx-auto z-20 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80/10 border border-white/80/20 mb-4"><Sparkles size={12} className="text-white/70" /><span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">The Creative Loop</span></div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Consume → Contemplate → Create</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto font-serif italic">Muse sits in the middle. Where self-knowledge lives.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{PHASES.map((phase, idx) => <PhaseCard key={phase.title} phase={phase} index={idx} />)}</div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto z-20 relative">
          <div className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Everything you need to know yourself</h2><p className="text-gray-500 text-base max-w-lg mx-auto font-serif italic mt-2">Muse isn't another algorithm. It's your honest mirror.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{FEATURES.map((feature, idx) => <FeatureCard key={feature.title} feature={feature} index={idx} />)}</div>
        </section>

        {/* Featured Insights */}
        <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto z-20 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80/10 border border-white/80/20 mb-4"><Brain size={12} className="text-white/70" /><span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Real patterns from real users</span></div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What your consumption reveals</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto font-serif italic mt-2">Muse finds what no single algorithm can see</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_INSIGHTS.map((insight, i) => (
              <motion.div key={insight.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} whileHover={{ y: -5, scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 hover:border-white/80/30 transition-all cursor-pointer group backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-mono text-gray-600">{insight.plays}</span><span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500">{insight.type}</span></div>
                <p className="text-sm font-semibold text-white mb-1 leading-tight">{insight.title}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Muse Card Preview */}
        <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto z-20 relative">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/80/20 via-white/80/10 to-transparent border border-white/80/30 p-8 md:p-12 backdrop-blur-sm">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-white/80/20 blur-[100px] rounded-full" />
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-0 left-0 w-80 h-80 bg-white/80/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6"><Share2 size={24} className="text-white/70" /><span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Your Muse Card</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div><h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">One link that shows<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/70">who you actually are.</span></h2><p className="text-gray-400 font-serif italic text-sm leading-relaxed mb-6">Not a highlight reel. Not a curated performance. Your Muse Card shows your sonic fingerprint, visual aesthetic, intellectual diet — the honest portrait.</p>
                  <div className="flex flex-wrap gap-2 mb-6"><div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10"><Music size={10} className="text-white/70" /><span className="text-[10px]">Ambient / Melancholy</span></div><div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10"><Image size={10} className="text-white/70" /><span className="text-[10px]">Brutalist / Analog</span></div><div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10"><Brain size={10} className="text-white/70" /><span className="text-[10px]">Consciousness / Systems</span></div></div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthMode('signup')} className="px-6 py-3 bg-gradient-to-r from-white/80 to-white/80 text-white font-semibold text-sm rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all cursor-pointer">Create Your Muse Card →</motion.button>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/80 to-white/80 flex items-center justify-center"><Sparkles size={14} className="text-white" /></div><div><p className="text-xs font-semibold">Your Muse Card</p><p className="text-[9px] text-gray-500">muse.me/yourname</p></div></div><Share2 size={12} className="text-gray-600" /></div>
                  <div className="space-y-3"><div className="flex items-center gap-2"><Music size={12} className="text-white/70" /><span className="text-[10px] text-gray-400">Sonic fingerprint:</span><span className="text-[10px] text-white">Ambient, Melancholy</span></div><div className="flex items-center gap-2"><Image size={12} className="text-white/70" /><span className="text-[10px] text-gray-400">Visual aesthetic:</span><span className="text-[10px] text-white">Brutalist, Analog</span></div><div className="flex items-center gap-2"><BookOpen size={12} className="text-white/70" /><span className="text-[10px] text-gray-400">Intellectual diet:</span><span className="text-[10px] text-white">Consciousness, Systems</span></div><div className="h-px bg-white/10 my-2" /><p className="text-[11px] text-gray-500 italic">"You return to melancholy themes. Your visual taste favors structure."</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto z-20 relative">
          <div className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trusted by creators, thinkers, and the curious</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="p-6 rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 hover:border-white/80/30 transition-all backdrop-blur-sm">
                <div className="flex gap-1 mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} size={12} className="text-white/70 fill-white/70" />)}</div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <p className="text-xs font-semibold text-white">{t.author}</p>
                <p className="text-[10px] text-gray-500">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 z-20 relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80/10 border border-white/80/20 mb-6"><Zap size={10} className="text-white/70" /><span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Limited early access</span></div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight mb-4">Stop performing.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 via-white/70 to-white/70">Start knowing.</span></h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto mb-8 font-serif italic">Join the waitlist. Be among the first to see your honest portrait.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthMode('signup')} className="group px-10 py-5 bg-gradient-to-r from-white to-gray-200 text-black font-bold text-sm rounded-full flex items-center gap-3 mx-auto shadow-xl hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-all cursor-pointer">Get Started<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></motion.button>
            <div className="flex items-center justify-center gap-4 mt-8"><div className="flex items-center gap-1"><Lock size={12} className="text-gray-600" /><span className="text-[10px] text-gray-600">Privacy first</span></div><div className="w-px h-3 bg-white/10" /><div className="flex items-center gap-1"><Fingerprint size={12} className="text-gray-600" /><span className="text-[10px] text-gray-600">Your data, your control</span></div><div className="w-px h-3 bg-white/10" /><div className="flex items-center gap-1"><Download size={12} className="text-gray-600" /><span className="text-[10px] text-gray-600">Export your portrait anytime</span></div></div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-600 text-[10px] font-bold uppercase tracking-wider z-20 relative backdrop-blur-sm">
          <div className="flex items-center gap-2"><img src={museLogo} alt="Muse" className="h-5 w-5 object-contain rounded opacity-50" /><span>Muse — The Honest Portrait</span></div>
          <span className="font-serif italic normal-case text-gray-700 text-[10px]">Consume → Contemplate → Create</span>
          <div className="flex gap-6"><button className="hover:text-white transition-colors">Privacy</button><button className="hover:text-white transition-colors">Terms</button><button className="hover:text-white transition-colors">@muse</button></div>
        </footer>
      </div>

      <style>{`
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s ease infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(79,70,229,0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(79,70,229,0.5); }
      `}</style>
    </div>
  );
}