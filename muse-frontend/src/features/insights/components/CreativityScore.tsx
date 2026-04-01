import { Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreativityScore as CreativityScoreType } from '../types';

interface Props {
  score: CreativityScoreType;
  trend: { direction: 'up' | 'down' | 'stable'; percentage: number };
}

export default function CreativityScore({ score, trend }: Props) {
  const subScores = [
    { label: 'Consistency', value: score.consistency },
    { label: 'Depth', value: score.depth },
    { label: 'Originality', value: score.originality },
    { label: 'Engagement', value: score.engagement },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} className="text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Creativity Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{score.overall}</span>
            <span className="text-sm text-gray-400">/ 100</span>
            {trend.direction !== 'stable' && (
              <span className={`text-sm flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage.toFixed(0)}% from last week
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          {subScores.map(sub => (
            <div key={sub.label} className="text-center">
              <p className="text-xl font-bold text-white">{sub.value}</p>
              <p className="text-[10px] text-gray-500">{sub.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Score History Preview */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Last 4 weeks</span>
          <TrendingUp size={12} className="text-green-400" />
        </div>
        <div className="flex items-end gap-2">
          {score.history.slice(-4).map((point, i) => (
            <div key={point.date} className="flex-1">
              <div 
                className="bg-gradient-to-t from-white to-gray-400 rounded-t"
                style={{ height: `${point.score * 1.5}px`, maxHeight: '80px' }}
              />
              <p className="text-[9px] text-gray-600 mt-1 text-center">
                {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}