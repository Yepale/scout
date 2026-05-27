import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Flashlight, Sun, Moon, Sunset, Lightbulb, LampCeiling,
  Tent, Crosshair, Volume2, Eye, Lock, Unlock, Maximize,
  Minimize, AlertTriangle, Radio, Activity, Zap, ZapOff,
  ChevronDown, ChevronUp, Droplets, Search,
} from 'lucide-react-native';
import { colors } from '../theme';
import { GlassCard } from './GlassCard';
import { useUtilityStore, FlashMode, ScreenMode } from '../stores/utilityStore';
import { lightTap, mediumTap } from '../utils/haptics';

// ─── Flashlight Mode Button ──────────────────────────────────────

const FlashBtn = ({
  mode,
  icon: Icon,
  label,
  current,
  onPress,
  color = colors.primary,
}: {
  mode: FlashMode;
  icon: any;
  label: string;
  current: FlashMode;
  onPress: (m: FlashMode) => void;
  color?: string;
}) => {
  const isActive = current === mode;
  return (
    <TouchableOpacity
      onPress={() => { lightTap(); onPress(mode); }}
      style={[styles.utilBtn, isActive && { borderColor: color, backgroundColor: `${color}15` }]}
      activeOpacity={0.7}
    >
      <Icon size={22} color={isActive ? color : colors.textSecondary} />
      <Text style={[styles.utilLabel, isActive && { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// ─── Screen Mode Button ──────────────────────────────────────────

const ScreenBtn = ({
  mode,
  icon: Icon,
  label,
  current,
  onPress,
  color = colors.primary,
}: {
  mode: ScreenMode;
  icon: any;
  label: string;
  current: ScreenMode;
  onPress: (m: ScreenMode) => void;
  color?: string;
}) => {
  const isActive = current === mode;
  return (
    <TouchableOpacity
      onPress={() => { lightTap(); onPress(mode); }}
      style={[styles.utilBtn, isActive && { borderColor: color, backgroundColor: `${color}15` }]}
      activeOpacity={0.7}
    >
      <Icon size={22} color={isActive ? color : colors.textSecondary} />
      <Text style={[styles.utilLabel, isActive && { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// ─── Main Panel ──────────────────────────────────────────────────

interface UtilityPanelProps {
  visible: boolean;
  onClose: () => void;
}

export const UtilityPanel: React.FC<UtilityPanelProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const {
    flashMode, setFlashMode,
    screenMode, setScreenMode,
    screenAwake, setScreenAwake,
    screenLocked, setScreenLocked,
    screenBrightness, setScreenBrightness,
    campMode, setCampMode,
    nightMode, setNightMode,
    handsFree, setHandsFree,
    audioFeedback, setAudioFeedback,
    voiceCommands, setVoiceCommands,
    overlayMinimal, setOverlayMinimal,
    activatePreset,
  } = useUtilityStore();

  const flashColor =
    flashMode === 'red' ? colors.error :
    flashMode === 'green' ? colors.success :
    flashMode === 'uv' ? '#9B59B6' :
    flashMode === 'white' ? colors.text :
    colors.primary;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }] },
      ]}
    >
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.handle}>
        <View style={styles.handleBar} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ─── Quick Presets ─── */}
        <Text style={styles.sectionTitle}>Quick Modes</Text>
        <View style={styles.presetRow}>
          <TouchableOpacity
            onPress={() => { mediumTap(); campMode ? setCampMode(false) : activatePreset('camp'); }}
            style={[styles.presetBtn, campMode && styles.presetActive]}
            activeOpacity={0.8}
          >
            <Tent size={20} color={campMode ? colors.bg : colors.primary} />
            <Text style={[styles.presetText, campMode && styles.presetTextActive]}>Camp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { mediumTap(); nightMode ? setNightMode(false) : activatePreset('night'); }}
            style={[styles.presetBtn, nightMode && styles.presetActive]}
            activeOpacity={0.8}
          >
            <Moon size={20} color={nightMode ? colors.bg : colors.primary} />
            <Text style={[styles.presetText, nightMode && styles.presetTextActive]}>Night</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { mediumTap(); activatePreset('emergency'); }}
            style={[styles.presetBtn, { borderColor: colors.error }]}
            activeOpacity={0.8}
          >
            <AlertTriangle size={20} color={colors.error} />
            <Text style={[styles.presetText, { color: colors.error }]}>SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { mediumTap(); setScreenMode('white-cold'); setScreenBrightness(1); }}
            style={styles.presetBtn}
            activeOpacity={0.8}
          >
            <Sun size={20} color={colors.text} />
            <Text style={styles.presetText}>White</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Flashlight Modes ─── */}
        <Text style={styles.sectionTitle}>Flashlight</Text>
        <View style={styles.utilGrid}>
          <FlashBtn mode="normal" icon={Zap} label="Normal" current={flashMode} onPress={setFlashMode} />
          <FlashBtn mode="red" icon={Sun} label="Red" current={flashMode} onPress={setFlashMode} color={colors.error} />
          <FlashBtn mode="green" icon={Sun} label="Green" current={flashMode} onPress={setFlashMode} color={colors.success} />
          <FlashBtn mode="uv" icon={Droplets} label="UV Sim" current={flashMode} onPress={setFlashMode} color="#9B59B6" />
          <FlashBtn mode="strobe" icon={Radio} label="Strobe" current={flashMode} onPress={setFlashMode} color={colors.warning} />
          <FlashBtn mode="white" icon={Lightbulb} label="Full" current={flashMode} onPress={setFlashMode} />
        </View>

        {/* ─── Screen Modes ─── */}
        <Text style={styles.sectionTitle}>Screen Light</Text>
        <View style={styles.utilGrid}>
          <ScreenBtn mode="white-warm" icon={Sun} label="Warm" current={screenMode} onPress={setScreenMode} color="#FFB347" />
          <ScreenBtn mode="white-cold" icon={Sun} label="Cold" current={screenMode} onPress={setScreenMode} />
          <ScreenBtn mode="red-night" icon={Moon} label="Red" current={screenMode} onPress={setScreenMode} color={colors.error} />
          <ScreenBtn mode="green-night" icon={Moon} label="Green" current={screenMode} onPress={setScreenMode} color={colors.success} />
          <ScreenBtn mode="blue-contrast" icon={Eye} label="Blue" current={screenMode} onPress={setScreenMode} color={colors.cyan} />
        </View>

        {/* ─── Persistent Controls ─── */}
        <Text style={styles.sectionTitle}>Persistent Controls</Text>
        <GlassCard style={styles.persistCard}>
          <ToggleRow icon={screenAwake ? Maximize : Minimize} label="Keep Screen Awake" value={screenAwake} onToggle={() => { lightTap(); setScreenAwake(!screenAwake); }} />
          <ToggleRow icon={screenLocked ? Lock : Unlock} label="Lock Screen State" value={screenLocked} onToggle={() => { lightTap(); setScreenLocked(!screenLocked); }} />
          <ToggleRow icon={Eye} label="Minimal Overlay" value={overlayMinimal} onToggle={() => { lightTap(); setOverlayMinimal(!overlayMinimal); }} />
          <ToggleRow icon={Zap} label="Persistent Flash" value={useUtilityStore.getState().flashPersistent} onToggle={() => { lightTap(); useUtilityStore.getState().setFlashPersistent(!useUtilityStore.getState().flashPersistent); }} />
        </GlassCard>

        {/* ─── Audio & Voice ─── */}
        <Text style={styles.sectionTitle}>Audio & Voice</Text>
        <GlassCard style={styles.persistCard}>
          <ToggleRow icon={Volume2} label="Audio Feedback" value={audioFeedback} onToggle={() => { lightTap(); setAudioFeedback(!audioFeedback); }} />
          <ToggleRow icon={Activity} label="Voice Commands" value={voiceCommands} onToggle={() => { lightTap(); setVoiceCommands(!voiceCommands); }} />
          <ToggleRow icon={Crosshair} label="Hands-Free Mode" value={handsFree} onToggle={() => { lightTap(); setHandsFree(!handsFree); }} />
        </GlassCard>

        {/* ─── Voice command examples ─── */}
        {voiceCommands && (
          <GlassCard style={styles.voiceCard}>
            <Text style={styles.voiceTitle}>Say:</Text>
            <Text style={styles.voiceText}>
              "Flash on" · "Red light" · "Camp mode" · "Night mode"{'\n'}
              "Screen awake" · "More bright" · "Strobe" · "Emergency"
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </Animated.View>
  );
};

// ─── Toggle Row helper ───────────────────────────────────────────

const ToggleRow = ({
  icon: Icon,
  label,
  value,
  onToggle,
}: {
  icon: any;
  label: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity onPress={onToggle} style={styles.toggleRow} activeOpacity={0.7}>
    <View style={styles.toggleLeft}>
      <Icon size={16} color={value ? colors.primary : colors.textTertiary} />
      <Text style={[styles.toggleLabel, value && { color: colors.text }]}>{label}</Text>
    </View>
    <View style={[styles.toggleDot, value && styles.toggleDotActive]}>
      {value && <View style={styles.toggleDotInner} />}
    </View>
  </TouchableOpacity>
);

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 200,
  },
  handle: { alignItems: 'center', paddingVertical: 8 },
  handleBar: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.textTertiary },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 40 },

  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  // Presets
  presetRow: { flexDirection: 'row', gap: 8 },
  presetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  presetActive: { backgroundColor: colors.primary },
  presetText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  presetTextActive: { color: colors.bg },

  // Utility grid
  utilGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  utilBtn: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  utilLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },

  // Persistent card
  persistCard: { gap: 0 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleDotActive: { borderColor: colors.primary },
  toggleDotInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },

  // Voice card
  voiceCard: {},
  voiceTitle: { color: colors.primary, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  voiceText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
});
