import { db } from '@/services/supabase';
import { StreaksRow } from '@/types/supabase';

export async function getStreak(userId: string): Promise<StreaksRow | null> {
  const { data, error } = await db.streaks().select('*').eq('user_id', userId).single();
  if (error || !data) return null;
  return data as StreaksRow;
}

export async function updateStreak(
  userId: string,
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string
): Promise<void> {
  const { error } = await db.streaks().upsert({
    user_id: userId,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_active_date: lastActiveDate,
  });
  if (error) throw error;
}

export async function getBadges(userId: string) {
  const { data } = await db.badges().select('*').eq('user_id', userId);
  return data ?? [];
}

export async function awardBadge(userId: string, badgeType: string): Promise<void> {
  // upsert handles the unique(user_id, badge_type) constraint gracefully
  const { error } = await db.badges().upsert({ user_id: userId, badge_type: badgeType });
  if (error) throw error;
}
