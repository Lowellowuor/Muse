import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Globe, 
  Search,
  ChevronRight,
  TrendingUp,
  Activity,
  Lock,
  ArrowLeft,
  Brain,
  Eye
} from 'lucide-react';
import { useConnectionsStore } from '../store/useConnectionsStore';
import ActiveCircleCard from '../components/connections/ActiveCircleCard';
import CollaboratorCard from '../components/connections/CollaboratorCard';
import CommunityRoomCard from '../components/connections/CommunityRoomCard';
import CommunityPulseStrip from '../components/connections/CommunityPulseStrip';
import SharedThemeCluster from '../components/connections/SharedThemeCluster';
import ThoughtfulComposer from '../components/connections/ThoughtfulComposer';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router';

type Tab = 'Circles' | 'People' | 'Insights';

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
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
            y: [`${p.y}%`, `${p.y - 40}%`],
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
function StatsCard({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: any; color: string; bg: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 800;
      const increment = value / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      className={`${bg} rounded-2xl p-4 text-center`}
    >
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
        <Icon size={18} className={color} />
      </div>
      <p className="text-2xl font-bold text-white font-mono">{count}</p>
      <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </motion.div>
  );
}

// Solo Mode Component
function SoloModeView({ onToggle, onBack }: { onToggle: () => void; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <div className="relative mb-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-48 h-48 rounded-full border border-dashed border-white/80/20 flex items-center justify-center"
        >
          <div className="w-32 h-32 rounded-full border border-white/80/40" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-3xl bg-white/80/20 border border-white/80/40 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]"
          >
            <Lock size={32} className="text-white/70" />
          </motion.div>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-white mb-4 italic font-serif">The Private Vault Is Active.</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-12 leading-relaxed font-serif italic text-lg">
        You are currently in Solo Mode. Community resonances are muffled to prioritize your private introspection.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="px-10 py-5 bg-gradient-to-r from-white to-gray-200 text-black font-bold uppercase tracking-widest text-xs rounded-3xl hover:shadow-lg active:scale-95 flex items-center gap-3 transition-all"
        >
          <Globe size={16} /> Reconnect to Community
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-10 py-5 bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-xs rounded-3xl hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          Return to Private Space
        </motion.button>
      </div>
    </motion.div>
  );
}

// Tab Navigation Component
function TabNav({ activeTab, setActiveTab, tabs }: { activeTab: Tab; setActiveTab: (tab: Tab) => void; tabs: { id: Tab; icon: any; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-4xl w-fit mb-12">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-3 px-6 py-3 rounded-3xl text-sm font-bold transition-all duration-500
            ${activeTab === tab.id 
              ? 'bg-gradient-to-r from-white/80 to-white/80 text-white shadow-lg' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'}
          `}
        >
          <tab.icon size={18} />
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}

export default function Connections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Circles');
  const { circles, collaborators, communityRooms, insights, joinCircle } = useConnectionsStore();
  const { soloMode, toggleSoloMode } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'Circles', icon: MessageSquare, label: 'Active Circles' },
    { id: 'People', icon: Users, label: 'Collaborators' },
    { id: 'Insights', icon: Sparkles, label: 'Communal Pulse' },
  ];

  const filteredCollaborators = collaborators.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sharedThemes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050508] pb-24 overflow-hidden">
      <FloatingParticles />
      
      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/80/8 blur-[120px] rounded-full" />
      </motion.div>

      {/* Ambient Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="connectionsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#connectionsGrid)" />
        </svg>
      </div>

      {/* Community Pulse Header */}
      <CommunityPulseStrip />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/80/20 border border-white/80/30 flex items-center justify-center">
                  <Globe size={20} className="text-white/70" />
                </div>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em]">The Hub</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-white tracking-tight"
              >
                Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-500">Circles.</span>
              </motion.h1>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
            >
              <div className="text-center">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Thinkers</p>
                <p className="text-2xl font-mono text-white">1,204</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Live Circles</p>
                <p className="text-2xl font-mono text-white/70">12</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Rooms</p>
                <p className="text-2xl font-mono text-white/70">{communityRooms.length}</p>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <TabNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        </div>

        <AnimatePresence mode="wait">
          {soloMode ? (
            <SoloModeView onToggle={toggleSoloMode} onBack={() => navigate('/dashboard')} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Main Content */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {/* Circles Tab */}
                  {activeTab === 'Circles' && (
                    <motion.div
                      key="circles"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-12"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {circles.map((circle) => (
                          <ActiveCircleCard 
                            key={circle.id} 
                            circle={circle} 
                            onJoin={() => joinCircle(circle.id)}
                          />
                        ))}
                      </div>
    
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Globe size={20} className="text-gray-500" /> Community Rooms
                          </h2>
                          <button className="text-[10px] font-bold text-white/70 uppercase tracking-wider hover:text-white/70 transition-colors">
                            View All →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                          {communityRooms.map((room) => (
                            <CommunityRoomCard key={room.id} room={room} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
    
                  {/* People Tab */}
                  {activeTab === 'People' && (
                    <motion.div
                      key="people"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type="text"
                            placeholder="Search collaborators by name, role, or theme..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/80/30 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <span className="text-[9px] text-gray-600">{filteredCollaborators.length} collaborators</span>
                      </div>
    
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredCollaborators.map((collaborator) => (
                          <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
                        ))}
                      </div>

                      {filteredCollaborators.length === 0 && (
                        <div className="text-center py-12">
                          <Search size={32} className="text-gray-700 mx-auto mb-3" />
                          <p className="text-gray-500 font-serif italic">No collaborators found matching "{searchQuery}"</p>
                        </div>
                      )}
                    </motion.div>
                  )}
    
                  {/* Insights Tab */}
                  {activeTab === 'Insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <ThoughtfulComposer onSubmit={(text, tone) => console.log('Collective Perspective:', text, tone)} />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-6">
                          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                            <TrendingUp size={18} className="text-white/70" /> Collective Intelligence
                          </h3>
                          <div className="space-y-5">
                            {insights.slice(0, 4).map((insight, i) => (
                              <div key={i} className="flex gap-3 group">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 group-hover:scale-150 transition-transform" />
                                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                                  {typeof insight === 'string' ? insight : insight.text || JSON.stringify(insight)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
    
                        <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-6">
                          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                            <Activity size={18} className="text-white/70" /> Communication Health
                          </h3>
                          <div className="space-y-5">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Global Resonance</span>
                                <span className="text-sm font-mono text-white/70">94.2%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '94.2%' }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-white/70 to-white/80 rounded-full" 
                                />
                              </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Dialogue Depth</span>
                                <span className="text-sm font-mono text-white/70">87.5%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '87.5%' }}
                                  transition={{ duration: 1, delay: 0.6 }}
                                  className="h-full bg-gradient-to-r from-white/70 to-white/80 rounded-full" 
                                />
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-serif italic leading-relaxed">
                              Community dialogue is currently high-fidelity and deeply reflective. Most interactions are categorized under 'Supportive' and 'Curious'.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
    
              {/* Right Rail: Themes & Pulse */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-6 backdrop-blur-3xl sticky top-24"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Theme Clusters</h3>
                    <Sparkles size={18} className="text-white/70" />
                  </div>
                  
                  <SharedThemeCluster />
    
                  <div className="mt-8 space-y-4">
                    <div className="p-5 bg-white/80/5 border border-white/80/20 rounded-xl">
                      <div className="flex items-start gap-3 mb-2">
                        <Zap size={16} className="text-white/70 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-white leading-tight">Join the 'Silence' Circle</p>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed mb-3 font-serif italic">
                        David Chen and 5 others are currently synthesizing ideas around digital voids.
                      </p>
                      <motion.button 
                        whileHover={{ x: 3 }}
                        className="text-[10px] font-bold text-white/70 uppercase tracking-wider flex items-center gap-1 group"
                      >
                        Enter Dialogue <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>

                    <div className="p-5 bg-white/80/5 border border-white/80/20 rounded-xl">
                      <div className="flex items-start gap-3 mb-2">
                        <Brain size={16} className="text-white/70 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-white leading-tight">Emerging: Systems Thinking</p>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed mb-3 font-serif italic">
                        3 new contributions on complexity and ecological networks.
                      </p>
                      <span className="text-[9px] text-white/70">+12 new insights this week</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-3">
                      <StatsCard 
                        label="Active Circles" 
                        value={circles.length} 
                        icon={MessageSquare} 
                        color="text-white/70" 
                        bg="bg-white/80/10" 
                      />
                      <StatsCard 
                        label="Collaborators" 
                        value={collaborators.length} 
                        icon={Users} 
                        color="text-white/70" 
                        bg="bg-white/80/10" 
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}