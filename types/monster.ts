export type MonsterType =
  | 'blobbsworth'
  | 'grimble'
  | 'wisper'
  | 'myco'
  | 'cindra';

export type MoodState = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'distressed';

export type EvolutionStage = 'hatchling' | 'companion' | 'elder';

export interface Monster {
  id: string;
  userId: string;
  name: string;
  type: MonsterType;
  mood: MoodState;
  hunger: number; // 0–100, 0 = full, 100 = starving
  streak: number;
  evolutionStage: EvolutionStage;
  lastFedAt: string | null; // ISO datetime
  createdAt: string;
}
