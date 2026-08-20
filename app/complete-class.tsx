// File: app/complete-class.tsx
// Phase 4 - lightweight class wrap-up and teacher review.
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

import { Badge } from '@/components/calcmate/Badge';
import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import {
  getGroupById,
  getPriorityDecision,
  setPriorityDecision,
  upcomingClass,
} from '@/data/mockData';
import { PriorityStudent } from '@/types';

const defaultGroupId = upcomingClass.groupId;

function statusMeta(studentId: string) {
  const decision = getPriorityDecision(studentId);
  switch (decision) {
    case 'resolved':
      return { label: 'Resolved', level: 'strong' as const };
    case 'follow-up':
      return { label: 'Needs follow-up', level: 'attention' as const };
    default:
      return { label: 'Pending', level: 'developing' as const };
  }
}

function CompletionRow({
  priority,
  onResolve,
  onFollowUp,
}: {
  priority: PriorityStudent;
  onResolve: () => void;
  onFollowUp: () => void;
}) {
  const meta = statusMeta(priority.studentId);

  return (
    <View style={styles.priorityRow}>
      <View style={styles.priorityRank}>
        <Text style={styles.priorityRankLabel}>{String(priority.rank).padStart(2, '0')}</Text>
      </View>
      <View style={styles.priorityCopy}>
        <View style={styles.priorityTopRow}>
          <Text style={Typography.cardTitle}>{priority.name}</Text>
          <Badge label={meta.label} level={meta.level} />
        </View>
        <Text style={Typography.bodySecondary}>{priority.reason}</Text>
        <View style={styles.choiceRow}>
          <TouchableOpacity
            style={[styles.choiceChip, meta.label === 'Resolved' && styles.choiceChipActive]}
            activeOpacity={0.85}
            onPress={onResolve}
          >
            <Text style={[styles.choiceChipLabel, meta.label === 'Resolved' && styles.choiceChipLabelActive]}>
              Resolved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceChip, meta.label === 'Needs follow-up' && styles.choiceChipAttention]}
            activeOpacity={0.85}
            onPress={onFollowUp}
          >
            <Text
              style={[
                styles.choiceChipLabel,
                meta.label === 'Needs follow-up' && styles.choiceChipLabelAttention,
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

export default function CompleteClassScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? defaultGroupId;
  const group = getGroupById(groupId) ?? getGroupById(defaultGroupId);

  if (!group) {
    return null;
  }

  const markResolved = (studentId: string) => setPriorityDecision(studentId, 'resolved');
  const markFollowUp = (studentId: string) => setPriorityDecision(studentId, 'follow-up');

  return (
    <>
      <Stack.Screen options={{ title: 'Complete Class', headerBackTitle: 'Class Mode' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Complete Class</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Review the lesson quickly and keep only the important follow-up work visible.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Lesson Review</Text>
            <Text style={Typography.sectionTitle}>{group.grade}</Text>
            <Text style={Typography.bodySecondary}>{upcomingClass.objective}</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryBox}>
                <Feather name="check-circle" size={16} color={Colors.accent} />
                <Text style={Typography.cardTitle}>Keep</Text>
                <Text style={Typography.supporting}>What worked today</Text>
              </View>
              <View style={styles.summaryBox}>
                <Feather name="alert-circle" size={16} color={Colors.attention} />
                <Text style={Typography.cardTitle}>Follow up</Text>
                <Text style={Typography.supporting}>What needs another look</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Priority Review</Text>
            {upcomingClass.priorities.map((priority) => (
              <CompletionRow
                key={priority.studentId}
                priority={priority}
                onResolve={() => markResolved(priority.studentId)}
                onFollowUp={() => markFollowUp(priority.studentId)}
              />
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Quick Note</Text>
            <View style={styles.noteBox}>
              <Feather name="edit-3" size={14} color={Colors.textSecondary} />
              <Text style={Typography.bodySecondary}>
                Capture only the follow-up that changes the next class. The goal is a short teacher memory, not a long log.
              </Text>
            </View>
          </Card>

          <View style={styles.actionStack}>
            <Button
              label="Save & Continue"
              onPress={() =>
                router.push({
                  pathname: '/post-class',
                  params: { groupId: group.id },
                } as never)
              }
            />
            <Button
              label="Back to Class"
              variant="outline"
              onPress={() => router.back()}
            />
          </View>
        </ScrollView>
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
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  summaryBox: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    padding: Spacing.md,
    gap: 4,
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
  choiceRow: {
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
  noteBox: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.sm,
  },
  actionStack: {
    gap: Spacing.sm,
  },
});
