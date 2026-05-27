import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Tent } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, useSharedValue } from 'react-native-reanimated';
import { colors } from '../theme';
import { useUtilityStore } from '../stores/utilityStore';
import { mediumTap } from '../utils/haptics';

export const CampModeButton: React.FC = () => {
  const campMode = useUtilityStore((s) => s.campMode);
  const setCampMode = useUtilityStore((s) => s.setCampMode);
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: campMode ? colors.primary : colors.glass,
    borderColor: campMode ? colors.primary : colors.glassBorder,
  }));

  return (
    <Animated.View style={[styles.wrapper, rStyle]}>
      <TouchableOpacity
        onPress={() => {
          mediumTap();
          scale.value = withSpring(0.85, {}, () => { scale.value = withSpring(1); });
          setCampMode(!campMode);
        }}
        style={styles.btn}
        activeOpacity={0.8}
      >
        <Tent size={22} color={campMode ? colors.bg : colors.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
