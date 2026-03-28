import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit2, 
  Share2, 
  Plus, 
  ExternalLink, 
  X, 
  Trash2, 
  Link2,
  Globe,
  Lock,
  Zap,
  Sparkles,
  TrendingUp,
  Users,
  MessageCircle,
  Heart,
  Send,
  MoreVertical,
  BookOpen,
  Brain,
  Flame,
  Clock,
  Star
} from 'lucide-react';
import { useThreadsStore } from '../../store/useThreadsStore';
import { useConnectionsStore, type ActiveCircle } from '../../store/useConnectionsStore';
import { useItemsStore } from '../../store/useItemsStore';
import { useRoomsStore } from '../../store/useRoomsStore';
import EditThreadModal from '../../components/modals/EditThreadModal';
import ThoughtfulComposer from '../../components/threads/ThoughtfulComposer';

// Helper for date formatting
const formatTimeAgo = (timestamp: number | Date) => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
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

// Contribution Card Component
function ContributionCard({ contribution, isOwn, onLike }: { 
  contribution: any; 
  isOwn: boolean; 
  onLike?: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const toneColors: Record<string, string> = {
    Reflect: 'text-white/70 border-white/80/20 bg-white/80/10',
    Build: 'text-white/70 border-white/80/20 bg-white/80/10',
    Ask: 'text-white/70 border-white/80/20 bg-white/80/10',
    Challenge: 'text-white/70 border-white/80/20 bg-white/80/10',
    Synthesize: 'text-white/70 border-white/80/20 bg-white/80/10',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} gap-2`}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {contribution.authorName}
        </span>
        <div className="w-1 h-1 rounded-full bg-gray-700" />
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${toneColors[contribution.tone] || 'text-gray-400 border-gray-500/20 bg-white/5'}`}>
          {contribution.tone}
        </span>
        <span className="text-[9px] text-gray-600">{formatTimeAgo(contribution.timestamp)}</span>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className={`max-w-xl group relative`}
      >
        <div className={`p-6 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
          isOwn 
            ? 'bg-gradient-to-r from-white/80/10 to-white/80/10 border-white/80/30 rounded-tr-lg' 
            : 'bg-white/[0.03] border-white/10 rounded-tl-lg hover:border-white/20'
        }`}>
          <p className="text-base text-gray-200 leading-relaxed font-serif italic">"{contribution.text}"</p>
          {contribution.likes > 0 && (
            <div className="flex items-center gap-1 mt-3">
              <Heart size={12} className="text-white/70 fill-white/70/50" />
              <span className="text-[10px] text-gray-500">{contribution.likes} resonance</span>
            </div>
          )}
        </div>
        
        {onLike && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLike}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/80/20 hover:border-white/80/30"
          >
            <Heart size={12} className="text-gray-400 hover:text-white/70" />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

// Artifact Card Component
function ArtifactCard({ item, onRemove, roomName }: { 
  item: any; 
  onRemove: () => void; 
  roomName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-2xl p-5 hover:border-white/80/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider px-2 py-1 rounded-full bg-white/5">
          {roomName}
        </span>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove} 
          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-600 hover:text-white/70 transition-all cursor-pointer"
        >
          <Trash2 size={12} />
        </motion.button>
      </div>
      <h4 className="font-bold text-white mb-2 line-clamp-2 text-sm">{item.title}</h4>
      {item.note && (
        <p className="text-xs text-gray-500 font-serif italic border-l border-white/10 pl-3 mb-3">"{item.note.slice(0, 80)}"</p>
      )}
      <a 
        href={item.sourceUrl} 
        target="_blank" 
        rel="noreferrer" 
        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/70 hover:text-white/70 transition-colors group/link"
      >
        View Source <ExternalLink size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
      </a>
    </motion.div>
  );
}

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCircle = searchParams.get('type') === 'circle';

  const personalThread = useThreadsStore(state => state.threads.find(t => t.id === id));
  const updateThread = useThreadsStore(state => state.updateThread);
  const addItemToThread = useThreadsStore(state => state.addItemToThread);
  const removeItemFromThread = useThreadsStore(state => state.removeItemFromThread);

  const circle = useConnectionsStore(state => state.circles.find(c => c.id === id));
  const addContribution = useConnectionsStore(state => state.addContribution);
  const likeContribution = useConnectionsStore(state => state.likeContribution);

  const allItems = useItemsStore(state => state.items);
  const addNewItem = useItemsStore(state => state.addItem);
  const rooms = useRoomsStore(state => state.rooms);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [synthesisText, setSynthesisText] = useState(personalThread?.thesis || '');
  const [isEditingThesis, setIsEditingThesis] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showLinkExisting, setShowLinkExisting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [circle?.contributions]);

  if (isCircle && !circle) return <NotFound navigate={navigate} />;
  if (!isCircle && !personalThread) return <NotFound navigate={navigate} />;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col overflow-hidden">
      <FloatingParticles />

      {/* Mouse-Following Glow */}
      <motion.div
        className="fixed pointer-events-none z-0"
        animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      >
        <div className="w-[400px] h-[400px] bg-white/80/8 blur-[120px] rounded-full" />
      </motion.div>

      {isEditOpen && personalThread && (
        <EditThreadModal thread={personalThread} onClose={() => setIsEditOpen(false)} onDeleted={() => navigate('/threads')} />
      )}

      {/* FIXED TOP NAV */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="sticky top-0 z-50 bg-[#050508]/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/threads')} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCircle ? 'bg-white/80/20 text-white/70' : 'bg-white/80/20 text-white/70'}`}>
              {isCircle ? <Globe size={16} /> : <Lock size={16} />}
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">{isCircle ? circle?.name : personalThread?.title}</h1>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {isCircle ? 'Community Circle' : 'Private Weave'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            <Share2 size={18} />
          </motion.button>
          {!isCircle && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditOpen(true)} 
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              <Edit2 size={18} />
            </motion.button>
          )}
        </div>
      </motion.header>

      {isCircle ? (
        <CircleView 
          circle={circle!} 
          addContribution={addContribution}
          likeContribution={likeContribution}
          scrollRef={scrollRef} 
        />
      ) : (
        <PrivateView 
          thread={personalThread!} 
          threadItems={allItems.filter(i => personalThread!.itemIds.includes(i.id))}
          unlinkedItems={allItems.filter(i => !personalThread!.itemIds.includes(i.id))}
          rooms={rooms}
          isEditingThesis={isEditingThesis}
          setIsEditingThesis={setIsEditingThesis}
          synthesisText={synthesisText}
          setSynthesisText={setSynthesisText}
          handleSaveThesis={() => { updateThread(personalThread!.id, { thesis: synthesisText }); setIsEditingThesis(false); }}
          setShowAddLink={setShowAddLink}
          showAddLink={showAddLink}
          setShowLinkExisting={setShowLinkExisting}
          showLinkExisting={showLinkExisting}
          addItemToThread={addItemToThread}
          removeItemFromThread={removeItemFromThread}
          addNewItem={addNewItem}
        />
      )}
    </div>
  );
}

function CircleView({ circle, addContribution, likeContribution, scrollRef }: { 
  circle: ActiveCircle; 
  addContribution: any;
  likeContribution: any;
  scrollRef: any;
}) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* MAIN DIALOGUE AREA */}
      <div className="flex-1 flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 space-y-12 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Intro/Context */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80/10 border border-white/80/20 mb-6 backdrop-blur-sm">
                <Sparkles size={14} className="text-white/70" />
                <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Dialogue Seeding</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{circle.name}</h2>
              <p className="text-gray-400 font-serif italic max-w-lg mx-auto leading-relaxed">"{circle.description}"</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-500">{circle.memberCount} members</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-700" />
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-500">{circle.contributions.length} contributions</span>
                </div>
              </div>
            </motion.div>

            {/* Perspective Bubbles */}
            <div className="space-y-8">
              {circle.contributions.map((con, idx) => (
                <ContributionCard 
                  key={con.id} 
                  contribution={con} 
                  isOwn={con.authorId === 'me'}
                  onLike={() => likeContribution(circle.id, con.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* COMPOSER AREA */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 md:p-8 bg-[#050508]/90 backdrop-blur-xl border-t border-white/10"
        >
          <div className="max-w-3xl mx-auto">
            <ThoughtfulComposer 
              onSubmit={(text, tone) => addContribution(circle.id, text, tone)} 
            />
          </div>
        </motion.div>
      </div>

      {/* RIGHT RAIL: Collective Intelligence */}
      <aside className="w-80 border-l border-white/5 hidden xl:flex flex-col p-6 space-y-8 overflow-y-auto bg-[#050508]/30">
        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
            <TrendingUp size={14} className="text-white/70" /> Collective Intelligence
          </h3>
          <div className="space-y-5">
            <div className="p-5 bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-white mb-3 uppercase tracking-wider">Circle Resonance</p>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-mono text-white/70">94%</span>
                <span className="text-[9px] text-gray-500">Very High</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-white/70 to-white/80 rounded-full" 
                />
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Active Members</p>
              <div className="flex -space-x-2 mb-4">
                {circle.members.slice(0, 5).map((m, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050508] bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden flex items-center justify-center font-bold text-[10px] text-gray-400">
                    {m.charAt(0)}
                  </div>
                ))}
              </div>
              <button className="text-[9px] font-bold text-white/70 uppercase tracking-wider hover:text-white/70 transition-colors">
                Invite Thinker →
              </button>
            </div>

            <div className="p-5 bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Flame size={12} className="text-white/70" /> Trending Themes
              </p>
              <div className="flex flex-wrap gap-2">
                {circle.tags?.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 rounded-full bg-white/5 text-[9px] text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
            <Zap size={14} className="text-white/70" /> Key Syntheses
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3 group">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 group-hover:scale-150 transition-transform" />
              <p className="text-xs text-gray-400 leading-relaxed font-serif italic group-hover:text-gray-300 transition-colors">
                "Silence is structural in digital architecture."
              </p>
            </div>
            <div className="flex gap-3 group">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 group-hover:scale-150 transition-transform" />
              <p className="text-xs text-gray-400 leading-relaxed font-serif italic group-hover:text-gray-300 transition-colors">
                "Flow state vs Void state — both necessary for creativity."
              </p>
            </div>
            <div className="flex gap-3 group">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 group-hover:scale-150 transition-transform" />
              <p className="text-xs text-gray-400 leading-relaxed font-serif italic group-hover:text-gray-300 transition-colors">
                "Collective intelligence emerges from diverse perspectives."
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PrivateView({ 
  thread, threadItems, unlinkedItems, rooms, isEditingThesis, setIsEditingThesis, 
  synthesisText, setSynthesisText, handleSaveThesis, setShowAddLink, showAddLink, 
  setShowLinkExisting, showLinkExisting, addItemToThread, removeItemFromThread, addNewItem 
}: any) {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addError, setAddError] = useState('');
  const firstRoomId = rooms?.[0]?.id || '';

  const handleAddNew = () => {
    if (!newTitle.trim()) { setAddError('Title is required.'); return; }
    if (!newUrl.trim()) { setAddError('URL is required.'); return; }
    let url = newUrl.trim();
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    const newItem = addNewItem({ 
      roomId: firstRoomId, 
      title: newTitle.trim(), 
      sourceUrl: url, 
      note: newNote.trim() || undefined, 
      isPublic: false,
      type: 'link',
      tags: [],
      status: 'saved'
    });
    if (newItem?.id) addItemToThread(thread.id, newItem.id);
    setNewTitle(''); setNewUrl(''); setNewNote(''); setAddError('');
    setShowAddLink(false);
  };

  return (
    <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full z-10 flex flex-col gap-10 overflow-y-auto">
      {/* SYNTHESIS / THESIS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-2"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/80/20 text-white/70 flex items-center justify-center">
              <Brain size={16} />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/70">Personal Synthesis</h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isEditingThesis ? handleSaveThesis() : setIsEditingThesis(true)}
            className="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-white/5"
          >
            {isEditingThesis ? 'Save Weave' : 'Edit Synthesis'}
          </motion.button>
        </div>
        
        {isEditingThesis ? (
          <textarea
            value={synthesisText}
            onChange={e => setSynthesisText(e.target.value)}
            rows={4}
            autoFocus
            placeholder="What is the deeper question or pattern this weave reveals?"
            className="w-full bg-white/5 border border-white/80/30 rounded-2xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-white/80/50 transition-all text-base font-serif italic leading-relaxed resize-none"
          />
        ) : (
          <motion.div 
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            onClick={() => setIsEditingThesis(true)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 cursor-text transition-all min-h-[120px]"
          >
            {thread.thesis ? (
              <p className="text-gray-200 text-base font-serif italic leading-relaxed">"{thread.thesis}"</p>
            ) : (
              <p className="text-gray-600 text-sm font-serif italic">Click to write your synthesis…</p>
            )}
          </motion.div>
        )}
      </motion.section>

      {/* ARTIFACTS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-gray-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {threadItems.length} Linked Artifacts
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowLinkExisting(!showLinkExisting); setShowAddLink(false); }}
              className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${showLinkExisting ? 'bg-white/80/20 border-white/80/40 text-white/70' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              Link Existing
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowAddLink(!showAddLink); setShowLinkExisting(false); setAddError(''); }}
              className={`px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg cursor-pointer ${showAddLink ? 'bg-white/70 text-black' : 'bg-white/90 hover:bg-white/80 shadow-white/80/20'}`}
            >
              Add New
            </motion.button>
          </div>
        </div>

        {/* PANEL: Add New Artifact */}
        <AnimatePresence>
          {showAddLink && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/80/20 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white tracking-tight flex items-center gap-2 text-sm">
                  <Plus size={14} className="text-white/70" /> New Artifact
                </h3>
                <button onClick={() => { setShowAddLink(false); setAddError(''); }} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input value={newTitle} onChange={e => { setNewTitle(e.target.value); setAddError(''); }}
                  placeholder="Article name, song title…"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/80/40 transition-all" />
                <input value={newUrl} onChange={e => { setNewUrl(e.target.value); setAddError(''); }}
                  placeholder="https://…"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/80/40 transition-all" />
              </div>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="Why does this matter to this weave?"
                rows={2} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm font-serif italic focus:outline-none focus:border-white/80/40 transition-all resize-none mb-3" />
              {addError && <p className="text-white/70 text-xs mb-2">{addError}</p>}
              <button onClick={handleAddNew}
                className="px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs bg-white/90 hover:bg-white/80 text-white transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95">
                Weave into Thread
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PANEL: Link Existing Artifacts */}
        <AnimatePresence>
          {showLinkExisting && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/80/20 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white tracking-tight flex items-center gap-2 text-sm">
                  <Link2 size={14} className="text-white/70" /> Link from Your Rooms
                </h3>
                <button onClick={() => setShowLinkExisting(false)} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X size={14} />
                </button>
              </div>
              {unlinkedItems.length === 0 ? (
                <p className="text-gray-500 font-serif italic text-sm text-center py-6">All your room artifacts are already in this thread.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {unlinkedItems.slice(0, 8).map((item: any) => (
                    <button key={item.id} onClick={() => { addItemToThread(thread.id, item.id); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/80/30 transition-all text-left group cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {rooms.find((r: any) => r.id === item.roomId)?.name || 'Room'}
                        </p>
                      </div>
                      <Plus size={14} className="text-white/70 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Artifacts Grid */}
        {threadItems.length === 0 && !showAddLink && !showLinkExisting ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center text-center"
          >
            <Link2 size={32} className="text-gray-700 mb-4" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">No Artifacts Linked</p>
            <p className="text-[10px] text-gray-600 font-serif italic">Start weaving items from your rooms to find patterns.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
              {threadItems.map((item: any) => (
                <ArtifactCard 
                  key={item.id} 
                  item={item} 
                  onRemove={() => removeItemFromThread(thread.id, item.id)}
                  roomName={rooms.find((r: any) => r.id === item.roomId)?.name || 'General'}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.section>
    </main>
  );
}

function NotFound({ navigate }: { navigate: any }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#050508]">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-500"
      >
        <X size={32} />
      </motion.div>
      <div className="text-center">
        <p className="text-2xl font-bold text-white mb-2 tracking-tight">Dialogue Lost.</p>
        <p className="text-gray-500 font-serif italic">This space does not seem to exist yet.</p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/threads')} 
        className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:shadow-lg transition-all"
      >
        Back to Portal
      </motion.button>
    </div>
  );
}