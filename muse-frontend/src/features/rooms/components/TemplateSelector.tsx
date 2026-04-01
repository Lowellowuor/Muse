import { Sparkles, X } from 'lucide-react';
import { roomTemplates } from '../../../lib/roomTemplates';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: typeof roomTemplates[0]) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelectTemplate }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111318] border border-white/10 rounded-2xl max-w-2xl w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-white" />
            <h2 className="text-xl font-bold text-white">Room Templates</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => onSelectTemplate(template)}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-left group"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="font-bold text-white mb-1">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.suggestedTags.map(tag => (
                  <span key={tag} className="text-[10px] text-gray-500">#{tag}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}