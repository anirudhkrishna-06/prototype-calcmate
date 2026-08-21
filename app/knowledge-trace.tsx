// File: app/knowledge-trace.tsx
// Phase 6 - student knowledge progression trace.
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

import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { getKnowledgeTraceForStudent, students } from '@/data/mockData';

// Show the first 4 students as selectable
const traceStudents = students.slice(0, 4);

function knowledgeBadge(level: string) {
  if (level === 'strong') return { label: 'Strong', color: Colors.accent };
  if (level === 'developing') return { label: 'Developing', color: Colors.attention };
  return { label: 'Needs attention', color: Colors.critical };
}

export default function KnowledgeTraceScreen() {
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = React.useState(
    traceStudents[0]?.id ?? students[0].id
  );
  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? students[0];
  const trace = getKnowledgeTraceForStudent(selectedStudent.id);
  const badge = knowledgeBadge(selectedStudent.knowledgeLevel);

  return (
    <>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Knowledge Trace</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            A quiet view of how learner state changes when attendance, teaching, and evidence come
            together.
          </Text>

          <Card style={styles.card}>
            <Text style={Typography.eyebrow}>Student Focus</Text>
            <View style={styles.studentChips}>
              {traceStudents.map((student) => {
                const active = student.id === selectedStudentId;
                return (
                  <TouchableOpacity
                    key={student.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedStudentId(student.id)}
                    style={[styles.studentChip, active && styles.studentChipActive]}
                  >
                    <Text style={[styles.chipName, active && styles.chipNameActive]}>
                      {student.name}
                    </Text>
                    <Text style={[styles.chipGrade, active && styles.chipGradeActive]}>
                      {student.grade}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.studentHeader}>
              <View>
                <Text style={styles.studentName}>{selectedStudent.name}</Text>
                <Text style={Typography.bodySecondary}>{selectedStudent.grade}</Text>
              </View>
              <View style={styles.badgeRow}>
                <View style={[styles.dot, { backgroundColor: badge.color }]} />
                <Text style={[styles.badgeLabel, { color: badge.color }]}>{badge.label}</Text>
              </View>
            </View>

            {trace.length === 0 ? (
              <View style={styles.emptyTrace}>
                <Feather name="activity" size={20} color={Colors.textSecondary} />
                <Text style={[Typography.bodySecondary, { marginTop: Spacing.sm }]}>
                  No trace data yet for this student.
                </Text>
              </View>
            ) : (
              <View style={styles.traceList}>
                {trace.map((point, index) => (
                  <View key={point.id} style={styles.traceRow}>
                    <View style={styles.traceRail}>
                      <View style={styles.traceDot} />
                      {index < trace.length - 1 && <View style={styles.traceLine} />}
                    </View>
                    <View style={styles.traceCopy}>
                      <View style={styles.traceTopRow}>
                        <Text style={styles.traceTime}>{point.time}</Text>
                        <Text style={styles.traceScore}>{Math.round(point.mastery * 100)}%</Text>
                      </View>
                      <Text style={Typography.body}>{point.evidence}</Text>
                      <Text style={[Typography.supporting, styles.traceConcept]}>
                        {point.concept}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card style={styles.card}>
            <Text style={Typography.eyebrow}>What this means</Text>
            <Text style={[Typography.body, styles.sectionBody]}>
              The trace shows a shift from a fragile starting point toward a stronger outcome after
              teacher support and classroom evidence.
            </Text>
          </Card>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => router.push(`/students/${selectedStudent.id}` as never)}
          >
            <Text style={styles.actionButtonLabel}>Open Student Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl * 2 },
  subtitle: { marginTop: Spacing.xs, marginBottom: Spacing.lg },
  card: { marginBottom: Spacing.md },
  studentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  studentChip: {
    borderRadius: 999, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, alignItems: 'center',
  },
  studentChipActive: { borderColor: Colors.accent, backgroundColor: '#E6F2F0' },
  chipName: { fontSize: 14, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  chipNameActive: { color: Colors.accent },
  chipGrade: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 1 },
  chipGradeActive: { color: Colors.accent },
  studentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  studentName: { fontSize: 22, fontWeight: '700', color: Colors.text },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badgeLabel: { fontSize: 13, fontWeight: '600' },
  emptyTrace: { alignItems: 'center', paddingVertical: Spacing.xl },
  traceList: { gap: 0 },
  traceRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  traceRail: { width: 18, alignItems: 'center', paddingTop: 4 },
  traceDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.accent },
  traceLine: { width: 2, flex: 1, backgroundColor: Colors.border, marginTop: 4, minHeight: 40 },
  traceCopy: { flex: 1, paddingBottom: Spacing.sm },
  traceTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  traceTime: { fontSize: 18, fontWeight: '700', color: Colors.text },
  traceScore: { fontSize: 16, fontWeight: '700', color: Colors.accent },
  traceConcept: { marginTop: 2 },
  sectionBody: { marginTop: Spacing.sm, lineHeight: 22 },
  actionButton: { backgroundColor: Colors.accent, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  actionButtonLabel: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
