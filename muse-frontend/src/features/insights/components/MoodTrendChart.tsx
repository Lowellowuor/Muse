import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { MoodTrend } from '../types';

interface Props {
  trends: MoodTrend[];
}

const moodColors = {
  inspired: 'bg-amber-400',
  reflective: 'bg-blue-400',
  peaceful: 'bg-emerald-400',
  curious: 'bg-cyan-400',
  anxious: 'bg-red-400',
  energetic: 'bg-purple-400',
  dark: 'bg-gray-500',
  urgent: 'bg-pink-500',
  serene: 'bg-teal-400',
};

export default function MoodTrendChart({ trends }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Mood Distribution</h3>
      </div>
      
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div key={trend.mood}>
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize text-gray-300">{trend.mood}</span>
              <span className="text-gray-400">{trend.percentage}% ({trend.count} entries)</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trend.percentage}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`h-full rounded-full ${moodColors[trend.mood] || 'bg-gray-400'}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Avg {trend.averageWords} words</span>
              <span>Best: {trend.bestTimeOfDay}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}