import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SettingsState, 
  ProfileSettings, 
  AppearanceSettings, 
  NotificationSettings, 
  PrivacySecuritySettings,
  ContentPreferences,
  DataManagement
} from '../types';

interface SettingsActions {
  updateProfile: (updates: Partial<ProfileSettings>) => void;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updatePrivacy: (updates: Partial<PrivacySecuritySettings>) => void;
  updateContent: (updates: Partial<ContentPreferences>) => void;
  updateData: (updates: Partial<DataManagement>) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  exportData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const defaultProfile: ProfileSettings = {
  displayName: 'Alex Chen',
  username: '@alexcreates',
  email: 'alex@muse.com',
  bio: 'Creative technologist exploring AI and human creativity.',
  location: 'San Francisco, CA',
  website: 'https://alexcreates.dev',
  twitter: '@alexcreates',
  github: 'alexcreates',
  avatar: '',
};

const defaultAppearance: AppearanceSettings = {
  theme: 'dark',
  accentColor: 'cyan',
  fontSize: 'medium',
  compactMode: false,
  animations: true,
  reduceMotion: false,
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  notifyOnReply: true,
  notifyOnLike: true,
  notifyOnFollow: true,
  notifyOnAchievement: true,
  weeklyDigest: true,
  productUpdates: false,
};

const defaultPrivacy: PrivacySecuritySettings = {
  accountVisibility: 'public',
  showEmailInProfile: false,
  allowSearchIndexing: true,
  twoFactorEnabled: false,
  lastPasswordChange: new Date().toISOString(),
};

const defaultContent: ContentPreferences = {
  defaultThreadVisibility: 'public',
  autoSaveDrafts: true,
  showWordCount: true,
  defaultMood: 'reflective',
  defaultLanguage: 'en',
};

const defaultData: DataManagement = {
  exportFormat: 'json',
  lastExport: null,
  dataSize: '2.4 MB',
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      appearance: defaultAppearance,
      notifications: defaultNotifications,
      privacy: defaultPrivacy,
      content: defaultContent,
      data: defaultData,
      isLoading: false,
      saveStatus: 'idle',

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
          saveStatus: 'idle',
        }));
      },

      updateAppearance: (updates) => {
        set((state) => ({
          appearance: { ...state.appearance, ...updates },
          saveStatus: 'idle',
        }));
      },

      updateNotifications: (updates) => {
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
          saveStatus: 'idle',
        }));
      },

      updatePrivacy: (updates) => {
        set((state) => ({
          privacy: { ...state.privacy, ...updates },
          saveStatus: 'idle',
        }));
      },

      updateContent: (updates) => {
        set((state) => ({
          content: { ...state.content, ...updates },
          saveStatus: 'idle',
        }));
      },

      updateData: (updates) => {
        set((state) => ({
          data: { ...state.data, ...updates },
          saveStatus: 'idle',
        }));
      },

      saveSettings: async () => {
        set({ saveStatus: 'saving', isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ saveStatus: 'saved', isLoading: false });
        setTimeout(() => set({ saveStatus: 'idle' }), 2000);
      },

      resetSettings: () => {
        set({
          profile: defaultProfile,
          appearance: defaultAppearance,
          notifications: defaultNotifications,
          privacy: defaultPrivacy,
          content: defaultContent,
          data: defaultData,
          saveStatus: 'idle',
        });
      },

      exportData: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = {
          profile: get().profile,
          content: get().content,
          notifications: get().notifications,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `muse-backup-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        set({ isLoading: false, data: { ...get().data, lastExport: new Date().toISOString() } });
      },

      clearAllData: async () => {
        if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
          set({ isLoading: true });
          await new Promise(resolve => setTimeout(resolve, 1500));
          set({ 
            profile: defaultProfile,
            appearance: defaultAppearance,
            notifications: defaultNotifications,
            privacy: defaultPrivacy,
            content: defaultContent,
            data: { ...defaultData, dataSize: '0 KB' },
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'muse-settings-storage',
      version: 1,
    }
  )
);