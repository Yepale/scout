import { useUtilityStore } from '../stores/utilityStore';

export type PresetMode = 'normal' | 'flashlight' | 'red-light' | 'uv-contrast' | 'camp' | 'sos';

export const PRESET_ICONS: Record<PresetMode, string> = {
  normal: '✨',
  flashlight: '🔦',
  'red-light': '🔴',
  'uv-contrast': '🔮',
  camp: '⛺',
  sos: '🆘',
};

export const PRESET_LABELS: Record<PresetMode, string> = {
  normal: 'Normal',
  flashlight: 'Flash',
  'red-light': 'Red',
  'uv-contrast': 'UV',
  camp: 'Camp',
  sos: 'SOS',
};

const ORDER: PresetMode[] = ['normal', 'flashlight', 'red-light', 'uv-contrast', 'camp', 'sos'];

export function nextPreset(current: PresetMode, dir: -1 | 1 = 1): PresetMode {
  const idx = ORDER.indexOf(current);
  return ORDER[(idx + dir + ORDER.length) % ORDER.length];
}

export function applyPreset(preset: PresetMode) {
  const store = useUtilityStore.getState();
  switch (preset) {
    case 'normal':
      store.resetAll();
      break;
    case 'flashlight':
      store.setFlashMode('normal');
      store.setScreenMode('normal');
      break;
    case 'red-light':
      store.setFlashMode('red');
      store.setScreenMode('red-night');
      break;
    case 'uv-contrast':
      store.setFlashMode('uv');
      store.setScreenMode('blue-contrast');
      store.setCameraFilter('uv');
      break;
    case 'camp':
      store.setCampMode(true);
      store.setCameraFilter('none');
      break;
    case 'sos':
      store.activatePreset('emergency');
      break;
  }
}

export function getCurrentPreset(): PresetMode {
  const s = useUtilityStore.getState();
  if (s.campMode) return 'camp';
  if (s.strobeActive || s.activePreset === 'emergency') return 'sos';
  if (s.flashMode === 'red') return 'red-light';
  if (s.flashMode === 'uv') return 'uv-contrast';
  if (s.flashMode === 'normal') return 'flashlight';
  return 'normal';
}
