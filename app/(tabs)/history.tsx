import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Filter } from 'lucide-react-native';
import { colors } from '../../src/theme';
import { GlassCard } from '../../src/components/GlassCard';
import { EvolutionChart } from '../../src/components/EvolutionChart';
import { useDetectionStore } from '../../src/stores';
import { demoHistoryData, EVOLUTION_DATA } from '../../src/utils/demoData';

const historyData = demoHistoryData();

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const scanResults = useDetectionStore((s) => s.scanResults);
  const displayData = scanResults.length > 0 ? scanResults : historyData;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
          <Filter size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <EvolutionChart data={EVOLUTION_DATA} title="Swelling Evolution" />
        <GlassCard style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Side by Side</Text>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonSide}>
              <Text style={styles.comparisonLabel}>Yesterday</Text>
              <View style={styles.comparisonImage}><Text style={styles.comparisonEmoji}>🔴</Text></View>
              <Text style={styles.comparisonMetric}>8.2mm</Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonSide}>
              <Text style={styles.comparisonLabel}>Today</Text>
              <View style={styles.comparisonImage}><Text style={styles.comparisonEmoji}>🟢</Text></View>
              <Text style={styles.comparisonMetric}>0.6mm</Text>
            </View>
          </View>
        </GlassCard>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        {displayData.map((scan, i) => (
          <TouchableOpacity key={scan.id} activeOpacity={0.7}>
            <GlassCard style={styles.scanCard}>
              <View style={styles.scanCardRow}>
                <View style={styles.scanCardLeft}>
                  <View style={[styles.scanModeBadge, { backgroundColor: scan.mode === 'Pet' ? 'rgba(0,245,212,0.15)' : scan.mode === 'Human' ? 'rgba(0,217,255,0.15)' : 'rgba(255,159,67,0.15)' }]}>
                    <Text style={[styles.scanModeText, { color: scan.mode === 'Pet' ? colors.primary : scan.mode === 'Human' ? colors.cyan : colors.warning }]}>{scan.mode}</Text>
                  </View>
                  <Text style={styles.scanDate}>{scan.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View style={styles.scanCardRight}>
                  <Text style={[styles.scanResult, { color: scan.detections.length > 0 ? colors.warning : colors.success }]}>
                    {scan.detections.length > 0 ? `${scan.detections.length} found` : 'Clear'}
                  </Text>
                  <ChevronRight size={16} color={colors.textTertiary} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  filterBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '600', marginTop: 4 },
  comparisonCard: {},
  comparisonTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  comparisonRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  comparisonSide: { flex: 1, alignItems: 'center', gap: 8 },
  comparisonLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  comparisonImage: { width: 80, height: 80, borderRadius: 16, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  comparisonEmoji: { fontSize: 32 },
  comparisonMetric: { color: colors.text, fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  comparisonDivider: { width: 1, height: 80, backgroundColor: colors.border },
  scanCard: {},
  scanCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scanCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scanCardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scanModeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  scanModeText: { fontSize: 11, fontWeight: '700' },
  scanDate: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
  scanResult: { fontSize: 13, fontWeight: '600' },
});
