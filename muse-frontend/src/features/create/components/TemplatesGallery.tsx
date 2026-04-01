import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { ContentTemplate } from '../types';
import { getTemplateIcon } from '../store/useCreateStore';

interface Props {
  templates: ContentTemplate[];
  onSelectTemplate: (template: ContentTemplate) => void;
}

export default function TemplatesGallery({ templates, onSelectTemplate }: Props) {
  const featuredTemplates = templates.filter(t => t.isFeatured);
  const otherTemplates = templates.filter(t => !t.isFeatured);

  return (
    <div className="space-y-6">
      {/* Featured Templates */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-yellow-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Featured Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {featuredTemplates.map((template, index) => {
            const Icon = getTemplateIcon(template.icon);
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectTemplate(template)}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-left group"
              >
                <Icon size={28} className="text-white mb-2" />
                <h4 className="font-bold text-white text-sm">{template.name}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] text-gray-500">#{tag}</span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* More Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">More Templates</h3>
          <ChevronRight size={14} className="text-gray-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {otherTemplates.map((template) => {
            const Icon = getTemplateIcon(template.icon);
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-left group flex items-center gap-3"
              >
                <Icon size={18} className="text-gray-400 group-hover:text-white transition" />
                <span className="text-sm text-white">{template.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}