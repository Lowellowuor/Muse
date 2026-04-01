import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { 
  Home, Layers, BookOpen, Plus, User, PenTool, 
  Menu as MenuIcon, X, Network, Layout as LayoutIcon, 
  ChevronRight, Sparkles, Search, Bell, Compass, 
  Star, Flame, TrendingUp, Fingerprint, Zap
} from 'lucide-react';
import museLogo from '../../assets/muse-logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import CaptureModal from '../modals/CaptureModal';
import ProfileOverlay from '../profile/ProfileOverlay';
import PrivacyBadge from './PrivacyBadge';
import { useUserStore } from '../../store/useUserStore';
import { useRoomsStore, useTotalArtifacts } from '../../store/useRoomsStore';

// Floating particles for ambient effect
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{ 
            y: [`${p.y}%`, `${p.y - 20}%`],
            opacity: [0, 0.15, 0],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute w-0.5 h-0.5 rounded-full bg-white/20"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

// Notification Badge Component
function NotificationBadge() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: "Your room 'Music & Ambience' has 3 new artifacts", time: "5 min ago", read: false },
    { id: 2, text: "Weekly Mirror: You've been exploring themes of solitude", time: "1 hour ago", read: false },
    { id: 3, text: "New pattern discovered in your consumption", time: "1 day ago", read: true },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
      >
        <Bell size={18} className="text-gray-400" />
        {hasNotifications && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-white/40 rounded-full border border-white/20"
          />
        )}
      </button>
      
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-[#111115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-white/5' : ''}`}>
                  <p className="text-xs text-gray-300 leading-relaxed">{notif.text}</p>
                  <p className="text-[9px] text-gray-600 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
            <button className="w-full p-3 text-[10px] text-white/60 hover:bg-white/5 transition-colors font-bold uppercase tracking-wider">
              View All
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick Stats Component
function QuickStats() {
  const totalArtifacts = useTotalArtifacts();
  const rooms = useRoomsStore(state => state.rooms);
  const streakDays = 12; // Mock data

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="hidden lg:flex items-center gap-3"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <Flame size={12} className="text-gray-400" />
        <span className="text-[10px] font-mono text-gray-500">{streakDays} day streak</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <Sparkles size={12} className="text-gray-400" />
        <span className="text-[10px] font-mono text-gray-500">{rooms.length} rooms</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <Zap size={12} className="text-gray-400" />
        <span className="text-[10px] font-mono text-gray-500">{totalArtifacts} artifacts</span>
      </div>
    </motion.div>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, soloMode } = useUserStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navItems = [
    { label: 'Rooms', path: '/rooms', icon: <LayoutIcon size={22} />, desc: 'Your collection spaces' },
    { label: 'Threads', path: '/threads', icon: <Layers size={22} />, desc: 'Thematic syntheses' },
    { label: 'Journal', path: '/journal', icon: <BookOpen size={22} />, desc: 'Private introspection' },
    { label: 'Create', path: '/create', icon: <PenTool size={22} />, desc: 'Start a new flow' },
  ];

  const secondaryNav = [
    { label: 'Connections', path: '/connections', icon: <Network size={20} /> },
    { label: 'Settings', path: '/settings', icon: <User size={20} /> },
    { label: 'Discover', path: '/discover', icon: <Compass size={20} /> },
    { label: 'Trending', path: '/trending', icon: <TrendingUp size={20} /> },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className={`flex flex-col h-screen w-full bg-black text-white overflow-hidden pb-safe transition-all duration-1000 ${soloMode ? 'border-[6px] border-white/10 shadow-[inset_0_0_50px_rgba(255,255,255,0.03)]' : 'border-0'}`}>
      <CaptureModal isOpen={isCaptureOpen} onClose={() => setIsCaptureOpen(false)} />
      <ProfileOverlay isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full" />
      </motion.div>
      
      {/* Solo Mode Shimmer Overlay */}
      <AnimatePresence>
        {soloMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[100] border-[1px] border-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]"
          >
            <motion.div
              animate={{ 
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.02) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UNIFIED TOP HEADER */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="sticky top-0 w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 md:px-10 py-4 h-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center gap-8">
          <motion.h1 
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer flex items-center gap-2 group" 
            onClick={() => navigate('/dashboard')}
          >
            <motion.img 
              src={museLogo} 
              alt="Muse" 
              className="h-9 w-9 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              whileHover={{ rotate: 5 }}
            />
            <span className="text-xl font-bold tracking-tight text-white">Muse</span>
          </motion.h1>

          {/* Desktop Quick Search */}
          <motion.div 
            animate={{ width: isSearchFocused ? 320 : 240 }}
            className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-gray-500 cursor-text hover:border-white/20 transition-all"
          >
            <Search size={16} />
            <input 
              type="text"
              placeholder="Search deep artifacts..."
              className="bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none w-full"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <kbd className="hidden text-[9px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">⌘K</kbd>
          </motion.div>
        </div>

        <div className="flex items-center gap-6">
          {/* Quick Stats */}
          <QuickStats />

          {/* Notifications */}
          <NotificationBadge />

          {/* Privacy Switcher */}
          <div className="hidden sm:block">
            <PrivacyBadge />
          </div>

          <div className="flex items-center gap-4">
            {/* Clickable Profile Avatar */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(true)}
              className="relative group p-0.5 rounded-full bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-95 outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex items-center justify-center font-serif text-gray-400">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-white/60">
                    {user?.name?.charAt(0) || 'M'}
                  </span>
                )}
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white/40 rounded-full border-2 border-black shadow-lg"
              />
            </motion.button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Global Menu Icon */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="group p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all outline-none"
            >
              <MenuIcon size={22} className="text-gray-400 group-hover:text-white transition-colors" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* GLOBAL NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex justify-end"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-sm md:max-w-md h-full bg-black border-l border-white/10 shadow-2xl flex flex-col p-8 md:p-12 overflow-y-auto"
            >
              {/* Drawer Header with Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4"
                  >
                    <Sparkles size={10} className="text-white/60" />
                    <span className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Navigate</span>
                  </motion.div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Choose Intent</h2>
                  <p className="text-[10px] text-gray-500 mt-1 font-serif italic">Navigate your creative universe</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all cursor-pointer"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <nav className="flex flex-col gap-3 flex-1 relative z-10">
                {navItems.map((item, idx) => {
                  const active = isActive(item.path);
                  return (
                    <motion.button 
                      key={item.label}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                      className={`group flex items-center justify-between p-6 rounded-2xl transition-all border ${active ? 'bg-white/10 border-white/20 shadow-[0_20px_40px_rgba(255,255,255,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white'}`}>
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <p className={`text-lg font-bold leading-tight ${active ? 'text-white' : 'text-gray-300'}`}>{item.label}</p>
                          <p className={`text-[9px] uppercase tracking-widest font-bold ${active ? 'text-white/70' : 'text-gray-600'}`}>{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className={active ? 'text-white/60' : 'text-gray-800'} />
                    </motion.button>
                  );
                })}

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                <div className="grid grid-cols-2 gap-3">
                  {secondaryNav.map((item, idx) => (
                    <motion.button 
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all text-gray-500 hover:text-white group ${isActive(item.path) ? 'bg-white/5 border-white/20 text-white' : ''}`}
                    >
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring" }}>
                        {item.icon}
                      </motion.div>
                      <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </nav>

              <div className="pt-10 flex flex-col gap-4 relative z-10">
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsCaptureOpen(true); setIsMenuOpen(false); }}
                  className="w-full group py-5 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-3xl flex justify-center items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                  Deep Capture
                </motion.button>
                <div className="text-center">
                  <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Muse Beta 1.2.0 • Inspired Flow</p>
                  <p className="text-[7px] text-gray-700 mt-1 font-serif italic">Consume → Contemplate → Create</p>
                </div>
              </div>

              {/* Drawer Footer Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative scroll-smooth bg-black">
        <Outlet />
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center h-20 px-4 z-40 pb-safe">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${isActive('/dashboard') ? 'text-white' : 'text-gray-600'}`}
        >
          <Home size={22} />
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/rooms')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${isActive('/rooms') ? 'text-white' : 'text-gray-600'}`}
        >
          <LayoutIcon size={22} />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCaptureOpen(true)}
          className="relative -top-10 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-4 border-black active:scale-90 transition-transform"
        >
          <Plus size={28} />
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/journal')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${isActive('/journal') ? 'text-white' : 'text-gray-600'}`}
        >
          <BookOpen size={22} />
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${isMenuOpen ? 'text-white' : 'text-gray-600'}`}
        >
          <MenuIcon size={24} />
        </motion.button>
      </nav>

      {/* Global styles for scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}