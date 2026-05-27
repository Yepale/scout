import { useCallback } from 'react';
import { useUtilityStore } from '../stores/utilityStore';

export function useAudioFeedback() {
  const enabled = useUtilityStore((s) => s.audioFeedback);

  const speak = useCallback(
    async (text: string) => {
      if (!enabled) return;
      try {
        const Speech = await import('expo-speech');
        Speech.speak(text, { rate: 0.85, pitch: 1.0 });
      } catch {}
    },
    [enabled]
  );

  return { speak, enabled };
}
