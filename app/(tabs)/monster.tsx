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
      <View className="flex-1 items-center justify-center bg-parchment dark:bg-inkwell">
        <Text className="text-dusk-plum dark:text-mystic-violet">No monster yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-parchment dark:bg-inkwell"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
      contentContainerClassName="px-6 gap-6">

      {/* Monster name */}
      <Text className="text-center text-3xl font-bold text-inkwell dark:text-parchment">
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
      <View className="rounded-2xl bg-white dark:bg-dusk-plum p-4">
        <HungerBar hunger={monster.hunger} />
      </View>

      {/* Stats */}
      <View className="rounded-2xl bg-white dark:bg-dusk-plum p-4 gap-3">
        <Text className="text-sm font-semibold text-dusk-plum dark:text-mystic-violet uppercase tracking-wide">
          Stats
        </Text>
        <View className="flex-row justify-between">
          <Text className="text-sm text-dusk-plum dark:text-mystic-violet">Current streak</Text>
          <Text className="text-sm font-bold text-inkwell dark:text-parchment">
            {monster.streak} {monster.streak === 1 ? 'day' : 'days'}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-dusk-plum dark:text-mystic-violet">Evolution stage</Text>
          <Text className="text-sm font-bold text-inkwell dark:text-parchment">
            {STAGE_LABELS[monster.evolutionStage]}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-dusk-plum dark:text-mystic-violet">Today's words</Text>
          <Text className="text-sm font-bold text-inkwell dark:text-parchment">
            {todayWordCount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Write Now button — only if goal not yet met */}
      {!goalMet && (
        <Button
          onPress={() => router.push('/(tabs)/write')}
          className="h-14 rounded-xl bg-monster-green active:bg-monster-green/80">
          <UIText className="text-base font-bold text-inkwell">Write Now</UIText>
        </Button>
      )}
    </ScrollView>
  );
}
