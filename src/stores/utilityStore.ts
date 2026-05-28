import { create } from 'zustand';

export type FlashMode = 'off' | 'normal' | 'red' | 'green' | 'uv' | 'strobe' | 'white';
export type ScreenMode = 'normal' | 'white-warm' | 'white-cold' | 'red-night' | 'green-night' | 'blue-contrast';
export type UtilityPreset = 'normal' | 'camp' | 'night' | 'emergency';
export type CameraFilter = 'none' | 'uv' | 'thermal' | 'high-contrast' | 'edge-detect' | 'invert' | 'sepia' | 'dramatic';

interface UtilityState {
  // Flashlight
  flashMode: FlashMode;
  flashIntensity: number; // 0-1
  flashPersistent: boolean;
  strobeActive: boolean;

  // Screen
  screenMode: ScreenMode;
  screenBrightness: number; // 0-1 (system override)
  screenAwake: boolean;
  screenLocked: boolean;

  // Mode
  activePreset: UtilityPreset;
  campMode: boolean;
  nightMode: boolean;
  handsFree: boolean;

  // Audio
  audioFeedback: boolean;
  voiceCommands: boolean;
  lastVoiceCommand: string;

  // Camera filters
  cameraFilter: CameraFilter;
  filterIntensity: number; // 0-1

  // UI
  showUtilityPanel: boolean;
  overlayMinimal: boolean;

  // Actions — Flash
  setFlashMode: (m: FlashMode) => void;
  setFlashIntensity: (v: number) => void;
  setFlashPersistent: (v: boolean) => void;
  toggleStrobe: () => void;

  // Actions — Screen
  setScreenMode: (m: ScreenMode) => void;
  setScreenBrightness: (v: number) => void;
  setScreenAwake: (v: boolean) => void;
  setScreenLocked: (v: boolean) => void;

  // Actions — Modes
  setCampMode: (v: boolean) => void;
  setNightMode: (v: boolean) => void;
  setHandsFree: (v: boolean) => void;
  activatePreset: (p: UtilityPreset) => void;

  // Actions — Audio
  setAudioFeedback: (v: boolean) => void;
  setVoiceCommands: (v: boolean) => void;
  setLastVoiceCommand: (c: string) => void;

  // Actions — Filters
  setCameraFilter: (f: CameraFilter) => void;
  setFilterIntensity: (v: number) => void;

  // Actions — UI
  setShowUtilityPanel: (v: boolean) => void;
  setOverlayMinimal: (v: boolean) => void;

  // Reset
  resetAll: () => void;
}

const initialState = {
  flashMode: 'off' as FlashMode,
  flashIntensity: 1,
  flashPersistent: false,
  strobeActive: false,
  screenMode: 'normal' as ScreenMode,
  screenBrightness: -1, // -1 = system default
  screenAwake: false,
  screenLocked: false,
  activePreset: 'normal' as UtilityPreset,
  campMode: false,
  nightMode: false,
  handsFree: false,
  audioFeedback: false,
  voiceCommands: false,
  lastVoiceCommand: '',
  cameraFilter: 'none' as CameraFilter,
  filterIntensity: 0.7,
  showUtilityPanel: false,
  overlayMinimal: false,
};

export const useUtilityStore = create<UtilityState>((set, get) => ({
  ...initialState,

  setFlashMode: (m) => set({ flashMode: m, strobeActive: m === 'strobe' }),
  setFlashIntensity: (v) => set({ flashIntensity: Math.max(0, Math.min(1, v)) }),
  setFlashPersistent: (v) => set({ flashPersistent: v }),
  toggleStrobe: () => {
    const next = !get().strobeActive;
    set({ strobeActive: next, flashMode: next ? 'strobe' : 'off' });
  },

  setScreenMode: (m) => set({ screenMode: m }),
  setScreenBrightness: (v) => set({ screenBrightness: v }),
  setScreenAwake: (v) => set({ screenAwake: v }),
  setScreenLocked: (v) => set({ screenLocked: v }),

  setCampMode: (v) =>
    set({
      campMode: v,
      activePreset: v ? 'camp' : 'normal',
      screenAwake: v ? true : false,
      flashPersistent: v ? true : false,
      screenBrightness: v ? 0.4 : -1,
      handsFree: v ? true : false,
      overlayMinimal: v ? true : false,
      screenMode: v ? 'red-night' : 'normal',
    }),
  setNightMode: (v) =>
    set({
      nightMode: v,
      screenMode: v ? 'red-night' : 'normal',
      overlayMinimal: v ? true : false,
      screenBrightness: v ? 0.2 : -1,
    }),
  setHandsFree: (v) => set({ handsFree: v, overlayMinimal: v }),
  activatePreset: (p) => {
    switch (p) {
      case 'camp':
        get().setCampMode(true);
        break;
      case 'night':
        get().setNightMode(true);
        break;
      case 'emergency':
        set({
          activePreset: 'emergency',
          flashMode: 'strobe',
          strobeActive: true,
          screenMode: 'red-night',
          screenAwake: true,
          screenBrightness: 1,
          flashPersistent: true,
        });
        break;
      default:
        set(initialState);
    }
  },

  setAudioFeedback: (v) => set({ audioFeedback: v }),
  setVoiceCommands: (v) => set({ voiceCommands: v }),
  setLastVoiceCommand: (c) => set({ lastVoiceCommand: c }),
  setCameraFilter: (f) => set({ cameraFilter: f }),
  setFilterIntensity: (v) => set({ filterIntensity: Math.max(0.1, Math.min(1, v)) }),
  setShowUtilityPanel: (v) => set({ showUtilityPanel: v }),
  setOverlayMinimal: (v) => set({ overlayMinimal: v }),
  resetAll: () => set(initialState),
}));
