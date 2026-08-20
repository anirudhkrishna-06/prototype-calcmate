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
        <Text style={Typography.screenTitle}>Groups</Text>
        <Text style={[Typography.bodySecondary, styles.subtitle]}>
          Grade-wise classroom state, presented as a quick scan rather than a dense management board.
        </Text>

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
              <Text style={styles.summaryValue}>{upcomingClass.grade}</Text>
              <Text style={Typography.supporting}>Next focus</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={Typography.sectionTitle}>Today&apos;s groups</Text>
          <Text style={Typography.supporting}>Tap any group for a compact class view.</Text>
        </View>

        {groups.map((group) => (
          <Card key={group.id} style={styles.groupCard}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/groups/${group.id}` as never)}>
              <View style={styles.cardTop}>
                <View style={styles.cardTitleRow}>
                  <Text style={Typography.cardTitle}>{group.grade}</Text>
                  <Badge label={modeLabels[group.activityMode]} level={modeLevels[group.activityMode]} />
                </View>
                <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricBlock}>
                  <Text style={styles.metricValue}>{group.studentCount}</Text>
                  <Text style={Typography.supporting}>Students</Text>
                </View>
                <View style={styles.metricBlock}>
                  <Text style={styles.metricValue}>{group.presentCount}</Text>
                  <Text style={Typography.supporting}>Present</Text>
                </View>
                <View style={styles.metricBlock}>
                  <Text style={styles.metricValue}>{group.minutesRemaining ?? '—'}</Text>
                  <Text style={Typography.supporting}>Minutes</Text>
                </View>
              </View>

              <View style={styles.conceptRow}>
                <Text style={Typography.body}>{group.currentSubject}</Text>
                <Text style={Typography.bodySecondary}>{group.currentConcept}</Text>
              </View>

              <Button
                label="Open Group"
                variant="outline"
                style={styles.groupButton}
                onPress={() => router.push(`/groups/${group.id}` as never)}
              />
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
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  groupCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metricBlock: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  conceptRow: {
    gap: 2,
    marginBottom: Spacing.md,
  },
  groupButton: {
    width: '100%',
  },
});
