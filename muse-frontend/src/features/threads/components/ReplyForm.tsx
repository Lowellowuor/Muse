import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onSubmit: (content: string) => void;
  placeholder?: string;
  suggestedReplies?: string[];
}

export default function ReplyForm({ onSubmit, placeholder = "Write a reply...", suggestedReplies }: Props) {
  const [content, setContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const useSuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
      />
      
      <div className="flex justify-between items-center">
        {suggestedReplies && suggestedReplies.length > 0 && (
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
          >
            <Sparkles size={12} />
            AI Suggestions
          </button>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="ml-auto px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={16} />
          Post Reply
        </button>
      </div>
      
      {/* AI Suggestions */}
      {showSuggestions && suggestedReplies && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-white/5 border border-white/10"
        >
          <p className="text-xs text-gray-400 mb-2">Suggested replies:</p>
          <div className="space-y-2">
            {suggestedReplies.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => useSuggestion(suggestion)}
                className="w-full text-left text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}