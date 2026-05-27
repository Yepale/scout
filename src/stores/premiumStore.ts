import { create } from 'zustand';

export type PlanTier = 'free' | 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'none' | 'active' | 'trial' | 'expired' | 'cancelled';

interface PremiumState {
  // Current plan
  tier: PlanTier;
  status: SubscriptionStatus;
  trialDaysLeft: number;
  expiryDate: string | null;

  // Feature gates
  historyLimitDays: number;
  maxPets: number;
  hasCloudBackup: boolean;
  hasRiskMaps: boolean;
  hasVetReports: boolean;
  hasAlerts: boolean;

  // UI state
  showPaywall: boolean;
  selectedPlan: 'monthly' | 'yearly' | 'lifetime';

  // Actions
  setPlan: (tier: PlanTier) => void;
  startTrial: () => void;
  cancelSubscription: () => void;
  setShowPaywall: (v: boolean) => void;
  setSelectedPlan: (p: 'monthly' | 'yearly' | 'lifetime') => void;
}

export const PLAN_FEATURES = {
  free: {
    label: 'Free',
    price: 0,
    period: null,
    historyDays: 1,
    maxPets: 1,
    cloud: false,
    riskMaps: false,
    vetReports: false,
    alerts: false,
  },
  monthly: {
    label: 'Premium Monthly',
    price: 4.99,
    period: 'month',
    historyDays: 365,
    maxPets: 5,
    cloud: true,
    riskMaps: true,
    vetReports: true,
    alerts: true,
  },
  yearly: {
    label: 'Premium Annual',
    price: 29.99,
    period: 'year',
    historyDays: 9999,
    maxPets: 10,
    cloud: true,
    riskMaps: true,
    vetReports: true,
    alerts: true,
  },
  lifetime: {
    label: 'Premium Lifetime',
    price: 79.99,
    period: null,
    historyDays: 9999,
    maxPets: 20,
    cloud: true,
    riskMaps: true,
    vetReports: true,
    alerts: true,
  },
} as const;

export const usePremiumStore = create<PremiumState>((set) => ({
  tier: 'free',
  status: 'none',
  trialDaysLeft: 7,
  expiryDate: null,

  historyLimitDays: 1,
  maxPets: 1,
  hasCloudBackup: false,
  hasRiskMaps: false,
  hasVetReports: false,
  hasAlerts: false,

  showPaywall: false,
  selectedPlan: 'yearly',

  setPlan: (tier) => {
    const f = PLAN_FEATURES[tier];
    set({
      tier,
      status: 'active',
      historyLimitDays: f.historyDays,
      maxPets: f.maxPets,
      hasCloudBackup: f.cloud,
      hasRiskMaps: f.riskMaps,
      hasVetReports: f.vetReports,
      hasAlerts: f.alerts,
      showPaywall: false,
      trialDaysLeft: 0,
    });
  },
  startTrial: () =>
    set({
      tier: 'yearly',
      status: 'trial',
      trialDaysLeft: 7,
      historyLimitDays: PLAN_FEATURES.yearly.historyDays,
      maxPets: PLAN_FEATURES.yearly.maxPets,
      hasCloudBackup: PLAN_FEATURES.yearly.cloud,
      hasRiskMaps: PLAN_FEATURES.yearly.riskMaps,
      hasVetReports: PLAN_FEATURES.yearly.vetReports,
      hasAlerts: PLAN_FEATURES.yearly.alerts,
      showPaywall: false,
    }),
  cancelSubscription: () => set({ status: 'cancelled' }),
  setShowPaywall: (v) => set({ showPaywall: v }),
  setSelectedPlan: (p) => set({ selectedPlan: p }),
}));
