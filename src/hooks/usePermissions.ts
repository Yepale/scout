import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { Camera } from 'expo-camera';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'blocked';

export interface PermissionInfo {
  key: string;
  label: string;
  description: string;
  icon: string;
  status: PermissionStatus;
  request: () => Promise<boolean>;
  isRequired?: boolean;
}

export function usePermissions() {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>('undetermined');
  const [notificationStatus, setNotificationStatus] = useState<PermissionStatus>('undetermined');

  const checkCamera = useCallback(async () => {
    try { const p = await Camera.getCameraPermissionsAsync(); setCameraStatus(p.granted ? 'granted' : (p.canAskAgain ? 'denied' : 'blocked')); }
    catch { setCameraStatus('undetermined'); }
  }, []);

  const checkNotifications = useCallback(async () => {
    try {
      const { getPermissionsAsync } = await import('expo-notifications');
      const p = await getPermissionsAsync();
      setNotificationStatus(p.granted ? 'granted' : (p.canAskAgain ? 'denied' : 'blocked'));
    } catch { setNotificationStatus('undetermined'); }
  }, []);

  const requestCamera = useCallback(async () => {
    try {
      const p = await Camera.requestCameraPermissionsAsync();
      setCameraStatus(p.granted ? 'granted' : 'denied');
      return p.granted;
    } catch { return false; }
  }, []);

  const requestNotifications = useCallback(async () => {
    try {
      const { requestPermissionsAsync } = await import('expo-notifications');
      const p = await requestPermissionsAsync();
      setNotificationStatus(p.granted ? 'granted' : 'denied');
      return p.granted;
    } catch { return false; }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => { checkCamera(); checkNotifications(); }, []);

  const permissions: PermissionInfo[] = [
    {
      key: 'camera',
      label: 'Camera',
      description: 'Live scanning for ticks, fleas, and parasites',
      icon: '📷',
      status: cameraStatus,
      request: requestCamera,
      isRequired: true,
    },
    {
      key: 'notifications',
      label: 'Notifications',
      description: 'Bite check alarms, tips, and risk alerts',
      icon: '🔔',
      status: notificationStatus,
      request: requestNotifications,
    },
  ];

  return { permissions, refresh: () => { checkCamera(); checkNotifications(); }, openSettings };
}
