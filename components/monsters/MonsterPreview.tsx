import { View, Text } from 'react-native';
import MonsterRenderer from '@/components/monsters/MonsterRenderer';
import { Monster } from '@/types/monster';

const MOOD_LABELS: Record<string, string> = {
  ecstatic: '🌟 Ecstatic!',
  happy: '😊 Happy',
  neutral: '😐 Doing okay',
  sad: '😢 Hungry...',
  distressed: '😭 Very hungry!',
};

interface MonsterPreviewProps {
  monster: Monster;
  size?: number;
}

export default function MonsterPreview({ monster, size = 120 }: MonsterPreviewProps) {
  return (
    <View className="items-center gap-1">
      <MonsterRenderer type={monster.type} mood={monster.mood} size={size} />
      <Text className="text-base font-bold text-inkwell dark:text-parchment">{monster.name}</Text>
      <Text className="text-xs text-dusk-plum dark:text-mystic-violet">
        {MOOD_LABELS[monster.mood] ?? monster.mood}
      </Text>
    </View>
  );
}
