import { MoodState } from '@/types/monster';
import { daysBetween, getToday } from '@/lib/date';

/**
 * Calculates the monster's current mood based on feeding history.
 *
 * Fed today → "ecstatic" (streak >= 7) or "happy"
 * 1 day missed → "neutral"
 * 2–3 days missed → "sad"
 * 4+ days missed → "distressed"
 */
export function calculateMood(
  lastFedAt: string | null,
  currentStreak: number
): MoodState {
  if (!lastFedAt) return 'sad';

  const lastFedDate = lastFedAt.slice(0, 10); // YYYY-MM-DD
  const today = getToday();
  const daysMissed = daysBetween(lastFedDate, today);

  if (daysMissed === 0) {
    return currentStreak >= 7 ? 'ecstatic' : 'happy';
  }
  if (daysMissed === 1) return 'neutral';
  if (daysMissed <= 3) return 'sad';
  return 'distressed';
}

/**
 * Calculates hunger on a 0–100 scale.
 * Increases ~20 per missed day, capped at 100.
 */
export function calculateHunger(lastFedAt: string | null): number {
  if (!lastFedAt) return 60;

  const lastFedDate = lastFedAt.slice(0, 10);
  const today = getToday();
  const daysMissed = daysBetween(lastFedDate, today);

  if (daysMissed === 0) return 0;
  return Math.min(daysMissed * 20, 100);
}
