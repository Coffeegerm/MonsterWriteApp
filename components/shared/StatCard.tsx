import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  emoji?: string;
}

export default function StatCard({ label, value, emoji }: StatCardProps) {
  return (
    <View className="flex-1 items-center rounded-2xl bg-white dark:bg-dusk-plum px-3 py-4 gap-1">
      {emoji && <Text style={{ fontSize: 22 }}>{emoji}</Text>}
      <Text className="text-xl font-bold text-inkwell dark:text-parchment">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      <Text className="text-center text-xs text-dusk-plum dark:text-mystic-violet">{label}</Text>
    </View>
  );
}
