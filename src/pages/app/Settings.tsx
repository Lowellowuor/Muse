import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Upload, Plus, Trash2, Camera, Link as LinkIcon, 
  ExternalLink, MapPin, AlignLeft, Sparkles, User, 
  Calendar, Lock, Save,  Check,
  Music, Palette, BookOpen, Brain, Star, Flame, Fingerprint,
  AtSign, Code, Briefcase, X
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useRoomsStore, useTotalArtifacts } from '../../store/useRoomsStore';
import PortraitCard from '../../components/profile/PortraitCard';

// Floating particles for ambient effect
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{ 
            y: [`${p.y}%`, `${p.y - 30}%`],
            opacity: [0, 0.2, 0],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute w-0.5 h-0.5 rounded-full bg-white/70/20"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

// Stats Card Component
function StatsCard() {
  const rooms = useRoomsStore(state => state.rooms);
  const totalArtifacts = useTotalArtifacts();
  const streakDays = 12; // Mock data

  const stats = [
    { label: 'Rooms', value: rooms.length, icon: BookOpen, color: 'text-white/80', bg: 'bg-white/10' },
    { label: 'Artifacts', value: totalArtifacts, icon: Star, color: 'text-white/70', bg: 'bg-white/80/10' },
    { label: 'Day Streak', value: streakDays, icon: Flame, color: 'text-white/70', bg: 'bg-white/80/10' },
    { label: 'Insights', value: 24, icon: Brain, color: 'text-white/70', bg: 'bg-white/80/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-4 rounded-2xl ${stat.bg} border border-white/10 backdrop-blur-sm`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon size={14} className={stat.color} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Privacy Toggle Component
function PrivacyToggle({ label, value, onToggle }: { 
  label: string; 
  setting: string; 
  value: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-[10px] text-gray-500 font-serif italic">
          {value ? 'Visible to everyone' : 'Only visible to you'}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value ? 'bg-white/80' : 'bg-white/20'}`}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}

// Link Icon Selector
const linkIcons: Record<string, { icon: any; color: string }> = {
  twitter: { icon: X, color: 'text-sky-400' },
  github: { icon: Code, color: 'text-gray-400' },
  linkedin: { icon: Briefcase, color: 'text-blue-400' },
  spotify: { icon: Music, color: 'text-white/70' },
  behance: { icon: Palette, color: 'text-blue-400' },
  default: { icon: ExternalLink, color: 'text-gray-400' },
};

const getLinkIcon = (url: string) => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('X') || hostname.includes('x.com')) return linkIcons.twitter;
    if (hostname.includes('github')) return linkIcons.github;
    if (hostname.includes('linkedin')) return linkIcons.linkedin;
    if (hostname.includes('spotify')) return linkIcons.spotify;
    if (hostname.includes('behance')) return linkIcons.behance;
    return linkIcons.default;
  } catch {
    return linkIcons.default;
  }
};

export default function Settings() {
  const { user, soloMode, updateProfile, addLink, removeLink, togglePublicSetting } = useUserStore();
  const rooms = useRoomsStore(state => state.rooms);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const [isEditing, setIsEditing] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'links'>('profile');

  const activeRooms = rooms.slice().sort((a, b) => b.count - a.count).slice(0, 3);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;
    
    let finalUrl = newLinkUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    addLink({ title: newLinkTitle, url: finalUrl });
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleSaveAndPreview = () => {
    setShowSavedMessage(true);
    setIsEditing(false);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050508] overflow-hidden">
      <FloatingParticles />

      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/80/8 blur-[120px] rounded-full" />
      </motion.div>

      <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full font-sans transition-all duration-500 flex flex-col items-center relative z-10">
        
        {/* Saved Message Toast */}
        <AnimatePresence>
          {showSavedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-6 z-50 px-5 py-3 bg-white/80/20 border border-white/80/30 rounded-2xl backdrop-blur-md flex items-center gap-2"
            >
              <Check size={16} className="text-white/70" />
              <span className="text-xs font-medium text-white/70">Profile saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center mt-2 md:mt-8"
          >
            <div className="mb-10 text-center max-w-lg">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4"
              >
                <Fingerprint size={12} className="text-white/80" />
                <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Digital Identity</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-serif italic"
              >
                Live Portrait
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 font-serif italic text-base leading-relaxed px-4"
              >
                This is the exact digital replica of how your identity is rendered globally across the Muse network.
              </motion.p>
            </div>
            
            {/* Stats Cards */}
            <StatsCard />
            
            {/* Portrait Card */}
            <PortraitCard user={user} activeRooms={activeRooms} soloMode={soloMode} />

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="mt-12 px-10 py-5 bg-gradient-to-r from-white to-gray-200 text-black font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_60px_rgba(255,255,255,0.25)] hover:-translate-y-1 transition-all active:scale-95 cursor-pointer"
            >
              Edit Persona Blocks
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-4xl"
          >
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4"
                >
                  <Sparkles size={12} className="text-white/80" />
                  <span className="text-[8px] font-bold text-white/80 uppercase tracking-wider">Edit Mode</span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Editor</h2>
                <p className="text-gray-500 font-serif italic text-sm">Manage your foundational identity blocks.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveAndPreview}
                className="px-8 py-3.5 bg-gradient-to-r from-white to-white/80 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-1 cursor-pointer flex items-center gap-2"
              >
                <Save size={14} /> Save & Preview
              </motion.button>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'privacy', label: 'Privacy', icon: Lock },
                { id: 'links', label: 'Links', icon: LinkIcon },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white/10 text-white/80 border border-white/20' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 pb-20"
                >
                  {/* Avatar Section */}
                  <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/10 flex items-center justify-center cursor-pointer hover:border-white/80/50 transition-all overflow-hidden group shadow-xl shrink-0"
                      >
                        {user.avatarUrl ? (
                          <>
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera size={28} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <Upload size={28} className="text-gray-600 group-hover:text-white/80 transition-colors" />
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">Primary Avatar</h3>
                        <p className="text-xs text-gray-500 font-serif italic leading-relaxed max-w-sm">Capture a unique visual. High-fidelity rendering scales across both list and detail views natively.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <User size={10} /> Full Display Name
                        </label>
                        <input 
                          type="text" 
                          value={user.name}
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/80/50 transition-all text-white font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <AtSign size={10} /> Global Handle
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 font-bold text-sm">@</span>
                          <input 
                            type="text" 
                            value={user.username.startsWith('@') ? user.username.slice(1) : user.username}
                            onChange={(e) => updateProfile({ username: '@' + e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 focus:outline-none focus:border-white/80/50 transition-all text-white font-mono"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <AlignLeft size={10} /> Thoughtful Bio
                        </label>
                        <textarea 
                          value={user.bio || ''}
                          onChange={(e) => updateProfile({ bio: e.target.value })}
                          placeholder="What drives your curation flow?"
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/80/50 transition-all text-white font-serif italic placeholder-gray-600 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <MapPin size={10} /> Current Location
                        </label>
                        <input 
                          type="text" 
                          value={user.location || ''}
                          onChange={(e) => updateProfile({ location: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/80/50 transition-all text-white"
                          placeholder="Berlin / Digital Hub"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={10} /> Birth Date
                        </label>
                        <input 
                          type="date" 
                          value={user.birthDate || ''}
                          onChange={(e) => updateProfile({ birthDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/80/50 transition-all text-white"
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Shield size={20} className="text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">Privacy Controls</h3>
                      <p className="text-xs text-gray-500 font-serif italic">Control what others can see on your public portrait</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <PrivacyToggle 
                      label="Profile Information"
                      setting="showProfile"
                      value={user.publicSettings?.showProfile ?? true}
                      onToggle={() => togglePublicSetting('showProfile')}
                    />
                    <PrivacyToggle 
                      label="Location"
                      setting="showLocation"
                      value={user.publicSettings?.showLocation ?? true}
                      onToggle={() => togglePublicSetting('showLocation')}
                    />
                    <PrivacyToggle 
                      label="Rooms"
                      setting="showRooms"
                      value={user.publicSettings?.showRooms ?? true}
                      onToggle={() => togglePublicSetting('showRooms')}
                    />
                    <PrivacyToggle 
                      label="Threads"
                      setting="showThreads"
                      value={user.publicSettings?.showThreads ?? true}
                      onToggle={() => togglePublicSetting('showThreads')}
                    />
                    <PrivacyToggle 
                      label="Insights"
                      setting="showInsights"
                      value={user.publicSettings?.showInsights ?? true}
                      onToggle={() => togglePublicSetting('showInsights')}
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Solo Mode</p>
                        <p className="text-[10px] text-gray-500">When enabled, your activity is completely private</p>
                      </div>
                      <button
                        onClick={() => useUserStore.getState().toggleSoloMode()}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${soloMode ? 'bg-white/80' : 'bg-white/20'}`}
                      >
                        <motion.div
                          animate={{ x: soloMode ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Links Tab */}
              {activeTab === 'links' && (
                <motion.div
                  key="links"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">External Realms</h3>
                    <p className="text-xs text-gray-500 font-serif italic mt-1">Connect your other social identities or portfolios to your Portrait.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {(user.links || []).map(link => {
                      const { icon: Icon, color } = getLinkIcon(link.url);
                      return (
                        <motion.div 
                          key={link.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className={`w-10 h-10 rounded-xl ${color.replace('text', 'bg')}/10 flex items-center justify-center`}>
                              <Icon size={18} className={color} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-white truncate">{link.title}</p>
                              <p className="text-[8px] text-gray-500 truncate mt-0.5 font-mono">{new URL(link.url).hostname}</p>
                            </div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeLink(link.id)} 
                            className="p-2 text-gray-600 hover:text-white/80 transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                    
                    {(user.links || []).length === 0 && (
                      <div className="text-center py-8 text-gray-500 font-serif italic text-sm">
                        No external links added yet.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-white/10">
                    <input 
                      type="text" 
                      placeholder="Platform Label (e.g., Portfolio, Twitter)" 
                      value={newLinkTitle}
                      onChange={e => setNewLinkTitle(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/80/50 transition-all text-white"
                    />
                    <input 
                      type="text" 
                      placeholder="https://example.com/username" 
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-white/80/50 transition-all text-white"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddLink}
                      disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                      className="bg-gradient-to-r from-white to-white/80 text-white disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <Plus size={14} /> Add Link
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}