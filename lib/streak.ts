import { EvolutionStage } from '@/types/monster';
import { isYesterday, isSameDay } from '@/lib/date';

export function calculateStreak(
  lastActiveDate: string | null,
  today: string
): { current: number; isActive: boolean } {
  if (!lastActiveDate) {
    return { current: 0, isActive: false };
  }
  if (isSameDay(lastActiveDate, today)) {
    return { current: 1, isActive: true };
  }
  if (isYesterday(lastActiveDate)) {
    return { current: 1, isActive: false }; // streak continues if fed today
  }
  // Gap of 2+ days — streak would reset
  return { current: 0, isActive: false };
}

export function getEvolutionStage(streak: number): EvolutionStage {
  if (streak >= 30) return 'elder';
  if (streak >= 7) return 'companion';
  return 'hatchling';
}

export function shouldEvolve(oldStreak: number, newStreak: number): boolean {
  return getEvolutionStage(oldStreak) !== getEvolutionStage(newStreak);
}
