import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Linking } from 'react-native';
import { colors } from '../src/theme';
import { useEffect, useRef } from 'react';
import { PresetMode } from '../src/utils/presets';

export default function RootLayout() {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    try {
      const initNotifs = async () => {
        const { setupNotificationHandler, configureNotificationCategories } = await import('../src/services/notifications');
        setupNotificationHandler();
        configureNotificationCategories();
      };
      initNotifs();
    } catch {}
  }, []);

  // Deep link handler for app shortcuts (Flash, Scan, Camp)
  useEffect(() => {
    const handler = (url: string | null) => {
      if (!url) return;
      try {
        const parsed = new URL(url);
        const preset = parsed.searchParams.get('preset') as PresetMode | null;
        if (preset) {
          const { applyPreset } = require('../src/utils/presets');
          applyPreset(preset);
        }
      } catch {}
    };
    const sub = Linking.addEventListener('url', (e) => handler(e.url));
    Linking.getInitialURL().then(handler);
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pet-inspection"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="premium"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="risk-map"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="emergency"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="permissions"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
