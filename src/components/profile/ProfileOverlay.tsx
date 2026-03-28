import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, LogOut, Shield, ChevronRight, Globe, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserStore } from '../../store/useUserStore';
import { useRoomsStore } from '../../store/useRoomsStore';
import PortraitCard from './PortraitCard';
import PrivacyManager from '../modals/PrivacyManager';

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileOverlay({ isOpen, onClose }: ProfileOverlayProps) {
  const navigate = useNavigate();
  const { user, soloMode, toggleSoloMode, logout } = useUserStore();
  const rooms = useRoomsStore(state => state.rooms);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  
  const activeRooms = rooms.slice().sort((a, b) => b.count - a.count).slice(0, 3);

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
        >
          <PrivacyManager isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />

          {/* Backdrop blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left side: The Portrait Card */}
            <div className="flex justify-center lg:justify-end">
              <PortraitCard user={user} activeRooms={activeRooms} soloMode={soloMode} />
            </div>

            {/* Right side: Management Actions */}
            <div className="flex flex-col gap-6 max-w-md mx-auto lg:mx-0">
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                  <User size={10} className="text-white/60" />
                  <span className="text-[8px] font-bold text-white/60 uppercase tracking-wider">Profile Control</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white italic font-serif">Manage your digital replica.</h2>
                <p className="text-xs text-gray-500 mt-2 font-serif italic">Control how your identity appears across the Muse network.</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => { navigate('/settings'); onClose(); }}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <Settings size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Edit Profile</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Blocks & Identity</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                </button>

                <button 
                  onClick={toggleSoloMode}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${soloMode ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-gray-500 group-hover:text-white'}`}>
                      {soloMode ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{soloMode ? 'Solo Mode Active' : 'Solo Mode Disabled'}</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Privacy & Noise control</p>
                    </div>
                  </div>
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${soloMode ? 'bg-white/30' : 'bg-white/10'}`}>
                    <motion.div 
                      animate={{ x: soloMode ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md ${soloMode ? 'bg-white' : 'bg-white/50'}`}
                    />
                  </div>
                </button>

                <button 
                  onClick={() => setIsPrivacyOpen(true)}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white transition-all">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Community Settings</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Granular sharing</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                </button>

                <button 
                  onClick={() => { logout(); onClose(); navigate('/'); }}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white/80 transition-all">
                      <LogOut size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Logout</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">End session</p>
                    </div>
                  </div>
                  <X size={16} className="text-gray-700 group-hover:text-white/60 transition-colors" />
                </button>
              </div>

              <button 
                onClick={onClose}
                className="mt-4 w-full py-4 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                Close Persona
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}