import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { MoodState } from '@/types/monster';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_ID = 'daily-writing-reminder';

const MOOD_MESSAGES: Record<MoodState, string> = {
  ecstatic: 'Your monster is thriving! Keep the streak alive today. 🌟',
  happy: "Your monster is well-fed! Keep the streak going today.",
  neutral: "Time to write! Your monster is waiting.",
  sad: "Your monster is getting hungry... come write!",
  distressed: "Your monster really misses you! Even a few words help. 😭",
};

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(
  timeHHMM: string,
  mood: MoodState
): Promise<void> {
  // Cancel any existing reminder first
  await cancelDailyReminder();

  const [hourStr, minuteStr] = timeHHMM.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (isNaN(hour) || isNaN(minute)) return;

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: "Time to feed your monster! 🐾",
      body: MOOD_MESSAGES[mood],
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
}

export async function rescheduleWithMood(
  timeHHMM: string | null,
  mood: MoodState
): Promise<void> {
  if (!timeHHMM) {
    await cancelDailyReminder();
    return;
  }
  const hasPermission = await requestNotificationPermissions();
  if (hasPermission) {
    await scheduleDailyReminder(timeHHMM, mood);
  }
}
