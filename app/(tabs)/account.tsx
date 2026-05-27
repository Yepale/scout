import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, PawPrint, Bell, Vibrate, Zap, Sliders, Move, Crown, Shield, HelpCircle, ChevronRight, FlaskConical } from 'lucide-react-native';
import { colors } from '../../src/theme';
import { GlassCard } from '../../src/components/GlassCard';
import { useSettingsStore, usePremiumStore } from '../../src/stores';
import { lightTap } from '../../src/utils/haptics';
import { router } from 'expo-router';

const SettingRow = ({ icon: Icon, label, description, right }: { icon: any; label: string; description?: string; right: React.ReactNode }) => (
  <View style={styles.settingRow}>
    <Icon size={20} color={colors.textSecondary} />
    <View style={styles.settingLabel}>
      <Text style={styles.settingText}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    {right}
  </View>
);

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const { setShowPaywall } = usePremiumStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>Account</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => { lightTap(); setShowPaywall(true); router.push('/premium'); }} activeOpacity={0.8}>
          <GlassCard style={styles.premiumBanner}>
            <View style={styles.settingRow}>
              <Crown size={24} color={colors.warning} />
              <View style={styles.settingLabel}>
                <Text style={[styles.settingText, { color: colors.warning, fontWeight: '700' }]}>Scout Premium</Text>
                <Text style={styles.settingDescription}>Unlimited history, multi-pet profiles, risk maps & more</Text>
              </View>
              <ChevronRight size={20} color={colors.warning} />
            </View>
          </GlassCard>
        </TouchableOpacity>
        <GlassCard>
          <SettingRow icon={PawPrint} label="My Pets" description="Manage pet profiles" right={<ChevronRight size={18} color={colors.textTertiary} />} />
          <View style={styles.divider} />
          <SettingRow icon={Bell} label="Notifications" description="Outdoor risk alerts" right={<ChevronRight size={18} color={colors.textTertiary} />} />
        </GlassCard>
        <GlassCard>
          <SettingRow icon={Vibrate} label="Haptics" right={<Switch value={settings.hapticsEnabled} onValueChange={settings.toggleHaptics} trackColor={{ false: colors.glass, true: colors.primaryDark }} thumbColor={settings.hapticsEnabled ? colors.primary : colors.textTertiary} />} />
          <View style={styles.divider} />
          <SettingRow icon={Zap} label="Auto Flash" right={<Switch value={settings.autoFlash} onValueChange={settings.toggleAutoFlash} trackColor={{ false: colors.glass, true: colors.primaryDark }} thumbColor={settings.autoFlash ? colors.primary : colors.textTertiary} />} />
          <View style={styles.divider} />
          <SettingRow icon={Sliders} label="AI Sensitivity" right={<Switch value={settings.motionTracking} onValueChange={settings.toggleMotionTracking} trackColor={{ false: colors.glass, true: colors.primaryDark }} thumbColor={settings.motionTracking ? colors.primary : colors.textTertiary} />} />
          <View style={styles.divider} />
          <SettingRow icon={Move} label="Motion Tracking" right={<Switch value={settings.motionTracking} onValueChange={settings.toggleMotionTracking} trackColor={{ false: colors.glass, true: colors.primaryDark }} thumbColor={settings.motionTracking ? colors.primary : colors.textTertiary} />} />
        </GlassCard>
        <GlassCard>
          <SettingRow icon={FlaskConical} label="Demo Mode" description="Simulated detections for demos" right={<Switch value={settings.demoMode} onValueChange={settings.toggleDemoMode} trackColor={{ false: colors.glass, true: colors.primaryDark }} thumbColor={settings.demoMode ? colors.primary : colors.textTertiary} />} />
        </GlassCard>
        <GlassCard>
          <SettingRow icon={Shield} label="Privacy" right={<ChevronRight size={18} color={colors.textTertiary} />} />
          <View style={styles.divider} />
          <SettingRow icon={HelpCircle} label="Support" right={<ChevronRight size={18} color={colors.textTertiary} />} />
        </GlassCard>
        <Text style={styles.version}>Scout v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.5, paddingHorizontal: 20, marginBottom: 8 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 14, paddingBottom: 100 },
  premiumBanner: { borderColor: 'rgba(255,159,67,0.3)', borderWidth: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  settingLabel: { flex: 1 },
  settingText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  settingDescription: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  version: { color: colors.textTertiary, fontSize: 12, textAlign: 'center', marginTop: 8 },
});
