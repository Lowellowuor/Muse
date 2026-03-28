import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Link2, Layout, ChevronRight, ArrowLeft, Zap, Sparkles,
  Check, Plus, Globe, Lock, AlertCircle
} from 'lucide-react';
import { useItemsStore } from '../../store/useItemsStore';
import { useRoomsStore } from '../../store/useRoomsStore';
import CaptureProgress from '../capture/CaptureProgress';

// Types
type CaptureStep = 'input' | 'context' | 'contemplation';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewRoomData {
  name: string;
  isPublic: boolean;
}

// Constants
const STEPS: CaptureStep[] = ['input', 'context', 'contemplation'];
const STEP_TITLES = {
  input: 'Capture the Essence',
  context: 'Define the Context',
  contemplation: 'Moment of Reflection'
} as const;

const STEP_DESCRIPTIONS = {
  input: 'What artifact has entered your field of vision?',
  context: 'Where does this resonance belong?',
  contemplation: 'Why did this resonance matter to you?'
} as const;

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

const stepVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const scanlineVariants = {
  animate: {
    top: ['-10%', '110%'],
    transition: {
      duration: 1.2,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

export default function CaptureModal({ isOpen, onClose }: CaptureModalProps): React.ReactElement | null {
  // State
  const [step, setStep] = useState<CaptureStep>('input');
  const [url, setUrl] = useState('');
  const [roomId, setRoomId] = useState('');
  const [note, setNote] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Inline Room Creation State
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoom, setNewRoom] = useState<NewRoomData>({ name: '', isPublic: false });
  
  // Store hooks - FIX: Ensure proper initialization
  const addItem = useItemsStore((state) => state.addItem);
  const rooms = useRoomsStore((state) => state.rooms);
  const addRoom = useRoomsStore((state) => state.addRoom);

  // Memoized values
  const currentStepIndex = useMemo(() => STEPS.indexOf(step), [step]);
  const hasValidUrl = useMemo(() => url.trim().length > 0, [url]);
  const hasValidRoom = useMemo(() => Boolean(roomId), [roomId]);

  // Initialize room selection
  useEffect(() => {
    if (rooms && rooms.length > 0 && !roomId) {
      setRoomId(rooms[0].id);
    }
  }, [rooms, roomId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]); // FIX: Add handleClose to dependencies or remove from effect if not needed

  // Reset form on close
  const resetForm = useCallback(() => {
    setStep('input');
    setUrl('');
    setRoomId(rooms && rooms[0]?.id || '');
    setNote('');
    setIsScanning(false);
    setError(null);
    setIsAddingRoom(false);
    setNewRoom({ name: '', isPublic: false });
  }, [rooms]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleNext = useCallback(async () => {
    if (step === 'input') {
      if (!hasValidUrl) {
        setError('Please enter a URL or thought');
        return;
      }
      
      setError(null);
      setIsScanning(true);
      
      // Simulate scanning
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsScanning(false);
      setStep('context');
    } else if (step === 'context') {
      if (!hasValidRoom) {
        setError('Please select or create a room');
        return;
      }
      setError(null);
      setStep('contemplation');
    }
  }, [step, hasValidUrl, hasValidRoom]);

  const handleBack = useCallback(() => {
    if (step === 'context') setStep('input');
    if (step === 'contemplation') setStep('context');
    setError(null);
  }, [step]);

  const handleCreateRoom = useCallback(() => {
    if (!newRoom.name.trim()) {
      setError('Please enter a room name');
      return;
    }

    try {
      const createdRoom = addRoom(
        newRoom.name.trim(),
        '',
        'light', // Default theme - adjust based on your RoomTheme type
        '',
        newRoom.isPublic
      );
      
      setRoomId(createdRoom.id);
      setIsAddingRoom(false);
      setNewRoom({ name: '', isPublic: false });
      setError(null);
      setStep('contemplation');
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error('Room creation error:', err);
    }
  }, [newRoom, addRoom]);

  const handleCapture = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !roomId) {
      setError('Missing required information');
      return;
    }

    try {
      // Extract title from URL
      let title = 'Captured Artifact';
      try {
        if (url.startsWith('http')) {
          const urlObj = new URL(url);
          title = urlObj.hostname.replace('www.', '');
        } else {
          title = 'Personal Thought';
        }
      } catch {
        title = 'Captured Thought';
      }

      await addItem({
        roomId,
        title,
        sourceUrl: url.startsWith('http') ? url : `https://google.com/search?q=${encodeURIComponent(url)}`,
        note: note.trim() || '',
        isPublic: false,
        type: url.startsWith('http') ? 'link' : 'note',
        status: 'active',
        tags: []
      });

      handleClose();
    } catch (err) {
      setError('Failed to save your capture. Please try again.');
      console.error('Capture error:', err);
    }
  }, [url, roomId, note, addItem, handleClose]);

  // Render helpers
  const renderInputStep = () => (
    <motion.div
      key="input"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-10"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          {STEP_TITLES.input}
          <span className="text-white/80">.</span>
        </h2>
        <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
          {STEP_DESCRIPTIONS.input}
        </p>
      </div>

      <div className="relative group max-w-lg mx-auto">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10 group-focus-within:bg-white/80 transition-colors duration-500" />
        <input
          type="text"
          required
          placeholder="Paste a URL or a deep thought..."
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          className="w-full bg-transparent text-2xl p-6 text-center outline-none transition-colors placeholder-gray-800 font-sans text-white"
          aria-label="URL or thought input"
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-4">
          <Link2 size={18} className="text-gray-600" />
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="flex justify-center pt-8">
        <button
          onClick={handleNext}
          disabled={!hasValidUrl || isScanning}
          className="group px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-3xl flex items-center gap-3 shadow-lg hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-30 disabled:translate-y-0"
          aria-label="Continue to next step"
        >
          {isScanning ? 'Scanning Artifact...' : 'Analyze Resonance'}
          {!isScanning && <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
        </button>
      </div>
    </motion.div>
  );

  const renderContextStep = () => (
    <motion.div
      key="context"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-10"
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2 rounded-full bg-white/10 border border-white/20 flex items-center gap-3">
            <Check size={14} className="text-white/80" />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
              Resonance Verified
            </span>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
          {STEP_TITLES.context}
          <span className="text-gray-500 italic font-serif">?</span>
        </h2>
        <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
          {STEP_DESCRIPTIONS.context}
        </p>
      </div>

      <div className="min-h-[220px]">
        {!isAddingRoom ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto h-[220px] overflow-y-auto px-4 scrollbar-hide py-2">
            {rooms && rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setRoomId(room.id);
                  setError(null);
                }}
                className={`p-6 rounded-4xl border transition-all flex flex-col items-center gap-4 group ${
                  roomId === room.id
                    ? 'bg-white/10 border-white/80 shadow-lg'
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
                aria-label={`Select room: ${room.name}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  roomId === room.id ? 'bg-white/80 text-black' : 'bg-white/5 text-gray-500 group-hover:text-white'
                }`}>
                  <Layout size={18} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest text-center leading-tight ${
                  roomId === room.id ? 'text-white' : 'text-gray-500'
                }`}>
                  {room.name}
                </span>
              </button>
            ))}
            
            <button
              onClick={() => setIsAddingRoom(true)}
              className="p-6 rounded-4xl border border-dashed border-white/10 hover:border-white/40 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-4 group"
              aria-label="Create new room"
            >
              <div className="w-10 h-10 rounded-full border border-dashed border-gray-600 flex items-center justify-center group-hover:border-white transition-colors">
                <Plus size={18} className="text-gray-600 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                New Room
              </span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto space-y-6 bg-white/5 border border-white/10 p-8 rounded-[2.5rem]"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">
                Room Identity
              </label>
              <input
                autoFocus
                placeholder="e.g., Digital Ephemera"
                value={newRoom.name}
                onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateRoom();
                  if (e.key === 'Escape') setIsAddingRoom(false);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-lg outline-none focus:border-white/80 transition-all text-white placeholder-gray-800"
                aria-label="New room name"
              />
            </div>

            <div className="flex gap-2 p-1 bg-white/5 rounded-3xl">
              <button
                onClick={() => setNewRoom(prev => ({ ...prev, isPublic: false }))}
                className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                  !newRoom.isPublic ? 'bg-white/10 text-white shadow-lg' : 'text-gray-600'
                }`}
                aria-label="Private room"
              >
                <Lock size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Solo Vault</span>
              </button>
              <button
                onClick={() => setNewRoom(prev => ({ ...prev, isPublic: true }))}
                className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                  newRoom.isPublic ? 'bg-white/20 text-white shadow-lg' : 'text-gray-600'
                }`}
                aria-label="Public room"
              >
                <Globe size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Public Hub</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsAddingRoom(false);
                  setError(null);
                }}
                className="flex-1 py-4 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all"
                aria-label="Cancel room creation"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={!newRoom.name.trim()}
                className="flex-[2] py-4 rounded-2xl bg-white text-black text-[10px] font-bold uppercase tracking-widest shadow-lg disabled:opacity-30 transition-all hover:-translate-y-0.5"
                aria-label="Create room"
              >
                Establish Room
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="flex justify-center pt-8">
        <button
          onClick={handleNext}
          disabled={!hasValidRoom}
          className="group px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-3xl flex items-center gap-3 shadow-lg hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-30"
          aria-label="Continue to contemplation"
        >
          Anchor Context <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );

  const renderContemplationStep = () => (
    <motion.div
      key="contemplation"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="space-y-10"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
          {STEP_TITLES.contemplation}
          <span className="text-white/80">.</span>
        </h2>
        <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
          {STEP_DESCRIPTIONS.contemplation}
        </p>
      </div>

      <div className="relative group max-w-lg mx-auto">
        <textarea
          placeholder="Your silent thoughts go here..."
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleCapture(e);
            }
          }}
          className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-lg outline-none transition-all placeholder-gray-700 min-h-[140px] font-serif italic text-white focus:border-white/40 resize-y"
          aria-label="Your thoughts and notes"
          rows={4}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="flex justify-center pt-8">
        <button
          onClick={handleCapture}
          className="group px-12 py-6 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-[2rem] flex items-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
          aria-label="Save capture"
        >
          <Zap size={18} className="fill-black" /> Commit to Muse
        </button>
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100]"
        aria-label="Modal backdrop"
      />
      
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[101] flex items-center justify-center p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Capture modal"
      >
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Scanline Effect */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                variants={scanlineVariants}
                animate="animate"
                className="absolute inset-x-0 h-1 bg-white/80 blur-md z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 p-3 text-gray-500 hover:text-white transition-all rounded-2xl hover:bg-white/5 active:scale-95"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Back button */}
          {step !== 'input' && (
            <button
              onClick={handleBack}
              className="absolute top-8 left-8 p-3 text-gray-500 hover:text-white transition-all rounded-2xl hover:bg-white/5 active:scale-95 flex items-center gap-2 group"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
                Back
              </span>
            </button>
          )}

          {/* Progress indicator */}
          <CaptureProgress 
            currentStep={currentStepIndex} 
            totalSteps={STEPS.length} 
          />

          {/* Main content */}
          <div className="min-h-[300px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 'input' && renderInputStep()}
              {step === 'context' && renderContextStep()}
              {step === 'contemplation' && renderContemplationStep()}
            </AnimatePresence>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}