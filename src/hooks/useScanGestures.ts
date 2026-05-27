import { useCallback, useRef } from 'react';
import { PanResponder, Dimensions } from 'react-native';
import { useUtilityStore } from '../stores/utilityStore';
import { lightTap } from '../utils/haptics';
import { nextPreset, applyPreset, getCurrentPreset, PresetMode } from '../utils/presets';

const { width: SW, height: SH } = Dimensions.get('window');

interface GestureCallbacks {
  onCyclePreset: (dir: -1 | 1) => void;
  onShowPanel: () => void;
  onAdjustBrightness: (delta: number) => void;
  onTap: () => void;
}

export function useScanGestures() {
  const startPos = useRef({ x: 0, y: 0 });
  const presetRef = useRef<PresetMode>('normal');

  const callbacks: GestureCallbacks = {
    onCyclePreset: (dir) => {
      const s = useUtilityStore.getState();
      const current = getCurrentPreset();
      const next = nextPreset(current, dir);
      presetRef.current = next;
      applyPreset(next);
      lightTap();
    },
    onShowPanel: () => {
      useUtilityStore.getState().setShowUtilityPanel(true);
    },
    onAdjustBrightness: (delta) => {
      const s = useUtilityStore.getState();
      const cur = s.screenBrightness < 0 ? 0.5 : s.screenBrightness;
      s.setScreenBrightness(Math.max(0.05, Math.min(1, cur + delta)));
    },
    onTap: () => {},
  };

  // Center zone: horizontal swipes for presets
  const centerPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        const dx = Math.abs(gs.dx);
        const dy = Math.abs(gs.dy);
        // Only claim horizontal swipes (wider than vertical, but not too vertical)
        return dx > 20 && dy < dx * 0.6;
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) > SW * 0.15) {
          const dir = gs.dx > 0 ? -1 : 1;
          callbacks.onCyclePreset(dir);
          return { cycled: true };
        }
        return { cycled: false };
      },
    })
  ).current;

  // Bottom zone: vertical up-swipe for panel
  const bottomPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        if (gs.moveY < SH * 0.65) return false;
        return gs.dy < -20 && Math.abs(gs.dx) < Math.abs(gs.dy) * 0.5;
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy < -50) callbacks.onShowPanel();
      },
    })
  ).current;

  // Edge zones: vertical swipe for brightness
  const edgePan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        const nearEdge = gs.moveX < 40 || gs.moveX > SW - 40;
        if (!nearEdge) return false;
        return Math.abs(gs.dy) > 15 && Math.abs(gs.dx) < Math.abs(gs.dy) * 0.4;
      },
      onPanResponderRelease: (_, gs) => {
        const delta = gs.dy < 0 ? 0.1 : -0.1;
        callbacks.onAdjustBrightness(delta);
      },
    })
  ).current;

  return { centerPan, bottomPan, edgePan };
}
