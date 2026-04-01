import { MoodType, MoodOption } from '../../../types';

const moods: MoodOption[] = [
  { value: 'inspired', emoji: '⚡', label: 'Inspired', color: 'bg-white/20' },
  { value: 'reflective', emoji: '🤔', label: 'Reflective', color: 'bg-white/15' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-white/10' },
  { value: 'peaceful', emoji: '😌', label: 'Peaceful', color: 'bg-white/20' },
  { value: 'energetic', emoji: '🎨', label: 'Energetic', color: 'bg-white/20' },
];

interface Props {
  selected: MoodType;
  onSelect: (mood: MoodType) => void;
}

export default function MoodSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
            selected === mood.value
              ? 'bg-white text-black'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className={`text-[10px] font-medium ${
            selected === mood.value ? 'text-black' : 'text-gray-400'
          }`}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}