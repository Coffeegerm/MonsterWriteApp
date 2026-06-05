export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  dailyGoal: number; // default: 500, user-configurable
  saveWriting: boolean; // whether to persist writing content
  notificationTime: string | null; // HH:MM format, null = disabled
  createdAt: string;
}
