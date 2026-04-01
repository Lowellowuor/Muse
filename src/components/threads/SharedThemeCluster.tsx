import { useConnectionsStore } from '../../store/useConnectionsStore';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Sparkles, TrendingUp, Star, Flame, Compass } from 'lucide-react';

interface ThemeStats {
  name: string;
  count: number;
  trend?: 'up' | 'down' | 'stable';
  activeUsers?: number;
}

export default function SharedThemeCluster() {
  const themes = useConnectionsStore(state => state.activeThemes);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  // Mock theme stats for demonstration
  const themeStats: Record<string, ThemeStats> = {
    'Silence': { name: 'Silence', count: 47, trend: 'up', activeUsers: 23 },
    'Brutalism': { name: 'Brutalism', count: 38, trend: 'up', activeUsers: 18 },
    'Identity': { name: 'Identity', count: 52, trend: 'stable', activeUsers: 31 },
    'Urban Voids': { name: 'Urban Voids', count: 29, trend: 'down', activeUsers: 12 },
    'Scale': { name: 'Scale', count: 34, trend: 'up', activeUsers: 19 },
    'Memory': { name: 'Memory', count: 41, trend: 'up', activeUsers: 24 },
    'Reverb': { name: 'Reverb', count: 26, trend: 'stable', activeUsers: 14 },
    'Typography': { name: 'Typography', count: 31, trend: 'up', activeUsers: 17 },
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp size={10} className="text-white/80" />;
    if (trend === 'down') return <TrendingUp size={10} className="text-white/70 rotate-180" />;
    return <Star size={10} className="text-gray-500" />;
  };

  const getTrendColor = (trend?: string) => {
    if (trend === 'up') return 'border-white/80/30 bg-white/5';
    if (trend === 'down') return 'border-white/80/30 bg-white/80/5';
    return 'border-gray-500/20 bg-white/5';
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#1c1c1c] to-[#161618] border border-white/5 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-white/80" />
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Shared Themes</h3>
        </div>
        <div className="flex items-center gap-1">
          <Compass size={10} className="text-gray-600" />
          <span className="text-[8px] text-gray-600">{themes.length} clusters</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, i) => {
          const stats = themeStats[theme] || { name: theme, count: 0, trend: 'stable', activeUsers: 0 };
          const trendColor = getTrendColor(stats.trend);
          
          return (
            <motion.button 
              key={theme}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-3 py-2 rounded-xl ${trendColor} border text-[10px] font-bold transition-all shadow-lg uppercase tracking-wider cursor-pointer overflow-hidden`}
            >
              {/* Hover Glow Effect */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.5 }}
                className={`absolute inset-0 bg-gradient-to-r from-${theme === 'Silence' ? 'indigo' : 'violet'}-500/10 to-transparent pointer-events-none`}
              />
              
              <div className="relative z-10 flex items-center gap-1.5">
                <span className={`text-gray-300 group-hover:text-white transition-colors`}>
                  #{theme}
                </span>
                {stats.count > 0 && (
                  <span className="text-[8px] text-gray-500 group-hover:text-gray-400 transition-colors">
                    {stats.count}
                  </span>
                )}
                {stats.trend && (
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                    {getTrendIcon(stats.trend)}
                  </span>
                )}
              </div>
              
              {/* Tooltip on Hover */}
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-[8px] text-white whitespace-nowrap pointer-events-none z-20 border border-white/10"
              >
                {stats.activeUsers > 0 ? `${stats.activeUsers} active` : 'Trending'} • {stats.count} discussions
              </motion.div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Summary Row */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Flame size={8} className="text-white/70" />
            <span className="text-[7px] text-gray-600">Trending: Silence</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1">
            <Star size={8} className="text-white/80" />
            <span className="text-[7px] text-gray-600">{themes.length} active clusters</span>
          </div>
        </div>
        <button className="text-[7px] font-bold text-white/80 hover:text-white/70 transition-colors uppercase tracking-wider">
          Explore All →
        </button>
      </div>
    </motion.div>
  );
}