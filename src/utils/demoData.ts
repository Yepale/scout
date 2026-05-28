import { BITE_TYPES } from './constants';

export interface DemoDetection {
  id: string;
  type: 'tick' | 'flea' | 'bite' | 'parasite' | 'clear';
  label: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  x: number;
  y: number;
  timestamp: number;
}

export interface DemoBiteResult {
  type: string;
  probability: number;
}

export interface DemoScanResult {
  id: string;
  date: Date;
  mode: string;
  detections: DemoDetection[];
  biteResults?: DemoBiteResult[];
  imageUri?: string;
}

export type DemoScenario =
  | 'tick-dog'
  | 'flea-cat'
  | 'tick-human'
  | 'bite-reaction'
  | 'multiple-ticks'
  | 'clear-pet'
  | 'flea-dirt'
  | 'lyme-rash';

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const scenarios: Record<DemoScenario, {
  mode: string;
  detections: Omit<DemoDetection, 'id' | 'timestamp' | 'x' | 'y'>[];
  description: string;
}> = {
  'tick-dog': {
    mode: 'Pet',
    description: 'Tick behind ear on golden retriever',
    detections: [
      { type: 'tick', label: 'Deer tick (Ixodes scapularis) behind ear', confidence: 94, severity: 'high' },
    ],
  },
  'flea-cat': {
    mode: 'Pet',
    description: 'Flea movement on cat belly',
    detections: [
      { type: 'flea', label: 'Flea activity detected — lower abdomen', confidence: 88, severity: 'medium' },
      { type: 'parasite', label: 'Flea dirt (excrement) found', confidence: 79, severity: 'medium' },
    ],
  },
  'tick-human': {
    mode: 'Human',
    description: 'Tick on ankle after hike',
    detections: [
      { type: 'tick', label: 'Lone Star tick (Amblyomma americanum) on ankle', confidence: 91, severity: 'high' },
    ],
  },
  'bite-reaction': {
    mode: 'Human',
    description: 'Red ring rash — possible Lyme',
    detections: [
      { type: 'bite', label: 'Erythema migrans (bullseye rash) — monitor closely', confidence: 86, severity: 'high' },
      { type: 'bite', label: 'Localized swelling 3cm diameter', confidence: 73, severity: 'medium' },
    ],
  },
  'multiple-ticks': {
    mode: 'Pet',
    description: 'Multiple ticks on dog after woods',
    detections: [
      { type: 'tick', label: 'Engorged tick — neck area', confidence: 96, severity: 'high' },
      { type: 'tick', label: 'Nymph tick — front paw', confidence: 84, severity: 'medium' },
      { type: 'flea', label: 'Possible flea near tail', confidence: 61, severity: 'low' },
    ],
  },
  'clear-pet': {
    mode: 'Pet',
    description: 'Clean bill — no detections',
    detections: [],
  },
  'flea-dirt': {
    mode: 'Pet',
    description: 'Flea dirt on dog bed',
    detections: [
      { type: 'parasite', label: 'Flea dirt (digested blood) — characteristic black specks', confidence: 82, severity: 'medium' },
    ],
  },
  'lyme-rash': {
    mode: 'Human',
    description: 'Classic Lyme bullseye expanding rash',
    detections: [
      { type: 'bite', label: 'Target lesion with central clearing — EM rash', confidence: 92, severity: 'high' },
    ],
  },
};

const generateDemoDetections = (mode: string): DemoDetection[] => {
  if (mode === 'Pet') {
    return [
      {
        id: 'd1',
        type: 'tick',
        label: 'Possible tick detected',
        confidence: 87,
        severity: 'medium',
        x: randomBetween(0.2, 0.8),
        y: randomBetween(0.2, 0.6),
        timestamp: Date.now(),
      },
      {
        id: 'd2',
        type: 'flea',
        label: 'Movement pattern found',
        confidence: 72,
        severity: 'low',
        x: randomBetween(0.3, 0.7),
        y: randomBetween(0.5, 0.9),
        timestamp: Date.now(),
      },
    ];
  }
  if (mode === 'Human') {
    return [
      {
        id: 'd3',
        type: 'bite',
        label: 'Suspicious area detected',
        confidence: 81,
        severity: 'low',
        x: randomBetween(0.2, 0.8),
        y: randomBetween(0.2, 0.8),
        timestamp: Date.now(),
      },
    ];
  }
  return [
    {
      id: 'd4',
      type: 'parasite',
      label: 'Possible flea dirt found',
      confidence: 65,
      severity: 'low',
      x: randomBetween(0.3, 0.7),
      y: randomBetween(0.3, 0.7),
      timestamp: Date.now(),
    },
  ];
};

export const SCENARIOS = Object.entries(scenarios).map(([key, val]) => ({
  id: key as DemoScenario,
  ...val,
}));

export function generateScenarioDetections(scenario: DemoScenario): DemoDetection[] {
  const s = scenarios[scenario];
  return s.detections.map((d, i) => ({
    ...d,
    id: `sc_${scenario}_${i}`,
    x: randomBetween(0.25, 0.75),
    y: randomBetween(0.2, 0.8),
    timestamp: Date.now(),
  }));
}

export function getScenarioMode(scenario: DemoScenario): string {
  return scenarios[scenario].mode;
}

export const generateDemoScanResult = (mode: string): DemoScanResult => {
  return {
    id: `scan_${Date.now()}`,
    date: new Date(),
    mode,
    detections: generateDemoDetections(mode),
  };
};

export const generateBiteAnalysis = (scenario?: DemoScenario) => {
  const types = [...BITE_TYPES];
  const results = types.map((type) => ({
    type,
    probability: Math.round(randomBetween(0, 100)),
  }));
  results.sort((a, b) => b.probability - a.probability);

  // If scenario, boost the relevant type
  if (scenario === 'bite-reaction' || scenario === 'lyme-rash') {
    const lyme = results.find((r) => r.type.toLowerCase().includes('lyme'));
    if (lyme) lyme.probability = Math.min(97, lyme.probability + 40);
  }

  return results;
};

export const demoHistoryData = (): DemoScanResult[] => {
  const modes = ['Pet', 'Human', 'Home'];
  return Array.from({ length: 7 }, (_, i) => ({
    id: `scan_${i}`,
    date: new Date(Date.now() - i * 86400000),
    mode: modes[i % 3],
    detections: i % 2 === 0 ? generateDemoDetections(modes[i % 3]) : [],
    imageUri: undefined,
  }));
};

export const EVOLUTION_DATA = [
  { day: 'Mon', swelling: 8.2 },
  { day: 'Tue', swelling: 7.5 },
  { day: 'Wed', swelling: 6.1 },
  { day: 'Thu', swelling: 4.3 },
  { day: 'Fri', swelling: 2.8 },
  { day: 'Sat', swelling: 1.5 },
  { day: 'Sun', swelling: 0.6 },
];

export const RISK_MAP_POINTS = [
  { x: 0.2, y: 0.3, risk: 0.9 },
  { x: 0.5, y: 0.2, risk: 0.7 },
  { x: 0.7, y: 0.6, risk: 0.5 },
  { x: 0.3, y: 0.7, risk: 0.8 },
  { x: 0.8, y: 0.4, risk: 0.4 },
  { x: 0.4, y: 0.5, risk: 0.6 },
  { x: 0.6, y: 0.8, risk: 0.3 },
  { x: 0.1, y: 0.6, risk: 0.2 },
];
