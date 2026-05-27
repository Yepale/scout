import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'system';
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';

interface PetDefault {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  photo?: string;
}

interface SettingsState {
  // Profile
  displayName: string;
  email: string;
  pets: PetDefault[];

  // Scanner
  hapticsEnabled: boolean;
  autoFlash: boolean;
  aiSensitivity: number;
  motionTracking: boolean;
  autoZoom: boolean;
  scanSound: boolean;
  demoMode: boolean;

  // Appearance
  theme: ThemeMode;
  reduceMotion: boolean;

  // Notifications
  pushEnabled: boolean;
  riskAlerts: boolean;
  weeklyReport: boolean;
  tipOfDay: boolean;

  // Data
  autoBackup: boolean;
  useCellularData: boolean;
  storageUsed: number;

  // Privacy
  shareAnalytics: boolean;
  shareLocation: boolean;

  // Language
  language: Language;
  temperatureUnit: TemperatureUnit;

  // Actions
  toggleHaptics: () => void;
  toggleAutoFlash: () => void;
  setAiSensitivity: (v: number) => void;
  toggleMotionTracking: () => void;
  toggleAutoZoom: () => void;
  toggleScanSound: () => void;
  toggleDemoMode: () => void;
  setTheme: (t: ThemeMode) => void;
  toggleReduceMotion: () => void;
  togglePush: () => void;
  toggleRiskAlerts: () => void;
  toggleWeeklyReport: () => void;
  toggleTipOfDay: () => void;
  toggleAutoBackup: () => void;
  toggleUseCellular: () => void;
  toggleAnalytics: () => void;
  toggleLocation: () => void;
  setLanguage: (l: Language) => void;
  setTemperatureUnit: (t: TemperatureUnit) => void;
  setDisplayName: (n: string) => void;
  setEmail: (e: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  displayName: 'You',
  email: '',
  pets: [{ id: 'pet1', name: 'Luna', type: 'dog', breed: 'Labrador', age: 3, weight: 28 }],

  hapticsEnabled: true,
  autoFlash: false,
  aiSensitivity: 0.7,
  motionTracking: true,
  autoZoom: true,
  scanSound: false,
  demoMode: false,

  theme: 'dark',
  reduceMotion: false,

  pushEnabled: true,
  riskAlerts: true,
  weeklyReport: false,
  tipOfDay: true,

  autoBackup: false,
  useCellularData: false,
  storageUsed: 0,

  shareAnalytics: true,
  shareLocation: false,

  language: 'en',
  temperatureUnit: 'celsius',

  toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
  toggleAutoFlash: () => set((s) => ({ autoFlash: !s.autoFlash })),
  setAiSensitivity: (v) => set({ aiSensitivity: v }),
  toggleMotionTracking: () => set((s) => ({ motionTracking: !s.motionTracking })),
  toggleAutoZoom: () => set((s) => ({ autoZoom: !s.autoZoom })),
  toggleScanSound: () => set((s) => ({ scanSound: !s.scanSound })),
  toggleDemoMode: () => set((s) => ({ demoMode: !s.demoMode })),
  setTheme: (t) => set({ theme: t }),
  toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
  togglePush: () => set((s) => ({ pushEnabled: !s.pushEnabled })),
  toggleRiskAlerts: () => set((s) => ({ riskAlerts: !s.riskAlerts })),
  toggleWeeklyReport: () => set((s) => ({ weeklyReport: !s.weeklyReport })),
  toggleTipOfDay: () => set((s) => ({ tipOfDay: !s.tipOfDay })),
  toggleAutoBackup: () => set((s) => ({ autoBackup: !s.autoBackup })),
  toggleUseCellular: () => set((s) => ({ useCellularData: !s.useCellularData })),
  toggleAnalytics: () => set((s) => ({ shareAnalytics: !s.shareAnalytics })),
  toggleLocation: () => set((s) => ({ shareLocation: !s.shareLocation })),
  setLanguage: (l) => set({ language: l }),
  setTemperatureUnit: (t) => set({ temperatureUnit: t }),
  setDisplayName: (n) => set({ displayName: n }),
  setEmail: (e) => set({ email: e }),
}));
