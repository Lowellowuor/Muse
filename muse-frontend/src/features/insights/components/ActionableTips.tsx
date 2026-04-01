import { Target, CheckCircle } from 'lucide-react';
import { ActionableTip } from '../types';

interface Props {
  tips: ActionableTip[];
  onComplete: (tipId: string) => void;
}

export default function ActionableTips({ tips, onComplete }: Props) {
  const incompleteTips = tips.filter(t => !t.completed);
  const completedTips = tips.filter(t => t.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Actionable Tips</h3>
      </div>
      
      {/* Incomplete Tips */}
      <div className="space-y-2">
        {incompleteTips.map(tip => (
          <div
            key={tip.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition cursor-pointer"
            onClick={() => onComplete(tip.id)}
          >
            <div className="text-2xl">{tip.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{tip.title}</p>
              <p className="text-xs text-gray-400">{tip.description}</p>
            </div>
            <button className="px-3 py-1 text-xs bg-white text-black rounded-lg font-medium hover:bg-white/90">
              Complete
            </button>
          </div>
        ))}
      </div>
      
      {/* Completed Tips */}
      {completedTips.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2">Completed</p>
          {completedTips.map(tip => (
            <div key={tip.id} className="flex items-center gap-3 p-2 opacity-50">
              <div className="text-2xl">{tip.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">{tip.title}</p>
              </div>
              <CheckCircle size={14} className="text-green-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}