import { useEffect, useRef } from 'react';
import { useUtilityStore } from '../stores/utilityStore';
import { lightTap } from '../utils/haptics';

export function usePersistentFlash() {
  const { flashMode, flashPersistent, flashIntensity } = useUtilityStore();
  const isActive = flashMode !== 'off';
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Strobe effect
  useEffect(() => {
    if (flashMode === 'strobe') {
      const speed = 150; // ms
      intervalRef.current = setInterval(() => {
        lightTap();
      }, speed);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [flashMode]);

  return {
    torchMode: flashMode === 'normal' || flashMode === 'strobe',
    torchIntensity: flashIntensity,
    isActive,
    isPersistent: flashPersistent,
    activeMode: flashMode,
  };
}
