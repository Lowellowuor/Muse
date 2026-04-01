import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, Sparkles, Brain, Sun, Moon } from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const headerClass = scrolled 
    ? 'fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-b border-white/10 transition-all duration-500'
    : 'fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500';
  
  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={onMenuClick} 
              className="text-white hover:text-gray-300 transition"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="group relative">
              <div className="relative flex items-center gap-2">
                <Sparkles size={28} className="text-white" />
                <span className="text-2xl font-bold tracking-tight text-white">
                  MUSE 2075
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10">
              <Search size={18} className="text-gray-400 hover:text-white transition" />
            </button>
            
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10 relative">
              <Bell size={18} className="text-gray-400 hover:text-white transition" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
            </button>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              {isDarkMode ? <Sun size={18} className="text-gray-400 hover:text-white transition" /> : <Moon size={18} className="text-gray-400 hover:text-white transition" />}
            </button>
            
            <Link 
              to="/profile"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              <User size={18} className="text-gray-400 hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}