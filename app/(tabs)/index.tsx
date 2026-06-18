import { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Text as UIText } from '@/components/ui/text';
import ProgressRing from '@/components/shared/ProgressRing';
import StreakDisplay from '@/components/shared/StreakDisplay';
import MonsterPreview from '@/components/monsters/MonsterPreview';
import { useAuthStore } from '@/stores/auth.store';
import { useMonsterStore } from '@/stores/monster.store';
import { useWritingStore } from '@/stores/writing.store';
import { calculateMood, calculateHunger } from '@/lib/mood-engine';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { monster, updateMood } = useMonsterStore();
  const { todayWordCount, dailyGoal, goalMet } = useWritingStore();

  // Recalculate mood on mount in case days have passed since last open
  useEffect(() => {
    if (monster) {
      const mood = calculateMood(monster.lastFedAt, monster.streak);
      const hunger = calculateHunger(monster.lastFedAt);
      if (mood !== monster.mood || hunger !== monster.hunger) {
        updateMood(mood, hunger);
      }
    }
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const ctaLabel = goalMet
    ? 'Goal complete'
    : todayWordCount > 0
      ? 'Keep writing'
      : 'Start writing';

  return (
    <ScrollView
      className="flex-1 bg-paper dark:bg-ink"
      contentContainerClassName="px-6 pt-14 pb-10 gap-8">

      {/* Greeting */}
      <View>
        <Text className="font-display text-3xl text-ink dark:text-paper">
          {greeting()}, {user?.displayName ?? 'Writer'}
        </Text>
        <Text className="mt-0.5 font-serif text-sm text-muted-foreground">{today}</Text>
      </View>

      {/* Monster preview */}
      {monster && (
        <View className="items-center">
          <MonsterPreview monster={monster} size={140} />
        </View>
      )}

      {/* Progress ring */}
      <View className="items-center gap-2">
        <ProgressRing wordCount={todayWordCount} goal={dailyGoal} size={180} />
        <Text className="font-serif text-xs text-muted-foreground">
          {goalMet ? 'Monster fed for today.' : "Today's progress"}
        </Text>
      </View>

      {/* Streak */}
      <View className="items-center">
        <StreakDisplay streak={monster?.streak ?? 0} />
      </View>

      {/* CTA */}
      <Button
        onPress={() => router.push('/(tabs)/write')}
        disabled={goalMet}
        className="h-14 rounded-lg bg-ink dark:bg-paper active:bg-ink/90 dark:active:bg-paper/90 disabled:opacity-40">
        <UIText className="font-serif text-base font-semibold text-paper dark:text-ink">{ctaLabel}</UIText>
      </Button>
    </ScrollView>
  );
}
