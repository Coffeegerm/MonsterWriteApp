import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Text as UIText } from '@/components/ui/text';
import MonsterRenderer from '@/components/monsters/MonsterRenderer';
import { MonsterType } from '@/types/monster';
import { useAuthStore } from '@/stores/auth.store';
import { useMonsterStore } from '@/stores/monster.store';
import { db } from '@/services/supabase';

interface MonsterOption {
  type: MonsterType;
  name: string;
  tagline: string;
}

const MONSTER_OPTIONS: MonsterOption[] = [
  { type: 'blobbsworth', name: 'Blobbsworth', tagline: 'Friendly & encouraging' },
  { type: 'grimble', name: 'Grimble', tagline: 'Sarcastic but secretly caring' },
  { type: 'wisper', name: 'Wisper', tagline: 'Gentle and soft-spoken' },
  { type: 'myco', name: 'Myco', tagline: 'Laid-back & philosophical' },
  { type: 'cindra', name: 'Cindra', tagline: 'Excitable and fiery' },
];

export default function ChooseMonsterScreen() {
  const { session } = useAuthStore();
  const { setMonster } = useMonsterStore();
  const [selected, setSelected] = useState<MonsterType | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleChoose() {
    if (!selected || !session?.user) return;
    setLoading(true);
    try {
      const { data, error } = await db.monsters().insert({
        user_id: session.user.id,
        name: MONSTER_OPTIONS.find((m) => m.type === selected)!.name,
        type: selected,
        mood: 'happy',
        hunger: 0,
        streak: 0,
        evolution_stage: 'hatchling',
        last_fed_at: null,
      }).select().single();

      if (error) throw error;

      setMonster({
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type as MonsterType,
        mood: 'happy',
        hunger: 0,
        streak: 0,
        evolutionStage: 'hatchling',
        lastFedAt: null,
        createdAt: data.created_at,
      });

      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not save your monster. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-parchment dark:bg-inkwell">
      {/* Header */}
      <View className="px-6 pt-16 pb-4">
        <Text className="text-3xl font-bold text-inkwell dark:text-parchment">
          Choose Your Monster
        </Text>
        <Text className="mt-1 text-sm text-dusk-plum dark:text-mystic-violet">
          They'll be counting on you to write every day.
        </Text>
      </View>

      {/* Monster grid */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between gap-3">
          {MONSTER_OPTIONS.map((option) => {
            const isSelected = selected === option.type;
            return (
              <Pressable
                key={option.type}
                onPress={() => setSelected(option.type)}
                className={[
                  'w-[47%] rounded-2xl border-2 p-4 items-center',
                  isSelected
                    ? 'border-monster-green bg-monster-green/10'
                    : 'border-border bg-white dark:bg-dusk-plum',
                ].join(' ')}>
                <MonsterRenderer type={option.type} mood="happy" size={100} />
                <Text className="mt-2 text-base font-bold text-inkwell dark:text-parchment">
                  {option.name}
                </Text>
                <Text className="mt-0.5 text-center text-xs text-dusk-plum dark:text-mystic-violet">
                  {option.tagline}
                </Text>
                {isSelected && (
                  <View className="mt-2 rounded-full bg-monster-green px-3 py-0.5">
                    <Text className="text-xs font-bold text-inkwell">Selected ✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-parchment dark:bg-inkwell px-6 pb-10 pt-4 border-t border-border">
        <Button
          onPress={handleChoose}
          disabled={!selected || loading}
          className="h-14 rounded-xl bg-monster-green active:bg-monster-green/80 disabled:opacity-40">
          {loading ? (
            <ActivityIndicator color="#1A1625" />
          ) : (
            <UIText className="text-base font-bold text-inkwell">
              {selected ? `Choose ${MONSTER_OPTIONS.find(m => m.type === selected)!.name}!` : 'Pick a monster first'}
            </UIText>
          )}
        </Button>
      </View>
    </View>
  );
}
