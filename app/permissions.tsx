import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Shield, Camera, Bell, ChevronLeft } from 'lucide-react-native';
import { colors } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';
import { usePermissions } from '../src/hooks/usePermissions';
import { lightTap, mediumTap } from '../src/utils/haptics';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  granted: { label: 'Granted', color: colors.success },
  denied: { label: 'Denied', color: colors.error },
  blocked: { label: 'Blocked', color: colors.error },
  undetermined: { label: 'Not Asked', color: colors.textTertiary },
};

const STATUS_ICONS: Record<string, string> = {
  granted: '✅',
  denied: '⛔',
  blocked: '🚫',
  undetermined: '❓',
};

export default function PermissionsScreen() {
  const insets = useSafeAreaInsets();
  const { permissions, refresh, openSettings } = usePermissions();

  const handleRequest = async (perm: typeof permissions[0]) => {
    lightTap();
    if (perm.status === 'blocked') {
      openSettings();
      return;
    }
    const ok = await perm.request();
    if (ok) mediumTap();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { lightTap(); router.back(); }} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Permissions</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <GlassCard>
          <View style={styles.intro}>
            <Shield size={32} color={colors.primary} />
            <Text style={styles.introText}>
              Scout needs certain permissions to function. {'\n'}Denied permissions can be re-enabled in system settings.
            </Text>
          </View>
        </GlassCard>

        {permissions.map((perm, i) => {
          const st = STATUS_MAP[perm.status] || STATUS_MAP.undetermined;
          const si = STATUS_ICONS[perm.status] || STATUS_ICONS.undetermined;
          return (
            <GlassCard key={perm.key} style={i > 0 ? { marginTop: 12 } : undefined}>
              <View style={styles.permRow}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>{perm.icon}</Text>
                </View>
                <View style={styles.permInfo}>
                  <View style={styles.permTitleRow}>
                    <Text style={styles.permLabel}>{perm.label}</Text>
                    {perm.isRequired && <Text style={styles.requiredBadge}>Required</Text>}
                  </View>
                  <Text style={styles.permDesc}>{perm.description}</Text>
                  <View style={styles.permStatusRow}>
                    <Text style={styles.statusIcon}>{si}</Text>
                    <Text style={[styles.statusLabel, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  perm.status === 'granted' && styles.actionBtnGranted,
                ]}
                onPress={() => handleRequest(perm)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.actionBtnText,
                    perm.status === 'granted' && styles.actionBtnTextGranted,
                  ]}
                >
                  {perm.status === 'blocked' ? 'Open Settings' : perm.status === 'granted' ? 'Re-request' : 'Grant Permission'}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          );
        })}

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={styles.noteTitle}>🔒 Privacy Note</Text>
          <Text style={styles.noteText}>
            Scout never shares your camera feed or personal data. Camera processing happens entirely on-device.
            Location data is only used for risk maps and is never stored permanently.
          </Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 60 },
  intro: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  introText: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  permRow: { flexDirection: 'row', gap: 14 },
  permIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.glass, justifyContent: 'center', alignItems: 'center' },
  permIcon: { fontSize: 22 },
  permInfo: { flex: 1 },
  permTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  permLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  requiredBadge: { backgroundColor: colors.primaryDark, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  requiredBadgeText: { color: colors.bg, fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  permDesc: { color: colors.textTertiary, fontSize: 12, marginTop: 2 },
  permStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  statusIcon: { fontSize: 12 },
  statusLabel: { fontSize: 12, fontWeight: '600' },
  actionBtn: { marginTop: 14, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  actionBtnGranted: { backgroundColor: colors.glass },
  actionBtnText: { color: colors.bg, fontSize: 13, fontWeight: '700' },
  actionBtnTextGranted: { color: colors.textSecondary },
  noteTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  noteText: { color: colors.textTertiary, fontSize: 12, lineHeight: 18 },
});
