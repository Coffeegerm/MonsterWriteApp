import { View, Text } from 'react-native';
import { MoodState } from '@/types/monster';

const MOOD_CONFIG: Record<MoodState, { emoji: string; label: string; colorClass: string }> = {
  ecstatic: { emoji: '🌟', label: 'Ecstatic!', colorClass: 'text-monster-green' },
  happy: { emoji: '😊', label: 'Happy', colorClass: 'text-monster-green' },
  neutral: { emoji: '😐', label: 'Doing okay', colorClass: 'text-happy-gold' },
  sad: { emoji: '😢', label: 'Hungry...', colorClass: 'text-sad-blue' },
  distressed: { emoji: '😭', label: 'Very hungry!', colorClass: 'text-hungry-orange' },
};

interface MoodIndicatorProps {
  mood: MoodState;
}

export default function MoodIndicator({ mood }: MoodIndicatorProps) {
  const config = MOOD_CONFIG[mood];
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-white dark:bg-dusk-plum px-4 py-2">
      <Text style={{ fontSize: 20 }}>{config.emoji}</Text>
      <Text className={`text-base font-semibold ${config.colorClass}`}>{config.label}</Text>
    </View>
  );
}
