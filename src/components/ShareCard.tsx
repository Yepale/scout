import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme';

const { width: SW } = Dimensions.get('window');
const CARD_WIDTH = SW * 0.85;

interface ShareCardProps {
  type?: 'analysis' | 'scan' | 'history';
  resultType?: string;
  probability?: number;
  mode?: string;
  date?: Date;
  scanCount?: number;
  detectionCount?: number;
}

export const ShareCard = React.forwardRef<View, ShareCardProps>(({
  type = 'analysis',
  resultType = 'Tick',
  probability = 87,
  mode = 'Pet',
  date = new Date(),
  scanCount = 12,
  detectionCount = 3,
}, ref) => {
  const severity = probability > 70 ? 'Monitor' : probability > 40 ? 'Low' : 'Clear';

  return (
    <View ref={ref} style={styles.container} collapsable={false}>
      {/* Brand header */}
      <View style={styles.header}>
        <Text style={styles.logo}>SCOUT</Text>
        <Text style={styles.badge}>AI DETECTION</Text>
      </View>

      {/* Result dashboard */}
      <View style={styles.dash}>
        <View style={styles.resultRow}>
          <Text style={styles.emoji}>🦟</Text>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>Possible {resultType}</Text>
            <Text style={styles.resultProb}>{probability}% confidence</Text>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: severity === 'Monitor' ? 'rgba(255,159,67,0.2)' : 'rgba(46,213,115,0.2)' }]}>
            <Text style={[styles.severityText, { color: severity === 'Monitor' ? colors.warning : colors.success }]}>{severity}</Text>
          </View>
        </View>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{mode}</Text>
          <Text style={styles.statLabel}>Scan Mode</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{detectionCount}</Text>
          <Text style={styles.statLabel}>Detections</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{scanCount}</Text>
          <Text style={styles.statLabel}>Scans Today</Text>
        </View>
      </View>

      {/* Guidance */}
      <Text style={styles.guidance}>
        AI-assisted estimation. Monitor the area. {'\n'}Consider professional advice if concerned.
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerDate}>
          {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
        <Text style={styles.footerBrand}>scout.app · Outdoor Intelligence</Text>
      </View>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#0D1117',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,245,212,0.2)',
    gap: 20,
    // Shadow
    shadowColor: '#00F5D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#00F5D4',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
  },
  badge: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dash: {
    backgroundColor: 'rgba(0,245,212,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,245,212,0.1)',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: { fontSize: 32 },
  resultInfo: { flex: 1 },
  resultLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultProb: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  guidance: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDate: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '500',
  },
  footerBrand: {
    color: 'rgba(0,245,212,0.4)',
    fontSize: 10,
    fontWeight: '600',
  },
});
