import React, { useCallback, useState, useRef as useReactRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { CameraView } from 'expo-camera';
import { Zap, ZapOff, Search, PawPrint, Map, AlertTriangle, Flashlight, Crosshair, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '../../src/theme';
import { ScanMode } from '../../src/utils/constants';
import { useDetectionStore } from '../../src/stores';
import { lightTap, mediumTap, heavyTap } from '../../src/utils/haptics';
import { useDetectionSimulation } from '../../src/hooks/useDetectionSimulation';
import { TopBar } from '../../src/components/TopBar';
import { ScanButton } from '../../src/components/ScanButton';
import { ZoomWheel } from '../../src/components/ZoomWheel';
import { DetectionOverlay } from '../../src/components/DetectionOverlay';
import { QuickScanRing } from '../../src/components/QuickScanRing';
import { GlassCard } from '../../src/components/GlassCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RadialItem {
  icon: any;
  label: string;
  route?: string;
  action?: () => void;
}

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Pet');
  const [showQuickScan, setShowQuickScan] = useState(false);
  const [quickProgress, setQuickProgress] = useState(0);
  const [detectionAlert, setDetectionAlert] = useState<string | null>(null);
  const [showRadial, setShowRadial] = useState(false);
  const alertAnim = useReactRef(new Animated.Value(0)).current;

  const {
    isScanning,
    activeDetections,
    flashEnabled,
    zoomLevel,
    toggleFlash,
    setZoom,
    setScanning,
    clearDetections,
  } = useDetectionStore();

  const { startScan, stopScan } = useDetectionSimulation();

  // ─── Scan Logic ────────────────────────────────────────────────

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

  // ─── Radial Menu ───────────────────────────────────────────────

  const handleLongPress = useCallback(() => {
    heavyTap();
    setShowRadial(true);
  }, []);

  const radialItems: RadialItem[] = [
    { icon: Map, label: 'Risk Map', route: '/risk-map' },
    { icon: PawPrint, label: 'Pet Check', route: '/pet-inspection' },
    { icon: AlertTriangle, label: 'Emergency', route: '/emergency' },
    { icon: Search, label: 'Quick Scan', action: handleQuickScan },
  ];

  // ─── Mode-specific scan label ──────────────────────────────────

  const scanLabel =
    mode === 'Pet' ? 'Scan your pet' :
    mode === 'Human' ? 'Scan skin' : 'Scan area';

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" enableTorch={flashEnabled} zoom={zoomLevel / 5}>
        <View style={styles.overlay}>
          <TopBar mode={mode} onModeChange={handleModeChange} onSettingsPress={() => router.push('/(tabs)/account')} />

          {/* Center: scan area with label */}
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
              <Animated.View style={[styles.alertCard, { opacity: alertAnim, transform: [{ translateY: alertAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
                <GlassCard intensity={30}>
                  <View style={styles.alertContent}>
                    <View style={styles.alertDot} />
                    <Text style={styles.alertText}>{detectionAlert}</Text>
                  </View>
                </GlassCard>
              </Animated.View>
            )}
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <View style={styles.zoomArea}><ZoomWheel zoom={zoomLevel} onZoomChange={setZoom} /></View>
            <View style={styles.scanButtonArea}>
              <ScanButton
                onPress={handleScan}
                onLongPress={handleLongPress}
                isScanning={isScanning}
                size={80}
              />
              {!isScanning && !showQuickScan && (
                <Text style={styles.tapHint}>Tap to scan · Hold for menu</Text>
              )}
            </View>
            <View style={styles.flashArea}>
              <TouchableOpacity onPress={() => { lightTap(); toggleFlash(); }} style={styles.flashButton} activeOpacity={0.7}>
                {flashEnabled ? <Zap size={22} color={colors.primary} /> : <ZapOff size={22} color={colors.textSecondary} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>

      {/* ─── Radial Menu Modal ───────────────────────────────────── */}
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
                    lightTap();
                    setShowRadial(false);
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
            {/* Close button at center */}
            <TouchableOpacity onPress={() => setShowRadial(false)} style={styles.radialClose} activeOpacity={0.7}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    position: 'absolute',
    bottom: 40,
  },

  quickScanContainer: { alignItems: 'center', gap: 20 },
  quickScanHint: { color: colors.textSecondary, fontSize: 14, fontWeight: '500', letterSpacing: 0.3 },

  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
  },
  zoomArea: { width: 50, alignItems: 'center' },
  scanButtonArea: { alignItems: 'center', gap: 8 },
  tapHint: { color: colors.textTertiary, fontSize: 10, fontWeight: '500', letterSpacing: 0.3 },
  flashArea: { width: 50, alignItems: 'center' },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertCard: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  alertContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  alertText: { color: colors.text, fontSize: 14, fontWeight: '600' },

  // Radial menu
  radialOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  radialContainer: { width: 260, height: 260, justifyContent: 'center', alignItems: 'center' },
  radialItem: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  radialIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  radialLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  radialClose: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
