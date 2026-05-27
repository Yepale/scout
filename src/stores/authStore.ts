import { create } from 'zustand';

export type AuthProvider = 'apple' | 'google' | 'anonymous';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  provider: AuthProvider;
}

interface AuthState {
  user: UserProfile | null;
  isSignedIn: boolean;
  showAuthSheet: boolean;

  signInAnonymously: () => void;
  signInWithApple: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
  setShowAuthSheet: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'anon_' + Date.now().toString(36),
    name: 'You',
    provider: 'anonymous',
  },
  isSignedIn: true,
  showAuthSheet: false,

  signInAnonymously: () =>
    set({
      user: { id: 'anon_' + Date.now().toString(36), name: 'You', provider: 'anonymous' },
      isSignedIn: true,
      showAuthSheet: false,
    }),
  signInWithApple: () =>
    set({
      user: { id: 'apple_' + Date.now().toString(36), name: 'Apple User', email: 'user@icloud.com', provider: 'apple' },
      isSignedIn: true,
      showAuthSheet: false,
    }),
  signInWithGoogle: () =>
    set({
      user: { id: 'google_' + Date.now().toString(36), name: 'Google User', email: 'user@gmail.com', provider: 'google' },
      isSignedIn: true,
      showAuthSheet: false,
    }),
  signOut: () =>
    set({
      user: null,
      isSignedIn: false,
    }),
  setShowAuthSheet: (v) => set({ showAuthSheet: v }),
}));
