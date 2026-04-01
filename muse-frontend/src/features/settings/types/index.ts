export interface ProfileSettings {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  avatar: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  reduceMotion: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notifyOnReply: boolean;
  notifyOnLike: boolean;
  notifyOnFollow: boolean;
  notifyOnAchievement: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
}

export interface PrivacySecuritySettings {
  accountVisibility: 'public' | 'private';
  showEmailInProfile: boolean;
  allowSearchIndexing: boolean;
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
}

export interface ContentPreferences {
  defaultThreadVisibility: 'public' | 'private';
  autoSaveDrafts: boolean;
  showWordCount: boolean;
  defaultMood: string;
  defaultLanguage: string;
}

export interface DataManagement {
  exportFormat: 'json' | 'csv';
  lastExport: string | null;
  dataSize: string;
}

export interface SettingsState {
  profile: ProfileSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySecuritySettings;
  content: ContentPreferences;
  data: DataManagement;
  isLoading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}