import { useRef, useState } from 'react';
import { MessageCircle, Zap, ExternalLink, Sparkles, Heart, Star } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import type { Collaborator } from '../../store/useConnectionsStore';

interface Props {
  collaborator: Collaborator;
  index?: number;
}

export default function CollaboratorCard({ collaborator, index = 0 }: Props) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    'Online': 'bg-white/60',
    'Reflecting': 'bg-white/40',
    'Deep Focus': 'bg-white/80',
    'Offline': 'bg-white/20',
    'Away': 'bg-white/30'
  };

  const statusText = {
    'Online': 'Active now',
    'Reflecting': 'In reflection',
    'Deep Focus': 'Deep flow',
    'Offline': 'Offline',
    'Away': 'Away'
  };

  const statusGlow = {
    'Online': 'shadow-white/30',
    'Reflecting': 'shadow-white/20',
    'Deep Focus': 'shadow-white/40',
    'Offline': 'shadow-white/10',
    'Away': 'shadow-white/15'
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-[#1c1c1c] to-[#161618] border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.04] shadow-2xl overflow-hidden cursor-pointer"
    >
      {/* Animated Background Glow */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none"
      />
      
      {/* Top Accent Line */}
      <motion.div 
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.4 }}
        className="absolute top-0 left-0 h-0.5 bg-white/40 rounded-full"
        style={{ width: '0%' }}
      />

      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-all shadow-2xl"
          >
            {collaborator.avatar ? (
              <motion.img 
                src={collaborator.avatar} 
                alt={collaborator.name} 
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl font-bold text-gray-400">
                {collaborator.name.charAt(0)}
              </div>
            )}
          </motion.div>
          <motion.div 
            animate={{ scale: isHovered ? 1.2 : 1 }}
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1c1c1c] ${statusColors[collaborator.status]} shadow-lg ${statusGlow[collaborator.status]}`}
          />
        </div>

        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all"
          >
            <MessageCircle size={14} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ExternalLink size={14} />
          </motion.button>
        </div>
      </div>

      <div className="relative z-10 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors tracking-tight">
            {collaborator.name}
          </h4>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[collaborator.status]} animate-pulse`} />
            <span className="text-[8px] text-gray-500">{statusText[collaborator.status]}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">{collaborator.role}</p>
        </div>
        
        <p className="text-gray-400 font-serif italic text-sm leading-relaxed line-clamp-2 mb-3">
          "{collaborator.bio}"
        </p>
      </div>

      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap gap-2">
        {collaborator.sharedThemes.slice(0, 3).map((theme, i) => (
          <motion.span 
            key={theme}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="text-[8px] font-bold text-white/70 bg-white/10 border border-white/20 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1"
          >
            <Sparkles size={8} /> {theme}
          </motion.span>
        ))}
        {collaborator.sharedThemes.length > 3 && (
          <span className="text-[8px] text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">
            +{collaborator.sharedThemes.length - 3}
          </span>
        )}
      </div>

      {/* Mutual Connections Indicator */}
      {collaborator.mutualConnections && collaborator.mutualConnections > 0 && (
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
            <Heart size={8} className="text-white/60" />
            <span className="text-[7px] text-gray-500">{collaborator.mutualConnections} mutual</span>
          </div>
        </div>
      )}

      {/* Status Overlay for Deep Focus */}
      {collaborator.status === 'Deep Focus' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none rounded-2xl"
        >
          <div className="bg-[#1c1c1c] border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
            <Zap size={12} className="text-white/80 animate-pulse" />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">In Deep Flow</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}