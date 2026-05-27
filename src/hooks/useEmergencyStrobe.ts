import { useEffect, useRef } from 'react';
import { useUtilityStore } from '../stores/utilityStore';

const SOS_PATTERN = [
  // S: 3 short
  200, 200, 200, 200, 200,
  // O: 3 long
  600, 200, 600, 200, 600,
  // S: 3 short
  200, 200, 200, 200, 200,
  // pause between repeats
  1000,
];

export function useEmergencyStrobe() {
  const strobeActive = useUtilityStore((s) => s.strobeActive);
  const flashPersistent = useUtilityStore((s) => s.flashPersistent);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!strobeActive || !flashPersistent) return;

    let step = 0;
    const run = () => {
      if (!useUtilityStore.getState().strobeActive) return;
      const delay = SOS_PATTERN[step % SOS_PATTERN.length];
      step++;
      timerRef.current = setTimeout(run, delay);
    };
    run();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [strobeActive, flashPersistent]);
}
