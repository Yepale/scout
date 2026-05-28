import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useUtilityStore, CameraFilter } from '../stores/utilityStore';
import { colors } from '../theme';

const { width, height } = Dimensions.get('window');

// ─── Filter configurations ───────────────────────────────────────

interface FilterConfig {
  tintColor: string;
  tintOpacity: number;
  overlayComponent?: React.ReactNode;
  label: string;
  description: string;
}

const FILTERS: Record<CameraFilter, FilterConfig> = {
  none: { tintColor: 'transparent', tintOpacity: 0, label: 'None', description: 'No filter' },
  uv: {
    tintColor: '#6633CC',
    tintOpacity: 0.25,
    label: 'UV',
    description: 'Simulates UV light to spot ticks & fleas',
  },
  thermal: {
    tintColor: '#FF4400',
    tintOpacity: 0.15,
    label: 'Thermal',
    description: 'Heat-map style contrast',
  },
  'high-contrast': {
    tintColor: '#000000',
    tintOpacity: 0.3,
    label: 'Contrast',
    description: 'Increases edge visibility for small objects',
  },
  'edge-detect': {
    tintColor: '#FFFFFF',
    tintOpacity: 0.1,
    label: 'Edge',
    description: 'Light overlay for shape detection',
  },
  invert: {
    tintColor: '#FFFFFF',
    tintOpacity: 0.5,
    label: 'Invert',
    description: 'Inverts colors for alternative view',
  },
  sepia: {
    tintColor: '#704214',
    tintOpacity: 0.3,
    label: 'Sepia',
    description: 'Warm tone for skin analysis',
  },
  dramatic: {
    tintColor: '#1a1a2e',
    tintOpacity: 0.35,
    label: 'Dramatic',
    description: 'Crushed blacks, boosted contrast',
  },
};

interface CameraFilterOverlayProps {
  enabled?: boolean;
}

export const CameraFilterOverlay: React.FC<CameraFilterOverlayProps> = ({ enabled = true }) => {
  const cameraFilter = useUtilityStore((s) => s.cameraFilter);
  const filterIntensity = useUtilityStore((s) => s.filterIntensity);

  if (!enabled || cameraFilter === 'none') return null;

  const config = FILTERS[cameraFilter];
  const opacity = config.tintOpacity * filterIntensity;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Color tint overlay */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: config.tintColor, opacity }]} />

      {/* UV vignette effect */}
      {cameraFilter === 'uv' && (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.vignette, { borderColor: '#8844FF', opacity: 0.3 }]} />
        </View>
      )}

      {/* Thermal glow */}
      {cameraFilter === 'thermal' && (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.thermalGlow, { opacity: 0.2 }]} />
        </View>
      )}

      {/* Edge detect grid */}
      {cameraFilter === 'edge-detect' && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.gridContainer}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={`h${i}`} style={[styles.gridLineH, { top: (height / 8) * i }]} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={`v${i}`} style={[styles.gridLineV, { left: (width / 8) * i }]} />
            ))}
          </View>
        </View>
      )}

      {/* Contrast corners */}
      {cameraFilter === 'high-contrast' && (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.cornerTL, styles.corner]} />
          <View style={[styles.cornerTR, styles.corner]} />
          <View style={[styles.cornerBL, styles.corner]} />
          <View style={[styles.cornerBR, styles.corner]} />
        </View>
      )}
    </View>
  );
};

// ─── Filter helpers ──────────────────────────────────────────────

export const FILTER_LABELS: Record<CameraFilter, string> = {
  none: 'None',
  uv: 'UV',
  thermal: 'Thermal',
  'high-contrast': 'Contrast',
  'edge-detect': 'Edge',
  invert: 'Invert',
  sepia: 'Sepia',
  dramatic: 'Dramatic',
};

export const FILTER_ORDER: CameraFilter[] = [
  'none', 'uv', 'thermal', 'high-contrast', 'edge-detect', 'invert', 'sepia', 'dramatic',
];

export function getFilterConfig(filter: CameraFilter): FilterConfig {
  return FILTERS[filter];
}

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  vignette: {
    flex: 1,
    borderWidth: 40,
    borderRadius: 0,
    borderColor: '#8844FF',
    opacity: 0.3,
  },
  thermalGlow: {
    flex: 1,
    backgroundColor: '#FF4400',
    opacity: 0.2,
  },
  gridContainer: { flex: 1 },
  gridLineH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  cornerTL: { top: 20, left: 20, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 20, right: 20, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 20, left: 20, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 20, right: 20, borderBottomWidth: 2, borderRightWidth: 2 },
});
