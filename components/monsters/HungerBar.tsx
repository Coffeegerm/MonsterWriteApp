import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { BrandColors } from '@/constants/theme';

interface HungerBarProps {
  hunger: number; // 0-100
}

export default function HungerBar({ hunger }: HungerBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(hunger / 100, { duration: 500 });
  }, [hunger]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const barColor =
    hunger <= 30
      ? BrandColors.olive
      : hunger <= 70
        ? BrandColors.terracotta
        : BrandColors.oxblood;

  const label = hunger === 0 ? 'Full' : hunger <= 30 ? 'Content' : hunger <= 70 ? 'Peckish' : 'Starving';

  return (
    <View className="w-full gap-1.5">
      <View className="flex-row justify-between">
        <Text className="font-serif text-sm text-muted-foreground">Hunger</Text>
        <Text className="font-serif text-sm font-medium text-ink dark:text-paper">{label}</Text>
      </View>
      <View className="h-3 w-full overflow-hidden rounded-full bg-border">
        <Animated.View
          style={[barStyle, { backgroundColor: barColor, height: '100%', borderRadius: 9999 }]}
        />
      </View>
    </View>
  );
}
