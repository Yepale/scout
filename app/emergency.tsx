import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, ChevronDown, ChevronUp, Phone, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';

const SECTIONS = [
  { title: 'Tick Removal', content: '1. Use fine-tipped tweezers.\n2. Grasp the tick as close to the skin as possible.\n3. Pull upward with steady, even pressure.\n4. Clean the area with soap and water.\n5. Monitor for rash or symptoms.' },
  { title: 'Allergic Reactions', content: 'Watch for: hives, swelling, difficulty breathing, dizziness.\nIf severe: seek emergency care immediately.\nFor mild reactions: antihistamines may help. Monitor closely.' },
  { title: 'When to Seek Help', content: 'Seek medical attention if you experience:\n• Expanding rash (especially bulls-eye pattern)\n• Fever or chills\n• Joint pain or swelling\n• Signs of infection (redness, warmth, pus)\n• Allergic reaction symptoms' },
  { title: 'First Aid for Bites', content: '1. Wash with soap and water.\n2. Apply cold compress for 10-15 minutes.\n3. Use anti-itch cream if needed.\n4. Keep the area clean and dry.\n5. Monitor for changes over 24-48 hours.' },
  { title: 'Pet Emergency Signs', content: 'Take your pet to the vet if you notice:\n• Excessive scratching or licking\n• Hair loss or skin irritation\n• Lethargy or loss of appetite\n• Visible parasites that you cannot remove\n• Swelling or redness around a bite area' },
];

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}><X size={22} color={colors.textSecondary} /></TouchableOpacity>
        <Text style={styles.title}>Emergency Guide</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['rgba(255,71,87,0.2)', 'rgba(255,159,67,0.1)']} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <AlertTriangle size={24} color={colors.warning} />
          <Text style={styles.bannerTitle}>Not a substitute for professional medical advice</Text>
          <Text style={styles.bannerText}>If you suspect a serious reaction, please consult a healthcare provider or veterinarian immediately.</Text>
        </LinearGradient>
        {SECTIONS.map((section, i) => {
          const isOpen = expanded === i;
          return (
            <TouchableOpacity key={i} onPress={() => setExpanded(isOpen ? null : i)} activeOpacity={0.7}>
              <GlassCard style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {isOpen ? <ChevronUp size={18} color={colors.textSecondary} /> : <ChevronDown size={18} color={colors.textSecondary} />}
                </View>
                {isOpen && <Text style={styles.sectionContent}>{section.content}</Text>}
              </GlassCard>
            </TouchableOpacity>
          );
        })}
        <GlassCard style={styles.emergencyContactCard}>
          <View style={styles.emergencyRow}>
            <Phone size={20} color={colors.error} />
            <View style={styles.emergencyTextArea}>
              <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
              <Text style={styles.emergencyText}>Poison Control: 1-800-222-1222{'\n'}Pet Poison Helpline: 1-855-764-7661{'\n'}Emergency: 911</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  placeholder: { width: 36 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 40 },
  banner: { padding: 20, borderRadius: 16, gap: 8 },
  bannerTitle: { color: colors.warning, fontSize: 14, fontWeight: '700' },
  bannerText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  sectionCard: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  sectionContent: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 12 },
  emergencyContactCard: { borderColor: 'rgba(255,71,87,0.3)', borderWidth: 1 },
  emergencyRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  emergencyTextArea: { flex: 1 },
  emergencyTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  emergencyText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
});
