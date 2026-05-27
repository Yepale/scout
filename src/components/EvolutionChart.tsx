import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 160;

interface DataPoint {
  day: string;
  swelling: number;
}

interface EvolutionChartProps {
  data: DataPoint[];
  title?: string;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({
  data,
  title = 'Swelling Evolution',
}) => {
  const maxVal = Math.max(...data.map((d) => d.swelling), 1);
  const barWidth = (CHART_WIDTH - (data.length - 1) * 6) / data.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chart}>
        <View style={styles.barsContainer}>
          {data.map((point, i) => {
            const height = (point.swelling / maxVal) * (CHART_HEIGHT - 20);
            return (
              <View key={i} style={styles.barWrapper}>
                <Text style={styles.barValue}>{point.swelling.toFixed(1)}</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height: Math.max(height, 4),
                      backgroundColor:
                        i === data.length - 1
                          ? colors.success
                          : i === 0
                          ? colors.warning
                          : colors.primary,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{point.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },
  barLabel: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '500',
  },
});
