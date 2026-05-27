import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Circle as SvgCircle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../theme';
import { DemoDetection } from '../utils/demoData';
import { RadarPulse } from './RadarPulse';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DetectionOverlayProps {
  detections: DemoDetection[];
  isScanning: boolean;
}

const DetectionCircle: React.FC<{ detection: DemoDetection }> = ({ detection }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.6,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const size = 60 + detection.confidence * 0.4;
  const x = detection.x * SCREEN_WIDTH;
  const y = detection.y * SCREEN_HEIGHT;

  return (
    <Animated.View
      style={[
        styles.detectionCircle,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor:
            detection.severity === 'high'
              ? colors.error
              : detection.severity === 'medium'
              ? colors.warning
              : colors.primary,
          opacity: fadeAnim,
        },
      ]}
    >
      <SvgCircle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1}
        stroke={
          detection.severity === 'high'
            ? colors.error
            : detection.severity === 'medium'
            ? colors.warning
            : colors.primary
        }
        strokeWidth={1.5}
        strokeDasharray="4,4"
        fill="none"
        opacity={0.4}
      />
      <View style={styles.detectionLabel}>
        <Text style={styles.detectionConfidence}>
          {detection.confidence}%
        </Text>
      </View>
    </Animated.View>
  );
};

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  detections,
  isScanning,
}) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <RadarPulse active={isScanning} size={160} color={colors.primary} />
      {detections.map((d) => (
        <DetectionCircle key={d.id} detection={d} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...(StyleSheet.absoluteFill as object),
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectionCircle: {
    position: 'absolute',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectionLabel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  detectionConfidence: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },
});
