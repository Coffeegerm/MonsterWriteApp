import { View, Text } from 'react-native';
import { BookOpen, Drumstick, Flame, Gem, Sparkles, Trophy, type LucideIcon } from 'lucide-react-native';
import { BadgeType, getBadgeInfo, BADGE_INFO } from '@/lib/badges';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ICONS: Record<string, LucideIcon> = {
  Drumstick,
  Sparkles,
  Flame,
  Gem,
  BookOpen,
  Trophy,
};

interface BadgeGridProps {
  earnedBadges: { badge_type: string; earned_at: string }[];
}

export default function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const scheme = useColorScheme() ?? 'light';
  const earnedTypes = new Set(earnedBadges.map((b) => b.badge_type));
  const allBadgeTypes = Object.keys(BADGE_INFO) as BadgeType[];

  return (
    <View className="flex-row flex-wrap gap-3">
      {allBadgeTypes.map((type) => {
        const info = getBadgeInfo(type);
        const earned = earnedBadges.find((b) => b.badge_type === type);
        const isEarned = earnedTypes.has(type);
        const Icon = ICONS[info.icon] ?? Trophy;

        return (
          <View
            key={type}
            className={[
              'w-[30%] items-center rounded-lg border border-border p-3 gap-1.5',
              isEarned ? 'bg-surface dark:bg-ink-surface' : 'bg-muted',
            ].join(' ')}>
            <Icon
              size={26}
              strokeWidth={2}
              color={isEarned ? Colors[scheme].accent : Colors[scheme].tabIconDefault}
            />
            <Text
              className={[
                'text-center font-serif text-xs',
                isEarned ? 'text-ink dark:text-paper' : 'text-muted-foreground',
              ].join(' ')}>
              {isEarned ? info.name : '???'}
            </Text>
            {earned && (
              <Text className="text-center font-mono text-[10px] text-muted-foreground">
                {new Date(earned.earned_at).toLocaleDateString()}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
