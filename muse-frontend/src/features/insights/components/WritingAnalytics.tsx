import { Zap, Calendar, BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import { WritingAnalytics as WritingAnalyticsType } from '../types';

interface Props {
  analytics: WritingAnalyticsType;
}

export default function WritingAnalytics({ analytics }: Props) {
  const items = [
    { icon: Zap, label: 'Peak Hour', value: `${analytics.mostProductiveHour}:00`, color: 'text-yellow-400' },
    { icon: Calendar, label: 'Most Productive Day', value: analytics.mostProductiveDay, color: 'text-blue-400' },
    { icon: BookOpen, label: 'Avg Words/Session', value: analytics.averageWordsPerSession, color: 'text-green-400' },
    { icon: TrendingUp, label: 'Consistency Score', value: `${analytics.writingConsistency}%`, color: 'text-purple-400' },
    { icon: Clock, label: 'Sessions This Week', value: analytics.totalSessionsThisWeek, color: 'text-cyan-400' },
    { icon: Award, label: 'Best Streak', value: `${analytics.bestStreak} days`, color: 'text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
            <Icon size={18} className={item.color + ' mb-2'} />
            <p className="text-xl font-bold text-white">{item.value}</p>
            <p className="text-[10px] text-gray-500 mt-1">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}