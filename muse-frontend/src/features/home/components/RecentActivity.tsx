// src/features/home/components/RecentActivity.tsx
import { motion } from 'framer-motion';
import { Clock, ArrowRight, FileText, FolderOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../types';
import { iconMap } from '../store/useHomeStore';

interface Props {
  activities: Activity[];
}

const iconComponents = {
  FileText,
  FolderOpen,
  MessageCircle,
};

export default function RecentActivity({ activities }: Props) {
  const navigate = useNavigate();

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const getIcon = (iconName: string) => {
    const Icon = iconComponents[iconName as keyof typeof iconComponents] || FileText;
    return <Icon size={18} className="text-white" />;
  };

  const getMoodIcon = (mood?: string) => {
    switch(mood) {
      case 'inspired': return '⚡';
      case 'reflective': return '🤔';
      case 'anxious': return '😰';
      case 'peaceful': return '😌';
      case 'energetic': return '🎨';
      default: return '';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-white" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Recent Activity</h3>
        </div>
        <button className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1">
          View all <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer"
            onClick={() => {
              if (activity.type === 'journal') navigate('/journal');
              if (activity.type === 'room') navigate('/rooms');
              if (activity.type === 'thread') navigate('/threads');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {getIcon(activity.icon)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{activity.title}</p>
              <p className="text-xs text-gray-400 line-clamp-1">{activity.preview}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">{getTimeAgo(activity.timestamp)}</p>
              {activity.mood && <span className="text-xs">{getMoodIcon(activity.mood)}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}