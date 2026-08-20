// File: app/students/[studentId].tsx
// Phase 2 - student profile with knowledge state and attendance history.
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
import { getStudentById, setStudentAttendance } from '@/data/mockData';
import { Student } from '@/types';

function knowledgeLevel(level: Student['knowledgeLevel']) {
  switch (level) {
    case 'strong':
      return 'strong';
    case 'developing':
      return 'developing';
    case 'needs-attention':
      return 'attention';
  }
}

function knowledgeLabel(level: Student['knowledgeLevel']) {
  switch (level) {
    case 'strong':
      return 'Strong';
    case 'developing':
      return 'Developing';
    case 'needs-attention':
      return 'Needs attention';
  }
}

export default function StudentProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId?: string | string[] }>();
  const studentId = Array.isArray(params.studentId) ? params.studentId[0] : params.studentId;
  const [student, setStudent] = React.useState(() => (studentId ? getStudentById(studentId) : undefined));

  React.useEffect(() => {
    setStudent(studentId ? getStudentById(studentId) : undefined);
  }, [studentId]);

  const updateAttendance = React.useCallback(
    (attendance: Student['attendance']) => {
      if (!student) {
        return;
      }

      setStudentAttendance(
        student.id,
        attendance,
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
      setStudent(getStudentById(student.id));
    },
    [student]
  );

  if (!student) {
    return (
      <>
        <Stack.Screen options={{ title: 'Student', headerBackTitle: 'Students' }} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyState}>
            <Text style={Typography.screenTitle}>Student not found</Text>
            <Text style={[Typography.bodySecondary, styles.emptyDescription]}>
              The selected learner could not be loaded from the prototype data.
            </Text>
            <Button label="Back to Students" onPress={() => router.back()} style={styles.backButton} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  const attendanceHistory = [...(student.attendanceChanges ?? [])].reverse();

  return (
    <>
      <Stack.Screen options={{ title: student.name, headerBackTitle: 'Students' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLabel}>{student.initials}</Text>
              </View>

              <View style={styles.heroCopy}>
                <Text style={Typography.screenTitle}>{student.name}</Text>
                <Text style={Typography.bodySecondary}>{student.grade}</Text>
                <Text style={Typography.supporting}>{student.currentConcept}</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <Badge
                label={student.attendance === 'present' ? 'Present' : 'Absent'}
                level={student.attendance === 'present' ? 'strong' : 'critical'}
              />
              <Badge label={knowledgeLabel(student.knowledgeLevel)} level={knowledgeLevel(student.knowledgeLevel)} />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.smallButton, student.attendance === 'present' && styles.smallButtonActive]}
                activeOpacity={0.85}
                onPress={() => updateAttendance('present')}
              >
                <Text style={[styles.smallButtonLabel, student.attendance === 'present' && styles.smallButtonLabelActive]}>
                  Mark Present
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, student.attendance === 'absent' && styles.smallButtonCritical]}
                activeOpacity={0.85}
                onPress={() => updateAttendance('absent')}
              >
                <Text style={[styles.smallButtonLabel, student.attendance === 'absent' && styles.smallButtonLabelCritical]}>
                  Mark Absent
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {student.recommendation ? (
            <Card style={styles.sectionCard}>
              <Text style={Typography.eyebrow}>Instructional Priority</Text>
              <Text style={[Typography.body, styles.sectionBody]}>{student.recommendation}</Text>
            </Card>
          ) : null}

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Attendance History</Text>
            {student.attendanceNote ? (
              <View style={styles.historyRow}>
                <View style={styles.historyDot} />
                <View style={styles.historyCopy}>
                  <Text style={Typography.cardTitle}>{student.attendanceNote}</Text>
                  <Text style={Typography.supporting}>Current attendance note</Text>
                </View>
              </View>
            ) : null}

            {attendanceHistory.length === 0 ? (
              <Text style={[Typography.bodySecondary, styles.sectionBody]}>No attendance changes recorded yet.</Text>
            ) : (
              attendanceHistory.map((change, index) => (
                <View key={`${change.time}-${index}`} style={styles.historyRow}>
                  <View
                    style={[
                      styles.historyDot,
                      change.to === 'present' ? styles.historyDotPositive : styles.historyDotCritical,
                    ]}
                  />
                  <View style={styles.historyCopy}>
                    <Text style={Typography.cardTitle}>
                      {change.from === 'present' ? 'Present' : 'Absent'} to {change.to === 'present' ? 'Present' : 'Absent'}
                    </Text>
                    <Text style={Typography.supporting}>{change.time}</Text>
                  </View>
                </View>
              ))
            )}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Knowledge State</Text>
            <View style={styles.stateRow}>
              <Feather name="book-open" size={16} color={Colors.accent} />
              <Text style={Typography.cardTitle}>{knowledgeLabel(student.knowledgeLevel)}</Text>
            </View>
            <Text style={[Typography.bodySecondary, styles.sectionBody]}>
              Teacher-facing summary of current learner state for Fractions and the related classroom plan.
            </Text>
            <Button
              label="View Knowledge Trace"
              variant="outline"
              onPress={() => router.push(`/knowledge-trace` as never)}
              style={styles.traceButton}
            />
          </Card>
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
  heroCard: {
    marginBottom: Spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: '700',
  },
  heroCopy: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    flexWrap: 'wrap',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  smallButton: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    alignItems: 'center',
  },
  smallButtonActive: {
    backgroundColor: '#E9F4F3',
    borderColor: Colors.accent,
  },
  smallButtonCritical: {
    backgroundColor: '#FCECEC',
    borderColor: Colors.critical,
  },
  smallButtonLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  smallButtonLabelActive: {
    color: Colors.accent,
  },
  smallButtonLabelCritical: {
    color: Colors.critical,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  traceButton: {
    marginTop: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    marginTop: Spacing.md,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 6,
    backgroundColor: Colors.textSecondary,
  },
  historyDotPositive: {
    backgroundColor: Colors.success,
  },
  historyDotCritical: {
    backgroundColor: Colors.critical,
  },
  historyCopy: {
    flex: 1,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  emptyDescription: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  backButton: {
    marginTop: Spacing.md,
  },
});
