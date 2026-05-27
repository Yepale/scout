import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme';
import { MODES, ScanMode } from '../utils/constants';
import { lightTap } from '../utils/haptics';

interface ModeSelectorProps {
  activeMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  activeMode,
  onModeChange,
}) => {
  return (
    <View style={styles.container}>
      {MODES.map((mode) => {
        const isActive = mode === activeMode;
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => {
              lightTap();
              onModeChange(mode);
            }}
            style={[styles.tab, isActive && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, isActive && styles.activeTabText]}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.glass,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 17,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: colors.bg,
  },
});
