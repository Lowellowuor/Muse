import { useRef, useState } from 'react';
import { Users, Plus, ArrowRight, MessageSquare, Globe, Sparkles, ChevronRight, Activity, Clock } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router';
import type { ActiveCircle } from '../../store/useConnectionsStore';

interface Props {
  circle: ActiveCircle;
  onJoin?: () => void;
  index?: number;
}

export default function ActiveCircleCard({ circle, onJoin, index = 0 }: Props) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-[#1c1c1c] to-[#161618] border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.02] shadow-2xl flex flex-col h-full overflow-hidden cursor-pointer"
      onClick={() => navigate(`/threads/${circle.id}?type=circle`)}
    >
      {/* Animated Gradient Background */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.2 : 0.05, scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 blur-3xl pointer-events-none"
      />
      
      {/* Top Glow Effect */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
      />

      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              <span className="text-[8px] font-bold text-white/80 uppercase tracking-wider">Active Circle</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <Activity size={10} className="text-white/60" />
              <span className="text-[8px] font-mono text-gray-500">{circle.recentActivity}</span>
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white/90">
            {circle.name}
          </h3>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onJoin?.(); }}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all active:scale-90 shadow-lg shrink-0"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Description */}
      <p className="text-gray-400 font-serif italic text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
        "{circle.description}"
      </p>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-[9px] font-medium text-gray-500 border border-white/10 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
          <Globe size={10} /> {circle.theme}
        </span>
        {circle.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[9px] text-gray-500 border border-white/10 px-2.5 py-1 rounded-lg">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-5 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {circle.members.slice(0, 3).map((member, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="w-8 h-8 rounded-lg overflow-hidden border-2 border-[#1c1c1c] shadow-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-gray-400"
              >
                {member.charAt(0)}
              </motion.div>
            ))}
            {circle.memberCount > 3 && (
              <div className="w-8 h-8 rounded-lg bg-white/10 border-2 border-[#1c1c1c] flex items-center justify-center text-[9px] font-bold text-gray-400 shadow-lg">
                +{circle.memberCount - 3}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-none mb-0.5">{circle.memberCount} Members</p>
            <div className="flex items-center gap-1">
              <Clock size={8} className="text-gray-600" />
              <p className="text-[8px] font-mono text-gray-600">Active pulse</p>
            </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-white/80 transition-colors"
        >
          Enter <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </motion.div>
      </div>

      {/* Decorative Corner Sparkle */}
      {circle.pinned && (
        <div className="absolute top-4 right-4">
          <Sparkles size={12} className="text-white/60 animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}