import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Zap, ZapOff } from 'lucide-react-native';
import { colors } from '../theme';
import { ModeSelector } from './ModeSelector';
import { ScanMode } from '../utils/constants';
import { useDetectionStore } from '../stores';
import { lightTap } from '../utils/haptics';

interface TopBarProps {
  mode: ScanMode;
  onModeChange: (m: ScanMode) => void;
  onSettingsPress: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  onModeChange,
  onSettingsPress,
}) => {
  const insets = useSafeAreaInsets();
  const isScanning = useDetectionStore((s) => s.isScanning);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <ModeSelector activeMode={mode} onModeChange={onModeChange} />
        <TouchableOpacity
          onPress={() => {
            lightTap();
            onSettingsPress();
          }}
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <Settings size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      {isScanning && (
        <View style={styles.aiStatus}>
          <View style={styles.aiDot} />
          <Text style={styles.aiText}>AI scanning...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: colors.glass,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  aiText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
