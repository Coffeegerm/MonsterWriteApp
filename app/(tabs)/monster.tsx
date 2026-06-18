import { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text as UIText } from '@/components/ui/text';
import MonsterRenderer from '@/components/monsters/MonsterRenderer';
import MoodIndicator from '@/components/monsters/MoodIndicator';
import HungerBar from '@/components/monsters/HungerBar';
import { useMonsterStore } from '@/stores/monster.store';
import { useWritingStore } from '@/stores/writing.store';
import { calculateMood, calculateHunger } from '@/lib/mood-engine';

const STAGE_LABELS = { hatchling: 'Hatchling', companion: 'Companion', elder: 'Elder' };

export default function MonsterScreen() {
  const insets = useSafeAreaInsets();
  const { monster, updateMood } = useMonsterStore();
  const { todayWordCount, goalMet } = useWritingStore();

  // Recalculate mood on focus
  useEffect(() => {
    if (monster) {
      const mood = calculateMood(monster.lastFedAt, monster.streak);
      const hunger = calculateHunger(monster.lastFedAt);
      if (mood !== monster.mood || hunger !== monster.hunger) {
        updateMood(mood, hunger);
      }
    }
  }, []);

  if (!monster) {
    return (
      <View className="flex-1 items-center justify-center bg-paper dark:bg-ink">
        <Text className="font-serif text-muted-foreground">No monster yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-paper dark:bg-ink"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      contentContainerClassName="px-6 gap-6">

      {/* Monster name */}
      <Text className="text-center font-display text-4xl text-ink dark:text-paper">
        {monster.name}
      </Text>

      {/* Monster art */}
      <View className="items-center">
        <MonsterRenderer type={monster.type} mood={monster.mood} size={220} />
      </View>

      {/* Mood */}
      <View className="items-center">
        <MoodIndicator mood={monster.mood} />
      </View>

      {/* Hunger bar */}
      <View className="rounded-lg border border-border bg-surface dark:bg-ink-surface p-4">
        <HungerBar hunger={monster.hunger} />
      </View>

      {/* Stats */}
      <View className="rounded-lg border border-border bg-surface dark:bg-ink-surface p-4 gap-3">
        <Text className="font-serif text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Stats
        </Text>
        <View className="flex-row justify-between">
          <Text className="font-serif text-sm text-muted-foreground">Current streak</Text>
          <Text className="font-mono text-sm text-ink dark:text-paper">
            {monster.streak} {monster.streak === 1 ? 'day' : 'days'}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-serif text-sm text-muted-foreground">Evolution stage</Text>
          <Text className="font-serif text-sm font-semibold text-ink dark:text-paper">
            {STAGE_LABELS[monster.evolutionStage]}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-serif text-sm text-muted-foreground">Today&apos;s words</Text>
          <Text className="font-mono text-sm text-ink dark:text-paper">
            {todayWordCount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Write button — only if goal not yet met */}
      {!goalMet && (
        <Button
          onPress={() => router.push('/(tabs)/write')}
          className="h-14 rounded-lg bg-ink dark:bg-paper active:bg-ink/90 dark:active:bg-paper/90">
          <UIText className="font-serif text-base font-semibold text-paper dark:text-ink">Write now</UIText>
        </Button>
      )}
    </ScrollView>
  );
}
