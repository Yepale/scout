import { create } from 'zustand';

interface SettingsState {
  hapticsEnabled: boolean;
  autoFlash: boolean;
  aiSensitivity: number;
  motionTracking: boolean;
  demoMode: boolean;
  darkMode: boolean;

  toggleHaptics: () => void;
  toggleAutoFlash: () => void;
  setAiSensitivity: (v: number) => void;
  toggleMotionTracking: () => void;
  toggleDemoMode: () => void;
  toggleDarkMode: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  hapticsEnabled: true,
  autoFlash: false,
  aiSensitivity: 0.7,
  motionTracking: true,
  demoMode: false,
  darkMode: true,

  toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
  toggleAutoFlash: () => set((s) => ({ autoFlash: !s.autoFlash })),
  setAiSensitivity: (v) => set({ aiSensitivity: v }),
  toggleMotionTracking: () => set((s) => ({ motionTracking: !s.motionTracking })),
  toggleDemoMode: () => set((s) => ({ demoMode: !s.demoMode })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
