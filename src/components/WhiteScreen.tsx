import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface WhiteScreenProps {
  visible: boolean;
  onClose: () => void;
  color?: string; // '#FFFFFF', '#FF4444', '#00FF44', '#4466FF'
}

export const WhiteScreen: React.FC<WhiteScreenProps> = ({
  visible,
  onClose,
  color = '#FFFFFF',
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <TouchableOpacity onPress={onClose} style={styles.close} activeOpacity={0.7}>
        <View style={styles.closeBtn}>
          <X size={24} color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  close: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
