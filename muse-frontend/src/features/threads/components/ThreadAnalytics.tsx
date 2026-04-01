import { Eye, Heart, MessageCircle, TrendingUp, Users, Calendar } from 'lucide-react';
import { ThreadStats } from '../types';

interface Props {
  stats: ThreadStats;
}

export default function ThreadAnalytics({ stats }: Props) {
  const analyticsItems = [
    { icon: Eye, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'text-blue-400' },
    { icon: Heart, label: 'Total Likes', value: stats.totalLikes.toLocaleString(), color: 'text-red-400' },
    { icon: MessageCircle, label: 'Total Replies', value: stats.totalReplies.toLocaleString(), color: 'text-green-400' },
    { icon: TrendingUp, label: 'Weekly Growth', value: `${stats.weeklyGrowth > 0 ? '+' : ''}${stats.weeklyGrowth}`, color: 'text-yellow-400' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-white" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Community Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {analyticsItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3 rounded-xl bg-white/5">
              <Icon size={14} className={item.color} />
              <p className="text-lg font-bold text-white mt-1">{item.value}</p>
              <p className="text-[10px] text-gray-500">{item.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Active Threads</span>
          <span className="text-white font-bold">{stats.activeThreads}</span>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-gray-400">Most Active Tag</span>
          <span className="text-white">#{stats.mostActiveTag}</span>
        </div>
      </div>
    </div>
  );
}