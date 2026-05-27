import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/theme';
import { SPLASH_DURATION_MS } from '../src/utils/constants';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const radarScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const radarLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(radarScale, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(radarScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    radarLoop.start();

    const timer = setTimeout(() => {
      router.replace('/(tabs)/scan');
    }, SPLASH_DURATION_MS);

    return () => { clearTimeout(timer); radarLoop.stop(); };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.radarRing, { transform: [{ scale: radarScale }] }]} />
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Scout</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>See what hides.</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  radarRing: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, borderColor: colors.primary, opacity: 0.3 },
  logoIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  logoText: { color: colors.bg, fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  title: { color: colors.text, fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: colors.textSecondary, fontSize: 15, fontWeight: '400', marginTop: 4, letterSpacing: 0.5 },
});
