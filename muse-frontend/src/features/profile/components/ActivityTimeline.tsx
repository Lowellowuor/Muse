import { Clock, FileText, MessageCircle, FolderOpen, Archive, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../types';

interface Props {
  activities: Activity[];
}

const typeIcons = {
  journal: FileText,
  thread: MessageCircle,
  room: FolderOpen,
  artifact: Archive,
  achievement: Award,
  like: Heart,
};

const typeColors = {
  journal: 'text-blue-400',
  thread: 'text-purple-400',
  room: 'text-emerald-400',
  artifact: 'text-cyan-400',
  achievement: 'text-yellow-400',
  like: 'text-red-400',
};

export default function ActivityTimeline({ activities }: Props) {
  const navigate = useNavigate();

  const timeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white">Recent Activity</h3>
      
      <div className="space-y-2">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          const color = typeColors[activity.type];
          
          return (
            <button
              key={activity.id}
              onClick={() => navigate(activity.link)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left"
            >
              <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center ${color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{activity.title}</p>
                <p className="text-xs text-gray-400">{activity.description}</p>
                {activity.metadata?.wordCount && (
                  <p className="text-[10px] text-gray-500">{activity.metadata.wordCount} words</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">{timeAgo(activity.timestamp)}</p>
                {activity.metadata?.mood && (
                  <span className="text-xs">
                    {activity.metadata.mood === 'inspired' && '⚡'}
                    {activity.metadata.mood === 'reflective' && '🤔'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}