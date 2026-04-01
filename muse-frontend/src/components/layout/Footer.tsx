import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative z-10 border-t border-white/10 mt-20 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-white" />
            <span className="text-sm text-gray-400">MUSE 2075 • Neural Creative Platform</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Made with</span>
            <Heart size={12} className="text-white" />
            <span>for creators • {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}