// File: app/(tabs)/students.tsx
// Phase 2 - student list with quick access to learner profiles.
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/calcmate/Badge';
import { Card } from '@/components/calcmate/Card';
import { EmptyState } from '@/components/calcmate/EmptyState';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { getClassroomState, students, groups } from '@/data/mockData';
import { Student, Group } from '@/types';

type StudentFilter = 'All' | Group['grade'];

const filters: { id: StudentFilter; label: string }[] = [
  { id: 'All', label: 'All' },
  ...groups.map((group) => ({ id: group.grade, label: group.grade.replace('Grade ', 'G') })),
];

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

export default function StudentsScreen() {
  const router = useRouter();
  const classroomState = getClassroomState();
  const [filter, setFilter] = React.useState<StudentFilter>('All');
  const [query, setQuery] = React.useState('');

  const visibleStudents = React.useMemo(() => {
    return students.filter((student) => {
      const matchesFilter =
        filter === 'All' || student.grade === filter;

      const text = `${student.name} ${student.grade} ${student.currentConcept}`.toLowerCase();
      const matchesQuery = text.includes(query.trim().toLowerCase());

      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={Typography.screenTitle}>Students Directory</Text>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={Typography.eyebrow}>Today's Status</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{classroomState.totalStudents}</Text>
              <Text style={Typography.supporting}>Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{classroomState.presentToday}</Text>
              <Text style={Typography.supporting}>Present</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.absentValue]}>{classroomState.absentToday}</Text>
              <Text style={Typography.supporting}>Absent</Text>
            </View>
          </View>
        </Card>

        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={Colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name, grade, or concept..."
            placeholderTextColor={Colors.textSecondary}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((item) => {
            const active = item.id === filter;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.85}
                onPress={() => setFilter(item.id)}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {visibleStudents.length === 0 ? (
          <EmptyState
            icon={<Feather name="users" size={18} color={Colors.accent} />}
            title="No students match"
            description="Try a different search term or clear the filters to see the full roster."
            actionLabel="Clear filters"
            onAction={() => {
              setFilter('All');
              setQuery('');
            }}
          />
        ) : (
          visibleStudents.map((student) => (
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
                  <Text style={Typography.cardTitle}>{student.name}</Text>
                  <Text style={Typography.caption}>{student.grade}</Text>
                </View>
                <Badge
                  label={student.attendance === 'present' ? 'Present' : 'Absent'}
                  level={student.attendance === 'present' ? 'strong' : 'critical'}
                />
              </View>
            </TouchableOpacity>
          </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
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
  headerContainer: {
    marginBottom: Spacing.md,
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  absentValue: {
    color: Colors.critical,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 14,
  },
  filterRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
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
    backgroundColor: '#E7F2F1', // very light teal
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
  footerRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLink: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  recommendation: {
    marginTop: Spacing.sm,
  },
});
