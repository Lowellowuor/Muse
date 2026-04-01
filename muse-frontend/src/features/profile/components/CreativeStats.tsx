import { TrendingUp, Flame, BookOpen, MessageCircle, FolderOpen, Archive, Heart, Eye } from 'lucide-react';
import { CreativeStats as CreativeStatsType } from '../types';

interface Props {
  stats: CreativeStatsType;
}

export default function CreativeStats({ stats }: Props) {
  const statItems = [
    { icon: BookOpen, label: 'Total Words', value: stats.totalWords.toLocaleString(), color: 'text-blue-400' },
    { icon: Flame, label: 'Current Streak', value: `${stats.currentStreak} days`, color: 'text-orange-400' },
    { icon: TrendingUp, label: 'Longest Streak', value: `${stats.longestStreak} days`, color: 'text-green-400' },
    { icon: MessageCircle, label: 'Threads', value: stats.totalThreads, color: 'text-purple-400' },
    { icon: FolderOpen, label: 'Rooms', value: stats.totalRooms, color: 'text-emerald-400' },
    { icon: Archive, label: 'Artifacts', value: stats.totalArtifacts, color: 'text-cyan-400' },
    { icon: Heart, label: 'Likes Received', value: stats.totalLikesReceived, color: 'text-red-400' },
    { icon: Eye, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Creative Statistics</h3>
        <div className="text-right">
          <span className="text-xs text-gray-400">Level {stats.level}</span>
          <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full" style={{ width: `${stats.nextLevelProgress}%` }} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <Icon size={16} className={item.color} />
              <p className="text-lg font-bold text-white mt-1">{item.value}</p>
              <p className="text-[10px] text-gray-500">{item.label}</p>
            </div>
          );
        })}
      </div>
      
      {/* Rank Badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
        <div>
          <p className="text-xs text-gray-300">Current Rank</p>
          <p className="text-xl font-bold text-white">{stats.rank}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-300">Next Rank</p>
          <p className="text-sm text-white">Master</p>
        </div>
      </div>
    </div>
  );
}