import React, { useCallback, useState, useRef as useReactRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CameraView } from 'expo-camera';
import { Zap, ZapOff, Search } from 'lucide-react-native';
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

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Pet');
  const [showQuickScan, setShowQuickScan] = useState(false);
  const [quickProgress, setQuickProgress] = useState(0);
  const [detectionAlert, setDetectionAlert] = useState<string | null>(null);
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

  const handleScan = useCallback(() => {
    lightTap();
    if (isScanning) { stopScan(); clearDetections(); }
    else { startScan(mode); }
  }, [isScanning, mode, startScan, stopScan, clearDetections]);

  const handleQuickScan = useCallback(() => {
    mediumTap();
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

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" enableTorch={flashEnabled} zoom={zoomLevel / 5}>
        <View style={styles.overlay}>
          <TopBar mode={mode} onModeChange={handleModeChange} onSettingsPress={() => {}} />
          <View style={styles.scanArea}>
            {showQuickScan ? (
              <View style={styles.quickScanContainer}>
                <QuickScanRing progress={quickProgress} size={180} strokeWidth={5} />
                <Text style={styles.quickScanHint}>
                  {quickProgress < 0.33 ? 'Checking fur...' : quickProgress < 0.66 ? 'Scanning paws...' : quickProgress < 1 ? 'Almost done' : 'Complete'}
                </Text>
              </View>
            ) : (
              <DetectionOverlay detections={activeDetections} isScanning={isScanning} />
            )}
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
          <View style={styles.bottomControls}>
            <View style={styles.zoomArea}><ZoomWheel zoom={zoomLevel} onZoomChange={setZoom} /></View>
            <View style={styles.scanButtonArea}>
              {!showQuickScan && !isScanning && (
                <TouchableOpacity onPress={handleQuickScan} style={styles.quickScanBtn} activeOpacity={0.7}>
                  <Search size={16} color={colors.bg} />
                  <Text style={styles.quickScanBtnText}>Quick Scan</Text>
                </TouchableOpacity>
              )}
              <ScanButton onPress={handleScan} isScanning={isScanning} size={80} />
            </View>
            <View style={styles.flashArea}>
              <TouchableOpacity onPress={() => { lightTap(); toggleFlash(); }} style={styles.flashButton} activeOpacity={0.7}>
                {flashEnabled ? <Zap size={22} color={colors.primary} /> : <ZapOff size={22} color={colors.textSecondary} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  quickScanContainer: { alignItems: 'center', gap: 20 },
  quickScanHint: { color: colors.textSecondary, fontSize: 14, fontWeight: '500', letterSpacing: 0.3 },
  bottomControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 100, paddingTop: 16 },
  zoomArea: { width: 50, alignItems: 'center' },
  scanButtonArea: { alignItems: 'center', gap: 12 },
  quickScanBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  quickScanBtnText: { color: colors.bg, fontSize: 13, fontWeight: '600' },
  flashArea: { width: 50, alignItems: 'center' },
  flashButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.glassBorder, justifyContent: 'center', alignItems: 'center' },
  alertCard: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  alertContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  alertText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
