// File: app/knowledge-trace.tsx
// Phase 6 - student knowledge progression trace.
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
import { Colors, Spacing, Typography } from '@/constants/theme';
import { getKnowledgeTraceForStudent, students } from '@/data/mockData';

const traceStudents = students.slice(0, 4);

export default function KnowledgeTraceScreen() {
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = React.useState(traceStudents[0]?.id ?? students[0].id);
  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? students[0];
  const trace = getKnowledgeTraceForStudent(selectedStudent.id);

  return (
    <>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Knowledge Trace</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            A quiet view of how learner state changes when attendance, teaching, and evidence come together.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Student focus</Text>
            <View style={styles.studentChips}>
              {traceStudents.map((student) => {
                const active = student.id === selectedStudentId;
                return (
                  <TouchableOpacity
                    key={student.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedStudentId(student.id)}
                    style={[styles.studentChip, active && styles.studentChipActive]}
                  >
                    <Text style={[styles.studentChipLabel, active && styles.studentChipLabelActive]}>{student.name}</Text>
                    <Text style={[Typography.supporting, active && styles.studentChipDetailActive]}>{student.grade}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <View style={styles.sectionTopRow}>
              <View style={styles.sectionCopy}>
                <Text style={Typography.sectionTitle}>{selectedStudent.name}</Text>
                <Text style={Typography.bodySecondary}>{selectedStudent.grade}</Text>
              </View>
              <Badge
                label={selectedStudent.knowledgeLevel === 'strong' ? 'Strong' : selectedStudent.knowledgeLevel === 'developing' ? 'Developing' : 'Needs attention'}
                level={selectedStudent.knowledgeLevel === 'strong' ? 'strong' : selectedStudent.knowledgeLevel === 'developing' ? 'attention' : 'critical'}
              />
            </View>

            <View style={styles.traceList}>
              {trace.map((point, index) => (
                <View key={point.id} style={styles.traceRow}>
                  <View style={styles.traceRail}>
                    <View style={styles.traceDot} />
                    {index < trace.length - 1 ? <View style={styles.traceLine} /> : null}
                  </View>
                  <View style={styles.traceCopy}>
                    <View style={styles.traceHeader}>
                      <Text style={Typography.cardTitle}>{point.time}</Text>
                      <Text style={styles.traceScore}>{Math.round(point.mastery * 100)}%</Text>
                    </View>
                    <Text style={Typography.bodySecondary}>{point.evidence}</Text>
                    <Text style={Typography.supporting}>{point.concept}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>What this means</Text>
            <Text style={[Typography.bodySecondary, styles.sectionBody]}>
              The trace shows a shift from a fragile starting point toward a stronger outcome after teacher support and classroom evidence.
            </Text>
          </Card>

          <View style={styles.actionRow}>
            <Button
              label="Open Student Profile"
              onPress={() => router.push(`/students/${selectedStudent.id}` as never)}
              style={styles.flexButton}
            />
            <Button
              label="Open Insights"
              variant="outline"
              onPress={() => router.push('/insights' as never)}
              style={styles.flexButton}
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
  studentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  studentChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  studentChipActive: {
    borderColor: Colors.accent,
    backgroundColor: '#E9F4F3',
  },
  studentChipLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  studentChipLabelActive: {
    color: Colors.accent,
  },
  studentChipDetailActive: {
    color: Colors.accent,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  sectionCopy: {
    flex: 1,
  },
  traceList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  traceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  traceRail: {
    width: 18,
    alignItems: 'center',
  },
  traceDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.accent,
    marginTop: 5,
  },
  traceLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  traceCopy: {
    flex: 1,
    paddingBottom: Spacing.sm,
  },
  traceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  traceScore: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
