import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Bug, BugOff } from 'lucide-react-native';
import { colors } from '../theme';
import { GlassCard } from './GlassCard';
import { useDetectionStore } from '../stores';
import { useSettingsStore } from '../stores/settingsStore';
import { lightTap, mediumTap } from '../utils/haptics';
import { SCENARIOS, generateScenarioDetections } from '../utils/demoData';
import { type DemoScenario } from '../utils/demoData';

interface DemoModePanelProps {
  visible: boolean;
  onClose: () => void;
}

export const DemoModePanel: React.FC<DemoModePanelProps> = ({ visible, onClose }) => {
  const demoMode = useSettingsStore((s) => s.demoMode);
  const toggleDemoMode = useSettingsStore((s) => s.toggleDemoMode);
  const setScanning = useDetectionStore((s) => s.setScanning);
  const setActiveDetections = useDetectionStore((s) => s.setActiveDetections);

  const handleScenario = (scenario: DemoScenario) => {
    mediumTap();
    const detections = generateScenarioDetections(scenario);
    setActiveDetections(detections);
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Bug size={18} color={colors.primary} />
          <Text style={styles.title}>Demo Scenarios</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeBtn}>Close</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => { lightTap(); toggleDemoMode(); }}
          style={[styles.toggleRow, demoMode && styles.toggleRowActive]}
          activeOpacity={0.8}
        >
          {demoMode ? <Bug size={18} color={colors.bg} /> : <BugOff size={18} color={colors.textSecondary} />}
          <Text style={[styles.toggleText, demoMode && { color: colors.bg }]}>
            Demo Mode {demoMode ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {SCENARIOS.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => handleScenario(s.id)}
              style={styles.scenarioBtn}
              activeOpacity={0.7}
            >
              <View style={styles.scenarioInfo}>
                <Text style={styles.scenarioTitle}>{s.description}</Text>
                <Text style={styles.scenarioMode}>{s.mode} mode · {s.detections.length} detection{s.detections.length !== 1 ? 's' : ''}</Text>
              </View>
              <Text style={styles.scenarioArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    zIndex: 300,
    padding: 16,
    paddingBottom: 100,
  },
  card: { padding: 16, maxHeight: 420 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  closeBtn: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.glass,
    borderWidth: 1, borderColor: colors.glassBorder,
    marginBottom: 12,
  },
  toggleRowActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },

  scroll: { maxHeight: 240 },
  scenarioBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 4,
    borderBottomWidth: 1, borderBottomColor: colors.glassBorder,
  },
  scenarioInfo: { flex: 1, gap: 2 },
  scenarioTitle: { color: colors.text, fontSize: 13, fontWeight: '500' },
  scenarioMode: { color: colors.textTertiary, fontSize: 11 },
  scenarioArrow: { color: colors.textTertiary, fontSize: 16, marginLeft: 8 },
});
