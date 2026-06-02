import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { useSettingsStore } from '../stores/settingsStore';
import {
  requestPermission,
  scheduleWelcomeTip,
  cancelWelcomeTip,
  scheduleCheckupReminder,
  cancelCheckupReminder,
  scheduleRiskAlert,
  cancelRiskAlert,
  scheduleTipOfDay,
  cancelTipOfDay,
  scheduleWeeklyReport,
  cancelWeeklyReport,
  setupForegroundHandler,
  configureCategories,
  setupResponseHandler,
  cancelAllScheduled,
} from '../services/notifications';

export function useNotificationScheduler() {
  const initialized = useRef(false);

  const pushEnabled = useSettingsStore((s) => s.pushEnabled);
  const riskAlerts = useSettingsStore((s) => s.riskAlerts);
  const weeklyReport = useSettingsStore((s) => s.weeklyReport);
  const tipOfDay = useSettingsStore((s) => s.tipOfDay);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Setup
    setupForegroundHandler();
    configureCategories();
    setupResponseHandler((data) => {
      if (data.screen === 'analysis') router.push('/(tabs)/analysis');
      else if (data.screen === 'scan') router.push('/(tabs)/scan');
      else if (data.screen === 'history') router.push('/(tabs)/history');
    });

    // Welcome tip (once)
    requestPermission().then((granted) => {
      if (granted) scheduleWelcomeTip();
    });
  }, []);

  // Schedule/cancel based on settings toggles
  useEffect(() => {
    if (!pushEnabled) {
      cancelCheckupReminder();
      cancelRiskAlert();
      cancelTipOfDay();
      cancelWeeklyReport();
      return;
    }
    requestPermission().then((granted) => {
      if (!granted) return;
      if (riskAlerts) scheduleRiskAlert();
      else cancelRiskAlert();
      if (weeklyReport) scheduleWeeklyReport();
      else cancelWeeklyReport();
      if (tipOfDay) scheduleTipOfDay();
      else cancelTipOfDay();
      scheduleCheckupReminder();
    });
  }, [pushEnabled, riskAlerts, weeklyReport, tipOfDay]);
}
