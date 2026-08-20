// File: app/assessment-schedule.tsx
// Phase 6 - schedule an assessment with prerequisite guidance.
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
import { assessments, getAssessmentById, getAssessmentResultById } from '@/data/mockData';

export default function AssessmentScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ assessmentId?: string | string[] }>();
  const assessmentId = Array.isArray(params.assessmentId) ? params.assessmentId[0] : params.assessmentId ?? assessments[0].id;
  const [selectedId, setSelectedId] = React.useState(assessmentId);

  React.useEffect(() => {
    setSelectedId(assessmentId);
  }, [assessmentId]);

  const selectedAssessment = getAssessmentById(selectedId) ?? assessments[0];
  const result = getAssessmentResultById(selectedAssessment.id);

  return (
    <>
      <Stack.Screen options={{ title: 'Schedule Assessment', headerBackTitle: 'Assessments' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Schedule Assessment</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Choose the concept, check the prerequisite chain, and keep the planning step compact.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Assessment Picker</Text>
            <View style={styles.pickerRow}>
              {assessments.map((assessment) => {
                const active = assessment.id === selectedId;
                return (
                  <TouchableOpacity
                    key={assessment.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedId(assessment.id)}
                    style={[styles.pickerChip, active && styles.pickerChipActive]}
                  >
                    <Text style={[styles.pickerLabel, active && styles.pickerLabelActive]}>{assessment.grade}</Text>
                    <Text style={[Typography.supporting, active && styles.pickerDetailActive]}>{assessment.concept}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <View style={styles.titleRow}>
              <View style={styles.titleCopy}>
                <Text style={Typography.sectionTitle}>
                  {selectedAssessment.grade} - {selectedAssessment.concept}
                </Text>
                <Text style={Typography.bodySecondary}>{selectedAssessment.subject}</Text>
              </View>
              <Badge label={selectedAssessment.difficulty} level="attention" />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>{selectedAssessment.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>{selectedAssessment.duration}</Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <Feather name="alert-triangle" size={16} color={Colors.attention} />
              <View style={styles.warningCopy}>
                <Text style={Typography.cardTitle}>Prerequisite check</Text>
                <Text style={Typography.bodySecondary}>
                  {selectedAssessment.prerequisite
                    ? `${selectedAssessment.prerequisite} should be confirmed before this assessment is scheduled.`
                    : 'No prerequisite warning detected for this concept.'}
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Existing Evidence</Text>
            {result ? (
              <View style={styles.resultGrid}>
                <Metric label="Mastery" value={`${result.mastery}%`} />
                <Metric label="Strong" value={`${result.strongCount}`} />
                <Metric label="Developing" value={`${result.developingCount}`} />
                <Metric label="Needs attention" value={`${result.needsAttentionCount}`} />
              </View>
            ) : (
              <Text style={[Typography.bodySecondary, styles.sectionBody]}>No previous result available.</Text>
            )}
          </Card>

          <View style={styles.actionStack}>
            <Button
              label="Schedule"
              onPress={() => router.push('/assessments' as never)}
            />
            <Button
              label="Conduct Now"
              variant="outline"
              onPress={() =>
                router.push({
                  pathname: '/assessment-conduct',
                  params: { assessmentId: selectedAssessment.id },
                } as never)
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  pickerRow: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  pickerChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  pickerChipActive: {
    borderColor: Colors.accent,
    backgroundColor: '#E9F4F3',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  pickerLabelActive: {
    color: Colors.accent,
  },
  pickerDetailActive: {
    color: Colors.accent,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  titleCopy: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metaItem: {
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
  warningBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#F1D7A8',
    backgroundColor: '#FFF7E9',
    padding: Spacing.md,
  },
  warningCopy: {
    flex: 1,
  },
  resultGrid: {
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
  sectionBody: {
    marginTop: Spacing.sm,
  },
  actionStack: {
    gap: Spacing.sm,
  },
});
