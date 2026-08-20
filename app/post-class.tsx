// File: app/post-class.tsx
// Phase 4 - post-class processing and updated state summary.
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import {
  getGroupById,
  getPriorityDecision,
  upcomingClass,
} from '@/data/mockData';

const defaultGroupId = upcomingClass.groupId;

const processingSteps = [
  'Attendance',
  'Participation',
  'Teacher observation',
  'Knowledge tracing',
];

export default function PostClassScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? defaultGroupId;
  const group = getGroupById(groupId) ?? getGroupById(defaultGroupId);

  if (!group) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Post-Class Update', headerBackTitle: 'Complete Class' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Post-Class Update</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            The system has the lesson context and updates the learner model in the background.
          </Text>

          <Card style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.eyebrow}>Processing</Text>
                <Text style={Typography.sectionTitle}>{group.grade}</Text>
                <Text style={Typography.bodySecondary}>{group.currentConcept}</Text>
              </View>
              <Feather name="check-circle" size={26} color={Colors.success} />
            </View>

            <View style={styles.processingList}>
              {processingSteps.map((step, index) => (
                <View key={step} style={styles.processingRow}>
                  <View style={[styles.processingDot, styles.processingDotDone]} />
                  <Text style={Typography.body}>{step}</Text>
                  {index === 0 ? <BadgeLabel label="Synced" /> : null}
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Impact Summary</Text>
            {upcomingClass.priorities.map((priority) => {
              const decision = getPriorityDecision(priority.studentId);
              return (
                <View key={priority.studentId} style={styles.summaryRow}>
                  <View style={styles.summaryLeft}>
                    <Text style={Typography.cardTitle}>{priority.name}</Text>
                    <Text style={Typography.supporting}>{priority.reason}</Text>
                  </View>
                  <Text style={[styles.summaryStatus, decision === 'resolved' && styles.summaryStatusResolved]}>
                    {decision === 'resolved' ? 'Resolved' : decision === 'follow-up' ? 'Follow-up' : 'Pending'}
                  </Text>
                </View>
              );
            })}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>What changed</Text>
            <View style={styles.noteRow}>
              <Feather name="users" size={14} color={Colors.textSecondary} />
              <Text style={Typography.bodySecondary}>
                Absent students stay excluded from this lesson update.
              </Text>
            </View>
            <View style={styles.noteRow}>
              <Feather name="book-open" size={14} color={Colors.textSecondary} />
              <Text style={Typography.bodySecondary}>
                Knowledge state is updated from the lesson review and stored as the new classroom signal.
              </Text>
            </View>
          </Card>

          <View style={styles.actionStack}>
            <Button
              label="Return Home"
              onPress={() => router.replace('/' as never)}
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

function BadgeLabel({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
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
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  heroCopy: {
    flex: 1,
  },
  processingList: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  processingDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.border,
  },
  processingDotDone: {
    backgroundColor: Colors.accent,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: '#E9F4F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  summaryStatusResolved: {
    color: Colors.accent,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Spacing.sm,
  },
  actionStack: {
    gap: Spacing.sm,
  },
});
