// File: components/calcmate/Badge.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Radius, StatusColor, StatusLevel } from '@/constants/theme';

interface BadgeProps {
  label: string;
  level?: StatusLevel;
}

// Small text label with a subtle dot indicator — deliberately NOT a giant
// colored card. Color is used sparingly per the "Calm Intelligence" system.
export function Badge({ label, level = 'neutral' }: BadgeProps) {
  const color = StatusColor[level];
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.sm / 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
