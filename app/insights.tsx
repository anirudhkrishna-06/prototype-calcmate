// File: app/insights.tsx
// Phase 6 - teacher insights dashboard.
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { insightMetrics, getClassroomState } from '@/data/mockData';

export default function InsightsScreen() {
  const router = useRouter();
  const classroomState = getClassroomState();

  return (
    <>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Insights</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Calm, teacher-facing analytics. Enough to see the pattern, not enough to distract from teaching.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Weekly Overview</Text>
            <View style={styles.heroRow}>
              <Metric label="Present today" value={`${classroomState.presentToday}`} detail="Attendance is steady." />
              <Metric label="Active groups" value={`${classroomState.activeGroups}`} detail="The classroom stays balanced." />
            </View>
          </Card>

          <View style={styles.metricGrid}>
            {insightMetrics.map((metric) => (
              <Card key={metric.label} style={styles.metricCard}>
                <View style={styles.metricTopRow}>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <TrendBadge trend={metric.trend} />
                </View>
                <Text style={Typography.cardTitle}>{metric.label}</Text>
                <Text style={Typography.supporting}>{metric.detail}</Text>
              </Card>
            ))}
          </View>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Actionable summary</Text>
            <InsightRow
              icon="alert-triangle"
              title="Keep attention on Grade 4"
              detail="Fractions still needs small-group support."
            />
            <InsightRow
              icon="check-circle"
              title="Attendance is strong"
              detail="The classroom is stable enough for parallel learning."
            />
            <InsightRow
              icon="trending-up"
              title="Mastery is improving"
              detail="The latest assessment shows a healthier trend."
            />
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Teacher actions</Text>
            <View style={styles.actionRow}>
              <Button label="Open Assessments" onPress={() => router.push('/assessments' as never)} style={styles.flexButton} />
              <Button label="Curriculum KG" variant="outline" onPress={() => router.push('/curriculum' as never)} style={styles.flexButton} />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <View style={styles.heroMetric}>
      <Text style={Typography.eyebrow}>{label}</Text>
      <Text style={styles.heroMetricValue}>{value}</Text>
      <Text style={Typography.supporting}>{detail}</Text>
    </View>
  );
}

function TrendBadge({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  const tone = trend === 'up' ? 'strong' : trend === 'down' ? 'attention' : 'developing';
  const label = trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Flat';
  return <Badge label={label} level={tone} />;
}

function InsightRow({
  icon,
  title,
  detail,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  detail: string;
}) {
  return (
    <View style={styles.insightRow}>
      <View style={styles.insightIcon}>
        <Feather name={icon} size={16} color={Colors.accent} />
      </View>
      <View style={styles.insightCopy}>
        <Text style={Typography.cardTitle}>{title}</Text>
        <Text style={Typography.bodySecondary}>{detail}</Text>
      </View>
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
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  heroMetric: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    padding: Spacing.md,
  },
  heroMetricValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 2,
  },
  metricGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metricCard: {
    marginBottom: 0,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: 2,
  },
  sectionCard: {
    marginTop: Spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCopy: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
