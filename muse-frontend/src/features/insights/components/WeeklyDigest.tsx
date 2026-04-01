import { Calendar, Sparkles, CheckCircle, Lightbulb, Heart } from 'lucide-react';
import { WeeklyDigest as WeeklyDigestType } from '../types';

interface Props {
  digest: WeeklyDigestType;
}

export default function WeeklyDigest({ digest }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Weekly Digest</h3>
        <span className="text-xs text-gray-500 ml-auto">{digest.week}</span>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{digest.summary}</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Sparkles size={12} className="text-yellow-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Highlights</h4>
          </div>
          <ul className="space-y-1">
            {digest.highlights.map((h, i) => (
              <li key={i} className="text-xs text-gray-400">• {h}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center gap-1 mb-2">
            <CheckCircle size={12} className="text-green-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Achievements</h4>
          </div>
          <ul className="space-y-1">
            {digest.achievements.map((a, i) => (
              <li key={i} className="text-xs text-green-400">✓ {a}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Lightbulb size={12} className="text-cyan-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Suggestions</h4>
          </div>
          <ul className="space-y-1">
            {digest.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-cyan-400">→ {s}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1">
          <Heart size={12} className="text-pink-400" />
          <p className="text-xs text-gray-400">{digest.moodOverview}</p>
        </div>
      </div>
    </div>
  );
}