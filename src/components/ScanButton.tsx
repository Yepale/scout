import React, { useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme';
import { lightTap } from '../utils/haptics';

interface ScanButtonProps {
  onPress: () => void;
  isScanning: boolean;
  size?: number;
}

export const ScanButton: React.FC<ScanButtonProps> = ({
  onPress,
  isScanning,
  size = 80,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isScanning) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isScanning]);

  const handlePress = useCallback(() => {
    lightTap();
    onPress();
  }, [onPress]);

  const innerSize = size - 16;
  const dotSize = isScanning ? 12 : 20;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulseAnim }],
            borderColor: isScanning ? colors.primary : colors.borderActive,
          },
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: isScanning ? colors.primary : 'transparent',
              borderColor: isScanning ? colors.primaryDark : colors.primary,
            },
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: isScanning ? colors.bg : colors.primary,
              },
            ]}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  dot: {},
});
