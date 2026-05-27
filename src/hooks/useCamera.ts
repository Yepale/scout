import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';

export function useCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  return {
    permission,
    facing,
    cameraRef,
    toggleFacing,
    isReady: permission?.granted ?? false,
  };
}
