import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Scan, Search, History, Lightbulb, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />,
      }}
    >
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: ({ color, size }) => <Scan size={size} color={color} /> }} />
      <Tabs.Screen name="analysis" options={{ title: 'Analysis', tabBarIcon: ({ color, size }) => <Search size={size} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color, size }) => <History size={size} color={color} /> }} />
      <Tabs.Screen name="tips" options={{ title: 'Tips', tabBarIcon: ({ color, size }) => <Lightbulb size={size} color={color} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    backgroundColor: 'transparent',
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 8,
  },
  tabLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
});
