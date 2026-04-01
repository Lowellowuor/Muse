import { Brain } from 'lucide-react';

interface Props {
  insights: string[];
}

export default function RoomInsights({ insights }: Props) {
  if (insights.length === 0) return null;
  
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={16} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">AI Insights</h3>
      </div>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="text-sm text-gray-300">• {insight}</li>
        ))}
      </ul>
    </div>
  );
}