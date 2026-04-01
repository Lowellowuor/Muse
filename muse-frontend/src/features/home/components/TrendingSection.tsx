// src/features/home/components/TrendingSection.tsx
import { motion } from 'framer-motion';
import { TrendingUp, Users, FolderOpen, MessageCircle, Zap, Brain, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrendingItem } from '../types';

interface Props {
  items: TrendingItem[];
}

const iconComponents = {
  Zap,
  Brain,
  Palette,
};

export default function TrendingSection({ items }: Props) {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const Icon = iconComponents[iconName as keyof typeof iconComponents] || Zap;
    return <Icon size={24} className="text-white" />;
  };

  const getMetricsText = (item: TrendingItem) => {
    if (item.type === 'room') return `${item.metrics.members} members • ${item.metrics.artifacts} artifacts`;
    if (item.type === 'thread') return `${item.metrics.replies} replies • ${item.metrics.views} views`;
    return '';
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Trending Now</h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer"
            onClick={() => navigate(item.type === 'room' ? `/rooms/${item.id}` : `/threads/${item.id}`)}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {getIcon(item.icon)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-[10px] text-gray-500">{getMetricsText(item)}</p>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">#{index + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}