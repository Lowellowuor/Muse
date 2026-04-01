import { Sparkles, FolderOpen, MessageCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Recommendation } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  recommendations: Recommendation[];
}

export default function PersonalizedRecommendations({ recommendations }: Props) {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'prompt': return Sparkles;
      case 'room': return FolderOpen;
      case 'thread': return MessageCircle;
      default: return Lightbulb;
    }
  };

  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/10',
    medium: 'border-yellow-500/30 bg-yellow-500/10',
    low: 'border-blue-500/30 bg-blue-500/10',
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => {
        const Icon = getIcon(rec.type);
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border ${priorityColors[rec.priority]} transition-all cursor-pointer hover:scale-[1.02]`}
            onClick={() => navigate(rec.actionLink)}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-white/10 rounded text-gray-400">
                    {rec.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{rec.description}</p>
                <p className="text-[10px] text-cyan-400">✨ {rec.reason}</p>
              </div>
              <Sparkles size={14} className="text-cyan-400 opacity-50" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}