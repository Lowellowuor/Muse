import { X, FileText, Image, Link as LinkIcon, Mic, Quote, File } from 'lucide-react';
import { Artifact } from '../../../types';
import { motion } from 'framer-motion';

interface Props {
  artifact: Artifact;
  onDelete: (id: string) => void;
}

const icons = {
  note: { icon: FileText, emoji: '📝' },
  image: { icon: Image, emoji: '🖼️' },
  link: { icon: LinkIcon, emoji: '🔗' },
  audio: { icon: Mic, emoji: '🎤' },
  quote: { icon: Quote, emoji: '💬' },
  document: { icon: File, emoji: '📄' },
};

export default function ArtifactCard({ artifact, onDelete }: Props) {
  const { emoji } = icons[artifact.type];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/30 transition-all relative"
    >
      <button
        onClick={() => onDelete(artifact.id)}
        className="absolute top-3 right-3 p-1 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition hover:bg-red-500/20"
      >
        <X size={12} className="text-red-400" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="text-2xl">{emoji}</div>
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">{artifact.title}</h4>
          <p className="text-sm text-gray-400 line-clamp-2">{artifact.content}</p>
          {artifact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {artifact.tags.map(tag => (
                <span key={tag} className="text-[10px] text-gray-500">#{tag}</span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-gray-600 mt-2">
            {new Date(artifact.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}