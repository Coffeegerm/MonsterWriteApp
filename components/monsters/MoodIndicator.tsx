import { View, Text } from 'react-native';
import { MoodState } from '@/types/monster';
import { MoodColors } from '@/constants/theme';

const MOOD_LABELS: Record<MoodState, string> = {
  ecstatic: 'Flourishing',
  happy: 'Content',
  neutral: 'Getting by',
  sad: 'Hungry',
  distressed: 'Fading',
};

interface MoodIndicatorProps {
  mood: MoodState;
}

export default function MoodIndicator({ mood }: MoodIndicatorProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-surface dark:bg-ink-surface border border-border px-4 py-2">
      <View
        style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: MoodColors[mood] }}
      />
      <Text className="font-serif text-base text-ink dark:text-paper">{MOOD_LABELS[mood]}</Text>
    </View>
  );
}
