// App constants
export const APP_NAME = 'Muse';
export const APP_VERSION = '1.0.0';

// Colors (Black & White theme)
export const THEME = {
  primary: '#ffffff',
  secondary: '#666666',
  background: '#000000',
  surface: '#1a1a1a',
  border: '#333333',
  text: {
    primary: '#ffffff',
    secondary: '#999999',
    disabled: '#666666',
  },
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ROOMS: '/rooms',
  ROOM_DETAIL: (id: string) => /rooms/,
  JOURNAL: '/journal',
  JOURNAL_ENTRY: (id: string) => /journal/,
  THREADS: '/threads',
  THREAD_DETAIL: (id: string) => /threads/,
  CONNECTIONS: '/connections',
  COMMUNITY: '/community',
  SETTINGS: '/settings',
  CREATE: '/create',
  MIRROR: '/mirror',
  AUTH: '/auth',
};

// Storage keys
export const STORAGE_KEYS = {
  USER: 'muse_user',
  THEME: 'muse_theme',
  SOLO_MODE: 'muse_solo_mode',
};

// Default values
export const DEFAULTS = {
  ROOM_THEME: 'white',
  JOURNAL_GOAL: 300,
  STREAK_DAYS: 0,
};