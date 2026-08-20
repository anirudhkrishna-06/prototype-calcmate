// File: app/assessment-results.tsx
// Phase 6 - assessment results and mastery summary.
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/calcmate/Badge';
import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { assessments, assessmentResults, getAssessmentById } from '@/data/mockData';

export default function AssessmentResultsScreen() {
  const router = useRouter();
  const latestAssessment = getAssessmentById('a2') ?? assessments[0];
  const result = assessmentResults.find((item) => item.assessmentId === latestAssessment.id) ?? assessmentResults[0];

  return (
    <>
      <Stack.Screen options={{ title: 'Assessment Results', headerBackTitle: 'Assessments' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Assessment Results</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            A compact summary of mastery, support needs, and the students that matter most.
          </Text>

          <Card style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.eyebrow}>Latest result</Text>
                <Text style={Typography.sectionTitle}>
                  {latestAssessment.grade} - {latestAssessment.concept}
                </Text>
                <Text style={Typography.bodySecondary}>{latestAssessment.subject}</Text>
              </View>
              <Badge label={`${result.mastery}% mastery`} level="strong" />
            </View>

            <View style={styles.barBlock}>
              <Bar label="Strong" value={result.strongCount} total={32} color={Colors.accent} />
              <Bar label="Developing" value={result.developingCount} total={32} color={Colors.attention} />
              <Bar label="Needs attention" value={result.needsAttentionCount} total={32} color={Colors.critical} />
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Result summary</Text>
            <View style={styles.summaryGrid}>
              <Metric label="Mastery" value={`${result.mastery}%`} />
              <Metric label="Strong" value={`${result.strongCount}`} />
              <Metric label="Developing" value={`${result.developingCount}`} />
              <Metric label="Needs attention" value={`${result.needsAttentionCount}`} />
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Students requiring attention</Text>
            {result.topStudents.map((student) => (
              <View key={student} style={styles.studentRow}>
                <View style={styles.studentDot} />
                <Text style={Typography.cardTitle}>{student}</Text>
                <Text style={Typography.supporting}>Follow up</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>What this means</Text>
            <Text style={[Typography.bodySecondary, styles.sectionBody]}>
              Keep the next lesson tight, revisit the common misconception once, and move the most fragile learners into a short support loop.
            </Text>
          </Card>

          <View style={styles.actionStack}>
            <Button label="Open Insights" onPress={() => router.push('/insights' as never)} />
            <Button label="Back to Assessments" variant="outline" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Bar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <View style={styles.barRow}>
      <View style={styles.barLabelRow}>
        <Text style={Typography.body}>{label}</Text>
        <Text style={Typography.supporting}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.max(8, (value / total) * 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={Typography.supporting}>{label}</Text>
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
  barBlock: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  barRow: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E9EDF3',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  metric: {
    width: '48%',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    padding: Spacing.md,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  studentDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.attention,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  actionStack: {
    gap: Spacing.sm,
  },
});
