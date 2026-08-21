// File: app/attendance.tsx
// Phase 2 - editable attendance for the classroom state.
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
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
  getClassroomState,
  students as allStudents,
  markAllStudentsPresent,
  setStudentAttendance,
  groups,
} from '@/data/mockData';
import { Student, Group } from '@/types';

type GradeFilter = 'All' | Group['grade'];

function attendanceLevel(attendance: Student['attendance']) {
  return attendance === 'present' ? 'strong' : 'critical';
}

function statusText(attendance: Student['attendance']) {
  return attendance === 'present' ? 'Present' : 'Absent';
}

export default function AttendanceScreen() {
  const router = useRouter();
  const [filter, setFilter] = React.useState<GradeFilter>('All');
  
  // We use classroomState to force a re-render when attendance changes
  const [classroomState, setClassroomState] = React.useState(() => getClassroomState());

  const refresh = React.useCallback(() => {
    setClassroomState(getClassroomState());
  }, []);

  const roster = React.useMemo(() => {
    return allStudents.filter(s => filter === 'All' || s.grade === filter);
  }, [filter, classroomState]);

  const toggleStudent = React.useCallback(
    (student: Student) => {
      const nextStatus = student.attendance === 'present' ? 'absent' : 'present';
      setStudentAttendance(
        student.id,
        nextStatus,
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
      refresh();
    },
    [refresh]
  );

  const markAllFilteredPresent = React.useCallback(() => {
    // Only mark students in the current filter as present
    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    
    roster.forEach(student => {
      if (student.attendance !== 'present') {
        setStudentAttendance(student.id, 'present', time);
      }
    });
    
    refresh();
  }, [roster, refresh]);

  const gradeFilters = ['All', ...groups.map(g => g.grade)];

  return (
    <>
      <Stack.Screen options={{ title: 'Attendance' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Mark Attendance</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Editable classroom state for all grades. Attendance changes immediately affect student profiles and downstream planning.
          </Text>

          <Card style={styles.summaryCard}>
            <Text style={Typography.eyebrow}>Classroom Today</Text>
            <Text style={styles.presentCount}>
              {classroomState.presentToday}
              <Text style={styles.presentCountTotal}> / {classroomState.totalStudents}</Text>
            </Text>
            <Text style={Typography.bodySecondary}>
              {classroomState.absentToday} absent, {classroomState.activeGroups} active groups
            </Text>
          </Card>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {gradeFilters.map((gradeFilter) => {
              const active = gradeFilter === filter;
              return (
                <TouchableOpacity
                  key={gradeFilter}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  activeOpacity={0.85}
                  onPress={() => setFilter(gradeFilter as GradeFilter)}
                >
                  <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                    {gradeFilter.replace('Grade ', 'G')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={Typography.sectionTitle}>{filter === 'All' ? 'All Students' : filter} roster</Text>
              <Text style={Typography.supporting}>Tap a row to view profile.</Text>
            </View>
            <Button label="Mark All Present" onPress={markAllFilteredPresent} style={styles.primaryAction} />
          </View>

          {roster.map((student) => (
            <Card key={student.id} style={styles.studentCard}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push(`/students/${student.id}` as never)}
              >
                <View style={styles.studentRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarLabel}>{student.initials}</Text>
                  </View>

                  <View style={styles.studentCopy}>
                    <View style={styles.nameRow}>
                      <Text style={Typography.cardTitle}>{student.name}</Text>
                      <Badge label={statusText(student.attendance)} level={attendanceLevel(student.attendance)} />
                    </View>
                    <Text style={Typography.bodySecondary}>{student.grade}</Text>
                    <Text style={Typography.supporting}>{student.attendanceNote ?? student.currentConcept}</Text>
                  </View>

                  <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
                </View>
              </TouchableOpacity>

              <View style={styles.rowActions}>
                <TouchableOpacity
                  style={[styles.smallButton, student.attendance === 'present' && styles.smallButtonActive]}
                  activeOpacity={0.85}
                  onPress={() => toggleStudent(student)}
                >
                  <Text
                    style={[
                      styles.smallButtonLabel,
                      student.attendance === 'present' && styles.smallButtonLabelActive,
                    ]}
                  >
                    {student.attendance === 'present' ? 'Mark Absent' : 'Mark Present'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push(`/students/${student.id}` as never)}
                >
                  <Text style={styles.profileLink}>View profile</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
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
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  presentCount: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  presentCountTotal: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  filterRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: Colors.white,
  },
  primaryAction: {
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  studentCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    color: Colors.accent,
    fontWeight: '700',
  },
  studentCopy: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  rowActions: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallButton: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  smallButtonActive: {
    borderColor: Colors.accent,
    backgroundColor: '#E9F4F3',
  },
  smallButtonLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  smallButtonLabelActive: {
    color: Colors.accent,
  },
  profileLink: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
