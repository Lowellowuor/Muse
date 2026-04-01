import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import ProfileSettings from '../components/ProfileSettings';
import AppearanceSettings from '../components/AppearanceSettings';
import NotificationSettings from '../components/NotificationSettings';
import PrivacySecurity from '../components/PrivacySecurity';
import DataManagement from '../components/DataManagement';
import { Settings as SettingsIcon, Save, CheckCircle } from 'lucide-react';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'privacy' | 'data';

export default function Settings() {
  const {
    profile,
    appearance,
    notifications,
    privacy,
    data,
    saveStatus,
    isLoading,
    updateProfile,
    updateAppearance,
    updateNotifications,
    updatePrivacy,
    updateData,
    saveSettings,
    exportData,
    clearAllData,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  useEffect(() => {
    // Auto-save when any setting changes (debounced)
    const timer = setTimeout(() => {
      if (saveStatus === 'idle') {
        saveSettings();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [profile, appearance, notifications, privacy, data, saveStatus]);

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: SettingsIcon },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: SettingsIcon },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: SettingsIcon },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: SettingsIcon },
    { id: 'data' as SettingsTab, label: 'Data', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account preferences</p>
        </div>
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-sm">Saving...</span>
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle size={16} />
            <span className="text-sm">Saved</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <ProfileSettings profile={profile} onUpdate={updateProfile} />
        )}

        {activeTab === 'appearance' && (
          <AppearanceSettings appearance={appearance} onUpdate={updateAppearance} />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings notifications={notifications} onUpdate={updateNotifications} />
        )}

        {activeTab === 'privacy' && (
          <PrivacySecurity privacy={privacy} onUpdate={updatePrivacy} />
        )}

        {activeTab === 'data' && (
          <DataManagement 
            data={data} 
            onExport={exportData}
            onClearAll={clearAllData}
            onUpdate={updateData}
            isExporting={isLoading}
          />
        )}
      </div>
    </div>
  );
}