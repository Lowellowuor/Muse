import { Brain, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { AIInsight } from '../../../types';

interface Props {
  insights: AIInsight[];
}

export default function InsightsPanel({ insights }: Props) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pattern': return TrendingUp;
      case 'suggestion': return Lightbulb;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={20} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">AI Insights</h3>
      </div>
      
      {insights.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <Sparkles size={24} className="text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            Write 3+ entries to receive AI-powered insights
          </p>
        </div>
      ) : (
        insights.map((insight) => {
          const Icon = getIcon(insight.type);
          return (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-3">
                <Icon size={16} className="text-white mt-0.5" />
                <p className="text-sm text-gray-300 leading-relaxed">{insight.content}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}