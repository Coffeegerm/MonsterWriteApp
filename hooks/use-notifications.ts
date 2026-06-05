import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useMonsterStore } from '@/stores/monster.store';
import { requestNotificationPermissions, rescheduleWithMood } from '@/services/notifications.service';

export function useNotifications() {
  const { user } = useAuthStore();
  const { monster } = useMonsterStore();

  // Request permissions on first mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Reschedule whenever mood or notification time changes
  useEffect(() => {
    if (monster && user?.notificationTime !== undefined) {
      rescheduleWithMood(user.notificationTime, monster.mood);
    }
  }, [monster?.mood, user?.notificationTime]);
}
