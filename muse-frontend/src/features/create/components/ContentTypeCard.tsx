import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ElementType } from 'react';

interface Props {
  icon: ElementType;  // Changed from string to component type
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export default function ContentTypeCard({ icon: Icon, title, description, color, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-6 rounded-2xl bg-gradient-to-br ${color} border border-white/10 hover:border-white/30 transition-all text-left w-full group`}
    >
      <div className="flex items-start justify-between">
        <Icon size={28} className="text-white mb-3" />
        <Plus size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </motion.button>
  );
}