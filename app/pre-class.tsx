// File: app/pre-class.tsx
// Phase 4 - briefing screen before the class begins.
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
  setPriorityDecision,
  upcomingClass,
} from '@/data/mockData';
import { PriorityStudent } from '@/types';

const defaultGroupId = upcomingClass.groupId;

function formatDecision(decision: ReturnType<typeof getPriorityDecision>) {
  switch (decision) {
    case 'resolved':
      return { label: 'Resolved', level: 'strong' as const };
    case 'follow-up':
      return { label: 'Needs follow-up', level: 'attention' as const };
    default:
      return { label: 'Pending', level: 'developing' as const };
  }
}

function PriorityRow({
  priority,
  onResolve,
  onFollowUp,
}: {
  priority: PriorityStudent;
  onResolve: () => void;
  onFollowUp: () => void;
}) {
  const decision = getPriorityDecision(priority.studentId);
  const status = formatDecision(decision);

  return (
    <View style={styles.priorityRow}>
      <View style={styles.priorityRank}>
        <Text style={styles.priorityRankLabel}>{String(priority.rank).padStart(2, '0')}</Text>
      </View>

      <View style={styles.priorityCopy}>
        <View style={styles.priorityTopRow}>
          <Text style={Typography.cardTitle}>{priority.name}</Text>
          <Badge label={status.label} level={status.level} />
        </View>
        <Text style={Typography.bodySecondary}>{priority.reason}</Text>
        <Text style={[Typography.supporting, styles.priorityRecommendation]}>
          {priority.recommendation}
        </Text>
        <View style={styles.priorityActions}>
          <TouchableOpacity
            style={[styles.choiceChip, decision === 'resolved' && styles.choiceChipActive]}
            activeOpacity={0.85}
            onPress={onResolve}
          >
            <Text style={[styles.choiceChipLabel, decision === 'resolved' && styles.choiceChipLabelActive]}>
              Resolved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceChip, decision === 'follow-up' && styles.choiceChipAttention]}
            activeOpacity={0.85}
            onPress={onFollowUp}
          >
            <Text
              style={[
                styles.choiceChipLabel,
                decision === 'follow-up' && styles.choiceChipLabelAttention,
              ]}
            >
              Follow up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PreClassScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? defaultGroupId;
  const group = getGroupById(groupId) ?? getGroupById(defaultGroupId);
  const otherGroups = getOtherGroups(defaultGroupId);
  const classDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (!group) {
    return null;
  }

  const startClass = () => {
    router.push({
      pathname: '/class-mode',
      params: { groupId: group.id },
    } as never);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Class Briefing', headerBackTitle: 'Home' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Pre-Class Briefing</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Calm, concise preparation before the lesson starts.
          </Text>

          <Card style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.eyebrow}>Next Class</Text>
                <Text style={Typography.sectionTitle}>{group.grade}</Text>
                <Text style={Typography.bodySecondary}>{group.currentSubject}</Text>
              </View>
              <Badge label={upcomingClass.time} level="strong" />
            </View>

            <Text style={[Typography.body, styles.objective]}>{upcomingClass.objective}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>{classDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="users" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>{upcomingClass.studentsNeedingAttention} students need attention</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Instructional Priority</Text>
            {upcomingClass.priorities.map((priority) => (
              <PriorityRow
                key={priority.studentId}
                priority={priority}
                onResolve={() => setPriorityDecision(priority.studentId, 'resolved')}
                onFollowUp={() => setPriorityDecision(priority.studentId, 'follow-up')}
              />
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Other Groups</Text>
            {otherGroups.map((otherGroup) => (
              <View key={otherGroup.id} style={styles.otherGroupRow}>
                <View style={styles.otherGroupCopy}>
                  <Text style={Typography.cardTitle}>{otherGroup.grade}</Text>
                  <Text style={Typography.bodySecondary}>
                    {otherGroup.currentConcept} - {otherGroup.activityMode === 'parallel' ? 'Parallel learning' : 'Independent work'}
                  </Text>
                </View>
                {typeof otherGroup.minutesRemaining === 'number' ? (
                  <Badge label={`${otherGroup.minutesRemaining} min`} level="attention" />
                ) : null}
              </View>
            ))}
          </Card>

          <View style={styles.actionStack}>
            <Button label="Start Class" onPress={startClass} />
            <Button
              label="Review Schedule"
              variant="outline"
              onPress={() => router.push('/(tabs)/schedule' as never)}
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
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  heroCard: {
    marginBottom: Spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  heroCopy: {
    flex: 1,
  },
  objective: {
    marginTop: Spacing.md,
  },
  metaRow: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
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
  priorityRecommendation: {
    marginTop: 2,
  },
  priorityActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  choiceChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  choiceChipActive: {
    backgroundColor: '#E9F4F3',
    borderColor: Colors.accent,
  },
  choiceChipAttention: {
    backgroundColor: '#FFF5E8',
    borderColor: Colors.attention,
  },
  choiceChipLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  choiceChipLabelActive: {
    color: Colors.accent,
  },
  choiceChipLabelAttention: {
    color: Colors.attention,
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
  actionStack: {
    gap: Spacing.sm,
  },
});
