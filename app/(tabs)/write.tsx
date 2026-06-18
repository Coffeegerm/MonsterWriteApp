import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WordCounter from '@/components/writing/WordCounter';
import GoalReachedOverlay from '@/components/writing/GoalReachedOverlay';
import { useWritingSession } from '@/hooks/use-writing-session';
import { countWords } from '@/lib/word-counter';
import { getToday } from '@/lib/date';
import { useMonsterStore } from '@/stores/monster.store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WriteScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const { isFeedingAnimation } = useMonsterStore();
  const [showOverlay, setShowOverlay] = useState(false);
  const wasGoalMet = useRef(false);

  const { content, todayWordCount, dailyGoal, goalMet, handleTextChange } = useWritingSession();

  // Show overlay exactly once when goal is crossed
  const sessionWordCount = countWords(content);

  if (goalMet && !wasGoalMet.current) {
    wasGoalMet.current = true;
    // Delay slightly so state has settled
    setTimeout(() => setShowOverlay(true), 100);
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-paper dark:bg-ink"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>

      {/* Top bar */}
      <View
        style={{ paddingTop: insets.top + 8 }}
        className="flex-row items-center justify-between px-4 pb-2 border-b border-border">
        <Text className="font-serif text-sm font-medium text-muted-foreground">{today}</Text>
        <Text className="font-mono text-sm text-ink dark:text-paper">
          {sessionWordCount} words this session
        </Text>
      </View>

      {/* Progress bar */}
      <WordCounter
        todayWordCount={todayWordCount}
        sessionWordCount={sessionWordCount}
        dailyGoal={dailyGoal}
      />

      {/* Editor */}
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <TextInput
          className="flex-1 px-5 py-4 font-mono text-base leading-relaxed text-ink dark:text-paper"
          style={{ color: Colors[colorScheme].text, minHeight: 400 }}
          multiline
          autoFocus
          textAlignVertical="top"
          placeholder="Start writing to feed your monster..."
          placeholderTextColor={colorScheme === 'dark' ? '#9A8868' : '#7A6A50'}
          value={content}
          onChangeText={handleTextChange}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={{ paddingBottom: insets.bottom + 8 }}
        className="flex-row items-center justify-center border-t border-border px-4 pt-2">
        <Text className="font-mono text-sm text-muted-foreground">
          {todayWordCount} / {dailyGoal} words today
          {goalMet ? ' · complete' : ''}
        </Text>
      </View>

      {/* Goal celebration overlay */}
      <GoalReachedOverlay
        visible={showOverlay}
        onDismiss={() => setShowOverlay(false)}
      />
    </KeyboardAvoidingView>
  );
}
