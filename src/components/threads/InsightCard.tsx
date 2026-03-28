import { Sparkles, TrendingUp, Zap, Brain, Star, Flame } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

interface Props {
  text: string;
  type?: 'insight' | 'trend' | 'pattern' | 'suggestion';
  index?: number;
  onClick?: () => void;
}

const typeConfig = {
  insight: { icon: Sparkles, color: 'text-white/70', bg: 'bg-white/80/10', border: 'border-white/80/20', gradient: 'from-white/80/5 to-transparent' },
  trend: { icon: TrendingUp, color: 'text-white/70', bg: 'bg-white/80/10', border: 'border-white/80/20', gradient: 'from-white/80/5 to-transparent' },
  pattern: { icon: Brain, color: 'text-white/70', bg: 'bg-white/80/10', border: 'border-white/80/20', gradient: 'from-white/80/5 to-transparent' },
  suggestion: { icon: Star, color: 'text-white/70', bg: 'bg-white/80/10', border: 'border-white/80/20', gradient: 'from-white/80/5 to-transparent' },
};

export default function InsightCard({ text, type = 'insight', index = 0, onClick }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ x: 4, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative bg-gradient-to-br from-[#1c1c1c] to-[#161618] border ${config.border} rounded-xl p-4 shadow-lg transition-all duration-500 cursor-pointer overflow-hidden`}
    >
      {/* Animated Background Gradient */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-r ${config.gradient} pointer-events-none`}
      />
      
      {/* Left Accent Line */}
      <motion.div 
        animate={{ height: isHovered ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
        className={`absolute left-0 top-0 w-0.5 ${config.color.replace('text', 'bg')} rounded-full`}
        style={{ height: '0%' }}
      />

      <div className="flex gap-3 items-start relative z-10">
        <motion.div 
          animate={{ rotate: isHovered ? 5 : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className={`${config.bg} ${config.color} p-2 rounded-xl shrink-0 border ${config.border}`}
        >
          <Icon size={16} />
        </motion.div>
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-relaxed font-medium group-hover:text-white transition-colors">
            {text}
          </p>
          
          {/* Type Badge */}
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-1 h-1 rounded-full ${config.color.replace('text', 'bg')}`} />
            <span className={`text-[8px] font-bold uppercase tracking-wider ${config.color}`}>
              {type}
            </span>
            <span className="text-[8px] text-gray-600">•</span>
            <span className="text-[8px] text-gray-600">Just now</span>
          </div>
        </div>
        
        {/* Decorative Element */}
        <motion.div 
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-2 right-2"
        >
          <Flame size={10} className="text-white/70/50" />
        </motion.div>
      </div>
      
      {/* Hover Glow Effect */}
      <motion.div 
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute -bottom-4 -right-4 w-20 h-20 ${config.bg} blur-2xl rounded-full pointer-events-none`}
      />
    </motion.div>
  );
}