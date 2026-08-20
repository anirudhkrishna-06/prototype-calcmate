// File: components/calcmate/OtherGroupsStrip.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Group } from '@/types';

const modeLabel: Record<Group['activityMode'], string> = {
  'teacher-led': 'Teacher-led',
  independent: 'Independent',
  parallel: 'Parallel',
  assessment: 'Assessment',
};

interface OtherGroupsStripProps {
  groups: Group[];
}

// Compact "what is everyone else doing right now" list — directly answers
// the professor's original multi-grade-classroom concern.
export function OtherGroupsStrip({ groups }: OtherGroupsStripProps) {
  return (
    <View>
      <Text style={[Typography.eyebrow, styles.heading]}>Other Groups</Text>
      {groups.map((g) => (
        <View key={g.id} style={styles.row}>
          <View style={styles.left}>
            <Text style={Typography.cardTitle}>{g.grade}</Text>
            <Text style={Typography.bodySecondary}>
              {modeLabel[g.activityMode]} — {g.currentConcept}
            </Text>
          </View>
          {typeof g.minutesRemaining === 'number' && (
            <Text style={styles.minutes}>{g.minutesRemaining} min</Text>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  left: {
    flex: 1,
  },
  minutes: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
