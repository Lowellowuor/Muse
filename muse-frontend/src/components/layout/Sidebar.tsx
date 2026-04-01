import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Home, Layers, BookOpen, Sparkles, Settings, User, 
  Brain, MessageSquare, Compass, PlusCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Layers, label: 'Rooms', path: '/rooms' },
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: MessageSquare, label: 'Threads', path: '/threads' },
    { icon: Brain, label: 'AI Insights', path: '/insights' },
    { icon: PlusCircle, label: 'Create', path: '/create' },
    { icon: Compass, label: 'Quick Actions', path: '/actions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed left-0 top-[73px] w-80 bg-[#111318] border-r border-white/10 z-50 shadow-2xl h-[calc(100vh-73px)]"
          >
            <div className="relative h-full py-6">
              <div className="px-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles size={24} className="text-white" />
                    <span className="text-lg font-bold tracking-tight text-white">
                      MUSE
                    </span>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <nav className="px-4 py-6 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-transparent hover:border-white/10 bg-transparent hover:bg-white/5 transition-all group"
                  >
                    <item.icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="absolute bottom-8 left-6 right-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} className="text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">AI Assistant</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Your creative energy is peaking. Ready to create?</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}