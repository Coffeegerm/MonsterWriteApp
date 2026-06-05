import { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text as UIText } from '@/components/ui/text';
import StatCard from '@/components/shared/StatCard';
import BadgeGrid from '@/components/shared/BadgeGrid';
import CalendarHeatmap from '@/components/shared/CalendarHeatmap';
import { useAuthStore } from '@/stores/auth.store';
import { useMonsterStore } from '@/stores/monster.store';
import { useWritingStore } from '@/stores/writing.store';
import { useStats } from '@/hooks/use-stats';
import { signOut, updateUserProfile } from '@/services/auth.service';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateDailyGoal, clearAuth } = useAuthStore();
  const { clearMonster } = useMonsterStore();
  const { setDailyGoal, resetDay } = useWritingStore();
  const stats = useStats();

  const [goalInput, setGoalInput] = useState(String(user?.dailyGoal ?? 500));
  const [saveWriting, setSaveWriting] = useState(user?.saveWriting ?? true);
  const [signingOut, setSigningOut] = useState(false);

  async function handleGoalChange(value: string) {
    setGoalInput(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 100 && num <= 5000) {
      updateDailyGoal(num);
      setDailyGoal(num);
      if (user) {
        await updateUserProfile(user.id, { daily_goal: num });
      }
    }
  }

  async function handleSaveWritingToggle(value: boolean) {
    setSaveWriting(value);
    if (user) {
      await updateUserProfile(user.id, { save_writing: value });
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
            clearAuth();
            clearMonster();
            resetDay();
            router.replace('/(auth)/sign-in');
          } catch {
            Alert.alert('Error', 'Could not sign out. Please try again.');
            setSigningOut(false);
          }
        },
      },
    ]);
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <ScrollView
      className="flex-1 bg-parchment dark:bg-inkwell"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      contentContainerClassName="px-5 gap-6">

      {/* User info */}
      <View>
        <Text className="text-2xl font-bold text-inkwell dark:text-parchment">
          {user?.displayName ?? 'Writer'}
        </Text>
        <Text className="text-sm text-dusk-plum dark:text-mystic-violet">{user?.email}</Text>
        <Text className="text-xs text-dusk-plum dark:text-mystic-violet mt-0.5">
          Member since {memberSince}
        </Text>
      </View>

      {/* Quick stats */}
      <View className="flex-row gap-3">
        <StatCard label="Total Words" value={stats.totalWords} emoji="✍️" />
        <StatCard label="Current Streak" value={`${stats.currentStreak}d`} emoji="🔥" />
        <StatCard label="Best Streak" value={`${stats.longestStreak}d`} emoji="💎" />
        <StatCard label="Days Written" value={stats.totalDays} emoji="📅" />
      </View>

      {/* Calendar heatmap */}
      <View className="rounded-2xl bg-white dark:bg-dusk-plum p-4 gap-3">
        <Text className="text-sm font-semibold text-dusk-plum dark:text-mystic-violet uppercase tracking-wide">
          Writing History
        </Text>
        {stats.isLoading ? (
          <ActivityIndicator />
        ) : (
          <CalendarHeatmap
            data={stats.heatmapData}
            dailyGoal={user?.dailyGoal ?? 500}
          />
        )}
      </View>

      {/* Badges */}
      <View className="rounded-2xl bg-white dark:bg-dusk-plum p-4 gap-3">
        <Text className="text-sm font-semibold text-dusk-plum dark:text-mystic-violet uppercase tracking-wide">
          Badges
        </Text>
        {stats.isLoading ? (
          <ActivityIndicator />
        ) : (
          <BadgeGrid earnedBadges={stats.badges} />
        )}
      </View>

      {/* Settings */}
      <View className="rounded-2xl bg-white dark:bg-dusk-plum p-4 gap-5">
        <Text className="text-sm font-semibold text-dusk-plum dark:text-mystic-violet uppercase tracking-wide">
          Settings
        </Text>

        {/* Daily goal */}
        <View className="gap-1.5">
          <Input
            label="Daily word goal"
            value={goalInput}
            onChangeText={handleGoalChange}
            keyboardType="number-pad"
          />
          <Text className="text-xs text-dusk-plum dark:text-mystic-violet">
            Min 100 · Max 5,000
          </Text>
        </View>

        {/* Save writing toggle */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-sm font-medium text-inkwell dark:text-parchment">
              Save writing content
            </Text>
            <Text className="text-xs text-dusk-plum dark:text-mystic-violet">
              Stores your text in the cloud. Turn off to save word counts only.
            </Text>
          </View>
          <Switch
            value={saveWriting}
            onValueChange={handleSaveWritingToggle}
            trackColor={{ false: '#D1D5DB', true: '#5BF178' }}
            thumbColor="white"
          />
        </View>
      </View>

      {/* Sign out */}
      <Button
        variant="destructive"
        onPress={handleSignOut}
        disabled={signingOut}
        className="h-12 rounded-xl">
        {signingOut ? (
          <ActivityIndicator color="white" />
        ) : (
          <UIText className="font-semibold text-white">Sign Out</UIText>
        )}
      </Button>
    </ScrollView>
  );
}
