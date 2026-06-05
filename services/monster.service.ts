import { db } from '@/services/supabase';
import { Monster, MonsterType } from '@/types/monster';
import { MonstersRow } from '@/types/supabase';

function rowToMonster(row: MonstersRow): Monster {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type as MonsterType,
    mood: row.mood as Monster['mood'],
    hunger: row.hunger,
    streak: row.streak,
    evolutionStage: row.evolution_stage as Monster['evolutionStage'],
    lastFedAt: row.last_fed_at,
    createdAt: row.created_at,
  };
}

export async function createMonster(
  userId: string,
  type: MonsterType,
  name: string
): Promise<Monster> {
  const { data, error } = await db.monsters().insert({
    userId,
    type,
    name,
    mood: 'happy',
    hunger: 0,
    streak: 0,
    evolution_stage: 'hatchling',
    last_fed_at: null,
  }).select().single();
  if (error) throw error;
  return rowToMonster(data as MonstersRow);
}

export async function getMonster(userId: string): Promise<Monster | null> {
  const { data, error } = await db.monsters().select('*').eq('user_id', userId).single();
  if (error || !data) return null;
  return rowToMonster(data as MonstersRow);
}

export async function updateMonster(
  monsterId: string,
  updates: Partial<MonstersRow>
): Promise<void> {
  const { error } = await db.monsters().update(updates).eq('id', monsterId);
  if (error) throw error;
}

export async function feedMonster(monsterId: string, newStreak: number): Promise<void> {
  const evolutionStage =
    newStreak >= 30 ? 'elder' : newStreak >= 7 ? 'companion' : 'hatchling';
  const { error } = await db.monsters().update({
    mood: newStreak >= 7 ? 'ecstatic' : 'happy',
    hunger: 0,
    streak: newStreak,
    evolution_stage: evolutionStage,
    last_fed_at: new Date().toISOString(),
  }).eq('id', monsterId);
  if (error) throw error;
}
