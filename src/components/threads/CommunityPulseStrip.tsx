import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, MessageSquare, Sparkles, Flame, Compass, Brain, Heart, TrendingUp, Globe } from 'lucide-react';

const PULSE_MESSAGES = [
  { icon: <Zap size={14} />, text: "3 Circles Growing in 'Architecture of Silence'", color: 'text-white/80', bg: 'bg-white/10', glow: 'shadow-white/10' },
  { icon: <Users size={14} />, text: "Amina El-Sayed is reflecting in 'Silence'", color: 'text-white/70', bg: 'bg-white/80/10', glow: 'shadow-white/80/20' },
  { icon: <Sparkles size={14} />, text: "Global Theme: 'Identity' is surfacing today", color: 'text-white/80', bg: 'bg-white/10', glow: 'shadow-white/80/20' },
  { icon: <MessageSquare size={14} />, text: "New Perspective: Marcus shared a direct insight", color: 'text-white/80', bg: 'bg-white/10', glow: 'shadow-white/80/20' },
  { icon: <Compass size={14} />, text: "Exploration peak: 47 new artifacts collected", color: 'text-white/70', bg: 'bg-white/80/10', glow: 'shadow-white/80/20' },
  { icon: <Brain size={14} />, text: "Collective insight forming around Systems Thinking", color: 'text-white/70', bg: 'bg-white/80/10', glow: 'shadow-white/80/20' },
  { icon: <Heart size={14} />, text: "24 new connections formed this hour", color: 'text-pink-400', bg: 'bg-pink-500/10', glow: 'shadow-pink-500/20' },
  { icon: <TrendingUp size={14} />, text: "Dialogue depth increased by 12% this week", color: 'text-orange-400', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' },
];

export default function CommunityPulseStrip() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PULSE_MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const current = PULSE_MESSAGES[index];
  const nextIndex = (index + 1) % PULSE_MESSAGES.length;
  const next = PULSE_MESSAGES[nextIndex];

  return (
    <div 
      className="relative w-full h-12 bg-gradient-to-r from-black/20 via-transparent to-black/20 backdrop-blur-sm border-y border-white/5 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${current.color.replace('text', 'rgba(99,102,241,0.03)')}, transparent 70%)`,
            `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${current.color.replace('text', 'rgba(99,102,241,0.05)')}, transparent 70%)`,
            `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${current.color.replace('text', 'rgba(99,102,241,0.03)')}, transparent 70%)`,
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Scrolling Background Lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <motion.div
          animate={{ x: [0, -100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 h-full w-[200%] flex"
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-px h-full bg-gradient-to-b from-transparent via-white/80/30 to-transparent mx-2" />
          ))}
        </motion.div>
      </div>

      <div className="relative h-full flex items-center justify-center px-6">
        {/* Left Decorative Glow */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute left-0 w-32 h-full bg-gradient-to-r from-white/80/10 to-transparent pointer-events-none"
        />
        
        {/* Right Decorative Glow */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className="absolute right-0 w-32 h-full bg-gradient-to-l from-white/80/10 to-transparent pointer-events-none"
        />
        
        {/* Animated Pulse Ring */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className={`w-2 h-2 rounded-full ${current.color.replace('text', 'bg')}`} />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 w-2 h-2 rounded-full ${current.color.replace('text', 'bg')}`}
            />
          </motion.div>
        </div>

        {/* Main Message Carousel */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -30, opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-3 relative z-10"
            >
              <motion.span 
                whileHover={{ scale: 1.2, rotate: 5 }}
                className={`${current.color} drop-shadow-lg flex items-center justify-center`}
              >
                {current.icon}
              </motion.span>
              <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap bg-clip-text ${current.color}`}>
                {current.text}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Next Message Preview (for visual interest) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 pointer-events-none hidden md:block">
            <div className="flex items-center gap-2 text-[8px] text-gray-600">
              <span>Next:</span>
              <span className="truncate max-w-[200px]">{next.text}</span>
            </div>
          </div>
        </div>

        {/* Right Side Stats */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3">
          <motion.div 
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Live Pulse</span>
          </motion.div>
          
          {/* Message Counter */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            <Globe size={8} className="text-gray-500" />
            <span className="text-[7px] text-gray-500 font-mono">
              {index + 1}/{PULSE_MESSAGES.length}
            </span>
          </div>
        </div>

        {/* Mobile Indicator Dots */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex md:hidden gap-1">
          {PULSE_MESSAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === index 
                  ? `bg-${current.color.replace('text-', '')} w-3` 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Animated Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-white/80 via-white/80 to-white/80"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}