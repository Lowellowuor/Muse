import { FileText, Image, Link as LinkIcon, Mic, Quote, File } from 'lucide-react';
import { RoomStats as RoomStatsType } from '../../../types';

interface Props {
  stats: RoomStatsType;
}

const icons = {
  note: FileText,
  image: Image,
  link: LinkIcon,
  audio: Mic,
  quote: Quote,
  document: File,
};

export default function RoomStats({ stats }: Props) {
  const statCards = [
    { label: 'Total Artifacts', value: stats.totalArtifacts },
    { label: 'Total Words', value: stats.wordCount.toLocaleString() },
    { label: 'Top Tags', value: stats.mostUsedTags.slice(0, 3).join(', ') || '-' },
    { label: 'Last Active', value: stats.lastActive || '-' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
        >
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.label}</p>
        </div>
      ))}
      
      {/* Artifact breakdown */}
      <div className="col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-xs text-gray-500 mb-2">Artifact Types</p>
        <div className="flex gap-4">
          {Object.entries(stats.artifactBreakdown).map(([type, count]) => {
            const Icon = icons[type as keyof typeof icons];
            if (count === 0) return null;
            return (
              <div key={type} className="flex items-center gap-2">
                <Icon size={14} className="text-gray-400" />
                <span className="text-sm text-white">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}