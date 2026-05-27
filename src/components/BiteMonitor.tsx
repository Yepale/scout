import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Bell, BellOff, RotateCcw, Camera } from 'lucide-react-native';
import { colors } from '../theme';
import { GlassCard } from './GlassCard';
import { lightTap, mediumTap } from '../utils/haptics';

interface BiteMonitorProps {
  onCapture?: () => void;
}

export const BiteMonitor: React.FC<BiteMonitorProps> = ({ onCapture }) => {
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [alarmSet, setAlarmSet] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [active]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  const startMonitor = useCallback(() => {
    mediumTap();
    setActive(true);
    setElapsed(0);
    setAlarmTriggered(false);
  }, []);

  const resetMonitor = useCallback(() => {
    lightTap();
    setActive(false);
    setElapsed(0);
    setAlarmSet(false);
    setAlarmTriggered(false);
  }, []);

  const toggleAlarm = useCallback(() => {
    lightTap();
    if (!alarmSet) {
      setAlarmSet(true);
      // 24h alarm
      setTimeout(() => {
        setAlarmTriggered(true);
      }, 24 * 60 * 60 * 1000);
    } else {
      setAlarmSet(false);
    }
  }, [alarmSet]);

  const alarmDue = alarmTriggered || (alarmSet && elapsed >= 86400);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Clock size={16} color={colors.primary} />
        <Text style={styles.title}>Bite Monitor</Text>
      </View>

      {!active ? (
        <TouchableOpacity onPress={startMonitor} style={styles.startBtn} activeOpacity={0.7}>
          <Text style={styles.startText}>Start Monitoring</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.timer}>{formatTime(elapsed)}</Text>
          <Text style={styles.subtext}>since detection</Text>

          {alarmDue && (
            <View style={styles.alarmRow}>
              <Bell size={14} color={colors.warning} />
              <Text style={styles.alarmText}>24h check due! Compare now.</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={toggleAlarm} style={styles.actionBtn} activeOpacity={0.7}>
              {alarmSet ? <BellOff size={16} color={colors.textSecondary} /> : <Bell size={16} color={colors.primary} />}
              <Text style={styles.actionText}>{alarmSet ? 'Cancel Alarm' : '24h Alarm'}</Text>
            </TouchableOpacity>

            {onCapture && (
              <TouchableOpacity onPress={() => { lightTap(); onCapture(); }} style={styles.actionBtn} activeOpacity={0.7}>
                <Camera size={16} color={colors.primary} />
                <Text style={styles.actionText}>Compare</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={resetMonitor} style={styles.actionBtn} activeOpacity={0.7}>
              <RotateCcw size={16} color={colors.textSecondary} />
              <Text style={styles.actionText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { color: colors.primary, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  startBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  startText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  timer: { color: colors.text, fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'] },
  subtext: { color: colors.textTertiary, fontSize: 12, marginBottom: 8 },
  alarmRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  alarmText: { color: colors.warning, fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.glass,
    borderWidth: 1, borderColor: colors.glassBorder,
  },
  actionText: { color: colors.textSecondary, fontSize: 11, fontWeight: '500' },
});
