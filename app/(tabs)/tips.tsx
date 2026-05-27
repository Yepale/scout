import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, TreePine, Bug, Tent, Home, PawPrint } from 'lucide-react-native';
import { colors } from '../../src/theme';
import { GlassCard } from '../../src/components/GlassCard';

const TIPS_DATA = [
  { icon: Bug, title: 'Tick Prevention', description: 'Check pets and clothing after walks in tall grass or wooded areas. Ticks are most active in warm months.', color: colors.primary },
  { icon: PawPrint, title: 'Flea Control', description: 'Regular vacuuming and pet bedding washing helps prevent flea infestations. Treat pets year-round.', color: colors.cyan },
  { icon: TreePine, title: 'Tick Hotspots', description: 'Ticks thrive in wooded, grassy, and leaf-covered areas. Stick to trail centers when hiking.', color: colors.warning },
  { icon: Tent, title: 'Camping Safety', description: 'Use insect repellent, wear long sleeves, and inspect gear after camping trips.', color: colors.primary },
  { icon: Home, title: 'Home Prevention', description: 'Seal cracks, use screens on windows, and keep your yard maintained to reduce pest entry.', color: colors.cyan },
  { icon: Shield, title: 'Bite Care', description: 'Clean bites with soap and water. Apply cold compresses for swelling. Monitor for changes.', color: colors.warning },
];

export default function TipsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Tips</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {TIPS_DATA.map((tip, i) => (
          <TouchableOpacity key={i} activeOpacity={0.7}>
            <GlassCard style={styles.tipCard}>
              <View style={styles.tipRow}>
                <View style={[styles.tipIcon, { backgroundColor: `${tip.color}15` }]}><tip.icon size={22} color={tip.color} /></View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.5, paddingHorizontal: 20, marginBottom: 8 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 100 },
  tipCard: {},
  tipRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  tipIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  tipContent: { flex: 1, gap: 4 },
  tipTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  tipDescription: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
});
