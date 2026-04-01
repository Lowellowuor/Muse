import { BookOpen, Flame, TrendingUp, Type } from 'lucide-react';
import { Stats } from '../../../types';

interface Props {
  stats: Stats;
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    { icon: BookOpen, label: 'Entries', value: stats.totalEntries, color: 'text-white' },
    { icon: Flame, label: 'Current Streak', value: `${stats.currentStreak} days`, color: 'text-white' },
    { icon: TrendingUp, label: 'Longest Streak', value: `${stats.longestStreak} days`, color: 'text-white' },
    { icon: Type, label: 'Total Words', value: stats.totalWords.toLocaleString(), color: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <Icon size={16} className="text-gray-400 mb-2" />
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}