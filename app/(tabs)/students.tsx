// File: app/(tabs)/students.tsx
// Phase 2 - High-Fidelity Interactive Learner Directory
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  Layout,
} from 'react-native-reanimated';

import { EmptyState } from '@/components/calcmate/EmptyState';
import { getClassroomState, students, groups } from '@/data/mockData';
import { Student, Group } from '@/types';

type StudentFilter = 'All' | Group['grade'];

const filters: { id: StudentFilter; label: string }[] = [
  { id: 'All', label: 'All Students' },
  ...groups.map((group) => ({ id: group.grade, label: group.grade.replace('Grade ', 'G') })),
];

// Color palette generator for distinct student avatars
const AVATAR_PALETTES = [
  { bg: '#E6F4F1', text: '#147D7A' }, // Teal
  { bg: '#EEF2F6', text: '#2563EB' }, // Royal Blue
  { bg: '#FEF3C7', text: '#B45309' }, // Amber
  { bg: '#F3E8FF', text: '#7E22CE' }, // Purple
  { bg: '#FCE7F3', text: '#BE185D' }, // Rose
];

function getAvatarPalette(name: string) {
  const charCode = name.charCodeAt(0) || 0;
  return AVATAR_PALETTES[charCode % AVATAR_PALETTES.length];
}

const KNOWLEDGE_THEMES: Record<
  Student['knowledgeLevel'],
  { label: string; color: string; bg: string }
> = {
  strong: { label: 'Strong', color: '#147D7A', bg: '#E6F4F1' },
  developing: { label: 'Developing', color: '#B45309', bg: '#FEF3C7' },
  'needs-attention': { label: 'Needs Attention', color: '#DC2626', bg: '#FEE2E2' },
};

const StudentCard = React.memo(
  ({ student, onPress }: { student: Student; onPress: () => void }) => {
    const isPresent = student.attendance === 'present';
    const palette = getAvatarPalette(student.name);
    const knowledge = KNOWLEDGE_THEMES[student.knowledgeLevel] || KNOWLEDGE_THEMES.strong;

    return (
      <Animated.View
        layout={Layout.springify().damping(16)}
        entering={FadeInDown.duration(260)}
        style={styles.cardWrapper}
      >
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
        >
          {/* Main Info Row */}
          <View style={styles.cardHeader}>
            <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
              <Text style={[styles.avatarText, { color: palette.text }]}>
                {student.initials}
              </Text>
            </View>

            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName}>{student.name}</Text>
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeBadgeText}>{student.grade}</Text>
                </View>
              </View>

              <Text style={styles.conceptText} numberOfLines={1}>
                {student.currentConcept || 'Core Concepts'}
              </Text>
            </View>

            {/* Attendance Indicator */}
            <View
              style={[
                styles.attendanceChip,
                { backgroundColor: isPresent ? '#E6F4F1' : '#FDF2F0' },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isPresent ? '#147D7A' : '#EF4444' },
                ]}
              />
              <Text
                style={[
                  styles.attendanceText,
                  { color: isPresent ? '#147D7A' : '#DC2626' },
                ]}
              >
                {isPresent ? 'Present' : 'Absent'}
              </Text>
            </View>
          </View>

          {/* Card Footer with Knowledge Badge */}
          <View style={styles.cardFooter}>
            <View style={[styles.knowledgeBadge, { backgroundColor: knowledge.bg }]}>
              <Feather name="bar-chart-2" size={11} color={knowledge.color} />
              <Text style={[styles.knowledgeText, { color: knowledge.color }]}>
                {knowledge.label}
              </Text>
            </View>

            <View style={styles.profileLink}>
              <Text style={styles.profileLinkText}>View Profile</Text>
              <Feather name="chevron-right" size={14} color="#147D7A" />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

export default function StudentsScreen() {
  const router = useRouter();
  const classroomState = getClassroomState();
  const [filter, setFilter] = useState<StudentFilter>('All');
  const [query, setQuery] = useState('');

  const visibleStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesFilter = filter === 'All' || student.grade === filter;
      const text = `${student.name} ${student.grade} ${student.currentConcept}`.toLowerCase();
      const matchesQuery = text.includes(query.trim().toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const attendancePercent = Math.round(
    (classroomState.presentToday / (classroomState.totalStudents || 1)) * 100
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Learners Directory</Text>
            <Text style={styles.subtitle}>Multi-grade classroom roster & progress</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeNum}>{classroomState.totalStudents}</Text>
            <Text style={styles.totalBadgeLabel}>Roster</Text>
          </View>
        </View>

        {/* Visual Attendance Ratio Bar */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusTitle}>Today's Attendance</Text>
              <Text style={styles.statusSub}>
                <Text style={styles.highlightCount}>{classroomState.presentToday}</Text> present •{' '}
                <Text style={styles.absentCount}>{classroomState.absentToday}</Text> absent
              </Text>
            </View>
            <View style={styles.percentPill}>
              <Text style={styles.percentText}>{attendancePercent}% Active</Text>
            </View>
          </View>

          <View style={styles.trackBackground}>
            <View style={[styles.trackFill, { width: `${attendancePercent}%` }]} />
          </View>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#667085" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search student, grade, or concept..."
            placeholderTextColor="#98A2B3"
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Feather name="x-circle" size={16} color="#667085" />
            </TouchableOpacity>
          )}
        </View>

        {/* Grade Filter Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {filters.map((item) => {
            const active = item.id === filter;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.8}
                onPress={() => setFilter(item.id)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Roster List / Empty State */}
        {visibleStudents.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon={<Feather name="users" size={20} color="#147D7A" />}
              title="No students found"
              description="Try adjusting your filter or search term to discover students."
              actionLabel="Reset Search"
              onAction={() => {
                setFilter('All');
                setQuery('');
              }}
            />
          </View>
        ) : (
          <View style={styles.listGroup}>
            {visibleStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onPress={() => router.push(`/students/${student.id}` as never)}
              />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#17233C',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#667085',
    marginTop: 2,
    fontWeight: '500',
  },
  totalBadge: {
    backgroundColor: '#17233C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalBadgeNum: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  totalBadgeLabel: {
    color: '#98A2B3',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAECE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusSub: {
    fontSize: 14,
    color: '#667085',
    marginTop: 2,
  },
  highlightCount: {
    fontWeight: '800',
    color: '#147D7A',
  },
  absentCount: {
    fontWeight: '800',
    color: '#DC2626',
  },
  percentPill: {
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  percentText: {
    color: '#147D7A',
    fontSize: 12,
    fontWeight: '700',
  },
  trackBackground: {
    height: 8,
    backgroundColor: '#F0F2EE',
    borderRadius: 999,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#147D7A',
    borderRadius: 999,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EAECE8',
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#17233C',
  },
  clearBtn: {
    padding: 4,
  },
  filterBar: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECE8',
  },
  filterChipActive: {
    backgroundColor: '#17233C',
    borderColor: '#17233C',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667085',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  emptyWrapper: {
    marginTop: 20,
  },
  listGroup: {
    gap: 12,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAECE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17233C',
  },
  gradeBadge: {
    backgroundColor: '#F0F2EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#667085',
  },
  conceptText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
    fontWeight: '500',
  },
  attendanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  attendanceText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F2EE',
  },
  knowledgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  knowledgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#147D7A',
  },
});