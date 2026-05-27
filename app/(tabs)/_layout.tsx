import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Scan, Search, History, Lightbulb, User, Crown } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../src/theme';
import { usePremiumStore } from '../../src/stores';

function TabIcon({ icon: Icon, color, size, badge }: { icon: any; color: string; size: number; badge?: string }) {
  return (
    <View>
      <Icon size={size} color={color} />
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { tier } = usePremiumStore();
  const isPremium = tier !== 'free';

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
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Scan size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarIcon: ({ color, size }) => <Lightbulb size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <View>
              <User size={size} color={color} />
              {isPremium && (
                <View style={styles.premiumDot}>
                  <Crown size={8} color={colors.warning} />
                </View>
              )}
            </View>
          ),
        }}
      />
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.warning,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.text, fontSize: 9, fontWeight: '700' },
  premiumDot: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,159,67,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
