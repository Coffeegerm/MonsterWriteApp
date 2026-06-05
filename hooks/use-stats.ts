import { useState, useEffect } from 'react';
import { db } from '@/services/supabase';
import { useAuthStore } from '@/stores/auth.store';
import { getDateRange, getToday } from '@/lib/date';

interface DayStats {
  date: string;
  wordCount: number;
  goalMet: boolean;
}

interface Stats {
  totalWords: number;
  totalDays: number;
  longestStreak: number;
  currentStreak: number;
  heatmapData: DayStats[];
  badges: { badge_type: string; earned_at: string }[];
  isLoading: boolean;
}

export function useStats(): Stats {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalWords: 0,
    totalDays: 0,
    longestStreak: 0,
    currentStreak: 0,
    heatmapData: [],
    badges: [],
    isLoading: true,
  });

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user?.id]);

  async function loadStats() {
    if (!user) return;

    const today = getToday();
    const startDate = getDateRange(today, 1)[0];
    // 84 days back for 12-week heatmap
    const heatmapStart = new Date(today + 'T00:00:00');
    heatmapStart.setDate(heatmapStart.getDate() - 83);
    const heatmapStartStr = heatmapStart.toISOString().slice(0, 10);

    const [sessionsRes, streakRes, badgesRes] = await Promise.all([
      db.writingSessions()
        .select('date, word_count')
        .eq('user_id', user.id)
        .gte('date', heatmapStartStr),
      db.streaks().select('*').eq('user_id', user.id).single(),
      db.badges().select('badge_type, earned_at').eq('user_id', user.id),
    ]);

    const sessions = sessionsRes.data ?? [];
    const streak = streakRes.data;
    const badges = badgesRes.data ?? [];

    // Aggregate by date
    const byDate = new Map<string, number>();
    for (const s of sessions) {
      byDate.set(s.date, (byDate.get(s.date) ?? 0) + s.word_count);
    }

    const dailyGoal = user.dailyGoal ?? 500;
    const heatmapData: DayStats[] = Array.from(byDate.entries()).map(([date, wordCount]) => ({
      date,
      wordCount,
      goalMet: wordCount >= dailyGoal,
    }));

    // All-time totals (separate query)
    const { data: allSessions } = await db.writingSessions()
      .select('date, word_count')
      .eq('user_id', user.id);

    const allByDate = new Map<string, number>();
    for (const s of allSessions ?? []) {
      allByDate.set(s.date, (allByDate.get(s.date) ?? 0) + s.word_count);
    }
    const totalWords = Array.from(allByDate.values()).reduce((sum, w) => sum + w, 0);
    const totalDays = allByDate.size;

    setStats({
      totalWords,
      totalDays,
      longestStreak: streak?.longest_streak ?? 0,
      currentStreak: streak?.current_streak ?? 0,
      heatmapData,
      badges,
      isLoading: false,
    });
  }

  return stats;
}
