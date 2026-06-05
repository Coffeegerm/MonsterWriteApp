import { useCallback, useEffect, useRef } from 'react';
import { useWritingStore } from '@/stores/writing.store';
import { useMonsterStore } from '@/stores/monster.store';
import { useAuthStore } from '@/stores/auth.store';
import { countWords } from '@/lib/word-counter';
import { getToday } from '@/lib/date';
import { checkNewBadges } from '@/lib/badges';
import { db } from '@/services/supabase';

export function useWritingSession() {
  const { user } = useAuthStore();
  const { monster, feedMonster } = useMonsterStore();
  const {
    todayWordCount,
    dailyGoal,
    goalMet,
    currentSessionContent,
    setContent,
    addWords,
    saveSession,
    setOnGoalMet,
  } = useWritingStore();

  const lastWordCount = useRef(countWords(currentSessionContent));

  // Wire the auto-feed callback once
  useEffect(() => {
    setOnGoalMet(() => handleGoalMet);
    return () => setOnGoalMet(null);
  }, [monster, user]);

  async function handleGoalMet() {
    feedMonster();

    if (!user || !monster) return;

    // Persist session to Supabase
    const content = useWritingStore.getState().currentSessionContent;
    const wordCount = countWords(content);
    const today = getToday();

    const sessionData = {
      user_id: user.id,
      date: today,
      word_count: wordCount,
      content: user.saveWriting ? content : null,
    };

    const { data } = await db.writingSessions().insert(sessionData).select().single();

    if (data) {
      saveSession({
        id: data.id,
        userId: data.user_id,
        date: data.date,
        wordCount: data.word_count,
        content: data.content ?? undefined,
        createdAt: data.created_at,
      });
    }

    // Update monster in Supabase
    await db.monsters().update({
      mood: monster.streak >= 7 ? 'ecstatic' : 'happy',
      hunger: 0,
      streak: monster.streak + 1,
      last_fed_at: new Date().toISOString(),
    }).eq('id', monster.id);

    // Badge check
    const { data: badges } = await db.badges().select('badge_type').eq('user_id', user.id);
    const existingBadges = (badges ?? []).map((b) => b.badge_type);
    const { data: sessions } = await db.writingSessions()
      .select('word_count')
      .eq('user_id', user.id);
    const totalWords = (sessions ?? []).reduce((sum, s) => sum + s.word_count, 0);

    const newBadges = checkNewBadges(
      {
        totalWordCount: totalWords,
        currentStreak: monster.streak + 1,
        hasEverFed: true,
        hasEverEvolved: monster.evolutionStage !== 'hatchling',
      },
      existingBadges
    );

    for (const badge of newBadges) {
      await db.badges().insert({ user_id: user.id, badge_type: badge });
    }
  }

  const handleTextChange = useCallback(
    (text: string) => {
      setContent(text);
      const newCount = countWords(text);
      const delta = newCount - lastWordCount.current;
      if (delta > 0) {
        addWords(delta);
      }
      lastWordCount.current = newCount;
    },
    [setContent, addWords]
  );

  return {
    content: currentSessionContent,
    todayWordCount,
    dailyGoal,
    goalMet,
    handleTextChange,
  };
}
