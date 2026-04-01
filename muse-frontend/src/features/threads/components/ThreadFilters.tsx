import { Search, Filter, X } from 'lucide-react';
import { ThreadType, ThreadMood } from '../types';

interface Props {
  searchQuery: string;
  selectedType: ThreadType | null;
  selectedMood: ThreadMood | null;
  onSearchChange: (query: string) => void;
  onTypeChange: (type: ThreadType | null) => void;
  onMoodChange: (mood: ThreadMood | null) => void;
  onClearFilters: () => void;
}

const threadTypes: ThreadType[] = ['discussion', 'question', 'resource', 'poll', 'announcement'];
const threadMoods: ThreadMood[] = ['contemplative', 'curious', 'dark', 'hopeful', 'urgent', 'serene'];

export default function ThreadFilters({
  searchQuery,
  selectedType,
  selectedMood,
  onSearchChange,
  onTypeChange,
  onMoodChange,
  onClearFilters,
}: Props) {
  const hasFilters = searchQuery || selectedType || selectedMood;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search threads by title, content, or tags..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
        />
      </div>
      
      {/* Type Filters */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Filter by type:</p>
        <div className="flex gap-2 flex-wrap">
          {threadTypes.map(type => (
            <button
              key={type}
              onClick={() => onTypeChange(selectedType === type ? null : type)}
              className={`px-3 py-1 rounded-full text-xs capitalize transition ${
                selectedType === type ? 'bg-white text-black' : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mood Filters */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Filter by mood:</p>
        <div className="flex gap-2 flex-wrap">
          {threadMoods.map(mood => (
            <button
              key={mood}
              onClick={() => onMoodChange(selectedMood === mood ? null : mood)}
              className={`px-3 py-1 rounded-full text-xs capitalize transition ${
                selectedMood === mood ? 'bg-white text-black' : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
      
      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
        >
          <X size={12} /> Clear all filters
        </button>
      )}
    </div>
  );
}