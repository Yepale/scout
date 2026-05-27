import { useState, useEffect, useCallback, useRef } from 'react';

export function useAutoHide(timeout = 4000) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), timeout);
  }, [timeout]);

  const show = useCallback(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    reset();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [reset]);

  return { visible, reset, show, hide };
}
