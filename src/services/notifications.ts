import { Platform } from 'react-native';

let Notifications: any = null;

async function load() {
  if (Notifications) return;
  try { Notifications = await import('expo-notifications'); } catch {}
}

export async function requestPermission(): Promise<boolean> {
  await load();
  if (!Notifications) return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch { return false; }
}

export async function checkPermission(): Promise<boolean> {
  await load();
  if (!Notifications) return false;
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch { return false; }
}

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_WEEK = 7 * MS_DAY;

function content(title: string, body: string, data: Record<string, any> = {}) {
  return { title, body, data: { ...data, sentAt: Date.now() }, sound: true, priority: 'high' as const };
}

async function schedule(id: string, title: string, body: string, seconds: number, repeats: boolean = false, data: Record<string, any> = {}) {
  await load();
  if (!Notifications) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: content(title, body, { ...data, notificationId: id }),
      trigger: { type: 'timeInterval' as const, seconds: Math.max(60, seconds), repeats },
    });
  } catch { return null; }
}

async function cancel(id: string) {
  await load();
  if (!Notifications) return;
  try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
}

// ─── Alarm types ─────────────────────────────────────────────────

export function scheduleWelcomeTip() {
  return schedule(
    'welcome-tip',
    '🐾 Welcome to Scout!',
    'Try pointing your camera at your pet — Scout will scan for ticks, fleas, and more.',
    60, false, { type: 'welcome', screen: 'scan' }
  );
}

export function cancelWelcomeTip() {
  return cancel('welcome-tip');
}

export function scheduleCheckupReminder(petName: string = 'your pet') {
  return schedule(
    'checkup-reminder',
    '🔍 Time for a checkup!',
    `It\'s been a week since last scan — give ${petName} a quick once-over with Scout.`,
    MS_WEEK / 1000, true
  );
}

export function cancelCheckupReminder() {
  return cancel('checkup-reminder');
}

export function scheduleRiskAlert(riskLevel: 'moderate' | 'high' = 'moderate') {
  const msg = riskLevel === 'high'
    ? 'High tick activity reported in your area. Check pets after outdoor trips.'
    : 'Tick season is active — routine scans recommended after walks.';
  return schedule(
    'risk-alert',
    '⚠️ Outdoor Risk Alert',
    msg,
    MS_DAY / 1000, true
  );
}

export function cancelRiskAlert() {
  return cancel('risk-alert');
}

export function scheduleTipOfDay() {
  return schedule(
    'tip-of-day',
    '🐾 Scout Tip',
    'Swipe down on the scanner to adjust brightness — perfect for low-light conditions.',
    MS_DAY / 1000, true
  );
}

export function cancelTipOfDay() {
  return cancel('tip-of-day');
}

export function scheduleWeeklyReport() {
  return schedule(
    'weekly-report',
    '📊 Your Scout Weekly',
    'Check your scan history and trends from the past 7 days.',
    MS_WEEK / 1000, true
  );
}

export function cancelWeeklyReport() {
  return cancel('weekly-report');
}

export function schedulePeriodicReminder(label: string, hours: number) {
  return schedule(
    'periodic-reminder',
    '🔍 Pet Check Reminder',
    `Time for a ${label} — keep your pets safe with a quick scan.`,
    hours * 3600, true
  );
}

export function cancelPeriodicReminder() {
  return cancel('periodic-reminder');
}

// ─── Bite check alarm ────────────────────────────────────────────

export async function scheduleBiteCheckAlarm(delayMs: number = MS_DAY) {
  await load();
  if (!Notifications) return null;
  await cancel('bite-check-alarm');
  try {
    return await Notifications.scheduleNotificationAsync({
      identifier: 'bite-check-alarm',
      content: {
        title: '🔍 Bite Check Due',
        body: '24 hours since your last scan — time to compare and re-check the area.',
        data: { type: 'bite-check', notificationId: 'bite-check-alarm', screen: 'analysis' },
        sound: true,
        categoryIdentifier: 'bite-check',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL ?? 'timeInterval',
        seconds: Math.max(60, delayMs / 1000),
        repeats: false,
      },
    });
  } catch { return null; }
}

export async function cancelBiteCheckAlarm() {
  return cancel('bite-check-alarm');
}

// ─── Category configuration ──────────────────────────────────────

export function configureCategories() {
  load();
  if (!Notifications) return;
  try {
    Notifications.setNotificationCategoryAsync('bite-check', [
      { identifier: 'compare', buttonTitle: 'Compare Now', options: { opensAppToForeground: true } },
      { identifier: 'snooze', buttonTitle: 'Remind Later', options: { opensAppToForeground: false } },
    ]);
  } catch {}
}

// ─── Response handler ────────────────────────────────────────────

type NotificationTapCallback = (data: Record<string, any>) => void;

export function setupResponseHandler(onTap: NotificationTapCallback) {
  load();
  if (!Notifications) return;
  try {
    const sub = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const data = response.notification?.request?.content?.data || {};
      onTap(data);
    });
    return sub;
  } catch { return null; }
}

// ─── Foreground handler ──────────────────────────────────────────

export function setupForegroundHandler() {
  load();
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

// ─── Badge ───────────────────────────────────────────────────────

export async function getBadge(): Promise<number> {
  await load();
  if (!Notifications) return 0;
  try { return await Notifications.getBadgeCountAsync(); } catch { return 0; }
}

export async function setBadge(count: number) {
  await load();
  if (!Notifications) return;
  try { await Notifications.setBadgeCountAsync(count); } catch {}
}

// ─── Cancel all ──────────────────────────────────────────────────

export async function cancelAllScheduled() {
  await load();
  if (!Notifications) return;
  try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch {}
}
