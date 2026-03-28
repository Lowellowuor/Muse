import React from 'react';
import { Lock, Globe, ShieldCheck, Sparkles, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

export default function PrivacyBadge() {
  const { soloMode, toggleSoloMode } = useUserStore();

  return (
    <motion.button 
      onClick={toggleSoloMode}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-500 overflow-hidden cursor-pointer shadow-lg ${
        soloMode 
          ? 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/10 border-indigo-500/40 text-white/80 shadow-white/10' 
          : 'bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
      }`}
    >
      {/* Animated Background Shimmer */}
      <AnimatePresence>
        {soloMode && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Pulsing Glow Effect */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full blur-md ${
          soloMode ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
        } pointer-events-none`}
      />

      {/* Mode Icon with Animation */}
      <motion.div 
        className="relative z-10"
        animate={{ 
          rotate: soloMode ? [0, 5, 0, -5, 0] : 0,
          scale: soloMode ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {soloMode ? (
          <Lock size={14} className="drop-shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
        ) : (
          <Globe size={14} className="drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
        )}
      </motion.div>

      {/* Mode Label */}
      <motion.span 
        className="relative z-10 text-[10px] font-bold uppercase tracking-wider"
        animate={{ 
          letterSpacing: soloMode ? '0.1em' : '0.05em'
        }}
        transition={{ duration: 0.3 }}
      >
        {soloMode ? 'Solo Mode' : 'Community'}
      </motion.span>

      {/* Divider */}
      <div className="relative z-10 w-px h-3 bg-current opacity-30 mx-0.5" />
      
      {/* Privacy Indicator */}
      <motion.div 
        className="relative z-10 flex items-center gap-1.5"
        whileHover={{ scale: 1.05 }}
      >
        {soloMode ? (
          <>
            <EyeOff size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <motion.span 
              className="text-[8px] font-mono opacity-60 group-hover:opacity-100 transition-opacity"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Private
            </motion.span>
          </>
        ) : (
          <>
            <Eye size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-[8px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
              Public
            </span>
          </>
        )}
        <ShieldCheck size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Floating Sparkles (Solo Mode) */}
      <AnimatePresence>
        {soloMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles size={8} className="text-white/80 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip on Hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-[9px] text-white whitespace-nowrap pointer-events-none border border-white/10"
      >
        {soloMode 
          ? 'Your activity is private. Only you can see your rooms and artifacts.' 
          : 'Your activity is public. Others can discover your rooms and creations.'}
      </motion.div>
    </motion.button>
  );
}