import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { CameraView } from 'expo-camera';
import {
  Zap, ZapOff, Search, PawPrint, Map, AlertTriangle, X, Tent,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '../../src/theme';
import { ScanMode } from '../../src/utils/constants';
import { useDetectionStore } from '../../src/stores';
import { useUtilityStore } from '../../src/stores/utilityStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { lightTap, mediumTap, heavyTap } from '../../src/utils/haptics';
import { useDetectionSimulation } from '../../src/hooks/useDetectionSimulation';
import { useScreenAwake } from '../../src/hooks/useScreenAwake';
import { usePersistentFlash } from '../../src/hooks/usePersistentFlash';
import { useEmergencyStrobe } from '../../src/hooks/useEmergencyStrobe';
import { useAutoHide } from '../../src/hooks/useAutoHide';
import { useScanGestures } from '../../src/hooks/useScanGestures';
import { TopBar } from '../../src/components/TopBar';
import { ScanButton } from '../../src/components/ScanButton';
import { ZoomWheel } from '../../src/components/ZoomWheel';
import { DetectionOverlay } from '../../src/components/DetectionOverlay';
import { QuickScanRing } from '../../src/components/QuickScanRing';
import { CampModeButton } from '../../src/components/CampModeButton';
import { UtilityPanel } from '../../src/components/UtilityPanel';
import { WhiteScreen } from '../../src/components/WhiteScreen';
import { CameraFilterOverlay } from '../../src/components/CameraFilterOverlay';
import { DemoModePanel } from '../../src/components/DemoModePanel';
import { GlassCard } from '../../src/components/GlassCard';
import { PRESET_LABELS, getCurrentPreset, PresetMode } from '../../src/utils/presets';

const { width: SW, height: SH } = Dimensions.get('window');

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Pet');
  const [showQuickScan, setShowQuickScan] = useState(false);
  const [quickProgress, setQuickProgress] = useState(0);
  const [detectionAlert, setDetectionAlert] = useState<string | null>(null);
  const [showRadial, setShowRadial] = useState(false);
  const [presetLabel, setPresetLabel] = useState<string | null>(null);
  const [brightnessPct, setBrightnessPct] = useState<number | null>(null);
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const alertAnim = useRef(new Animated.Value(0)).current;
  const presetOpacity = useRef(new Animated.Value(0)).current;
  const brightOpacity = useRef(new Animated.Value(0)).current;
  const swipeHintOpacity = useRef(new Animated.Value(1)).current;

  // ─── Stores ──────────────────────────────────────────────────────
  const {
    isScanning, activeDetections, flashEnabled, zoomLevel,
    toggleFlash, setZoom, setScanning, clearDetections,
  } = useDetectionStore();

  const {
    campMode, nightMode, overlayMinimal, screenMode,
    showUtilityPanel, setShowUtilityPanel, flashMode,
    setFlashMode, setScreenMode, screenBrightness,
  } = useUtilityStore();

  const demoMode = useSettingsStore((s) => s.demoMode);

  const { startScan, stopScan } = useDetectionSimulation();
  const { visible: uiVisible, reset: resetAutoHide } = useAutoHide(4500);

  // Utility hooks
  useScreenAwake();
  usePersistentFlash();
  useEmergencyStrobe();

  // ─── Gestures ────────────────────────────────────────────────────
  const { centerPan, bottomPan, edgePan } = useScanGestures();

  const flashPreset = useCallback(() => {
    const p = getCurrentPreset();
    setPresetLabel(PRESET_LABELS[p]);
    Animated.sequence([
      Animated.timing(presetOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(presetOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setPresetLabel(null));
    resetAutoHide();
  }, [resetAutoHide, presetOpacity]);

  const showBrightness = useCallback((pct: number) => {
    setBrightnessPct(Math.round(pct * 100));
    Animated.sequence([
      Animated.timing(brightOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(brightOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => setBrightnessPct(null));
  }, [brightOpacity]);

  // Subscribe to store changes for preset flash
  useEffect(() => {
    const unsub = useUtilityStore.subscribe((s, prev) => {
      if (s.flashMode !== prev.flashMode || s.campMode !== prev.campMode || s.strobeActive !== prev.strobeActive) {
        flashPreset();
      }
      if (s.screenBrightness !== prev.screenBrightness && s.screenBrightness >= 0) {
        showBrightness(s.screenBrightness);
      }
    });
    return unsub;
  }, [flashPreset, showBrightness]);

  // ─── Scan Logic ──────────────────────────────────────────────────
  const handleScan = useCallback(() => {
    lightTap();
    if (isScanning) { stopScan(); clearDetections(); }
    else { startScan(mode); }
  }, [isScanning, mode, startScan, stopScan, clearDetections]);

  const handleQuickScan = useCallback(() => {
    mediumTap();
    setShowRadial(false);
    setShowQuickScan(true);
    setQuickProgress(0);
    setScanning(true);
    const duration = 15000;
    const interval = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const progress = Math.min(elapsed / duration, 1);
      setQuickProgress(progress);
      if (progress >= 1) {
        clearInterval(timer);
        setScanning(false);
        heavyTap();
        const hasDetection = Math.random() > 0.5;
        if (hasDetection) {
          setDetectionAlert('1 possible tick found');
          Animated.sequence([
            Animated.timing(alertAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.timing(alertAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]).start(() => { setDetectionAlert(null); setShowQuickScan(false); });
        } else {
          setTimeout(() => setShowQuickScan(false), 1000);
        }
      }
    }, interval);
  }, [setScanning]);

  const handleModeChange = useCallback((newMode: ScanMode) => {
    lightTap();
    setMode(newMode);
    if (isScanning) { stopScan(); clearDetections(); }
  }, [isScanning, stopScan, clearDetections]);

  // ─── Radial Menu ─────────────────────────────────────────────────
  const handleLongPress = useCallback(() => {
    heavyTap();
    setShowRadial(true);
  }, []);

  const radialItems = [
    { icon: Map, label: 'Risk Map', route: '/risk-map' },
    { icon: PawPrint, label: 'Pet Check', route: '/pet-inspection' },
    { icon: AlertTriangle, label: 'Emergency', route: '/emergency' },
    { icon: Search, label: 'Quick Scan', action: handleQuickScan },
  ];

  const scanLabel =
    mode === 'Pet' ? 'Scan your pet' :
    mode === 'Human' ? 'Scan skin' : 'Scan area';

  const isWhiteScreen = screenMode === 'white-warm' || screenMode === 'white-cold';
  const whiteColor = screenMode === 'white-warm' ? '#FFF3CD' : '#FFFFFF';
  const currentPreset = getCurrentPreset();

  // ─── Track camp float visibility ─────────────────────────────────
  const showCampFloat = !showUtilityPanel && !isWhiteScreen && uiVisible;

  // ─── Swipe hint auto-dismiss ─────────────────────────────────────
  useEffect(() => {
    Animated.timing(swipeHintOpacity, { toValue: 0, duration: 800, delay: 6000, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* ─── Camera ─────────────────────────────────────────────── */}
      <CameraView style={styles.camera} facing="back" enableTorch={flashEnabled} zoom={zoomLevel / 5}>
        <View style={styles.overlay}>

          {/* Tap anything to reset auto-hide */}
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={resetAutoHide} />

          {/* ─── Top bar ───────────────────────────────────────── */}
          <Animated.View style={{ opacity: uiVisible ? 1 : 0 }}>
            <TopBar mode={mode} onModeChange={handleModeChange} onSettingsPress={() => router.push('/(tabs)/account')} />
          </Animated.View>

          {/* ─── Scan area ─────────────────────────────────────── */}
          <View style={styles.scanArea}>
            {showQuickScan ? (
              <View style={styles.quickScanContainer}>
                <QuickScanRing progress={quickProgress} size={180} strokeWidth={5} />
                <Text style={styles.quickScanHint}>
                  {quickProgress < 0.33 ? 'Checking fur...' : quickProgress < 0.66 ? 'Scanning paws...' : quickProgress < 1 ? 'Almost done' : 'Complete'}
                </Text>
              </View>
            ) : (
              <>
                <DetectionOverlay detections={activeDetections} isScanning={isScanning} />
                {!isScanning && !showRadial && (
                  <Text style={styles.scanLabel}>{scanLabel}</Text>
                )}
              </>
            )}

            {/* Alert */}
            {detectionAlert && (
              <Animated.View style={[styles.alertCard, { opacity: alertAnim }]}>
                <GlassCard intensity={30}>
                  <View style={styles.alertContent}>
                    <View style={styles.alertDot} />
                    <Text style={styles.alertText}>{detectionAlert}</Text>
                  </View>
                </GlassCard>
              </Animated.View>
            )}
          </View>

          {/* ─── Demo mode button ─────────────────────────── */}
          {demoMode && (
            <TouchableOpacity
              onPress={() => { lightTap(); setShowDemoPanel(true); }}
              style={styles.demoBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnText}>🎯 Demo</Text>
            </TouchableOpacity>
          )}

          {/* ─── Preset indicator pill ─────────────────────────── */}
          {currentPreset !== 'normal' && (
            <Animated.View style={[styles.presetPill, { opacity: uiVisible ? 1 : 0.6 }]}>
              <Text style={styles.presetPillText}>{PRESET_LABELS[currentPreset]}</Text>
            </Animated.View>
          )}

          {/* ─── Preset flash label ────────────────────────────── */}
          {presetLabel && (
            <Animated.View pointerEvents="none" style={[styles.presetFlash, { opacity: presetOpacity }]}>
              <Text style={styles.presetFlashText}>{presetLabel}</Text>
            </Animated.View>
          )}

          {/* ─── Brightness indicator ──────────────────────────── */}
          {brightnessPct !== null && (
            <Animated.View pointerEvents="none" style={[styles.brightIndicator, { opacity: brightOpacity }]}>
              <View style={styles.brightBar}>
                <View style={[styles.brightFill, { height: `${Math.max(5, brightnessPct)}%` }]} />
              </View>
              <Text style={styles.brightText}>{brightnessPct}%</Text>
            </Animated.View>
          )}

          {/* ─── Bottom controls ───────────────────────────────── */}
          <Animated.View style={[styles.bottomControls, { opacity: uiVisible ? 1 : 0 }]}>
            <View style={styles.zoomArea}>
              <ZoomWheel zoom={zoomLevel} onZoomChange={setZoom} />
            </View>
            <View style={styles.scanButtonArea}>
              <ScanButton
                onPress={handleScan}
                onLongPress={handleLongPress}
                isScanning={isScanning}
                size={80}
              />
              {!isScanning && !showQuickScan && (
                <Text style={styles.tapHint}>Tap to scan</Text>
              )}
            </View>
            <View style={styles.flashArea}>
              <TouchableOpacity
                onPress={() => { lightTap(); resetAutoHide(); flashMode === 'off' ? setFlashMode('normal') : setFlashMode('off'); }}
                onLongPress={() => { heavyTap(); setShowUtilityPanel(true); }}
                style={[styles.flashBtn, { borderColor: flashMode !== 'off' ? colors.primary : colors.glassBorder }]}
                activeOpacity={0.7}
              >
                {flashMode !== 'off' ? <Zap size={22} color={colors.primary} /> : <ZapOff size={22} color={colors.textSecondary} />}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ─── Swipe up hint ────────────────────────────────── */}
          <Animated.View pointerEvents="none" style={[styles.swipeHint, { opacity: Animated.multiply(uiVisible ? 1 : 0, swipeHintOpacity) }]}>
            <View style={styles.swipeBar} />
          </Animated.View>
        </View>
      </CameraView>

      {/* ─── Camera Filter Overlay ─────────────────────────────── */}
      <CameraFilterOverlay />

      {/* ─── Gesture zones (transparent, over camera) ──────────── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Center: horizontal swipe for presets */}
        <View style={styles.gestureCenter} {...centerPan.panHandlers} />
        {/* Bottom: swipe up for panel */}
        <View style={styles.gestureBottom} {...bottomPan.panHandlers} />
        {/* Edges: vertical for brightness */}
        <View style={styles.gestureEdgeLeft} {...edgePan.panHandlers} />
        <View style={styles.gestureEdgeRight} {...edgePan.panHandlers} />
      </View>

      {/* ─── White Screen ──────────────────────────────────────── */}
      <WhiteScreen visible={isWhiteScreen} onClose={() => setScreenMode('normal')} color={whiteColor} />

      {/* ─── Utility Panel ──────────────────────────────────────── */}
      <UtilityPanel visible={showUtilityPanel} onClose={() => setShowUtilityPanel(false)} />

      {/* ─── Camp mode button ──────────────────────────────────── */}
      {showCampFloat && (
        <View style={styles.campFloat}>
          <CampModeButton />
        </View>
      )}

      {/* ─── Radial Menu ────────────────────────────────────────── */}
      <Modal visible={showRadial} transparent animationType="none">
        <TouchableOpacity style={styles.radialOverlay} activeOpacity={1} onPress={() => setShowRadial(false)}>
          <View style={styles.radialContainer}>
            {radialItems.map((item, i) => {
              const angle = (i / radialItems.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 110;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    lightTap(); setShowRadial(false);
                    if (item.route) router.push(item.route as any);
                    else if (item.action) item.action();
                  }}
                  style={[styles.radialItem, { transform: [{ translateX: x }, { translateY: y }] }]}
                  activeOpacity={0.7}
                >
                  <View style={styles.radialIcon}>
                    <item.icon size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.radialLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setShowRadial(false)} style={styles.radialClose} activeOpacity={0.7}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ─── Demo Mode Panel ────────────────────────────────────── */}
      <DemoModePanel visible={showDemoPanel} onClose={() => setShowDemoPanel(false)} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },

  // Scan area
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanLabel: {
    color: colors.textSecondary, fontSize: 13, fontWeight: '500',
    letterSpacing: 0.5, position: 'absolute', bottom: 40,
  },

  // Quick scan
  quickScanContainer: { alignItems: 'center', gap: 20 },
  quickScanHint: { color: colors.textSecondary, fontSize: 14, fontWeight: '500', letterSpacing: 0.3 },

  // Gesture zones
  gestureCenter: {
    position: 'absolute', top: 80, left: 60, right: 60, bottom: 160,
    zIndex: 10,
  },
  gestureBottom: {
    position: 'absolute', bottom: 0, left: 40, right: 40, height: 120,
    zIndex: 10,
  },
  gestureEdgeLeft: {
    position: 'absolute', top: 80, left: 0, width: 40, bottom: 160,
    zIndex: 10,
  },
  gestureEdgeRight: {
    position: 'absolute', top: 80, right: 0, width: 40, bottom: 160,
    zIndex: 10,
  },

  // Preset pill
  presetPill: {
    position: 'absolute', top: 50, alignSelf: 'center',
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20, backgroundColor: colors.glass,
    borderWidth: 1, borderColor: colors.glassBorder,
  },
  presetPillText: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  // Demo button
  demoBtn: {
    position: 'absolute', top: 48, right: 16,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(0,245,212,0.15)',
    borderWidth: 1, borderColor: colors.primary,
  },
  demoBtnText: { color: colors.primary, fontSize: 11, fontWeight: '700' },

  // Preset flash label
  presetFlash: {
    position: 'absolute', top: '38%', alignSelf: 'center',
  },
  presetFlashText: { color: colors.text, fontSize: 30, fontWeight: '800', letterSpacing: 1.5 },

  // Brightness indicator
  brightIndicator: {
    position: 'absolute', left: 16, top: '30%',
    alignItems: 'center', gap: 6,
  },
  brightBar: {
    width: 4, height: 120, borderRadius: 2,
    backgroundColor: colors.surface, overflow: 'hidden',
  },
  brightFill: {
    position: 'absolute', bottom: 0, width: '100%',
    borderRadius: 2, backgroundColor: colors.primary,
  },
  brightText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },

  // Bottom controls
  bottomControls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 100, paddingTop: 16,
  },
  zoomArea: { width: 50, alignItems: 'center' },
  scanButtonArea: { alignItems: 'center', gap: 8 },
  tapHint: { color: colors.textTertiary, fontSize: 10, fontWeight: '500', letterSpacing: 0.3 },
  flashArea: { width: 50, alignItems: 'center' },
  flashBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.glass, borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center', alignItems: 'center',
  },

  // Swipe hint
  swipeHint: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
  },
  swipeBar: { width: 28, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary, opacity: 0.4 },

  // Camp float
  campFloat: { position: 'absolute', bottom: 120, right: 16, zIndex: 150 },

  // Alert
  alertCard: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  alertContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  alertText: { color: colors.text, fontSize: 14, fontWeight: '600' },

  // Radial menu
  radialOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  radialContainer: { width: 260, height: 260, justifyContent: 'center', alignItems: 'center' },
  radialItem: { position: 'absolute', alignItems: 'center', gap: 4 },
  radialIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  radialLabel: { color: colors.text, fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  radialClose: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
});
