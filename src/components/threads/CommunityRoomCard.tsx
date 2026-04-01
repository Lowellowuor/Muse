import { useRef, useState } from 'react';
import { Globe, Users, ArrowRight, Sparkles, Star, TrendingUp, Clock, Eye, Heart } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import type { CommunityRoom } from '../../store/useConnectionsStore';

interface Props {
  room: CommunityRoom;
  index?: number;
}

export default function CommunityRoomCard({ room, index = 0 }: Props) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1c1c] to-[#161618] border border-white/5 shadow-2xl transition-all duration-700 hover:border-white/40 cursor-pointer"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <img 
          src={room.coverImage} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
          alt={room.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Top Glow Effect */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
      />

      <div className="relative h-full z-10 p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-xl group-hover:bg-white group-hover:border-white/80 transition-all duration-500"
          >
            <Globe size={22} />
          </motion.div>
          
          <div className="flex items-center gap-2">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Users size={12} className="text-white/80" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">{room.memberCount} Members</span>
            </div>
            {room.isJoined && (
              <div className="bg-white/80/20 backdrop-blur-md border border-white/80/30 rounded-full px-2 py-1.5">
                <span className="text-[8px] font-bold text-white/70 uppercase tracking-wider">Joined</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-white/80" />
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">
              {room.category || 'Public Realm'}
            </span>
            {room.tags && room.tags.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-[8px] text-gray-500">{room.tags[0]}</span>
              </>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3 group-hover:text-white/80 transition-all duration-500">
            {room.name}
          </h3>
          
          <p className="text-gray-400 font-serif italic text-sm leading-relaxed mb-5 max-w-lg line-clamp-2 group-hover:text-gray-300 transition-colors">
            "{room.description}"
          </p>

          {/* Stats Row - Using only available properties */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              <Eye size={10} className="text-gray-600" />
              <span className="text-[9px] text-gray-500">{room.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-gray-600" />
              <span className="text-[9px] text-gray-500">Active community</span>
            </div>
            {room.tags && room.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp size={10} className="text-white/70" />
                <span className="text-[8px] text-gray-500">#{room.tags[0]}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/10">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-white/70" />
              <span className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">Growing community</span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.1, rotate: -45 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:border-white/80 transition-all shadow-xl group-hover:rotate-[-45deg] duration-500"
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover Overlay with Quick Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none z-20"
      >
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full bg-white text-white text-xs font-bold hover:bg-white/70 transition-colors">
            Explore Room
          </button>
          {!room.isJoined && (
            <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-colors">
              Join
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}