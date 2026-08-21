// File: app/attendance.tsx
// Phase 2 - High-fidelity, animated classroom attendance module
import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import {
  getClassroomState,
  students as allStudents,
  setStudentAttendance,
  groups,
} from '@/data/mockData';
import { Student, Group } from '@/types';

type GradeFilter = 'All' | Group['grade'];

// Animated Student Row Item
const StudentRow = React.memo(({ student, onToggle, onPressProfile }: {
  student: Student;
  onToggle: (student: Student) => void;
  onPressProfile: (id: string) => void;
}) => {
  const isPresent = student.attendance === 'present';

  const badgeStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isPresent ? '#E6F4F1' : '#FDF2F0', { duration: 200 }),
    borderColor: withTiming(isPresent ? Colors.accent : '#E57373', { duration: 200 }),
  }));

  return (
    <Animated.View 
      layout={Layout.springify().damping(16)} 
      entering={FadeInDown.duration(250)}
      style={styles.studentCard}
    >
      <Pressable 
        style={styles.cardContent}
        onPress={() => onPressProfile(student.id)}
        android_ripple={{ color: '#F0F0F0' }}
      >
        <View style={[styles.avatar, isPresent && styles.avatarPresent]}>
          <Text style={[styles.avatarText, isPresent && styles.avatarTextPresent]}>
            {student.initials}
          </Text>
        </View>

        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentMeta}>
            {student.grade} • {student.attendanceNote || student.currentConcept}
          </Text>
        </View>

        {/* Instant 1-Tap Attendance Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggle(student)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Animated.View style={[styles.statusBadge, badgeStyle]}>
            <Feather 
              name={isPresent ? "check" : "x"} 
              size={14} 
              color={isPresent ? Colors.accent : '#D32F2F'} 
            />
            <Text style={[styles.statusText, { color: isPresent ? Colors.accent : '#D32F2F' }]}>
              {isPresent ? 'Present' : 'Absent'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
});

export default function AttendanceScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<GradeFilter>('All');
  const [classroomState, setClassroomState] = useState(() => getClassroomState());

  const refreshState = useCallback(() => {
    setClassroomState(getClassroomState());
  }, []);

  const roster = useMemo(() => {
    return allStudents.filter(s => filter === 'All' || s.grade === filter);
  }, [filter, classroomState]);

  const toggleStudent = useCallback((student: Student) => {
    const nextStatus = student.attendance === 'present' ? 'absent' : 'present';
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setStudentAttendance(student.id, nextStatus, time);
    refreshState();
  }, [refreshState]);

  const markAllFilteredPresent = useCallback(() => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    roster.forEach(s => {
      if (s.attendance !== 'present') {
        setStudentAttendance(s.id, 'present', time);
      }
    });
    refreshState();
  }, [roster, refreshState]);

  const gradeFilters = ['All', ...groups.map(g => g.grade)];
  const attendanceRatio = classroomState.presentToday / (classroomState.totalStudents || 1);

  return (
    <>
      <Stack.Screen options={{ title: '', headerShadowVisible: false, headerStyle: { backgroundColor: Colors.background } }} />
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Header & Quick Stat Bar */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Attendance</Text>
              <Text style={styles.subtext}>{classroomState.activeGroups} Active Groups Today</Text>
            </View>
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllFilteredPresent} activeOpacity={0.8}>
              <Feather name="check-circle" size={15} color={Colors.accent} />
              <Text style={styles.markAllText}>Mark All Present</Text>
            </TouchableOpacity>
          </View>

          {/* Visual Progress Ratio Indicator */}
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Classroom Presence</Text>
              <Text style={styles.progressCount}>
                <Text style={styles.highlightCount}>{classroomState.presentToday}</Text>
                <Text style={styles.totalCount}> / {classroomState.totalStudents}</Text>
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${attendanceRatio * 100}%` }]} />
            </View>
          </View>

          {/* Horizontal Grade Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
            {gradeFilters.map((g) => {
              const active = g === filter;
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setFilter(g as GradeFilter)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {g === 'All' ? 'All Grades' : g.replace('Grade ', 'G')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Student Roster List */}
          <View style={styles.listContainer}>
            {roster.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onToggle={toggleStudent}
                onPressProfile={(id) => router.push(`/students/${id}` as never)}
              />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background || '#F7F8F5',
  },
  container: {
    paddingHorizontal: Spacing.md || 46,
    paddingBottom: 40,
    marginTop: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text || '#17233C',
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 13,
    color: '#667085',
    marginTop: 2,
    fontWeight: '500',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md || 10,
    backgroundColor: '#E6F4F1',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent || '#147D7A',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAECE8',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667085',
  },
  progressCount: {
    fontSize: 14,
  },
  highlightCount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text || '#17233C',
  },
  totalCount: {
    fontSize: 14,
    color: '#667085',
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F0F2EE',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent || '#147D7A',
    borderRadius: 999,
  },
  filterBar: {
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECE8',
  },
  chipActive: {
    backgroundColor: Colors.accent || '#147D7A',
    borderColor: Colors.accent || '#147D7A',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667085',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 10,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECE8',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPresent: {
    backgroundColor: '#E6F4F1',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667085',
  },
  avatarTextPresent: {
    color: Colors.accent || '#147D7A',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text || '#17233C',
  },
  studentMeta: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});