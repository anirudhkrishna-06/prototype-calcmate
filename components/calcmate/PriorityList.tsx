// File: components/calcmate/PriorityList.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { PriorityStudent } from '@/types';

interface PriorityListProps {
  priorities: PriorityStudent[];
  compact?: boolean;
}

// Renders "TOP PRIORITIES" — the visual signature that shows the output
// of the intelligence layer, rather than a generic "AI Recommendations" box.
export function PriorityList({ priorities, compact = false }: PriorityListProps) {
  return (
    <View>
      <Text style={[Typography.eyebrow, styles.heading]}>Top Priorities</Text>
      {priorities.map((p) => (
        <View key={p.studentId} style={[styles.row, compact && styles.rowCompact]}>
          <Text style={styles.rank}>{String(p.rank).padStart(2, '0')}</Text>
          <View style={styles.textCol}>
            <Text style={Typography.cardTitle}>{p.name}</Text>
            <Text style={Typography.bodySecondary}>{p.reason}</Text>
            {!compact && (
              <Text style={[Typography.supporting, styles.recommendation]}>
                {p.recommendation}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  rowCompact: {
    paddingVertical: Spacing.xs,
  },
  rank: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
    width: 20,
  },
  textCol: {
    flex: 1,
  },
  recommendation: {
    marginTop: 2,
  },
});
