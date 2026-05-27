import { create } from 'zustand';

interface PremiumState {
  isPremium: boolean;
  showPaywall: boolean;
  selectedPlan: 'monthly' | 'yearly';

  setPremium: (v: boolean) => void;
  setShowPaywall: (v: boolean) => void;
  setPlan: (p: 'monthly' | 'yearly') => void;
}

export const usePremiumStore = create<PremiumState>((set) => ({
  isPremium: false,
  showPaywall: false,
  selectedPlan: 'yearly',

  setPremium: (v) => set({ isPremium: v, showPaywall: false }),
  setShowPaywall: (v) => set({ showPaywall: v }),
  setPlan: (p) => set({ selectedPlan: p }),
}));
