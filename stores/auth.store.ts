import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/user';
import { mmkvStorage } from '@/lib/mmkv-storage';

interface AuthState {
  session: Session | null;
  user: UserProfile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: UserProfile | null) => void;
  updateDailyGoal: (goal: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isLoading: false,
      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      updateDailyGoal: (goal) =>
        set((state) => ({
          user: state.user ? { ...state.user, dailyGoal: goal } : null,
        })),
      clearAuth: () => set({ session: null, user: null, isLoading: false }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
