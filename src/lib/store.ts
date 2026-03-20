import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AppState, GenerationStats } from '@/types';

const MAX_FREE_ATTEMPTS = 2;

interface AppStore extends AppState {
  setUser: (user: User | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGeneratedImage: (imageUrl: string | null) => void;
  setError: (error: string | null) => void;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  unlockPremium: () => void;
  getStats: () => GenerationStats;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      generatedImage: null,
      isGenerating: false,

      // Actions
      setUser: (user) => set({ user }),

      setGenerating: (isGenerating) => set({ isGenerating, isLoading: isGenerating, error: null }),

      setGeneratedImage: (imageUrl) => set({ generatedImage: imageUrl }),

      setError: (error) => set({ error, isLoading: false }),

      incrementAttempt: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              attemptsUsed: user.attemptsUsed + 1,
            },
          });
        }
      },

      resetAttempts: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              attemptsUsed: 0,
            },
          });
        }
      },

      unlockPremium: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              isPremium: true,
            },
          });
        }
      },

      getStats: () => {
        const { user } = get();
        const attemptsUsed = user?.attemptsUsed || 0;
        const isPremium = user?.isPremium || false;

        return {
          totalAttempts: attemptsUsed,
          remainingFreeAttempts: Math.max(0, MAX_FREE_ATTEMPTS - attemptsUsed),
          premiumUnlocked: isPremium,
        };
      },

      reset: () => set({
        user: null,
        isLoading: false,
        error: null,
        generatedImage: null,
        isGenerating: false,
      }),
    }),
    {
      name: 'barq-storage',
      partialize: (state) => ({
        user: state.user,
        generatedImage: state.generatedImage,
      }),
    }
  )
);