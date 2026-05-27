import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { lightTap } from '../utils/haptics';

interface ZoomWheelProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 10;
const STEP = 0.5;

export const ZoomWheel: React.FC<ZoomWheelProps> = ({ zoom, onZoomChange }) => {
  const zoomIn = useCallback(() => {
    lightTap();
    onZoomChange(Math.min(MAX_ZOOM, zoom + STEP));
  }, [zoom, onZoomChange]);

  const zoomOut = useCallback(() => {
    lightTap();
    onZoomChange(Math.max(MIN_ZOOM, zoom - STEP));
  }, [zoom, onZoomChange]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={zoomIn} style={styles.button} activeOpacity={0.6}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{zoom.toFixed(1)}x</Text>
        <View style={styles.indicator}>
          <View
            style={[
              styles.indicatorFill,
              {
                height: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity onPress={zoomOut} style={styles.button} activeOpacity={0.6}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '300',
  },
  valueContainer: {
    alignItems: 'center',
    gap: 4,
  },
  value: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  indicator: {
    width: 3,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1.5,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  indicatorFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
});
