import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRoomsStore } from '../store/useRoomsStore';
import RoomStats from '../components/RoomStats';
import RoomInsights from '../components/RoomInsights';
import ArtifactCard from '../components/ArtifactCard';
import AddArtifactModal from '../components/AddArtifactModal';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = useRoomsStore(state => state.getRoomById(id || ''));
  const { addArtifact, deleteArtifact, getRoomStats, getRoomInsights } = useRoomsStore();
  const [showAddModal, setShowAddModal] = useState(false);
  
  if (!room) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Room not found</p>
        <button onClick={() => navigate('/rooms')} className="mt-4 text-white underline">
          Back to Rooms
        </button>
      </div>
    );
  }
  
  const stats = getRoomStats(room.id);
  const insights = getRoomInsights(room.id);
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/rooms')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{room.icon}</span>
              <h1 className="text-3xl font-bold text-white">{room.name}</h1>
            </div>
            {room.description && (
              <p className="text-gray-400 mt-1">{room.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Add Artifact
        </button>
      </div>
      
      {/* Stats */}
      <div className="mb-6">
        <RoomStats stats={stats} />
      </div>
      
      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="mb-6">
          <RoomInsights insights={insights} />
        </div>
      )}
      
      {/* Artifacts Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Artifacts</h2>
        <p className="text-gray-400 text-sm">Items collected in this room</p>
      </div>
      
      {/* Artifacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {room.artifacts.map((artifact) => (
          <ArtifactCard
            key={artifact.id}
            artifact={artifact}
            onDelete={(id) => deleteArtifact(room.id, id)}
          />
        ))}
      </div>
      
      {/* Empty Artifacts State */}
      {room.artifacts.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">No artifacts yet</p>
          <p className="text-gray-600 text-sm mt-2">Add your first artifact to this room</p>
        </div>
      )}
      
      {/* Add Artifact Modal */}
      <AddArtifactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(artifact) => addArtifact(room.id, artifact)}
      />
    </div>
  );
}