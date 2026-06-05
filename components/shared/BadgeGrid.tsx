import { View, Text } from 'react-native';
import { BadgeType, getBadgeInfo, BADGE_INFO } from '@/lib/badges';

interface BadgeGridProps {
  earnedBadges: { badge_type: string; earned_at: string }[];
}

export default function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const earnedTypes = new Set(earnedBadges.map((b) => b.badge_type));
  const allBadgeTypes = Object.keys(BADGE_INFO) as BadgeType[];

  return (
    <View className="flex-row flex-wrap gap-3">
      {allBadgeTypes.map((type) => {
        const info = getBadgeInfo(type);
        const earned = earnedBadges.find((b) => b.badge_type === type);
        const isEarned = earnedTypes.has(type);

        return (
          <View
            key={type}
            className={[
              'w-[30%] items-center rounded-2xl p-3 gap-1',
              isEarned
                ? 'bg-white dark:bg-dusk-plum'
                : 'bg-gray-100 dark:bg-dusk-plum/40',
            ].join(' ')}>
            <Text style={{ fontSize: 28, opacity: isEarned ? 1 : 0.3 }}>{info.icon}</Text>
            <Text
              className={[
                'text-center text-xs font-semibold',
                isEarned ? 'text-inkwell dark:text-parchment' : 'text-gray-400',
              ].join(' ')}>
              {isEarned ? info.name : '???'}
            </Text>
            {earned && (
              <Text className="text-center text-[10px] text-dusk-plum dark:text-mystic-violet">
                {new Date(earned.earned_at).toLocaleDateString()}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
