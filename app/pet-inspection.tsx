import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Check, ChevronRight } from 'lucide-react-native';
import { colors } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';
import { PetBodyMap } from '../src/components/PetBodyMap';
import { usePetStore } from '../src/stores';
import { PET_BODY_PARTS } from '../src/utils/constants';
import { mediumTap, lightTap, successNotification } from '../src/utils/haptics';

const PART_GUIDES: Record<string, { title: string; instruction: string }> = {
  ears: { title: 'Ears', instruction: 'Gently lift each ear and scan the inner surface for dark spots, ticks, or redness.' },
  neck: { title: 'Neck', instruction: 'Part the fur around the neck and collar area. Ticks often attach here.' },
  paws: { title: 'Paws', instruction: 'Check between toes and paw pads. Fleas and ticks hide in these warm areas.' },
  belly: { title: 'Belly', instruction: 'Gently expose the belly area. Look for small dark bumps or irritated skin.' },
  tail: { title: 'Tail', instruction: 'Inspect the base of the tail and underside. Fleas commonly gather here.' },
};

export default function PetInspectionScreen() {
  const insets = useSafeAreaInsets();
  const { inspectedParts, markPartInspected, resetInspection } = usePetStore();
  const [currentPart, setCurrentPart] = useState<string>(PET_BODY_PARTS[0]);

  const handlePartPress = useCallback((part: string) => { lightTap(); setCurrentPart(part); }, []);

  const handleComplete = useCallback(() => {
    mediumTap();
    markPartInspected(currentPart);
    const currentIndex = PET_BODY_PARTS.indexOf(currentPart as typeof PET_BODY_PARTS[number]);
    if (currentIndex < PET_BODY_PARTS.length - 1) {
      setCurrentPart(PET_BODY_PARTS[currentIndex + 1]);
    } else {
      successNotification();
    }
  }, [currentPart, markPartInspected]);

  const allDone = inspectedParts.length >= PET_BODY_PARTS.length;
  const currentGuide = PART_GUIDES[currentPart] || PART_GUIDES.ears;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Pet Inspection</Text>
        <View style={styles.progressBadge}><Text style={styles.progressText}>{inspectedParts.length}/{PET_BODY_PARTS.length}</Text></View>
      </View>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(inspectedParts.length / PET_BODY_PARTS.length) * 100}%` }]} /></View>
      <View style={styles.content}>
        <PetBodyMap inspectedParts={inspectedParts} currentPart={currentPart} onPartPress={handlePartPress} />
        {allDone ? (
          <GlassCard style={styles.doneCard}>
            <View style={styles.doneIcon}><Check size={32} color={colors.success} /></View>
            <Text style={styles.doneTitle}>Inspection Complete</Text>
            <Text style={styles.doneText}>All areas checked. No visible issues found.</Text>
            <TouchableOpacity onPress={() => { resetInspection(); setCurrentPart(PET_BODY_PARTS[0]); }} style={styles.doneBtn} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Start Over</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <GlassCard style={styles.guideCard}>
            <Text style={styles.guideTitle}>{currentGuide.title}</Text>
            <Text style={styles.guideInstruction}>{currentGuide.instruction}</Text>
            <Text style={styles.guideTip}>Use the camera to scan this area closely</Text>
            <TouchableOpacity onPress={handleComplete} style={styles.guideBtn} activeOpacity={0.8}>
              <Text style={styles.guideBtnText}>{PET_BODY_PARTS.indexOf(currentPart as typeof PET_BODY_PARTS[number]) < PET_BODY_PARTS.length - 1 ? 'Done — Next Area' : 'Complete Inspection'}</Text>
              <ChevronRight size={18} color={colors.bg} />
            </TouchableOpacity>
          </GlassCard>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  progressBadge: { backgroundColor: colors.glass, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: colors.glassBorder },
  progressText: { color: colors.primary, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  progressBar: { height: 2, backgroundColor: colors.glass, marginHorizontal: 20, borderRadius: 1, marginBottom: 16 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 1 },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', gap: 20 },
  guideCard: { marginBottom: 20 },
  guideTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  guideInstruction: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 8 },
  guideTip: { color: colors.textTertiary, fontSize: 12, fontStyle: 'italic', marginBottom: 16 },
  guideBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 24 },
  guideBtnText: { color: colors.bg, fontSize: 14, fontWeight: '700' },
  doneCard: { alignItems: 'center', padding: 24, marginBottom: 20 },
  doneIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(46,213,115,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  doneTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  doneText: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 20 },
  doneBtn: { backgroundColor: colors.surfaceLight, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, borderWidth: 1, borderColor: colors.border },
  doneBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
