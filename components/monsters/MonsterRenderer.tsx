import React from 'react';
import { MonsterType, MoodState } from '@/types/monster';
import Blobbsworth from '@/assets/monsters/blobbsworth';
import Grimble from '@/assets/monsters/grimble';
import Wisper from '@/assets/monsters/wisper';
import Myco from '@/assets/monsters/myco';
import Cindra from '@/assets/monsters/cindra';

interface MonsterRendererProps {
  type: MonsterType;
  mood: MoodState;
  size?: number;
}

const MONSTERS: Record<MonsterType, React.ComponentType<{ mood: MoodState; size?: number }>> = {
  blobbsworth: Blobbsworth,
  grimble: Grimble,
  wisper: Wisper,
  myco: Myco,
  cindra: Cindra,
};

export default function MonsterRenderer({ type, mood, size = 200 }: MonsterRendererProps) {
  const Monster = MONSTERS[type];
  return <Monster mood={mood} size={size} />;
}
