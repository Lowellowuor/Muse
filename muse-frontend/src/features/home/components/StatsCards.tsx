import { motion } from 'framer-motion';
import { Flame, BookOpen, Target, Award } from 'lucide-react';
import { HomeStats } from '../types';

interface Props {
  stats: HomeStats;
}

export default function StatsCards({ stats }: Props) {
  const statItems = [
    { icon: Flame, label: 'Current Streak', value: `${stats.streak} days`, color: 'from-orange-500 to-red-500' },
    { icon: BookOpen, label: 'Total Words', value: stats.totalWords.toLocaleString(), color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Weekly Goal', value: `${Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%`, color: 'from-green-500 to-emerald-500' },
    { icon: Award, label: 'Achievements', value: stats.achievements.filter(a => a.unlocked).length.toString(), color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
          >
            <Icon size={24} className="text-white mb-2" />
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-gray-400 mt-1">{item.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}