import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Monster, MoodState } from '@/types/monster';
import { mmkvStorage } from '@/lib/mmkv-storage';
import { getToday } from '@/lib/date';

interface MonsterState {
  monster: Monster | null;
  isFeedingAnimation: boolean;
  setMonster: (monster: Monster | null) => void;
  feedMonster: () => void;
  updateMood: (mood: MoodState, hunger: number) => void;
  clearMonster: () => void;
}

export const useMonsterStore = create<MonsterState>()(
  persist(
    (set) => ({
      monster: null,
      isFeedingAnimation: false,
      setMonster: (monster) => set({ monster }),
      feedMonster: () =>
        set((state) => {
          if (!state.monster) return {};
          const newStreak = state.monster.streak + 1;
          const evolutionStage =
            newStreak >= 30
              ? 'elder'
              : newStreak >= 7
                ? 'companion'
                : 'hatchling';
          return {
            isFeedingAnimation: true,
            monster: {
              ...state.monster,
              mood: newStreak >= 7 ? 'ecstatic' : 'happy',
              hunger: 0,
              streak: newStreak,
              evolutionStage,
              lastFedAt: new Date().toISOString(),
            },
          };
        }),
      updateMood: (mood, hunger) =>
        set((state) => ({
          monster: state.monster ? { ...state.monster, mood, hunger } : null,
          isFeedingAnimation: false,
        })),
      clearMonster: () => set({ monster: null, isFeedingAnimation: false }),
    }),
    {
      name: 'monster-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
