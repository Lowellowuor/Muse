import { useEffect, useState } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import ProfileHeader from '../components/ProfileHeader';
import CreativeStats from '../components/CreativeStats';
import AchievementsGrid from '../components/AchievementsGrid';
import ActivityTimeline from '../components/ActivityTimeline';
import CreativeSignature from '../components/CreativeSignature';
import { Settings, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'achievements' | 'activity';

export default function Profile() {
  const navigate = useNavigate();
  const { 
    profile, 
    stats, 
    achievements, 
    activities, 
    creativeSignature,
    isLoading,
    fetchProfile,
    updateProfile,
    updateAvatar,
    getRecentActivities
  } = useProfileStore();

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading || !profile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const recentActivities = getRecentActivities(5);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <Settings size={18} className="text-gray-400" />
          </button>
          <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 transition">
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader 
        profile={profile} 
        onUpdateProfile={updateProfile}
        onUpdateAvatar={updateAvatar}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mt-6 px-6">
        {[
          { id: 'overview' as Tab, label: 'Overview' },
          { id: 'achievements' as Tab, label: 'Achievements' },
          { id: 'activity' as Tab, label: 'Activity' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <CreativeStats stats={stats} />
            <div className="grid md:grid-cols-2 gap-6">
              <CreativeSignature signature={creativeSignature!} />
              <ActivityTimeline activities={recentActivities} />
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <AchievementsGrid achievements={achievements} />
        )}

        {activeTab === 'activity' && (
          <ActivityTimeline activities={activities} />
        )}
      </div>
    </div>
  );
}