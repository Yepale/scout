export const APP_NAME = 'Scout';
export const TAGLINE = 'See what hides.';
export const SCAN_DURATION_MS = 15000;
export const SPLASH_DURATION_MS = 1500;
export const DETECTION_ANIMATION_MS = 800;
export const MODES = ['Pet', 'Human', 'Home'] as const;
export type ScanMode = (typeof MODES)[number];

export const BITE_TYPES = [
  'mosquito',
  'flea',
  'tick',
  'spider',
  'bed bug',
  'irritation/allergy',
] as const;

export const PET_BODY_PARTS = [
  'ears',
  'neck',
  'paws',
  'belly',
  'tail',
] as const;
