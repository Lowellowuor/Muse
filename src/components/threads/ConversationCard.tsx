import { Sparkles, MessageCircle, Heart, Share2, Layers } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Define the CommentNode type locally since it's not exported
export interface CommentNode {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  tone: string;
  timestamp: string;
  themes: string[];
  likes?: number;
  replies?: CommentNode[];
}

const toneColors: Record<string, string> = {
  'Reflective': 'text-white/70 bg-white/70/10 border-white/70/20',
  'Supportive': 'text-white/70 bg-white/80/10 border-white/80/20',
  'Curious': 'text-white/70 bg-white/80/10 border-white/80/20',
  'Collaborative': 'text-white/70 bg-white/80/10 border-white/80/20',
  'Appreciative': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Sensitive': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Respectful Tension': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

interface Props {
  comment: CommentNode;
  index?: number;
  onReflect?: () => void;
  onAppreciate?: () => void;
  onBuild?: () => void;
  onPod?: () => void;
}

export default function ConversationCard({ comment, index = 0, onReflect, onAppreciate, onBuild, onPod }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const toneStyle = toneColors[comment.tone] || toneColors['Reflective'];

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="group bg-gradient-to-br from-[#1c1c1c]/80 to-[#161618]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl w-full hover:border-white/80/30 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={comment.authorAvatar} 
              alt={comment.authorName} 
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/10" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white/80 border-2 border-[#1c1c1c]" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-white/70 transition-colors">
              {comment.authorName}
            </h4>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{comment.timestamp}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full border text-[8px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${toneStyle}`}>
          <Sparkles size={10} />
          {comment.tone}
        </div>
      </div>
      
      <p className="text-gray-300 font-serif text-base leading-relaxed mb-5 pl-1 pr-2">
        "{comment.content}"
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {comment.themes.map((theme: string) => (
          <span 
            key={theme} 
            className="text-[8px] uppercase tracking-wider bg-white/5 text-gray-500 px-2 py-1 rounded-lg font-medium border border-white/5 hover:border-white/80/30 transition-colors"
          >
            #{theme}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReflect}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <MessageCircle size={12} /> Reflect
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAppreciate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <Heart size={12} /> Appreciate
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBuild}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80/10 hover:bg-white/80/20 rounded-full text-[10px] font-semibold text-white/70 hover:text-white/70 transition-all cursor-pointer border border-white/80/20 ml-auto"
        >
          <Share2 size={12} /> Build Together
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPod}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-semibold text-gray-500 hover:text-white transition-all cursor-pointer"
        >
          <Layers size={12} /> Pod
        </motion.button>
      </div>

      {/* Like count indicator */}
      {comment.likes && comment.likes > 0 && (
        <div className="absolute bottom-4 right-6 flex items-center gap-1">
          <Heart size={10} className="text-white/70 fill-white/70/50" />
          <span className="text-[8px] text-gray-500">{comment.likes} resonances</span>
        </div>
      )}
    </motion.div>
  );
}