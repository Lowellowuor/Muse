import { Brain, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Pattern } from '../types';

interface Props {
  patterns: Pattern[];
}

export default function PatternRecognition({ patterns }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Detected Patterns</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {patterns.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-white">{pattern.title}</h4>
              <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-full text-gray-300">
                {pattern.confidence}% confidence
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{pattern.description}</p>
            <div className="p-2 rounded-lg bg-white/5 mb-2">
              <p className="text-xs text-gray-500 italic">"{pattern.example}"</p>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Lightbulb size={12} className="text-cyan-400 mt-0.5" />
              <p className="text-xs text-cyan-300">{pattern.actionableTip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}