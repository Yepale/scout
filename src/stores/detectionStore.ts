import { create } from 'zustand';
import { DemoDetection, DemoScanResult, DemoBiteResult } from '../utils/demoData';

interface DetectionState {
  isScanning: boolean;
  scanProgress: number;
  activeDetections: DemoDetection[];
  scanResults: DemoScanResult[];
  currentBiteAnalysis: DemoBiteResult[] | null;
  quickScanActive: boolean;
  flashEnabled: boolean;
  zoomLevel: number;

  setScanning: (v: boolean) => void;
  setScanProgress: (v: number) => void;
  setActiveDetections: (d: DemoDetection[]) => void;
  addDetection: (d: DemoDetection) => void;
  clearDetections: () => void;
  addScanResult: (r: DemoScanResult) => void;
  setBiteAnalysis: (b: DemoBiteResult[] | null) => void;
  setQuickScan: (v: boolean) => void;
  toggleFlash: () => void;
  setZoom: (z: number) => void;
  clearAll: () => void;
}

export const useDetectionStore = create<DetectionState>((set) => ({
  isScanning: false,
  scanProgress: 0,
  activeDetections: [],
  scanResults: [],
  currentBiteAnalysis: null,
  quickScanActive: false,
  flashEnabled: false,
  zoomLevel: 1,

  setScanning: (v) => set({ isScanning: v }),
  setScanProgress: (v) => set({ scanProgress: v }),
  setActiveDetections: (d) => set({ activeDetections: d }),
  addDetection: (d) =>
    set((s) => ({ activeDetections: [...s.activeDetections, d] })),
  clearDetections: () => set({ activeDetections: [] }),
  addScanResult: (r) =>
    set((s) => ({ scanResults: [r, ...s.scanResults].slice(0, 50) })),
  setBiteAnalysis: (b) => set({ currentBiteAnalysis: b }),
  setQuickScan: (v) => set({ quickScanActive: v }),
  toggleFlash: () => set((s) => ({ flashEnabled: !s.flashEnabled })),
  setZoom: (z) => set({ zoomLevel: Math.max(1, Math.min(10, z)) }),
  clearAll: () =>
    set({
      isScanning: false,
      scanProgress: 0,
      activeDetections: [],
      currentBiteAnalysis: null,
      quickScanActive: false,
    }),
}));
