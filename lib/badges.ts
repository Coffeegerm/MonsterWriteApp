export type BadgeType =
  | 'first_feed'
  | 'first_evolution'
  | 'streak_7'
  | 'streak_30'
  | 'words_10k'
  | 'words_50k';

export interface BadgeInfo {
  name: string;
  description: string;
  icon: string; // Lucide icon name (see components/shared/BadgeGrid.tsx)
}

export const BADGE_INFO: Record<BadgeType, BadgeInfo> = {
  first_feed: {
    name: 'First feeding',
    description: 'Fed your monster for the first time.',
    icon: 'Drumstick',
  },
  first_evolution: {
    name: 'Evolution',
    description: 'Your monster evolved for the first time.',
    icon: 'Sparkles',
  },
  streak_7: {
    name: '7-day streak',
    description: 'Wrote for 7 days in a row.',
    icon: 'Flame',
  },
  streak_30: {
    name: '30-day streak',
    description: 'Wrote for 30 days in a row.',
    icon: 'Gem',
  },
  words_10k: {
    name: '10,000 words',
    description: 'Written 10,000 total words.',
    icon: 'BookOpen',
  },
  words_50k: {
    name: '50,000 words',
    description: 'Written 50,000 total words. A novel\'s worth.',
    icon: 'Trophy',
  },
};

export interface UserStats {
  totalWordCount: number;
  currentStreak: number;
  hasEverFed: boolean;
  hasEverEvolved: boolean;
}

export function getBadgeInfo(type: BadgeType): BadgeInfo {
  return BADGE_INFO[type];
}

/**
 * Returns badge types that are newly earned (not already in existingBadges).
 */
export function checkNewBadges(
  stats: UserStats,
  existingBadges: string[]
): BadgeType[] {
  const earned: BadgeType[] = [];

  const check = (type: BadgeType, condition: boolean) => {
    if (condition && !existingBadges.includes(type)) {
      earned.push(type);
    }
  };

  check('first_feed', stats.hasEverFed);
  check('first_evolution', stats.hasEverEvolved);
  check('streak_7', stats.currentStreak >= 7);
  check('streak_30', stats.currentStreak >= 30);
  check('words_10k', stats.totalWordCount >= 10_000);
  check('words_50k', stats.totalWordCount >= 50_000);

  return earned;
}
