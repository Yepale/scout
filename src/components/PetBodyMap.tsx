import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme';

interface PetBodyMapProps {
  inspectedParts: string[];
  currentPart: string;
  onPartPress: (part: string) => void;
}

const PART_POSITIONS: Record<string, { path: string; cx: number; cy: number }> = {
  ears: {
    path: 'M80,40 Q100,15 120,40 Q110,35 100,40 Q90,35 80,40',
    cx: 100,
    cy: 28,
  },
  neck: {
    path: 'M85,55 Q100,50 115,55 Q110,65 100,70 Q90,65 85,55',
    cx: 100,
    cy: 62,
  },
  paws: {
    path: 'M60,155 Q80,170 100,170 Q120,170 140,155 Q130,165 100,165 Q70,165 60,155',
    cx: 100,
    cy: 165,
  },
  belly: {
    path: 'M75,85 Q100,80 125,85 Q130,110 125,135 Q100,140 75,135 Q70,110 75,85',
    cx: 100,
    cy: 110,
  },
  tail: {
    path: 'M140,60 Q160,50 170,35 Q165,55 155,70 Q145,75 140,70',
    cx: 155,
    cy: 48,
  },
};

export const PetBodyMap: React.FC<PetBodyMapProps> = ({
  inspectedParts,
  currentPart,
  onPartPress,
}) => {
  const bodyPath =
    'M100,45 Q60,50 55,85 Q50,120 55,155 Q60,165 75,170 Q95,175 100,175 Q105,175 125,170 Q140,165 145,155 Q150,120 145,85 Q140,50 100,45';

  return (
    <View style={styles.container}>
      <Svg width="200" height="200" viewBox="0 0 200 200">
        <Path
          d={bodyPath}
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1.5}
        />
        {Object.entries(PART_POSITIONS).map(([part, pos]) => {
          const isInspected = inspectedParts.includes(part);
          const isCurrent = currentPart === part;
          return (
            <Circle
              key={part}
              cx={pos.cx}
              cy={pos.cy}
              r={12}
              fill={
                isInspected
                  ? colors.primary
                  : isCurrent
                  ? colors.cyan
                  : 'rgba(255,255,255,0.1)'
              }
              opacity={isInspected || isCurrent ? 1 : 0.6}
              onPress={() => onPartPress(part)}
            />
          );
        })}
        {Object.entries(PART_POSITIONS).map(([part, pos]) => {
          const isInspected = inspectedParts.includes(part);
          const isCurrent = currentPart === part;
          return (
            <Circle
              key={`ring-${part}`}
              cx={pos.cx}
              cy={pos.cy}
              r={15}
              stroke={
                isInspected
                  ? colors.primary
                  : isCurrent
                  ? colors.cyan
                  : 'transparent'
              }
              strokeWidth={1.5}
              strokeDasharray="4,4"
              fill="none"
              opacity={0.5}
            />
          );
        })}
      </Svg>
      <View style={styles.labels}>
        {Object.entries(PART_POSITIONS).map(([part]) => {
          const isInspected = inspectedParts.includes(part);
          const isCurrent = currentPart === part;
          return (
            <TouchableOpacity
              key={part}
              onPress={() => onPartPress(part)}
              style={[
                styles.label,
                isCurrent && styles.currentLabel,
                isInspected && styles.inspectedLabel,
              ]}
            >
              <Text
                style={[
                  styles.labelText,
                  isCurrent && styles.currentLabelText,
                  isInspected && styles.inspectedLabelText,
                ]}
              >
                {part}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  currentLabel: {
    backgroundColor: 'rgba(0,217,255,0.15)',
    borderColor: colors.cyan,
  },
  inspectedLabel: {
    backgroundColor: 'rgba(0,245,212,0.15)',
    borderColor: colors.primary,
  },
  labelText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  currentLabelText: {
    color: colors.cyan,
  },
  inspectedLabelText: {
    color: colors.primary,
  },
});
