import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Zap, Brain, Plus, Edit, 
  Mic, Camera, Link, FileText, 
  MessageSquare, Users, Share2, Download,
  ArrowRight, Check, Clock, Star
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  route: string;
  shortcut?: string;
  category: 'create' | 'analyze' | 'share' | 'tools';
}

export default function Actions() {
  const navigate = useNavigate();
  const [recentActions, setRecentActions] = useState<string[]>(['Create Room', 'Journal Entry', 'New Thread']);
  const [favorites, setFavorites] = useState<string[]>(['AI Insights', 'Create Thread']);
  
  const quickActions: QuickAction[] = [
    {
      id: 'create-thread',
      title: 'Create Thread',
      description: 'Start a new conversation',
      icon: MessageSquare,
      gradient: 'from-cyan-500 to-blue-500',
      route: '/create',
      category: 'create'
    },
    {
      id: 'new-room',
      title: 'New Room',
      description: 'Create a collection space',
      icon: Plus,
      gradient: 'from-purple-500 to-pink-500',
      route: '/rooms',
      category: 'create'
    },
    {
      id: 'journal-entry',
      title: 'Journal Entry',
      description: 'Capture your thoughts',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500',
      route: '/journal',
      category: 'create'
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'Analyze your patterns',
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-500',
      route: '/insights',
      category: 'analyze'
    },
    {
      id: 'voice-note',
      title: 'Voice Note',
      description: 'Speak your mind',
      icon: Mic,
      gradient: 'from-red-500 to-orange-500',
      route: '/voice',
      category: 'tools'
    },
    {
      id: 'scan-url',
      title: 'Scan URL',
      description: 'Save web content',
      icon: Link,
      gradient: 'from-cyan-500 to-blue-500',
      route: '/scan',
      category: 'tools'
    },
    {
      id: 'share-insight',
      title: 'Share Insight',
      description: 'Share with community',
      icon: Share2,
      gradient: 'from-purple-500 to-pink-500',
      route: '/share',
      category: 'share'
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download your content',
      icon: Download,
      gradient: 'from-emerald-500 to-teal-500',
      route: '/export',
      category: 'tools'
    }
  ];
  
  const categories = [
    { id: 'all', label: 'All Actions', icon: Zap },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'analyze', label: 'Analyze', icon: Brain },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'tools', label: 'Tools', icon: Sparkles },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);
  
  const handleAction = (route: string, title: string) => {
    // Add to recent actions
    setRecentActions(prev => [title, ...prev.filter(a => a !== title)].slice(0, 5));
    navigate(route);
  };
  
  const toggleFavorite = (title: string) => {
    setFavorites(prev => 
      prev.includes(title) 
        ? prev.filter(f => f !== title)
        : [...prev, title]
    );
  };
  
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">QUICK ACTIONS • 1-CLICK ACCESS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quick Actions
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Instant access to your most-used features. Create, analyze, share, and explore with one click.
          </p>
        </div>
        
        {/* Recent Actions */}
        {recentActions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Recent Actions</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {recentActions.map((action, index) => (
                <motion.button
                  key={action}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    const actionItem = quickActions.find(a => a.title === action);
                    if (actionItem) handleAction(actionItem.route, action);
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-cyan-500/50 transition"
                >
                  {action}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <cat.icon size={16} />
              <span className="text-sm font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
        
        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredActions.map((action, index) => {
            const Icon = action.icon;
            const isFavorite = favorites.includes(action.title);
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div 
                  onClick={() => handleAction(action.route, action.title)}
                  className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all h-full"
                >
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(action.title);
                    }}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-yellow-400 transition"
                  >
                    <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-yellow-400' : ''} />
                  </button>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} p-2.5 mb-4 flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                  
                  {action.shortcut && (
                    <div className="text-xs text-gray-600 font-mono">{action.shortcut}</div>
                  )}
                  
                  <div className="flex items-center gap-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm">Activate</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Voice Command Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 mb-4">
            <Mic size={14} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">VOICE COMMANDS • BETA</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Voice-Activated Actions</h3>
          <p className="text-gray-400 mb-6">"Create a new room", "Show my insights", "Start journal entry"</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
            <Mic size={18} />
            Enable Voice Control
          </button>
        </motion.div>
      </div>
    </div>
  );
}