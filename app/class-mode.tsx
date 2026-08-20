// File: app/class-mode.tsx
// Phase 4 - in-class operating screen.
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AIButton } from '@/components/calcmate/AIButton';
import { Badge } from '@/components/calcmate/Badge';
import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import {
  getGroupById,
  getOtherGroups,
  getPriorityDecision,
  getStudentsByGroup,
  upcomingClass,
} from '@/data/mockData';

const defaultGroupId = upcomingClass.groupId;

const stepLabels = ['Briefing', 'Teach', 'Parallel', 'Review', 'Complete'];

function decisionBadge(studentId: string) {
  const decision = getPriorityDecision(studentId);
  switch (decision) {
    case 'resolved':
      return { label: 'Resolved', level: 'strong' as const };
    case 'follow-up':
      return { label: 'Follow-up', level: 'attention' as const };
    default:
      return { label: 'Pending', level: 'developing' as const };
  }
}

export default function ClassModeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? defaultGroupId;
  const group = getGroupById(groupId) ?? getGroupById(defaultGroupId);
  const students = group ? getStudentsByGroup(group.id) : [];
  const otherGroups = getOtherGroups(defaultGroupId);

  if (!group) {
    return null;
  }

  const goToParallel = () =>
    router.push({
      pathname: '/parallel-learning',
      params: { groupId: group.id },
    } as never);

  const goToNextPriority = () =>
    router.push({
      pathname: '/next-priority',
      params: { groupId: group.id },
    } as never);

  const goToComplete = () =>
    router.push({
      pathname: '/complete-class',
      params: { groupId: group.id },
    } as never);

  return (
    <>
      <Stack.Screen options={{ title: 'Class Mode', headerBackTitle: 'Briefing' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={Typography.eyebrow}>Now Teaching</Text>
              <Text style={Typography.screenTitle}>{group.grade}</Text>
              <Text style={Typography.bodySecondary}>{group.currentSubject}</Text>
            </View>
            <Badge label={upcomingClass.time} level="strong" />
          </View>

          <Card style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.sectionTitle}>{group.currentConcept}</Text>
                <Text style={[Typography.bodySecondary, styles.heroDescription]}>
                  Compare equivalent fractions with low-friction support and a clear sequence.
                </Text>
              </View>
              <Badge label="Teacher-led" level="strong" />
            </View>

            <View style={styles.timerRow}>
              <Feather name="clock" size={16} color={Colors.accent} />
              <Text style={styles.timerValue}>{upcomingClass.endTime}</Text>
              <Text style={Typography.supporting}>remaining in the current block</Text>
            </View>

            <View style={styles.progressRow}>
              {stepLabels.map((label, index) => {
                const active = index === 1;
                const done = index < 1;
                return (
                  <View key={label} style={styles.progressItem}>
                    <View
                      style={[
                        styles.progressDot,
                        done && styles.progressDotDone,
                        active && styles.progressDotActive,
                      ]}
                    />
                    <Text style={[styles.progressLabel, active && styles.progressLabelActive]}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Today&apos;s Objective</Text>
            <Text style={[Typography.body, styles.sectionBody]}>{upcomingClass.objective}</Text>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Top Priorities</Text>
            {upcomingClass.priorities.map((priority) => (
              <TouchableOpacity
                key={priority.studentId}
                activeOpacity={0.9}
                onPress={() => router.push(`/students/${priority.studentId}` as never)}
                style={styles.priorityRow}
              >
                <View style={styles.priorityRank}>
                  <Text style={styles.priorityRankLabel}>{String(priority.rank).padStart(2, '0')}</Text>
                </View>
                <View style={styles.priorityCopy}>
                  <View style={styles.priorityTopRow}>
                    <Text style={Typography.cardTitle}>{priority.name}</Text>
                    <Badge label={decisionBadge(priority.studentId).label} level={decisionBadge(priority.studentId).level} />
                  </View>
                  <Text style={Typography.bodySecondary}>{priority.reason}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Other Groups</Text>
            {otherGroups.map((otherGroup) => (
              <TouchableOpacity
                key={otherGroup.id}
                activeOpacity={0.9}
                onPress={() => router.push(`/groups/${otherGroup.id}` as never)}
                style={styles.otherGroupRow}
              >
                <View style={styles.otherGroupCopy}>
                  <Text style={Typography.cardTitle}>{otherGroup.grade}</Text>
                  <Text style={Typography.bodySecondary}>
                    {otherGroup.currentConcept} - {otherGroup.activityMode === 'parallel' ? 'Parallel learning' : 'Independent work'}
                  </Text>
                </View>
                {typeof otherGroup.minutesRemaining === 'number' ? (
                  <Badge label={`${otherGroup.minutesRemaining} min`} level="attention" />
                ) : null}
              </TouchableOpacity>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Quick Support</Text>
            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.quickChip} activeOpacity={0.85} onPress={goToParallel}>
                <Text style={styles.quickChipLabel}>Parallel Learning</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickChip} activeOpacity={0.85} onPress={goToNextPriority}>
                <Text style={styles.quickChipLabel}>Next Priority</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickRow}>
              <TouchableOpacity
                style={[styles.quickChip, styles.quickChipOutline]}
                activeOpacity={0.85}
                onPress={() => router.push(`/students/${students[0]?.id}` as never)}
              >
                <Text style={styles.quickChipLabel}>Open Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickChip, styles.quickChipOutline]}
                activeOpacity={0.85}
                onPress={() => router.push('/(tabs)/schedule' as never)}
              >
                <Text style={styles.quickChipLabel}>View Schedule</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <View style={styles.actionStack}>
            <Button label="Complete Class" onPress={goToComplete} />
            <Button
              label="Ask Calcmate"
              variant="outline"
              onPress={() =>
                router.push({
                  pathname: '/ai',
                  params: { mode: 'class', groupId: group.id },
                } as never)
              }
            />
          </View>
        </ScrollView>

        <AIButton params={{ mode: 'class', groupId: group.id }} />
      </SafeAreaView>
    </>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  headerCopy: {
    flex: 1,
  },
  heroCard: {
    marginBottom: Spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  heroCopy: {
    flex: 1,
  },
  heroDescription: {
    marginTop: 2,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  timerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    gap: 6,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.border,
    marginBottom: 6,
  },
  progressDotDone: {
    backgroundColor: Colors.accent,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressLabelActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priorityRank: {
    width: 30,
    height: 30,
    borderRadius: Radius.md,
    backgroundColor: '#F3F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityRankLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  priorityCopy: {
    flex: 1,
  },
  priorityTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  otherGroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  otherGroupCopy: {
    flex: 1,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  quickChip: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 11,
    alignItems: 'center',
  },
  quickChipOutline: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipLabel: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  actionStack: {
    gap: Spacing.sm,
  },
});
