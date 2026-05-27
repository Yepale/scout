import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, MapPin, AlertTriangle } from 'lucide-react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';
import { RISK_MAP_POINTS } from '../src/utils/demoData';

export default function RiskMapScreen() {
  const insets = useSafeAreaInsets();
  const riskLevel = RISK_MAP_POINTS.reduce((sum, p) => sum + p.risk, 0) / RISK_MAP_POINTS.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}><X size={22} color={colors.textSecondary} /></TouchableOpacity>
        <Text style={styles.title}>Risk Map</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <Svg width="100%" height="100%" viewBox="0 0 360 400">
            <Defs>
              <RadialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={colors.warning} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={colors.warning} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="360" height="400" fill={colors.glass} rx="20" />
            {RISK_MAP_POINTS.map((point, i) => (
              <React.Fragment key={i}>
                <Circle cx={point.x * 360} cy={point.y * 400} r={point.risk * 40} fill="url(#heatGlow)" />
                <Circle cx={point.x * 360} cy={point.y * 400} r={4 + point.risk * 4} fill={point.risk > 0.7 ? colors.error : point.risk > 0.4 ? colors.warning : colors.primary} opacity={0.8} />
              </React.Fragment>
            ))}
          </Svg>
          <View style={styles.mapOverlay}><MapPin size={20} color={colors.primary} /><Text style={styles.mapLocation}>Current Area</Text></View>
        </View>
        <GlassCard style={styles.riskCard}>
          <View style={styles.riskRow}>
            <View style={[styles.riskDot, { backgroundColor: riskLevel > 0.6 ? colors.warning : riskLevel > 0.3 ? colors.primary : colors.success }]} />
            <View style={styles.riskTextArea}>
              <Text style={styles.riskTitle}>Current Risk Level</Text>
              <Text style={styles.riskDescription}>{riskLevel > 0.6 ? 'Moderate tick activity in your area' : riskLevel > 0.3 ? 'Low tick activity reported' : 'Minimal risk reported'}</Text>
            </View>
          </View>
        </GlassCard>
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <AlertTriangle size={16} color={colors.warning} />
            <Text style={styles.infoText}>Recent reports indicate tick activity near wooded areas. Use caution when hiking.</Text>
          </View>
        </GlassCard>
        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.error }]} /><Text style={styles.legendText}>High</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.warning }]} /><Text style={styles.legendText}>Moderate</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={styles.legendText}>Low</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  placeholder: { width: 36 },
  content: { flex: 1, padding: 20, gap: 16 },
  mapContainer: { flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  mapOverlay: { position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  mapLocation: { color: colors.text, fontSize: 12, fontWeight: '600' },
  riskCard: {},
  riskRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  riskDot: { width: 12, height: 12, borderRadius: 6 },
  riskTextArea: { flex: 1 },
  riskTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  riskDescription: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  infoCard: {},
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, flex: 1 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
});
