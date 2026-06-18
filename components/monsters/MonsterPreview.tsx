import { View, Text } from 'react-native';
import MonsterRenderer from '@/components/monsters/MonsterRenderer';
import { Monster } from '@/types/monster';

const MOOD_LABELS: Record<string, string> = {
  ecstatic: 'Flourishing',
  happy: 'Content',
  neutral: 'Getting by',
  sad: 'Hungry',
  distressed: 'Fading',
};

interface MonsterPreviewProps {
  monster: Monster;
  size?: number;
}

export default function MonsterPreview({ monster, size = 120 }: MonsterPreviewProps) {
  return (
    <View className="items-center gap-1">
      <MonsterRenderer type={monster.type} mood={monster.mood} size={size} />
      <Text className="font-display text-lg text-ink dark:text-paper">{monster.name}</Text>
      <Text className="font-serif text-xs text-muted-foreground">
        {MOOD_LABELS[monster.mood] ?? monster.mood}
      </Text>
    </View>
  );
}
