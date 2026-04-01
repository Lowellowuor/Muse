import { Sparkles, Lightbulb, Zap } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

interface Props {
  suggestions: Suggestion[];
}

export default function SmartSuggestions({ suggestions }: Props) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles size={14} className="text-yellow-400" />;
      case 'lightbulb': return <Lightbulb size={14} className="text-cyan-400" />;
      default: return <Zap size={14} className="text-purple-400" />;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-yellow-400" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Smart Suggestions</h3>
      </div>
      
      <div className="space-y-2">
        {suggestions.map(suggestion => (
          <button
            key={suggestion.id}
            onClick={suggestion.action}
            className="w-full flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition text-left"
          >
            {getIcon(suggestion.icon)}
            <div>
              <p className="text-sm text-white">{suggestion.title}</p>
              <p className="text-xs text-gray-400">{suggestion.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}