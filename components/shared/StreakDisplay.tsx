import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { BrandColors } from '@/constants/theme';

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Flame
        size={22}
        color={streak > 0 ? BrandColors.hungryOrange : '#9BA1A6'}
        fill={streak > 0 ? BrandColors.hungryOrange : 'transparent'}
      />
      <Text className="text-base font-semibold text-inkwell dark:text-parchment">
        {streak > 0 ? `${streak} day streak` : 'Start your streak!'}
      </Text>
    </View>
  );
}
