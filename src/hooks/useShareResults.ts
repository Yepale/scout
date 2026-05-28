import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { lightTap } from '../utils/haptics';

export function useShareResults() {
  const viewRef = useRef<any>(null);

  const captureAndShare = useCallback(async () => {
    lightTap();

    if (!viewRef.current) {
      Alert.alert('Error', 'No results to share.');
      return;
    }

    try {
      const vs = await import('react-native-view-shot');
      const captureRef = (vs as any).captureRef;

      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const { shareAsync, isAvailableAsync } = await import('expo-sharing');

      const available = await isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing not available on this device');
        return;
      }

      await shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Scout Result',
        UTI: 'public.png',
      });
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('cancelled') || msg.includes('did not share')) return;
      console.warn('Share failed:', err);
      Alert.alert('Could not share', 'Try again or save a screenshot manually.');
    }
  }, []);

  return { viewRef, captureAndShare };
}
