import { TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProgressMetric } from '../types';

interface Props {
  metrics: ProgressMetric[];
}

export default function ProgressTracker({ metrics }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Target size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Progress Metrics</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-gray-400">{metric.label}</p>
              {metric.trend === 'up' && <TrendingUp size={14} className="text-green-400" />}
              {metric.trend === 'down' && <TrendingUp size={14} className="text-red-400 rotate-180" />}
            </div>
            <p className="text-2xl font-bold text-white">{metric.current}</p>
            <p className="text-xs text-gray-500">Target: {metric.target} {metric.unit}</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full"
                style={{ width: `${(metric.current / metric.target) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-2">
              {metric.current > metric.previous ? `+${metric.current - metric.previous}` : `${metric.current - metric.previous}`} from last week
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}