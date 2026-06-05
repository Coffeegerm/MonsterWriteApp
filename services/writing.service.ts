import { db } from '@/services/supabase';
import { WritingSession } from '@/types/writing';
import { WritingSessionsRow } from '@/types/supabase';

function rowToSession(row: WritingSessionsRow): WritingSession {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    wordCount: row.word_count,
    content: row.content ?? undefined,
    createdAt: row.created_at,
  };
}

export async function saveSession(session: Omit<WritingSession, 'id' | 'createdAt'>): Promise<WritingSession> {
  const { data, error } = await db.writingSessions().insert({
    user_id: session.userId,
    date: session.date,
    word_count: session.wordCount,
    content: session.content ?? null,
  }).select().single();
  if (error) throw error;
  return rowToSession(data as WritingSessionsRow);
}

export async function getTodaySessions(userId: string, date: string): Promise<WritingSession[]> {
  const { data, error } = await db.writingSessions()
    .select('*')
    .eq('user_id', userId)
    .eq('date', date);
  if (error) return [];
  return (data as WritingSessionsRow[]).map(rowToSession);
}

export async function getSessionsInRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<WritingSession[]> {
  const { data, error } = await db.writingSessions()
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);
  if (error) return [];
  return (data as WritingSessionsRow[]).map(rowToSession);
}

export async function getTotalWordCount(userId: string): Promise<number> {
  const { data, error } = await db.writingSessions()
    .select('word_count')
    .eq('user_id', userId);
  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + row.word_count, 0);
}

export async function getTotalDaysWritten(userId: string): Promise<number> {
  const { data, error } = await db.writingSessions()
    .select('date')
    .eq('user_id', userId);
  if (error || !data) return 0;
  return new Set(data.map((r) => r.date)).size;
}
