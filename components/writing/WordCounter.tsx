import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { BrandColors } from '@/constants/theme';

interface WordCounterProps {
  todayWordCount: number;
  sessionWordCount: number;
  dailyGoal: number;
}

export default function WordCounter({ todayWordCount, sessionWordCount, dailyGoal }: WordCounterProps) {
  const progress = Math.min(todayWordCount / dailyGoal, 1);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 300 });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  const barColor =
    progress >= 1
      ? BrandColors.monsterGreen
      : progress >= 0.25
        ? BrandColors.hungryOrange
        : BrandColors.sadBlue;

  return (
    <View className="gap-1.5 px-4 pb-2 pt-1">
      {/* Progress bar */}
      <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dusk-plum">
        <Animated.View
          style={[progressStyle, { backgroundColor: barColor, height: '100%', borderRadius: 9999 }]}
        />
      </View>
      {/* Counts */}
      <View className="flex-row justify-between">
        <Text className="text-xs text-dusk-plum dark:text-mystic-violet">
          Session: {sessionWordCount} words
        </Text>
        <Text className="text-xs font-medium text-inkwell dark:text-parchment">
          {todayWordCount} / {dailyGoal} today
        </Text>
      </View>
    </View>
  );
}
