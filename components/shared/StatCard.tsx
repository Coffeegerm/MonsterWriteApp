import { View, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  const scheme = useColorScheme() ?? 'light';
  return (
    <View className="flex-1 items-center rounded-lg border border-border bg-surface dark:bg-ink-surface px-3 py-4 gap-1">
      {Icon && <Icon size={20} strokeWidth={2} color={Colors[scheme].accent} />}
      <Text className="font-mono text-xl text-ink dark:text-paper">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      <Text className="text-center font-serif text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}
