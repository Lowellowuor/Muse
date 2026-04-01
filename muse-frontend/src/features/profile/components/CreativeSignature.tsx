import { Brain, Clock, Tag, Sparkles } from 'lucide-react';
import { CreativeSignature as CreativeSignatureType } from '../types';

interface Props {
  signature: CreativeSignatureType;
}

export default function CreativeSignature({ signature }: Props) {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Creative Signature</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-sm text-gray-300">Dominant Mood</span>
          </div>
          <span className="text-sm text-white capitalize">{signature.dominantMood}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-400" />
            <span className="text-sm text-gray-300">Peak Creative Hour</span>
          </div>
          <span className="text-sm text-white">{signature.peakHour}:00</span>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-purple-400" />
            <span className="text-sm text-gray-300">Favorite Topics</span>
          </div>
          <div className="flex flex-wrap gap-1 text-right">
            {signature.favoriteTags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-cyan-400">#{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Writing Style</span>
          <span className="text-sm text-white capitalize">{signature.writingStyle}</span>
        </div>
        
        <div className="pt-3 border-t border-white/10">
          <p className="text-xs text-cyan-400 italic">✨ {signature.uniqueInsight}</p>
          <p className="text-xs text-gray-500 mt-2">💡 {signature.recommendation}</p>
        </div>
      </div>
    </div>
  );
}