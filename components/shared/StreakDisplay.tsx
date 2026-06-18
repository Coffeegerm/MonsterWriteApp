import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { BrandColors } from '@/constants/theme';

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const active = streak > 0;
  return (
    <View className="flex-row items-center gap-2">
      <Flame
        size={22}
        strokeWidth={2}
        color={active ? BrandColors.brass : '#9A8868'}
        fill={active ? BrandColors.brass : 'transparent'}
      />
      <Text className="font-serif text-base text-ink dark:text-paper">
        {active ? `${streak} day streak` : 'Start your streak'}
      </Text>
    </View>
  );
}
