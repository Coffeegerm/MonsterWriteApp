export interface WritingSession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  wordCount: number;
  content?: string; // null if user opted out of saving
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  totalWordCount: number;
  goalMet: boolean;
  sessions: WritingSession[];
}
