import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  User, PawPrint, Bell, Vibrate, Zap, Sliders, Move, Crown, Shield,
  HelpCircle, ChevronRight, FlaskConical, Camera, Sun, Moon,
  Cloud, Wifi, MapPin, BarChart3, Globe, Thermometer, LogOut,
  Smartphone, Palette, Activity, Volume2, Maximize, ChevronLeft,
  Apple, Mail, X, Download, Database, Plus,
} from 'lucide-react-native';
import { colors } from '../../src/theme';
import { GlassCard } from '../../src/components/GlassCard';
import { useSettingsStore, usePremiumStore, useAuthStore, PLAN_FEATURES } from '../../src/stores';
import type { PlanTier, ThemeMode, Language } from '../../src/stores';
import { lightTap, mediumTap } from '../../src/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Reusable components ──────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const SettingRow = ({
  icon: Icon,
  label,
  description,
  right,
  onPress,
}: {
  icon: any;
  label: string;
  description?: string;
  right: React.ReactNode;
  onPress?: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}><Icon size={18} color={colors.textSecondary} /></View>
      <View style={styles.settingLabel}>
        <Text style={styles.settingText}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {right}
    </View>
  </TouchableOpacity>
);

const ToggleSwitch = ({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) => (
  <Switch
    value={value}
    onValueChange={() => { lightTap(); onToggle(); }}
    trackColor={{ false: colors.glass, true: colors.primaryDark }}
    thumbColor={value ? colors.primary : colors.textTertiary}
  />
);

const Chevron = () => <ChevronRight size={16} color={colors.textTertiary} />;

const Divider = () => <View style={styles.divider} />;

type PlanOptionProps = {
  tier: PlanTier;
  selected: boolean;
  onSelect: () => void;
};

const PlanOption = ({ tier, selected, onSelect }: PlanOptionProps) => {
  const f = PLAN_FEATURES[tier];
  if (tier === 'free') return null;
  return (
    <TouchableOpacity
      onPress={() => { lightTap(); onSelect(); }}
      style={[styles.planOption, selected && styles.planOptionSelected]}
      activeOpacity={0.7}
    >
      <View style={styles.planOptionLeft}>
        <Text style={[styles.planOptionName, selected && { color: colors.primary }]}>
          {f.label.replace('Premium ', '')}
        </Text>
        {tier === 'yearly' && (
          <View style={styles.saveBadge}><Text style={styles.saveText}>Save 40%</Text></View>
        )}
      </View>
      <View style={styles.planOptionRight}>
        <Text style={[styles.planPrice, selected && { color: colors.primary }]}>
          ${f.price}
        </Text>
        <Text style={styles.planPeriod}>/{f.period || 'once'}</Text>
        {selected && <View style={styles.planCheck}><Text style={styles.planCheckText}>✓</Text></View>}
      </View>
    </TouchableOpacity>
  );
};

// ─── Auth Sheet ───────────────────────────────────────────────────

const AuthSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { signInWithApple, signInWithGoogle, signInAnonymously } = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.authOverlay}>
        <TouchableOpacity style={styles.authBackdrop} onPress={onClose} />
        <View style={[styles.authSheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.authHandle} />
          <Text style={styles.authTitle}>Sign in to Scout</Text>
          <Text style={styles.authSubtitle}>Sync your data across devices and enable cloud backup.</Text>
          <TouchableOpacity onPress={() => { signInWithApple(); onClose(); }} style={styles.authBtn} activeOpacity={0.8}>
            <Apple size={20} color={colors.text} />
            <Text style={styles.authBtnText}>Continue with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { signInWithGoogle(); onClose(); }} style={[styles.authBtn, styles.authBtnOutline]} activeOpacity={0.8}>
            <Text style={styles.authBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { signInAnonymously(); onClose(); }} activeOpacity={0.7}>
            <Text style={styles.authSkip}>Continue without account</Text>
          </TouchableOpacity>
          <Text style={styles.authFooter}>Your data is encrypted and never shared.</Text>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const { tier, status, trialDaysLeft, setPlan, setShowPaywall, setSelectedPlan, selectedPlan } = usePremiumStore();
  const { user, isSignedIn, setShowAuthSheet, showAuthSheet, signOut } = useAuthStore();
  const [showPlans, setShowPlans] = useState(false);

  const isPremium = tier !== 'free' && (status === 'active' || status === 'trial');
  const planLabel = tier === 'free' ? 'Free' : tier === 'yearly' ? 'Premium Annual' : tier === 'monthly' ? 'Premium Monthly' : 'Premium Lifetime';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Profile Section ─── */}
        <SectionHeader title="Profile" />
        <GlassCard>
          <TouchableOpacity
            onPress={() => { lightTap(); if (!isSignedIn) setShowAuthSheet(true); }}
            activeOpacity={0.7}
          >
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <User size={24} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{settings.displayName}</Text>
                <Text style={styles.profileEmail}>
                  {isSignedIn
                    ? (user?.email || 'No email')
                    : 'Tap to sign in'}
                </Text>
              </View>
              <Chevron />
            </View>
          </TouchableOpacity>
          <Divider />
          <SettingRow icon={PawPrint} label="My Pets" description={`${settings.pets.length} pet${settings.pets.length > 1 ? 's' : ''}`} right={<Chevron />} />
        </GlassCard>

        {/* ─── Subscription ─── */}
        <SectionHeader title="Subscription" />
        <TouchableOpacity onPress={() => { lightTap(); setShowPlans(!showPlans); }} activeOpacity={0.8}>
          <GlassCard style={isPremium ? [styles.planCard, styles.planCardPremium] : styles.planCard}>
            <View style={styles.planCardRow}>
              <Crown size={22} color={isPremium ? colors.warning : colors.textSecondary} />
              <View style={styles.planCardInfo}>
                <Text style={[styles.planCardTitle, isPremium && { color: colors.warning }]}>
                  {isPremium ? 'Scout Premium' : 'Free Plan'}
                </Text>
                <Text style={styles.planCardDesc}>
                  {isPremium
                    ? status === 'trial'
                      ? `${trialDaysLeft} days trial remaining`
                      : 'All features unlocked'
                    : 'Unlock unlimited history, multi-pet, cloud & more'}
                </Text>
              </View>
              <Chevron />
            </View>
          </GlassCard>
        </TouchableOpacity>

        {showPlans && (
          <GlassCard>
            <View style={styles.plansHeader}>
              <Text style={styles.plansTitle}>Choose your plan</Text>
            </View>
            {(['monthly', 'yearly', 'lifetime'] as PlanTier[]).map((p) => (
              <PlanOption
                key={p}
                tier={p}
                selected={selectedPlan === p}
                onSelect={() => setSelectedPlan(p as 'monthly' | 'yearly' | 'lifetime')}
              />
            ))}
            <TouchableOpacity
              onPress={() => { mediumTap(); setPlan(selectedPlan); }}
              style={styles.upgradeBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeBtnText}>
                {status === 'none' ? 'Start Free Trial' : 'Upgrade Now'}
              </Text>
            </TouchableOpacity>
            {status === 'none' && (
              <Text style={styles.trialText}>7-day free trial, cancel anytime</Text>
            )}
            {isPremium && (
              <TouchableOpacity onPress={() => { lightTap(); /* cancel */ }} activeOpacity={0.7}>
                <Text style={styles.cancelText}>Cancel subscription</Text>
              </TouchableOpacity>
            )}
          </GlassCard>
        )}

        {/* ─── Scanner ─── */}
        <SectionHeader title="Scanner" />
        <GlassCard>
          <SettingRow icon={Vibrate} label="Haptics" description="Vibration on detection" right={<ToggleSwitch value={settings.hapticsEnabled} onToggle={settings.toggleHaptics} />} />
          <Divider />
          <SettingRow icon={Zap} label="Auto Flash" description="Flash in low light" right={<ToggleSwitch value={settings.autoFlash} onToggle={settings.toggleAutoFlash} />} />
          <Divider />
          <SettingRow icon={Maximize} label="Auto Zoom" description="Smart zoom assistance" right={<ToggleSwitch value={settings.autoZoom} onToggle={settings.toggleAutoZoom} />} />
          <Divider />
          <SettingRow icon={Volume2} label="Scan Sound" description="Audio feedback" right={<ToggleSwitch value={settings.scanSound} onToggle={settings.toggleScanSound} />} />
          <Divider />
          <SettingRow icon={Activity} label="Motion Tracking" description="Detect movement" right={<ToggleSwitch value={settings.motionTracking} onToggle={settings.toggleMotionTracking} />} />
          <Divider />
          <SettingRow icon={FlaskConical} label="Demo Mode" description="Simulated detections" right={<ToggleSwitch value={settings.demoMode} onToggle={settings.toggleDemoMode} />} />
          <Divider />
          <SettingRow icon={Sliders} label="AI Sensitivity" description="Detection threshold" right={<Text style={styles.sensitivityValue}>{Math.round(settings.aiSensitivity * 100)}%</Text>} />
        </GlassCard>

        {/* ─── Notifications ─── */}
        <SectionHeader title="Notifications" />
        <GlassCard>
          <SettingRow icon={Bell} label="Push Notifications" right={<ToggleSwitch value={settings.pushEnabled} onToggle={settings.togglePush} />} />
          <Divider />
          <SettingRow icon={MapPin} label="Risk Alerts" description="Outdoor tick warnings" right={<ToggleSwitch value={settings.riskAlerts} onToggle={settings.toggleRiskAlerts} />} />
          <Divider />
          <SettingRow icon={BarChart3} label="Weekly Report" description="Scan summary" right={<ToggleSwitch value={settings.weeklyReport} onToggle={settings.toggleWeeklyReport} />} />
          <Divider />
          <SettingRow icon={Lightbulb} label="Tip of the Day" right={<ToggleSwitch value={settings.tipOfDay} onToggle={settings.toggleTipOfDay} />} />
        </GlassCard>

        {/* ─── Appearance ─── */}
        <SectionHeader title="Appearance" />
        <GlassCard>
          <SettingRow icon={Moon} label="Dark Mode" description="Dark theme by default" right={
            <View style={styles.themeRow}>
              {(['dark', 'light', 'system'] as ThemeMode[]).map((t) => (
                <TouchableOpacity key={t} onPress={() => { lightTap(); settings.setTheme(t); }}
                  style={[styles.themeDot, settings.theme === t && styles.themeDotActive]}>
                  <Text style={[styles.themeDotText, settings.theme === t && styles.themeDotTextActive]}>
                    {t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '⚙️'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          } />
          <Divider />
          <SettingRow icon={Sun} label="Reduce Motion" right={<ToggleSwitch value={settings.reduceMotion} onToggle={settings.toggleReduceMotion} />} />
          <Divider />
          <SettingRow icon={Globe} label="Language" description="App language" right={
            <TouchableOpacity onPress={() => { lightTap(); }}><Text style={styles.languageText}>{settings.language.toUpperCase()}</Text></TouchableOpacity>
          } />
          <Divider />
          <SettingRow icon={Thermometer} label="Temperature" right={
            <View style={styles.tempRow}>
              {(['celsius', 'fahrenheit'] as const).map((t) => (
                <TouchableOpacity key={t} onPress={() => { lightTap(); settings.setTemperatureUnit(t); }}
                  style={[styles.tempBtn, settings.temperatureUnit === t && styles.tempBtnActive]}>
                  <Text style={[styles.tempBtnText, settings.temperatureUnit === t && styles.tempBtnTextActive]}>
                    {t === 'celsius' ? '°C' : '°F'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          } />
        </GlassCard>

        {/* ─── Data & Storage ─── */}
        <SectionHeader title="Data & Storage" />
        <GlassCard>
          <SettingRow icon={Cloud} label="Auto Backup" description={isPremium ? 'Backup to cloud' : 'Premium feature'} right={<ToggleSwitch value={settings.autoBackup} onToggle={settings.toggleAutoBackup} />} />
          <Divider />
          <SettingRow icon={Wifi} label="Use Cellular Data" description="For backups" right={<ToggleSwitch value={settings.useCellularData} onToggle={settings.toggleUseCellular} />} />
          <Divider />
          <SettingRow icon={Database} label="Storage Used" description="Local scan data" right={<Text style={styles.storageText}>0 MB</Text>} />
          <Divider />
          <TouchableOpacity onPress={() => { lightTap(); }} activeOpacity={0.7}>
            <View style={styles.settingRow}>
              <View style={styles.settingIcon}><Download size={18} color={colors.textSecondary} /></View>
              <Text style={styles.settingText}>Export Data</Text>
            </View>
          </TouchableOpacity>
        </GlassCard>

        {/* ─── Privacy ─── */}
        <SectionHeader title="Privacy" />
        <GlassCard>
          <SettingRow icon={BarChart3} label="Share Analytics" description="Help improve Scout" right={<ToggleSwitch value={settings.shareAnalytics} onToggle={settings.toggleAnalytics} />} />
          <Divider />
          <SettingRow icon={MapPin} label="Location" description="For risk maps" right={<ToggleSwitch value={settings.shareLocation} onToggle={settings.toggleLocation} />} />
        </GlassCard>

        {/* ─── Account Actions ─── */}
        <SectionHeader title="Account" />
        <GlassCard>
          {isSignedIn ? (
            <TouchableOpacity onPress={() => { lightTap(); signOut(); }} activeOpacity={0.7}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}><LogOut size={18} color={colors.error} /></View>
                <Text style={[styles.settingText, { color: colors.error }]}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => { lightTap(); setShowAuthSheet(true); }} activeOpacity={0.7}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}><User size={18} color={colors.primary} /></View>
                <Text style={[styles.settingText, { color: colors.primary }]}>Sign In</Text>
              </View>
            </TouchableOpacity>
          )}
          <Divider />
          <TouchableOpacity onPress={() => { lightTap(); router.push('/emergency'); }} activeOpacity={0.7}>
            <View style={styles.settingRow}>
              <View style={styles.settingIcon}><Shield size={18} color={colors.textSecondary} /></View>
              <Text style={styles.settingText}>Emergency Guide</Text>
              <Chevron />
            </View>
          </TouchableOpacity>
          <Divider />
          <SettingRow icon={HelpCircle} label="Support & FAQ" right={<Chevron />} />
        </GlassCard>

        <Text style={styles.version}>Scout v1.0.0 — Built with ❤️</Text>
      </ScrollView>

      <AuthSheet visible={showAuthSheet} onClose={() => setShowAuthSheet(false)} />
    </View>
  );
}

// We need Lightbulb — import was missing. Add inline.
const Lightbulb = ({ size, color }: { size: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>💡</Text>
);

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 0, paddingBottom: 100 },

  sectionHeader: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },

  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  settingIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.glass, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { flex: 1 },
  settingText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  settingDescription: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 40 },

  // Profile
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,245,212,0.15)', justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1 },
  profileName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  profileEmail: { color: colors.textTertiary, fontSize: 12, marginTop: 1 },

  // Plans
  planCard: {},
  planCardPremium: { borderColor: 'rgba(255,159,67,0.3)', borderWidth: 1 },
  planCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  planCardInfo: { flex: 1 },
  planCardTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  planCardDesc: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  plansHeader: { marginBottom: 8 },
  plansTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
  planOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },
  planOptionSelected: { backgroundColor: 'rgba(0,245,212,0.08)' },
  planOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planOptionName: { color: colors.text, fontSize: 14, fontWeight: '500' },
  planOptionRight: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  planPrice: { color: colors.text, fontSize: 16, fontWeight: '700' },
  planPeriod: { color: colors.textTertiary, fontSize: 11 },
  planCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  planCheckText: { color: colors.bg, fontSize: 11, fontWeight: '800' },
  saveBadge: { backgroundColor: colors.warning, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  saveText: { color: colors.text, fontSize: 9, fontWeight: '700' },
  upgradeBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 24, alignItems: 'center', marginTop: 8 },
  upgradeBtnText: { color: colors.bg, fontSize: 15, fontWeight: '700' },
  trialText: { color: colors.textTertiary, fontSize: 11, textAlign: 'center', marginTop: 6 },
  cancelText: { color: colors.error, fontSize: 12, textAlign: 'center', marginTop: 10, fontWeight: '500' },

  // Scanner extras
  sensitivityValue: { color: colors.text, fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },

  // Appearance
  themeRow: { flexDirection: 'row', gap: 6 },
  themeDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.glass, justifyContent: 'center', alignItems: 'center' },
  themeDotActive: { borderWidth: 2, borderColor: colors.primary },
  themeDotText: { fontSize: 14 },
  themeDotTextActive: {},
  languageText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  tempRow: { flexDirection: 'row', gap: 4 },
  tempBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: colors.glass },
  tempBtnActive: { backgroundColor: colors.primary },
  tempBtnText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  tempBtnTextActive: { color: colors.bg },

  // Storage
  storageText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },

  // Version
  version: { color: colors.textTertiary, fontSize: 11, textAlign: 'center', marginTop: 20 },

  // Auth Sheet
  authOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  authBackdrop: { flex: 1 },
  authSheet: { backgroundColor: colors.bgTertiary, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  authHandle: { width: 36, height: 4, backgroundColor: colors.textTertiary, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  authTitle: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  authSubtitle: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 18 },
  authBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.surfaceLight, paddingVertical: 14, borderRadius: 24 },
  authBtnOutline: { borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' },
  authBtnText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  authSkip: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 4 },
  authFooter: { color: colors.textTertiary, fontSize: 11, textAlign: 'center', marginTop: 4 },
});
