import { useCallback, useRef } from 'react';
import { useDetectionStore, useSettingsStore } from '../stores';
import {
  generateDemoScanResult,
  generateBiteAnalysis,
} from '../utils/demoData';
import { detectionFound, successNotification } from '../utils/haptics';
import { ScanMode } from '../utils/constants';

export function useDetectionSimulation() {
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addScanResult = useDetectionStore((s) => s.addScanResult);
  const setActiveDetections = useDetectionStore((s) => s.setActiveDetections);
  const setScanProgress = useDetectionStore((s) => s.setScanProgress);
  const setScanning = useDetectionStore((s) => s.setScanning);
  const setBiteAnalysis = useDetectionStore((s) => s.setBiteAnalysis);
  const demoMode = useSettingsStore((s) => s.demoMode);

  const startScan = useCallback(
    (mode: ScanMode) => {
      setScanning(true);
      setScanProgress(0);
      setActiveDetections([]);

      const duration = 5000;
      const interval = 100;
      let elapsed = 0;

      const progressInterval = setInterval(() => {
        elapsed += interval;
        const progress = Math.min(elapsed / duration, 1);
        setScanProgress(progress);

        if (Math.random() > 0.7 && elapsed % 1000 < interval) {
          const result = generateDemoScanResult(mode);
          setActiveDetections(result.detections);
          if (result.detections.length > 0) {
            detectionFound();
          }
        }

        if (progress >= 1) {
          clearInterval(progressInterval);
          const finalResult = generateDemoScanResult(mode);
          setActiveDetections(finalResult.detections);
          addScanResult(finalResult);

          if (finalResult.detections.length > 0) {
            detectionFound();
          } else {
            successNotification();
          }

          setTimeout(() => {
            setScanning(false);
          }, 1000);
        }
      }, interval);

      timeoutRef.current = progressInterval;
    },
    [addScanResult, setActiveDetections, setScanning, setScanProgress]
  );

  const analyzeBite = useCallback(() => {
    const results = generateBiteAnalysis();
    setBiteAnalysis(results);
    return results;
  }, [setBiteAnalysis]);

  const stopScan = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    setScanning(false);
    setScanProgress(0);
  }, [setScanning, setScanProgress]);

  return { startScan, analyzeBite, stopScan };
}
