import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Upload, AlertTriangle, Shield, Share2 } from 'lucide-react-native';
import { colors } from '../../src/theme';
import { GlassCard } from '../../src/components/GlassCard';
import { ProbabilityBar } from '../../src/components/ProbabilityBar';
import { ShareCard } from '../../src/components/ShareCard';
import { BiteMonitor } from '../../src/components/BiteMonitor';
import { useDetectionStore } from '../../src/stores';
import { generateBiteAnalysis } from '../../src/utils/demoData';
import { mediumTap } from '../../src/utils/haptics';
import { useShareResults } from '../../src/hooks/useShareResults';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalysisScreen() {
  const insets = useSafeAreaInsets();
  const results = useDetectionStore((s) => s.currentBiteAnalysis);
  const setBiteAnalysis = useDetectionStore((s) => s.setBiteAnalysis);
  const [hasImage, setHasImage] = useState(false);
  const { viewRef, captureAndShare } = useShareResults();

  const handleAnalyze = useCallback(() => {
    mediumTap();
    setBiteAnalysis(generateBiteAnalysis());
    setHasImage(true);
  }, [setBiteAnalysis]);

  const topResult = results ? results[0] : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Bite Analysis</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!hasImage ? (
          <View style={styles.emptyState}>
            <View style={styles.cameraPlaceholder}>
              <Camera size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>Take a Photo</Text>
              <Text style={styles.emptySubtitle}>Capture the bite or rash for AI analysis</Text>
            </View>
            <TouchableOpacity onPress={handleAnalyze} style={styles.analyzeBtn} activeOpacity={0.8}>
              <Camera size={20} color={colors.bg} />
              <Text style={styles.analyzeBtnText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
              <Upload size={18} color={colors.textSecondary} />
              <Text style={styles.uploadText}>Upload from gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.imagePreview}>
              <View style={styles.imagePlaceholder}><Text style={styles.imageEmoji}>🦟</Text></View>
              <View style={styles.imageBadge}><Text style={styles.imageBadgeText}>Photo captured</Text></View>
            </View>
            <GlassCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Analysis Results</Text>
              {topResult && (
                <View style={styles.topResultBanner}>
                  <AlertTriangle size={18} color={topResult.probability > 70 ? colors.warning : colors.primary} />
                  <Text style={styles.topResultText}>
                    Compatible with <Text style={styles.topResultHighlight}>{topResult.type}</Text>
                  </Text>
                </View>
              )}
              <View style={styles.disclaimerRow}>
                <Shield size={14} color={colors.textTertiary} />
                <Text style={styles.disclaimerText}>AI-assisted estimation. Not a medical diagnosis.</Text>
              </View>
            </GlassCard>
            <GlassCard style={styles.probabilityCard}>
              <View style={styles.probHeader}>
                <Text style={styles.probabilityTitle}>Probability Breakdown</Text>
                <TouchableOpacity onPress={captureAndShare} style={styles.shareBtn} activeOpacity={0.7}>
                  <Share2 size={16} color={colors.primary} />
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
              </View>
              {results?.map((r, i) => (<ProbabilityBar key={r.type} label={r.type} probability={r.probability} delay={i * 100} />))}
            </GlassCard>
            <GlassCard style={styles.guidanceCard}>
              <Text style={styles.guidanceTitle}>Guidance</Text>
              <Text style={styles.guidanceText}>Monitor the area for changes. If swelling increases or you experience severe symptoms, consider professional medical advice.</Text>
              <View style={styles.severityRow}>
                <Text style={styles.severityLabel}>Severity</Text>
                <View style={[styles.severityBadge, { backgroundColor: (topResult?.probability ?? 0) > 70 ? 'rgba(255,159,67,0.15)' : 'rgba(46,213,115,0.15)' }]}>
                  <Text style={[styles.severityText, { color: (topResult?.probability ?? 0) > 70 ? colors.warning : colors.success }]}>
                    {(topResult?.probability ?? 0) > 70 ? 'Monitor' : 'Low concern'}
                  </Text>
                </View>
              </View>
            </GlassCard>
            <TouchableOpacity onPress={() => { setHasImage(false); setBiteAnalysis(null); }} style={styles.newScanBtn} activeOpacity={0.8}>
              <Camera size={18} color={colors.primary} />
              <Text style={styles.newScanText}>New Analysis</Text>
            </TouchableOpacity>
            <BiteMonitor onCapture={() => { mediumTap(); handleAnalyze(); }} />
          </>
        )}
      </ScrollView>

      {/* Hidden share card (offscreen, for capture) */}
      <View style={styles.hiddenCard}>
        <ShareCard
          ref={viewRef}
          type="analysis"
          resultType={topResult?.type ?? 'Tick'}
          probability={topResult?.probability ?? 70}
          mode={hasImage ? 'Analysis' : 'Scan'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.5, paddingHorizontal: 20, marginBottom: 8 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
  emptyState: { alignItems: 'center', gap: 16, marginTop: 40 },
  cameraPlaceholder: { width: 200, height: 200, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', gap: 12, borderStyle: 'dashed' },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptySubtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', paddingHorizontal: 20, lineHeight: 18 },
  analyzeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 28 },
  analyzeBtnText: { color: colors.bg, fontSize: 16, fontWeight: '700' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  uploadText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  imagePreview: { alignItems: 'center', marginBottom: 8 },
  imagePlaceholder: { width: SCREEN_WIDTH - 40, height: 200, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  imageEmoji: { fontSize: 64 },
  imageBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(46,213,115,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  imageBadgeText: { color: colors.text, fontSize: 11, fontWeight: '600' },
  resultCard: {},
  resultTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 },
  topResultBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,159,67,0.1)', padding: 12, borderRadius: 12, marginBottom: 12 },
  topResultText: { color: colors.text, fontSize: 14, fontWeight: '500', flex: 1 },
  topResultHighlight: { color: colors.warning, fontWeight: '700', textTransform: 'capitalize' },
  disclaimerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  disclaimerText: { color: colors.textTertiary, fontSize: 11, fontWeight: '400', flex: 1 },
  probabilityCard: {},
  probabilityTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  probHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(0,245,212,0.3)',
  },
  shareText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  guidanceCard: {},
  guidanceTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 8 },
  guidanceText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 12 },
  severityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  severityLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  severityText: { fontSize: 12, fontWeight: '600' },
  newScanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 28, borderWidth: 1, borderColor: colors.primary },
  newScanText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  hiddenCard: {
    position: 'absolute',
    left: -9999,
    top: 0,
  },
});
