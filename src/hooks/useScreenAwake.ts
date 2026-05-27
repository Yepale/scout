import { useEffect } from 'react';
import { useUtilityStore } from '../stores/utilityStore';

export function useScreenAwake() {
  const screenAwake = useUtilityStore((s) => s.screenAwake);

  useEffect(() => {
    if (!screenAwake) return;
    // Keep screen awake via native API
    // In Expo: we'd use activateKeepAwakeAsync / deactivateKeepAwake
    const keepAwake = async () => {
      try {
        const { activateKeepAwakeAsync, deactivateKeepAwake } = await import('expo-keep-awake');
        await activateKeepAwakeAsync?.();
        return () => { deactivateKeepAwake?.(); };
      } catch {}
    };
    const cleanup = keepAwake();
    return () => { cleanup.then((fn) => fn?.()); };
  }, [screenAwake]);
}
