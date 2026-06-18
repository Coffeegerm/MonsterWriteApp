import { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PenLine, Flame, Gem, CalendarDays } from 'lucide-react-native';

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
      className="flex-1 bg-paper dark:bg-ink"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      contentContainerClassName="px-5 gap-6">

      {/* User info */}
      <View>
        <Text className="font-display text-3xl text-ink dark:text-paper">
          {user?.displayName ?? 'Writer'}
        </Text>
        <Text className="font-serif text-sm text-muted-foreground">{user?.email}</Text>
        <Text className="font-serif text-xs text-muted-foreground mt-0.5">
          Member since {memberSince}
        </Text>
      </View>

      {/* Quick stats */}
      <View className="flex-row gap-3">
        <StatCard label="Total words" value={stats.totalWords} icon={PenLine} />
        <StatCard label="Current streak" value={`${stats.currentStreak}d`} icon={Flame} />
        <StatCard label="Best streak" value={`${stats.longestStreak}d`} icon={Gem} />
        <StatCard label="Days written" value={stats.totalDays} icon={CalendarDays} />
      </View>

      {/* Calendar heatmap */}
      <View className="rounded-lg border border-border bg-surface dark:bg-ink-surface p-4 gap-3">
        <Text className="font-serif text-xs uppercase tracking-[0.16em] text-muted-foreground">
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
      <View className="rounded-lg border border-border bg-surface dark:bg-ink-surface p-4 gap-3">
        <Text className="font-serif text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Badges
        </Text>
        {stats.isLoading ? (
          <ActivityIndicator />
        ) : (
          <BadgeGrid earnedBadges={stats.badges} />
        )}
      </View>

      {/* Settings */}
      <View className="rounded-lg border border-border bg-surface dark:bg-ink-surface p-4 gap-5">
        <Text className="font-serif text-xs uppercase tracking-[0.16em] text-muted-foreground">
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
          <Text className="font-serif text-xs text-muted-foreground">
            Min 100 · Max 5,000
          </Text>
        </View>

        {/* Save writing toggle */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="font-serif text-sm font-medium text-ink dark:text-paper">
              Save writing content
            </Text>
            <Text className="font-serif text-xs text-muted-foreground">
              Stores your text in the cloud. Turn off to save word counts only.
            </Text>
          </View>
          <Switch
            value={saveWriting}
            onValueChange={handleSaveWritingToggle}
            trackColor={{ false: '#D9C7A4', true: '#5E6535' }}
            thumbColor="#F0E6D1"
          />
        </View>
      </View>

      {/* Sign out */}
      <Button
        variant="destructive"
        onPress={handleSignOut}
        disabled={signingOut}
        className="h-12 rounded-lg">
        {signingOut ? (
          <ActivityIndicator color="#F0E6D1" />
        ) : (
          <UIText className="font-serif font-semibold text-paper">Sign out</UIText>
        )}
      </Button>
    </ScrollView>
  );
}
