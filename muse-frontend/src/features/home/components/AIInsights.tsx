import { Brain, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  stats: { streak: number; totalWords: number };
}

export default function AIInsights({ stats }: Props) {
  const insights = [
    { icon: TrendingUp, text: `You're on a ${stats.streak}-day streak! Your most creative time is between 8-10 PM.` },
    { icon: Lightbulb, text: 'Based on your writing patterns, you might enjoy exploring topics about AI and creativity.' },
    { icon: Sparkles, text: `You've written ${stats.totalWords.toLocaleString()} words. That's equivalent to a short novel!` },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
            >
              <Icon size={16} className="text-white mt-0.5" />
              <p className="text-sm text-gray-300 leading-relaxed">{insight.text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}