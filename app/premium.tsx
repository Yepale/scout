import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Crown, Check, Infinity, History, Users, Cloud, Map, FileText, Bell } from 'lucide-react-native';
import { colors } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';
import { usePremiumStore } from '../src/stores';
import { lightTap, heavyTap } from '../src/utils/haptics';

const BENEFITS = [
  { icon: Infinity, text: 'Unlimited analysis' },
  { icon: History, text: 'Full AI tracking history' },
  { icon: Users, text: 'Multi-pet profiles' },
  { icon: Cloud, text: 'Cloud backup' },
  { icon: Map, text: 'Outdoor risk alerts' },
  { icon: FileText, text: 'Vet-ready reports' },
  { icon: Bell, text: 'Real-time notifications' },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { setPremium } = usePremiumStore();
  const [annual, setAnnual] = useState(true);

  const handleSubscribe = () => { lightTap(); setPremium(true); heavyTap(); router.back(); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.crownContainer}><Crown size={40} color={colors.warning} /></View>
          <Text style={styles.title}>Scout Premium</Text>
          <Text style={styles.subtitle}>Advanced protection for who matters most</Text>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setAnnual(true)} style={[styles.toggleBtn, annual && styles.toggleActive]} activeOpacity={0.7}>
            <Text style={[styles.toggleText, annual && styles.toggleTextActive]}>Annual</Text>
            {annual && <View style={styles.saveBadge}><Text style={styles.saveText}>Save 40%</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAnnual(false)} style={[styles.toggleBtn, !annual && styles.toggleActive]} activeOpacity={0.7}>
            <Text style={[styles.toggleText, !annual && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{annual ? '$29.99' : '$4.99'}</Text>
          <Text style={styles.pricePeriod}>/{annual ? 'year' : 'month'}</Text>
        </View>
        <GlassCard style={styles.benefitsCard}>
          {BENEFITS.map((benefit, i) => (
            <View key={i}>
              <View style={styles.benefitRow}>
                <View style={styles.benefitIcon}><benefit.icon size={18} color={colors.primary} /></View>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
              {i < BENEFITS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </GlassCard>
        <TouchableOpacity onPress={handleSubscribe} style={styles.subscribeBtn} activeOpacity={0.8}>
          <Text style={styles.subscribeText}>Start Free Trial</Text>
        </TouchableOpacity>
        <Text style={styles.finePrint}>Free 7-day trial. Cancel anytime.{'\n'}No commitment.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center', gap: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 12 },
  crownContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,159,67,0.15)', justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', backgroundColor: colors.glass, borderRadius: 24, padding: 3, borderWidth: 1, borderColor: colors.glassBorder },
  toggleBtn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 21, flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleActive: { backgroundColor: colors.primary },
  toggleText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: colors.bg },
  saveBadge: { backgroundColor: colors.warning, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  saveText: { color: colors.text, fontSize: 9, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { color: colors.text, fontSize: 48, fontWeight: '800', letterSpacing: -1 },
  pricePeriod: { color: colors.textSecondary, fontSize: 16, fontWeight: '500' },
  benefitsCard: { width: '100%' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  benefitIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(0,245,212,0.1)', justifyContent: 'center', alignItems: 'center' },
  benefitText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border },
  subscribeBtn: { width: '100%', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 28, alignItems: 'center' },
  subscribeText: { color: colors.bg, fontSize: 17, fontWeight: '700' },
  finePrint: { color: colors.textTertiary, fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
