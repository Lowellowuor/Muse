// src/features/rooms/pages/Rooms.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search,  ChevronLeft, ChevronRight, 
  Sparkles, LayoutGrid, List,  Star, TrendingUp,
  Zap, FolderOpen, Archive, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RoomType } from '../../../types';

// Dummy data for preview
const dummyRooms = [
  {
    id: '1',
    name: 'Creative Ideation Lab',
    description: 'Exploring innovative ideas and breakthrough concepts in creative technology',
    type: 'studio' as RoomType,
    icon: '⚡',
    tags: ['creativity', 'innovation', 'ideas'],
    artifacts: [
      { id: 'a1', type: 'note', title: 'Brainstorming Session', content: 'Generated 50+ ideas...' },
      { id: 'a2', type: 'image', title: 'Mind Map', content: 'Visual concept map' },
    ],
    pinned: true,
    isArchived: false,
    collaborators: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    count: 24,
  },
  {
    id: '2',
    name: 'Visual Inspiration Gallery',
    description: 'Curated collection of stunning visuals and design inspiration',
    type: 'gallery' as RoomType,
    icon: '🎨',
    tags: ['design', 'art', 'inspiration'],
    artifacts: [
      { id: 'a3', type: 'image', title: 'Color Palette', content: 'Modern gradients' },
    ],
    pinned: true,
    isArchived: false,
    collaborators: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    count: 156,
  },
  {
    id: '3',
    name: 'Research Archive',
    description: 'Academic papers, articles, and research materials',
    type: 'archive' as RoomType,
    icon: '📚',
    tags: ['research', 'academic', 'learning'],
    artifacts: [
      { id: 'a4', type: 'document', title: 'AI Research Paper', content: 'Latest advancements...' },
    ],
    pinned: false,
    isArchived: false,
    collaborators: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    count: 89,
  },
  {
    id: '4',
    name: 'Personal Vault',
    description: 'Private thoughts, memories, and personal reflections',
    type: 'vault' as RoomType,
    icon: '🔒',
    tags: ['personal', 'private', 'memories'],
    artifacts: [
      { id: 'a5', type: 'note', title: 'Daily Reflection', content: 'Today was productive...' },
    ],
    pinned: false,
    isArchived: false,
    collaborators: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    count: 45,
  },
  {
    id: '5',
    name: 'Team Collab Space',
    description: 'Collaborative workspace for the creative team',
    type: 'collab' as RoomType,
    icon: '🤝',
    tags: ['team', 'collaboration', 'work'],
    artifacts: [
      { id: 'a6', type: 'note', title: 'Meeting Notes', content: 'Q1 planning session...' },
    ],
    pinned: false,
    isArchived: false,
    collaborators: ['alice', 'bob', 'charlie'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    count: 67,
  },
];

// Type icons mapping
const typeIcons = {
  vault: FolderOpen,
  gallery: LayoutGrid,
  studio: Zap,
  archive: Archive,
  collab: Users,
};

const typeColors = {
  vault: 'from-gray-500/30 to-gray-600/20',
  gallery: 'from-purple-500/30 to-pink-500/20',
  studio: 'from-amber-500/30 to-orange-500/20',
  archive: 'from-blue-500/30 to-cyan-500/20',
  collab: 'from-emerald-500/30 to-teal-500/20',
};

// Room Card Component for Cinema View
function RoomCinemaCard({ room, onClick }: { room: any; onClick: () => void }) {
  const TypeIcon = typeIcons[room.type as keyof typeof typeIcons] || FolderOpen;
  
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="min-w-[260px] md:min-w-[300px] group/card cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[room.type as keyof typeof typeColors]} opacity-30`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className="text-4xl">{room.icon}</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{room.name}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{room.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <TypeIcon size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">{room.artifacts.length} artifacts</span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-400">{room.count} items</span>
          </div>
          {room.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {room.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[9px] text-gray-500">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Grid Card Component
function RoomGridCard({ room, onClick }: { room: any; onClick: () => void }) {
  const TypeIcon = typeIcons[room.type as keyof typeof typeIcons] || FolderOpen;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-5xl">{room.icon}</span>
        {room.pinned && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{room.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {room.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] text-gray-500">#{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <TypeIcon size={14} className="text-gray-500" />
          <span className="text-sm text-gray-500">{room.artifacts.length} artifacts</span>
        </div>
        <span className="text-xs text-gray-600">
          {new Date(room.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}

// Trending Card Component
function TrendingCard({ room, rank }: { room: any; rank: number }) {
  const TypeIcon = typeIcons[room.type as keyof typeof typeIcons] || FolderOpen;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer group"
    >
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">
        {rank}
      </div>
      <div className="text-3xl mb-2 mt-2">{room.icon}</div>
      <h4 className="font-bold text-white text-sm">{room.name}</h4>
      <div className="flex items-center gap-1 mt-1">
        <TypeIcon size={10} className="text-gray-500" />
        <p className="text-xs text-gray-400">{room.artifacts.length} artifacts</p>
      </div>
    </motion.div>
  );
}

// Row Component for Cinema View
function RoomRow({ title, rooms, onRoomClick }: { title: string; rooms: any[]; onRoomClick: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  if (rooms.length === 0) return null;
  
  return (
    <div className="relative group/row">
      <div className="flex justify-between items-center px-6 md:px-16 mb-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition">
          <button onClick={() => scroll('left')} className="p-2 bg-black/60 rounded-full hover:bg-white/20 backdrop-blur-sm transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-black/60 rounded-full hover:bg-white/20 backdrop-blur-sm transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-16"
        style={{ scrollBehavior: 'smooth' }}
      >
        {rooms.map((room) => (
          <RoomCinemaCard key={room.id} room={room} onClick={() => onRoomClick(room.id)} />
        ))}
      </div>
    </div>
  );
}

export default function Rooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(dummyRooms);
  const [viewMode, setViewMode] = useState<'cinema' | 'grid'>('cinema');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [heroRoom, setHeroRoom] = useState(dummyRooms.find(r => r.pinned) || dummyRooms[0]);
  
  // Filter rooms based on search and type
  const getFilteredRooms = () => {
    let filtered = rooms.filter(r => !r.isArchived);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedType) {
      filtered = filtered.filter(r => r.type === selectedType);
    }
    
    return filtered;
  };
  
  const filteredRooms = getFilteredRooms();
  
  // Group rooms by type for rows
  const roomsByType = {
    featured: filteredRooms.filter(r => r.pinned),
    studio: filteredRooms.filter(r => r.type === 'studio'),
    gallery: filteredRooms.filter(r => r.type === 'gallery'),
    vault: filteredRooms.filter(r => r.type === 'vault'),
    archive: filteredRooms.filter(r => r.type === 'archive'),
    collab: filteredRooms.filter(r => r.type === 'collab'),
  };
  
  const roomTypes: { value: RoomType | 'all'; label: string; icon: any }[] = [
    { value: 'all', label: 'All', icon: LayoutGrid },
    { value: 'vault', label: 'Vault', icon: FolderOpen },
    { value: 'gallery', label: 'Gallery', icon: LayoutGrid },
    { value: 'studio', label: 'Studio', icon: Zap },
    { value: 'archive', label: 'Archive', icon: Archive },
    { value: 'collab', label: 'Collab', icon: Users },
  ];
  
  const addRoom = (name: string, description: string, type: RoomType, template?: any) => {
    const newRoom = {
      id: Date.now().toString(),
      name,
      description,
      type,
      icon: template?.icon || '📁',
      tags: template?.suggestedTags || [],
      artifacts: [],
      pinned: false,
      isArchived: false,
      collaborators: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      count: 0,
    };
    setRooms([newRoom, ...rooms]);
  };
  
  const deleteRoom = (id: string) => {
    if (confirm('Delete this room?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };
  
  const togglePinRoom = (id: string) => {
    setRooms(rooms.map(r => 
      r.id === id ? { ...r, pinned: !r.pinned } : r
    ));
  };
  
  const duplicateRoom = (id: string) => {
    const original = rooms.find(r => r.id === id);
    if (original) {
      const duplicated = {
        ...original,
        id: Date.now().toString(),
        name: `${original.name} (Copy)`,
        artifacts: [...original.artifacts],
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setRooms([duplicated, ...rooms]);
    }
  };
  
  const archiveRoom = (id: string) => {
    setRooms(rooms.map(r => 
      r.id === id ? { ...r, isArchived: !r.isArchived } : r
    ));
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Featured Room */}
      {heroRoom && filteredRooms.length > 0 && (
        <div className="relative h-[55vh] md:h-[60vh] mb-12 group">
          <div className={`absolute inset-0 bg-gradient-to-r ${typeColors[heroRoom.type as keyof typeof typeColors]} z-10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
          
          <div className="absolute inset-0 flex items-center z-20 px-6 md:px-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white font-medium tracking-wide">
                  {heroRoom.pinned ? 'PINNED ROOM' : 'FEATURED ROOM'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{heroRoom.icon}</span>
                  <span className="text-sm text-gray-300">{heroRoom.artifacts.length} artifacts</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                {heroRoom.name}
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-2 max-w-xl">
                {heroRoom.description}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/rooms/${heroRoom.id}`)}
                  className="px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition transform hover:scale-105 flex items-center gap-2"
                >
                  Explore Room
                  <Sparkles size={18} />
                </button>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Room
                </button>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
      )}
      
      {/* View Toggle & Actions */}
      <div className="flex justify-between items-center px-6 md:px-16 mb-6">
        <div className="flex gap-2 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setViewMode('cinema')}
            className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
              viewMode === 'cinema' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={16} />
            Cinema View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
              viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <List size={16} />
            Grid View
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition flex items-center gap-2"
          >
            <Sparkles size={18} />
            Templates
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition flex items-center gap-2"
          >
            <Plus size={18} />
            New Room
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="px-6 md:px-16 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms by name, description, or tags..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
            />
          </div>
          <div className="flex gap-2">
            {roomTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value === 'all' ? null : type.value as RoomType)}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                    (type.value === 'all' && !selectedType) || selectedType === type.value
                      ? 'bg-white text-black'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>
          {(searchQuery || selectedType) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Cinema View */}
      {viewMode === 'cinema' && (
        <div className="space-y-10 pb-16">
          {roomsByType.featured.length > 0 && roomsByType.featured.length > 1 && (
            <RoomRow title="Your Picks" rooms={roomsByType.featured.slice(1)} onRoomClick={(id) => navigate(`/rooms/${id}`)} />
          )}
          
          {roomsByType.studio.length > 0 && (
            <RoomRow title="⚡ Creative Studios" rooms={roomsByType.studio} onRoomClick={(id) => navigate(`/rooms/${id}`)} />
          )}
          
          {roomsByType.gallery.length > 0 && (
            <RoomRow title="🎨 Visual Galleries" rooms={roomsByType.gallery} onRoomClick={(id) => navigate(`/rooms/${id}`)} />
          )}
          
          {roomsByType.vault.length > 0 && (
            <RoomRow title="🔒 Personal Vaults" rooms={roomsByType.vault} onRoomClick={(id) => navigate(`/rooms/${id}`)} />
          )}
          
          {roomsByType.archive.length > 0 && (
            <RoomRow title="📚 Research Archives" rooms={roomsByType.archive} onRoomClick={(id) => navigate(`/rooms/${id}`)} />
          )}
          
          {roomsByType.collab.length > 0 && (
            <RoomRow title="🤝 Collaboration Spaces" rooms={roomsByType.collab} onRoomClick={(id) => navigate(`/rooms/${id}`)} />
          )}
          
          {/* Trending Section */}
          <div className="px-6 md:px-16">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-white" />
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredRooms.slice(0, 4).map((room, i) => (
                <TrendingCard key={room.id} room={room} rank={i + 1} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="px-6 md:px-16 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomGridCard key={room.id} room={room} onClick={() => navigate(`/rooms/${room.id}`)} />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-20 mx-6 md:mx-16 bg-white/5 border border-white/10 rounded-2xl">
          <FolderOpen size={64} className="text-white/20 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No rooms yet</p>
          <p className="text-gray-600 text-sm mb-4">
            {searchQuery || selectedType ? 'No matching rooms found' : 'Create your first room to start curating'}
          </p>
          {!searchQuery && !selectedType && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Room
            </button>
          )}
        </div>
      )}
      
      {/* Quick Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
        >
          <Plus size={24} className="text-black" />
        </button>
      </div>
      
      {/* Modals (simplified for demo) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-white/10 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Create New Room</h2>
            <input
              type="text"
              placeholder="Room name"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-3 focus:outline-none focus:border-white/40"
            />
            <textarea
              placeholder="Description"
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-white/40 resize-none"
            />
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-white text-black rounded-xl font-medium">Create</button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-3 border border-white/20 rounded-xl text-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {showTemplates && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111318] border border-white/10 rounded-2xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Room Templates</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Idea Vault', 'Mood Board', 'Project Studio', 'Research Archive'].map(template => (
                <div key={template} className="p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-white/30">
                  <div className="text-3xl mb-2">📁</div>
                  <h3 className="font-bold text-white">{template}</h3>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTemplates(false)} className="mt-4 w-full py-2 border border-white/20 rounded-xl text-gray-400">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}