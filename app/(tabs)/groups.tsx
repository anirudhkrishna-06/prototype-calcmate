// File: app/(tabs)/groups.tsx
// Phase 3 - teacher-centric group overview.
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/calcmate/Badge';
import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { getClassroomState, groups, upcomingClass } from '@/data/mockData';
import { Group } from '@/types';

const modeLabels: Record<Group['activityMode'], string> = {
  'teacher-led': 'Teacher-led',
  independent: 'Independent',
  parallel: 'Parallel learning',
  assessment: 'Assessment',
};

const modeLevels: Record<Group['activityMode'], 'strong' | 'developing' | 'attention' | 'critical'> = {
  'teacher-led': 'strong',
  independent: 'developing',
  parallel: 'attention',
  assessment: 'critical',
};

export default function GroupsScreen() {
  const router = useRouter();
  const classroomState = getClassroomState();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={Typography.screenTitle}>Groups</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={Typography.eyebrow}>Classroom Snapshot</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{classroomState.activeGroups}</Text>
              <Text style={Typography.supporting}>Active groups</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{classroomState.presentToday}</Text>
              <Text style={Typography.supporting}>Present</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.focusValue]}>{upcomingClass.grade}</Text>
              <Text style={Typography.supporting}>Next focus</Text>
            </View>
          </View>
        </Card>

        {groups.map((group) => (
          <Card key={group.id} style={styles.groupCard}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/groups/${group.id}` as never)}>
              <View style={styles.cardTop}>
                <View style={styles.cardTitleRow}>
                  <Text style={Typography.cardTitle}>{group.grade}</Text>
                  <Badge label={modeLabels[group.activityMode]} level={modeLevels[group.activityMode]} />
                </View>
              </View>

              <Text style={styles.studentStatsText}>
                {group.studentCount} Students  |  {group.presentCount} Present
              </Text>

              <View style={styles.conceptRow}>
                <Text style={Typography.bodySecondary}>Current Topic</Text>
                <Text style={[Typography.body, styles.conceptText]}>{group.currentConcept}</Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={Typography.supporting}>
                  {group.minutesRemaining ? `${group.minutesRemaining} Minutes Available` : 'No time limit'}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl * 2,
  },
  headerContainer: {
    marginBottom: Spacing.md,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  focusValue: {
    color: Colors.attention, // Saffron accent
  },
  groupCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  studentStatsText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  conceptRow: {
    marginBottom: Spacing.md,
  },
  conceptText: {
    fontSize: 18,
    marginTop: 2,
  },
  footerRow: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
