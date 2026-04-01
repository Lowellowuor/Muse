import { Sparkles, Plus, FolderOpen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
}

const suggestions: Suggestion[] = [
  { id: '1', title: 'Write about your day', description: 'Reflect on today\'s highlights and challenges', icon: Sparkles, action: '/journal' },
  { id: '2', title: 'Create a mood board', description: 'Gather visual inspiration for your project', icon: FolderOpen, action: '/rooms' },
  { id: '3', title: 'Join a discussion', description: 'Share your thoughts on AI creativity', icon: MessageSquare, action: '/threads' },
];

export default function SmartSuggestions() {
  const navigate = useNavigate();

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Smart Suggestions</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(suggestion.action)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left"
            >
              <Icon size={18} className="text-white" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{suggestion.title}</p>
                <p className="text-xs text-gray-400">{suggestion.description}</p>
              </div>
              <Plus size={14} className="text-gray-400" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}