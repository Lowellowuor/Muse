import { useState } from 'react';
import { Brain, Sparkles, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onGenerate: (prompt: string, tone: string, length: string) => Promise<void>;
  isGenerating: boolean;
  generatedContent: string;
  tone: string;
  length: string;
  onToneChange: (tone: string) => void;
  onLengthChange: (length: string) => void;
  onUseContent: (content: string) => void;
}

const tones = ['professional', 'casual', 'inspiring', 'reflective'];
const lengths = ['short', 'medium', 'long'];

export default function AIWriter({ 
  onGenerate, 
  isGenerating, 
  generatedContent, 
  tone, 
  length, 
  onToneChange, 
  onLengthChange,
  onUseContent 
}: Props) {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt, tone, length);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={16} className="text-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">AI Writing Assistant</h3>
      </div>
      
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to write about..."
          rows={2}
          className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
        />
        
        <div className="flex gap-2">
          <select
            value={tone}
            onChange={(e) => onToneChange(e.target.value)}
            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none"
          >
            {tones.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          
          <select
            value={length}
            onChange={(e) => onLengthChange(e.target.value)}
            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none"
          >
            {lengths.map(l => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
          
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="px-3 py-1.5 bg-cyan-500 text-black rounded-xl text-xs font-medium hover:bg-cyan-400 transition disabled:opacity-50 flex items-center gap-1"
          >
            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
            Generate
          </button>
        </div>
        
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-black/50 border border-white/10"
          >
            <p className="text-sm text-gray-300 mb-2">{generatedContent}</p>
            <button
              onClick={() => onUseContent(generatedContent)}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <Sparkles size={10} />
              Use this content
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}