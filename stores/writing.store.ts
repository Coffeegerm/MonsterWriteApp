import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WritingSession } from '@/types/writing';
import { mmkvStorage } from '@/lib/mmkv-storage';

interface WritingState {
  todayWordCount: number;
  dailyGoal: number;
  goalMet: boolean;
  sessions: WritingSession[];
  currentSessionContent: string;
  // Callback wired up by the writing session hook to trigger auto-feed
  onGoalMet: (() => void) | null;
  setOnGoalMet: (cb: (() => void) | null) => void;
  addWords: (count: number) => void;
  setContent: (text: string) => void;
  saveSession: (session: WritingSession) => void;
  resetDay: () => void;
  loadTodayProgress: (wordCount: number, sessions: WritingSession[]) => void;
  setDailyGoal: (goal: number) => void;
}

export const useWritingStore = create<WritingState>()(
  persist(
    (set, get) => ({
      todayWordCount: 0,
      dailyGoal: 500,
      goalMet: false,
      sessions: [],
      currentSessionContent: '',
      onGoalMet: null,
      setOnGoalMet: (cb) => set({ onGoalMet: cb }),
      addWords: (count) =>
        set((state) => {
          const newCount = state.todayWordCount + count;
          const wasMetBefore = state.goalMet;
          const isMetNow = newCount >= state.dailyGoal;
          if (isMetNow && !wasMetBefore) {
            // Trigger auto-feed after state update
            setTimeout(() => get().onGoalMet?.(), 0);
          }
          return { todayWordCount: newCount, goalMet: isMetNow };
        }),
      setContent: (text) => set({ currentSessionContent: text }),
      saveSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      resetDay: () =>
        set({
          todayWordCount: 0,
          goalMet: false,
          sessions: [],
          currentSessionContent: '',
        }),
      loadTodayProgress: (wordCount, sessions) =>
        set((state) => ({
          todayWordCount: wordCount,
          goalMet: wordCount >= state.dailyGoal,
          sessions,
        })),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
    }),
    {
      name: 'writing-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        todayWordCount: state.todayWordCount,
        dailyGoal: state.dailyGoal,
        goalMet: state.goalMet,
        sessions: state.sessions,
        currentSessionContent: state.currentSessionContent,
      }),
    }
  )
);
