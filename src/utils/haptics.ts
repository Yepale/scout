import * as Haptics from 'expo-haptics';

export const lightTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const mediumTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export const heavyTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

export const detectionFound = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

export const successNotification = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const errorNotification = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
