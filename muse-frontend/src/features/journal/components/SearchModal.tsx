import { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { JournalEntry, MoodType } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onSearch: (query: string, mood: MoodType | null) => void;
}

const moods: MoodType[] = ['inspired', 'reflective', 'anxious', 'peaceful', 'energetic'];

export default function SearchModal({ isOpen, onClose, entries, onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleSearch = () => {
    onSearch(query, selectedMood);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#111318] border border-white/10 rounded-2xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Search size={20} className="text-white" />
                  <h2 className="text-xl font-bold text-white">Search Journal</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by title, content, or tags..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 mb-4"
                autoFocus
              />

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">Filter by mood</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMood(null)}
                    className={`px-3 py-1 rounded-full text-xs transition ${
                      selectedMood === null
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    All
                  </button>
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1 rounded-full text-xs transition ${
                        selectedMood === mood
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition"
              >
                Search
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  {entries.length} entries available
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}