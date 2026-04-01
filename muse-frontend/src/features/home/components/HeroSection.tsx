import { Sparkles, Plus, FolderOpen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Props {
  greeting: string;
  username?: string;
}

export default function HeroSection({ greeting, username = 'Creator' }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent rounded-3xl" />
      <div className="relative px-6 md:px-12 py-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={24} className="text-white" />
          <span className="text-sm text-gray-400">{greeting}, {username}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          Welcome to Your
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"> Neural Universe</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-8">
          Your creative sanctuary where thoughts become artifacts, and ideas evolve into realities.
        </p>
        <div className="flex gap-3 flex-wrap">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/journal')} 
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition flex items-center gap-2"
          >
            <Plus size={18} /> New Journal Entry
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/rooms')} 
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition flex items-center gap-2"
          >
            <FolderOpen size={18} /> Create Room
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/threads')} 
            className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition flex items-center gap-2"
          >
            <MessageSquare size={18} /> Start Thread
          </motion.button>
        </div>
      </div>
    </div>
  );
}