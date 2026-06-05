// Mirror the Supabase table schemas as Row types (snake_case matches DB column names)

export interface UsersRow {
  id: string;
  email: string;
  display_name: string;
  daily_goal: number;
  save_writing: boolean;
  notification_time: string | null;
  created_at: string;
}

export interface MonstersRow {
  id: string;
  user_id: string;
  name: string;
  type: string;
  mood: string;
  hunger: number;
  streak: number;
  evolution_stage: string;
  last_fed_at: string | null;
  created_at: string;
}

export interface WritingSessionsRow {
  id: string;
  user_id: string;
  date: string;
  word_count: number;
  content: string | null;
  created_at: string;
}

export interface StreaksRow {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export interface BadgesRow {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
}

export type Database = {
  public: {
    Tables: {
      users: { Row: UsersRow; Insert: Omit<UsersRow, 'created_at'>; Update: Partial<UsersRow>; Relationships: never[] };
      monsters: { Row: MonstersRow; Insert: Omit<MonstersRow, 'id' | 'created_at'>; Update: Partial<MonstersRow>; Relationships: never[] };
      writing_sessions: { Row: WritingSessionsRow; Insert: Omit<WritingSessionsRow, 'id' | 'created_at'>; Update: Partial<WritingSessionsRow>; Relationships: never[] };
      streaks: { Row: StreaksRow; Insert: Omit<StreaksRow, 'id'>; Update: Partial<StreaksRow>; Relationships: never[] };
      badges: { Row: BadgesRow; Insert: Omit<BadgesRow, 'id' | 'earned_at'>; Update: Partial<BadgesRow>; Relationships: never[] };
    };
  };
};
