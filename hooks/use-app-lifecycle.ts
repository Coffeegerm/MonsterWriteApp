import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '@/stores/auth.store';
import { useMonsterStore } from '@/stores/monster.store';
import { useWritingStore } from '@/stores/writing.store';
import { calculateMood, calculateHunger } from '@/lib/mood-engine';
import { getToday, isYesterday, isSameDay } from '@/lib/date';
import { checkNewBadges } from '@/lib/badges';
import { getMonster } from '@/services/monster.service';
import { getTodaySessions, getTotalWordCount } from '@/services/writing.service';
import { getStreak, updateStreak, getBadges, awardBadge } from '@/services/streak.service';
import { rescheduleWithMood } from '@/services/notifications.service';

export function useAppLifecycle() {
  const { user, session } = useAuthStore();
  const { monster, setMonster, updateMood, feedMonster } = useMonsterStore();
  const { resetDay, loadTodayProgress, setDailyGoal } = useWritingStore();
  const lastActiveDate = useRef<string | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Initial sync on auth ready
  useEffect(() => {
    if (session && user) {
      syncOnLaunch();
    }
  }, [session?.access_token, user?.id]);

  // Foreground detection
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        checkDayChange();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [monster, user]);

  async function syncOnLaunch() {
    if (!user) return;

    const today = getToday();
    lastActiveDate.current = today;

    // Fetch latest from Supabase
    const [remoteMonster, todaySessions, streakRow] = await Promise.all([
      getMonster(user.id),
      getTodaySessions(user.id, today),
      getStreak(user.id),
    ]);

    if (remoteMonster) {
      // Recalculate mood based on remote state
      const mood = calculateMood(remoteMonster.lastFedAt, remoteMonster.streak);
      const hunger = calculateHunger(remoteMonster.lastFedAt);
      setMonster({ ...remoteMonster, mood, hunger });
    }

    // Reconcile writing progress (take higher of local vs remote)
    const remoteTotal = todaySessions.reduce((sum, s) => sum + s.wordCount, 0);
    const localTotal = useWritingStore.getState().todayWordCount;
    const bestTotal = Math.max(remoteTotal, localTotal);

    if (bestTotal > 0) {
      loadTodayProgress(bestTotal, todaySessions);
    }

    if (user.dailyGoal) {
      setDailyGoal(user.dailyGoal);
    }

    // Reschedule notifications with updated mood
    if (remoteMonster) {
      const mood = calculateMood(remoteMonster.lastFedAt, remoteMonster.streak);
      rescheduleWithMood(user.notificationTime, mood);
    }
  }

  async function checkDayChange() {
    if (!user || !monster) return;

    const today = getToday();
    if (lastActiveDate.current && isSameDay(lastActiveDate.current, today)) return;

    const previousDate = lastActiveDate.current;
    lastActiveDate.current = today;

    // New day detected
    const streakRow = await getStreak(user.id);
    const lastActive = streakRow?.last_active_date ?? null;

    let newStreak = 0;
    let longestStreak = streakRow?.longest_streak ?? 0;

    if (previousDate && (isSameDay(previousDate, today) || isYesterday(previousDate ?? ''))) {
      // Yesterday's goal was met (monster was fed) — streak continues
      if (monster.lastFedAt && isYesterday(monster.lastFedAt.slice(0, 10))) {
        newStreak = (streakRow?.current_streak ?? 0) + 1;
      }
    }
    // Otherwise streak resets to 0

    longestStreak = Math.max(longestStreak, newStreak);
    await updateStreak(user.id, newStreak, longestStreak, today);

    // Reset writing store for the new day
    resetDay();

    // Recalculate mood (missed a day resets it)
    const mood = calculateMood(monster.lastFedAt, newStreak);
    const hunger = calculateHunger(monster.lastFedAt);
    updateMood(mood, hunger);

    // Badge check for streak milestones
    const totalWords = await getTotalWordCount(user.id);
    const existingBadges = (await getBadges(user.id)).map((b) => b.badge_type);
    const newBadges = checkNewBadges(
      {
        totalWordCount: totalWords,
        currentStreak: newStreak,
        hasEverFed: monster.lastFedAt !== null,
        hasEverEvolved: monster.evolutionStage !== 'hatchling',
      },
      existingBadges
    );
    for (const badge of newBadges) {
      await awardBadge(user.id, badge);
    }

    // Reschedule notification with new mood
    rescheduleWithMood(user.notificationTime, mood);
  }
}
