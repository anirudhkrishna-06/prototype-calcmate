// File: app/assessments.tsx
// Phase 6 - assessments hub.
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
import { assessments, getAssessmentResultById } from '@/data/mockData';

const statusLabels = {
  upcoming: { label: 'Upcoming', level: 'developing' as const },
  scheduled: { label: 'Scheduled', level: 'attention' as const },
  live: { label: 'Live', level: 'critical' as const },
  completed: { label: 'Completed', level: 'strong' as const },
};

export default function AssessmentsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={Typography.screenTitle}>Assessments</Text>
        <Text style={[Typography.bodySecondary, styles.subtitle]}>
          Planning, conducting, and reviewing assessments without turning the prototype into a test-management app.
        </Text>

        <Card style={styles.heroCard}>
          <Text style={Typography.eyebrow}>Assessment Workflow</Text>
          <View style={styles.workflowRow}>
            <StepPill label="Schedule" active />
            <StepPill label="Conduct" />
            <StepPill label="Results" />
          </View>
          <Text style={[Typography.bodySecondary, styles.heroNote]}>
            The emphasis stays on teaching decisions: what to assess, when to assess it, and what the results mean.
          </Text>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={Typography.sectionTitle}>Upcoming assessments</Text>
          <Text style={Typography.supporting}>Teacher-ready, curriculum-linked, and brief.</Text>
        </View>

        {assessments.map((assessment) => {
          const result = getAssessmentResultById(assessment.id);
          return (
            <Card key={assessment.id} style={styles.assessmentCard}>
              <View style={styles.assessmentTopRow}>
                <View style={styles.assessmentCopy}>
                  <Text style={Typography.cardTitle}>
                    {assessment.grade} - {assessment.concept}
                  </Text>
                  <Text style={Typography.bodySecondary}>{assessment.subject}</Text>
                </View>
                <Badge {...statusLabels[assessment.status]} />
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Feather name="calendar" size={14} color={Colors.textSecondary} />
                  <Text style={Typography.supporting}>{assessment.date}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Feather name="clock" size={14} color={Colors.textSecondary} />
                  <Text style={Typography.supporting}>{assessment.duration}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Feather name="layers" size={14} color={Colors.textSecondary} />
                  <Text style={Typography.supporting}>{assessment.difficulty}</Text>
                </View>
              </View>

              {result ? (
                <Text style={[Typography.supporting, styles.resultNote]}>
                  Last result: {result.mastery}% mastery
                </Text>
              ) : null}

              <View style={styles.actionRow}>
                <Button
                  label="Schedule"
                  variant="outline"
                  style={styles.flexButton}
                  onPress={() =>
                    router.push({
                      pathname: '/assessment-schedule',
                      params: { assessmentId: assessment.id },
                    } as never)
                  }
                />
                <Button
                  label="Conduct"
                  style={styles.flexButton}
                  onPress={() =>
                    router.push({
                      pathname: '/assessment-conduct',
                      params: { assessmentId: assessment.id },
                    } as never)
                  }
                />
              </View>
            </Card>
          );
        })}

        <Card style={styles.sectionCard}>
          <Text style={Typography.eyebrow}>What to do next</Text>
          <View style={styles.linkList}>
            <QuickLink
              icon="bar-chart-2"
              title="View results"
              detail="See mastery and attention counts."
              onPress={() => router.push('/assessment-results' as never)}
            />
            <QuickLink
              icon="git-branch"
              title="Open knowledge graph"
              detail="Check prerequisite flow before scheduling."
              onPress={() => router.push('/curriculum' as never)}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function StepPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.stepPill, active && styles.stepPillActive]}>
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

function QuickLink({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.quickLink}>
        <View style={styles.quickIcon}>
          <Feather name={icon} size={16} color={Colors.accent} />
        </View>
        <View style={styles.quickCopy}>
          <Text style={Typography.cardTitle}>{title}</Text>
          <Text style={Typography.bodySecondary}>{detail}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
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
  workflowRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  stepPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  stepPillActive: {
    borderColor: Colors.accent,
    backgroundColor: '#E9F4F3',
  },
  stepLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: Colors.accent,
  },
  heroNote: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  assessmentCard: {
    marginBottom: Spacing.md,
  },
  assessmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  assessmentCopy: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  resultNote: {
    marginTop: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  flexButton: {
    flex: 1,
  },
  sectionCard: {
    marginTop: Spacing.sm,
  },
  linkList: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCopy: {
    flex: 1,
  },
});
