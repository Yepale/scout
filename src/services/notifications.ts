import { Platform } from 'react-native';

let Notifications: any = null;
let expoNotificationsLoaded = false;

async function ensureLoaded() {
  if (expoNotificationsLoaded) return;
  try {
    Notifications = await import('expo-notifications');
    expoNotificationsLoaded = true;
  } catch {}
}

export async function requestNotificationPermissions(): Promise<boolean> {
  await ensureLoaded();
  if (!Notifications) return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleBiteCheckAlarm(delayMs: number = 24 * 60 * 60 * 1000) {
  await ensureLoaded();
  if (!Notifications) return null;

  // Cancel existing alarms
  await Notifications.cancelScheduledNotificationAsync('bite-check-alarm');

  try {
    const id = await Notifications.scheduleNotificationAsync({
      identifier: 'bite-check-alarm',
      content: {
        title: '🔍 Bite Check Due',
        body: '24 hours since your last scan — time to compare and re-check the area.',
        data: { type: 'bite-check' },
        priority: Notifications.AndroidNotificationPriority?.HIGH ?? 'high',
        sound: true,
        categoryIdentifier: 'bite-check',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL ?? 'timeInterval',
        seconds: Math.max(60, delayMs / 1000),
        repeats: false,
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelBiteCheckAlarm() {
  await ensureLoaded();
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync('bite-check-alarm');
  } catch {}
}

export async function scheduleDemoReminder() {
  await ensureLoaded();
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🐾 Scout Tip',
        body: 'Try the UV filter to spot ticks more easily — swipe to cycle presets!',
        data: { type: 'tip' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL ?? 'timeInterval',
        seconds: 3600,
        repeats: true,
      },
    });
  } catch {}
}

export function configureNotificationCategories() {
  if (!Notifications) return;
  try {
    Notifications.setNotificationCategoryAsync('bite-check', [
      {
        identifier: 'compare',
        buttonTitle: 'Compare Now',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'snooze',
        buttonTitle: 'Remind Later',
        options: { opensAppToForeground: false },
      },
    ]);
  } catch {}
}

// Set up foreground handler
export function setupNotificationHandler() {
  if (!Notifications) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {}
}

export async function getBadgeCount(): Promise<number> {
  await ensureLoaded();
  if (!Notifications) return 0;
  try {
    return await Notifications.getBadgeCountAsync();
  } catch {
    return 0;
  }
}

export async function setBadgeCount(count: number) {
  await ensureLoaded();
  if (!Notifications) return;
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch {}
}
