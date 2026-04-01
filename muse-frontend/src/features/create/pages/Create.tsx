import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Zap, Plus, FileText, MessageCircle, Home, 
  Package, File, Lightbulb, Brain, Target, Heart, 
  Calendar, Star, Award, Sun, Cloud, Moon, Eye,
  TrendingUp, FolderOpen, Users, Rocket, Gift, Compass
} from 'lucide-react';
import { useCreateStore, templates, getTemplateIcon } from '../store/useCreateStore';
import { useJournalStore } from '../../journal/store/useJournalStore';
import { useThreadsStore } from '../../threads/store/useThreadsStore';
import { useRoomsStore } from '../../rooms/store/useRoomsStore';
import ContentTypeCard from '../components/ContentTypeCard';
import QuickJournalForm from '../components/QuickJournalForm';
import QuickThreadForm from '../components/QuickThreadForm';
import TemplatesGallery from '../components/TemplatesGallery';
import AIWriter from '../components/AIWriter';
import RecentCreations from '../components/RecentCreations';
import SmartSuggestions from '../components/SmartSuggestions';
import { ContentType } from '../types';

export default function Create() {
  const navigate = useNavigate();
  const { recentCreations, addRecentCreation, generateAIContent, aiWriter, setAITone, setAILength, clearAIWriter } = useCreateStore();
  const addJournalEntry = useJournalStore(state => state.addEntry);
  const addThread = useThreadsStore(state => state.addThread);
  const addRoom = useRoomsStore(state => state.addRoom);
  
  const [activeModal, setActiveModal] = useState<ContentType | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const contentTypes = [
    { type: 'journal' as ContentType, icon: FileText, title: 'Journal Entry', description: 'Capture your thoughts and reflections', color: 'from-blue-500/20 to-blue-600/10', action: () => setActiveModal('journal') },
    { type: 'thread' as ContentType, icon: MessageCircle, title: 'Thread', description: 'Start a discussion with the community', color: 'from-purple-500/20 to-purple-600/10', action: () => setActiveModal('thread') },
    { type: 'room' as ContentType, icon: Home, title: 'Room', description: 'Create a curated creative space', color: 'from-emerald-500/20 to-emerald-600/10', action: () => navigate('/rooms') },
    { type: 'artifact' as ContentType, icon: Package, title: 'Artifact', description: 'Add content to an existing room', color: 'from-orange-500/20 to-orange-600/10', action: () => navigate('/rooms') },
    { type: 'note' as ContentType, icon: File, title: 'Quick Note', description: 'Jot down an idea before you forget', color: 'from-cyan-500/20 to-cyan-600/10', action: () => setActiveModal('journal') },
    { type: 'idea' as ContentType, icon: Lightbulb, title: 'Idea', description: 'Capture and develop creative concepts', color: 'from-yellow-500/20 to-yellow-600/10', action: () => setActiveModal('journal') },
  ];

  const smartSuggestions = [
    {
      id: '1',
      title: 'Continue your evening writing streak',
      description: 'You write best between 8-11 PM',
      icon: Sparkles,
      action: () => setActiveModal('journal'),
    },
    {
      id: '2',
      title: 'Explore AI creativity trends',
      description: 'Based on your recent reading',
      icon: TrendingUp,
      action: () => navigate('/threads'),
    },
    {
      id: '3',
      title: 'Organize your ideas into a room',
      description: 'You have 5 unsorted artifacts',
      icon: FolderOpen,
      action: () => navigate('/rooms'),
    },
  ];

  const inspirationPrompts = [
    { icon: Sun, title: 'Morning Pages', description: 'Stream of consciousness writing' },
    { icon: Target, title: "Today's Goal", description: 'What you want to accomplish' },
    { icon: Heart, title: 'Gratitude List', description: 'Things you\'re thankful for' },
    { icon: Eye, title: 'Future Self', description: 'Letter to your future self' },
  ];

  const handleJournalSubmit = (data: any) => {
    addJournalEntry(data);
    addRecentCreation({ type: 'journal', title: data.title, preview: data.content.slice(0, 100), link: '/journal' });
    setActiveModal(null);
  };

  const handleThreadSubmit = (data: any) => {
    addThread(data);
    addRecentCreation({ type: 'thread', title: data.title, preview: data.content.slice(0, 100), link: `/threads` });
    setActiveModal(null);
  };

  const handleAIGenerate = async (prompt: string, tone: string, length: string) => {
    await generateAIContent(prompt, tone, length);
  };

  const handleUseAIContent = (content: string) => {
    setActiveModal('journal');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={28} className="text-white" />
          <h1 className="text-4xl font-bold text-white">Create</h1>
        </div>
        <p className="text-gray-400">Bring your ideas to life</p>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          </div>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <Plus size={12} />
            Templates
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {contentTypes.map(type => (
            <ContentTypeCard key={type.type} {...type} />
          ))}
        </div>
      </div>

      {/* Templates Gallery */}
      {showTemplates && (
        <div className="mb-10">
          <TemplatesGallery 
            templates={templates} 
            onSelectTemplate={(template) => {
              if (template.type === 'journal') setActiveModal('journal');
              if (template.type === 'thread') setActiveModal('thread');
              if (template.type === 'room') navigate('/rooms');
              setShowTemplates(false);
            }} 
          />
        </div>
      )}

      {/* Two Column Layout for AI Writer & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - AI Writer */}
        <div className="lg:col-span-2 space-y-6">
          <AIWriter
            onGenerate={handleAIGenerate}
            isGenerating={aiWriter.isGenerating}
            generatedContent={aiWriter.generatedContent}
            tone={aiWriter.tone}
            length={aiWriter.length}
            onToneChange={setAITone}
            onLengthChange={setAILength}
            onUseContent={handleUseAIContent}
          />
          
          {/* Inspiration Section - No Emojis */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Rocket size={16} className="text-purple-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Need Inspiration?</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {inspirationPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button 
                    key={index}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left group"
                  >
                    <Icon size={24} className="text-gray-400 mb-2 group-hover:text-white transition" />
                    <p className="text-xs font-medium text-white">{prompt.title}</p>
                    <p className="text-[10px] text-gray-500">{prompt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right Column - Recent & Suggestions */}
        <div className="space-y-6">
          <RecentCreations creations={recentCreations} />
          
          <div className="space-y-3">
            {smartSuggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={suggestion.id}
                  onClick={suggestion.action}
                  className="w-full flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition text-left group"
                >
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition">
                    <Icon size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{suggestion.title}</p>
                    <p className="text-xs text-gray-400">{suggestion.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={14} className="text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Pro Tip</h3>
            </div>
            <p className="text-xs text-gray-400">
              Use the AI Writer to overcome creative blocks. Just describe what you want to write about and let AI help you get started!
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickJournalForm
        isOpen={activeModal === 'journal'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleJournalSubmit}
      />
      
      <QuickThreadForm
        isOpen={activeModal === 'thread'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleThreadSubmit}
      />
    </div>
  );
}