import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Crown, Check, Minus, Infinity, History, Users, Cloud, Map, FileText, Bell, Sparkles, Shield } from 'lucide-react-native';
import { colors } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';
import { usePremiumStore, PLAN_FEATURES } from '../src/stores';
import type { PlanTier } from '../src/stores';
import { lightTap, heavyTap } from '../src/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';

type FeatureRow = {
  label: string;
  free: string | boolean;
  monthly: string | boolean;
  yearly: string | boolean;
  lifetime: string | boolean;
};

const FEATURES: FeatureRow[] = [
  { label: 'Real-time scanning', free: true, monthly: true, yearly: true, lifetime: true },
  { label: 'Quick Scan (15s)', free: true, monthly: true, yearly: true, lifetime: true },
  { label: 'Bite analysis', free: true, monthly: true, yearly: true, lifetime: true },
  { label: 'Pet inspection', free: true, monthly: true, yearly: true, lifetime: true },
  { label: 'History retention', free: '24h', monthly: '1 year', yearly: 'Unlimited', lifetime: 'Unlimited' },
  { label: 'Pet profiles', free: '1', monthly: '5', yearly: '10', lifetime: '20' },
  { label: 'Cloud backup', free: false, monthly: true, yearly: true, lifetime: true },
  { label: 'Risk maps', free: false, monthly: true, yearly: true, lifetime: true },
  { label: 'Vet-ready reports', free: false, monthly: true, yearly: true, lifetime: true },
  { label: 'Outdoor alerts', free: false, monthly: true, yearly: true, lifetime: true },
  { label: 'Evolution tracking', free: false, monthly: true, yearly: true, lifetime: true },
  { label: 'Multi-device sync', free: false, monthly: false, yearly: true, lifetime: true },
  { label: 'Priority support', free: false, monthly: false, yearly: true, lifetime: true },
];

const CheckIcon = () => <Check size={16} color={colors.primary} />;
const MinusIcon = () => <Minus size={16} color={colors.textTertiary} />;

const FeatureValue = ({ value }: { value: string | boolean }) => {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <MinusIcon />;
  }
  return <Text style={styles.featureValue}>{value}</Text>;
};

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { setPlan, startTrial, selectedPlan, setSelectedPlan } = usePremiumStore();
  const [showYearly, setShowYearly] = useState(true);

  const handleSubscribe = () => {
    heavyTap();
    const plan = showYearly ? 'yearly' : 'monthly';
    setSelectedPlan(plan);
    startTrial();
    router.back();
  };

  const handleBuyLifetime = () => {
    heavyTap();
    setSelectedPlan('lifetime');
    setPlan('lifetime');
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['rgba(0,245,212,0.08)', 'rgba(255,159,67,0.05)']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.crownContainer}><Crown size={36} color={colors.warning} /></View>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>Unlock the full power of Scout. Advanced protection for who matters most.</Text>
        </LinearGradient>

        {/* Plan Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setShowYearly(true)} style={[styles.toggleBtn, showYearly && styles.toggleActive]} activeOpacity={0.7}>
            <Text style={[styles.toggleText, showYearly && styles.toggleTextActive]}>Annual</Text>
            {showYearly && <View style={styles.saveBadge}><Text style={styles.saveText}>Best value</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowYearly(false)} style={[styles.toggleBtn, !showYearly && styles.toggleActive]} activeOpacity={0.7}>
            <Text style={[styles.toggleText, !showYearly && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingRow}>
          <TouchableOpacity
            onPress={handleSubscribe}
            style={[styles.pricingCard, showYearly && styles.pricingCardFeatured]}
            activeOpacity={0.9}
          >
            {showYearly && (
              <View style={styles.featuredBadge}><Sparkles size={12} color={colors.bg} /><Text style={styles.featuredBadgeText}>Most popular</Text></View>
            )}
            <Text style={styles.pricingName}>{showYearly ? 'Annual' : 'Monthly'}</Text>
            <View style={styles.pricingPriceRow}>
              <Text style={styles.pricingPrice}>${showYearly ? '29.99' : '4.99'}</Text>
              <Text style={styles.pricingPeriod}>/{showYearly ? 'year' : 'month'}</Text>
            </View>
            {showYearly && <Text style={styles.pricingSave}>$4.17/mo — Save 40%</Text>}
            <TouchableOpacity
              onPress={handleSubscribe}
              style={styles.subscribeBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeText}>Start Free Trial</Text>
            </TouchableOpacity>
            <Text style={styles.trialNote}>7 days free, then ${showYearly ? '29.99' : '4.99'}/{showYearly ? 'year' : 'month'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyLifetime}
            style={styles.pricingCard}
            activeOpacity={0.9}
          >
            <Text style={styles.pricingName}>Lifetime</Text>
            <View style={styles.pricingPriceRow}>
              <Text style={styles.pricingPrice}>$79.99</Text>
              <Text style={styles.pricingPeriod}>/once</Text>
            </View>
            <Text style={styles.pricingSave}>Pay once, own forever</Text>
            <TouchableOpacity
              onPress={handleBuyLifetime}
              style={[styles.subscribeBtn, styles.subscribeBtnOutline]}
              activeOpacity={0.8}
            >
              <Text style={[styles.subscribeText, { color: colors.primary }]}>Buy Lifetime</Text>
            </TouchableOpacity>
            <Text style={styles.trialNote}>No recurring charges</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Comparison Table */}
        <Text style={styles.compareTitle}>Compare Plans</Text>
        <GlassCard style={styles.compareCard}>
          {/* Header row */}
          <View style={styles.compareHeader}>
            <Text style={styles.compareHeaderLabel}>Feature</Text>
            <Text style={styles.compareHeaderCol}>Free</Text>
            <Text style={styles.compareHeaderCol}>Pro</Text>
          </View>
          {FEATURES.map((f, i) => {
            const showVal = showYearly ? f.yearly : f.monthly;
            return (
              <View key={i} style={styles.compareRow}>
                <Text style={styles.compareLabel}>{f.label}</Text>
                <View style={styles.compareCol}><FeatureValue value={f.free} /></View>
                <View style={styles.compareCol}><FeatureValue value={showVal} /></View>
              </View>
            );
          })}
        </GlassCard>

        {/* Trust */}
        <GlassCard style={styles.trustCard}>
          <Shield size={20} color={colors.primary} />
          <Text style={styles.trustText}>
            Your data is encrypted and secure. Cancel anytime from Settings.{'\n'}
            No questions asked.
          </Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },

  hero: { padding: 24, borderRadius: 20, alignItems: 'center', gap: 12 },
  crownContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,159,67,0.15)', justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },

  toggleRow: { flexDirection: 'row', backgroundColor: colors.glass, borderRadius: 24, padding: 3, borderWidth: 1, borderColor: colors.glassBorder, alignSelf: 'center' },
  toggleBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 21, flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleActive: { backgroundColor: colors.primary },
  toggleText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: colors.bg },
  saveBadge: { backgroundColor: colors.warning, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  saveText: { color: colors.text, fontSize: 9, fontWeight: '700' },

  pricingRow: { flexDirection: 'row', gap: 10 },
  pricingCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 6, overflow: 'hidden' },
  pricingCardFeatured: { borderColor: colors.primary, borderWidth: 1.5 },
  featuredBadge: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  featuredBadgeText: { color: colors.bg, fontSize: 9, fontWeight: '700' },
  pricingName: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  pricingPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  pricingPrice: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  pricingPeriod: { color: colors.textTertiary, fontSize: 12, fontWeight: '500' },
  pricingSave: { color: colors.success, fontSize: 11, fontWeight: '600' },
  subscribeBtn: { width: '100%', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 22, alignItems: 'center', marginTop: 4 },
  subscribeBtnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  subscribeText: { color: colors.bg, fontSize: 14, fontWeight: '700' },
  trialNote: { color: colors.textTertiary, fontSize: 10, marginTop: 2 },

  compareTitle: { color: colors.text, fontSize: 17, fontWeight: '600', marginTop: 4 },
  compareCard: {},
  compareHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  compareHeaderLabel: { flex: 2, color: colors.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  compareHeaderCol: { flex: 1, color: colors.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },
  compareRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  compareLabel: { flex: 2, color: colors.text, fontSize: 13, fontWeight: '500' },
  compareCol: { flex: 1, alignItems: 'center' },
  featureValue: { color: colors.primary, fontSize: 12, fontWeight: '600' },

  trustCard: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  trustText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, flex: 1 },
});
