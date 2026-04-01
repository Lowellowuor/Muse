import { Clock, FileText, MessageCircle, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecentCreation } from '../types';

interface Props {
  creations: RecentCreation[];
}

const typeIcons = {
  journal: FileText,
  thread: MessageCircle,
  room: FolderOpen,
  artifact: FolderOpen,
  note: FileText,
  idea: FileText,
};

export default function RecentCreations({ creations }: Props) {
  const navigate = useNavigate();

  if (creations.length === 0) return null;

  const timeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-gray-400" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white">Recent Creations</h3>
      </div>
      
      <div className="space-y-2">
        {creations.slice(0, 5).map(creation => {
          const Icon = typeIcons[creation.type];
          return (
            <button
              key={creation.id}
              onClick={() => navigate(creation.link)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon size={14} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-white line-clamp-1">{creation.title}</p>
                <p className="text-[10px] text-gray-500">{timeAgo(creation.createdAt)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}