// File: app/groups/[groupId].tsx
// Phase 3 - compact group detail with live instructional state.
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
import { getGroupById, getStudentsByGroup, scheduleToday } from '@/data/mockData';
import { Group, Student } from '@/types';

const modeLabels: Record<Group['activityMode'], string> = {
  'teacher-led': 'Teacher-led',
  independent: 'Independent',
  parallel: 'Parallel learning',
  assessment: 'Assessment',
};

const modeLevels: Record<Group['activityMode'], 'strong' | 'developing' | 'attention' | 'critical'> = {
  'teacher-led': 'strong',
  independent: 'developing',
  parallel: 'attention',
  assessment: 'critical',
};

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

export default function GroupDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;
  const [group, setGroup] = React.useState(() => (groupId ? getGroupById(groupId) : undefined));

  React.useEffect(() => {
    setGroup(groupId ? getGroupById(groupId) : undefined);
  }, [groupId]);

  const groupStudents = React.useMemo(() => {
    return group ? getStudentsByGroup(group.id) : [];
  }, [group]);

  const groupBlocks = React.useMemo(() => {
    return group ? scheduleToday.filter((block) => block.groupId === group.id) : [];
  }, [group]);

  if (!group) {
    return (
      <>
        <Stack.Screen options={{ title: 'Group', headerBackTitle: 'Groups' }} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyState}>
            <Text style={Typography.screenTitle}>Group not found</Text>
            <Text style={[Typography.bodySecondary, styles.emptyDescription]}>
              The selected group is not available in the prototype data.
            </Text>
            <Button label="Back to Groups" onPress={() => router.back()} style={styles.backButton} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: group.grade, headerBackTitle: 'Groups' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Classroom State</Text>
            <View style={styles.heroHeader}>
              <View style={styles.heroCopy}>
                <Text style={Typography.screenTitle}>{group.grade}</Text>
                <Text style={Typography.bodySecondary}>{group.currentSubject}</Text>
                <Text style={Typography.body}>{group.currentConcept}</Text>
              </View>
              <Badge label={modeLabels[group.activityMode]} level={modeLevels[group.activityMode]} />
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{group.studentCount}</Text>
                <Text style={Typography.supporting}>Students</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{group.presentCount}</Text>
                <Text style={Typography.supporting}>Present</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{group.minutesRemaining ?? '—'}</Text>
                <Text style={Typography.supporting}>Minutes</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Current Instruction</Text>
            <View style={styles.instructionRow}>
              <Feather name="book-open" size={16} color={Colors.accent} />
              <Text style={Typography.cardTitle}>{group.currentConcept}</Text>
            </View>
            <Text style={[Typography.bodySecondary, styles.sectionBody]}>
              {group.activityMode === 'teacher-led'
                ? 'The teacher is actively leading this group right now.'
                : 'This group is working independently while the teacher focuses elsewhere.'}
            </Text>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Students</Text>
            {groupStudents.length === 0 ? (
              <Text style={[Typography.bodySecondary, styles.sectionBody]}>
                No student roster has been seeded for this group yet.
              </Text>
            ) : (
              groupStudents.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/students/${student.id}` as never)}
                  style={styles.studentRow}
                >
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentAvatarLabel}>{student.initials}</Text>
                  </View>
                  <View style={styles.studentCopy}>
                    <View style={styles.studentTopRow}>
                      <Text style={Typography.cardTitle}>{student.name}</Text>
                      <Badge
                        label={student.attendance === 'present' ? 'Present' : 'Absent'}
                        level={student.attendance === 'present' ? 'strong' : 'critical'}
                      />
                    </View>
                    <Text style={Typography.supporting}>{student.currentConcept}</Text>
                  </View>
                  <Badge label={knowledgeLabel(student.knowledgeLevel)} level={knowledgeLevel(student.knowledgeLevel)} />
                </TouchableOpacity>
              ))
            )}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Today&apos;s Schedule</Text>
            {groupBlocks.length === 0 ? (
              <Text style={[Typography.bodySecondary, styles.sectionBody]}>
                No schedule blocks are available for this group in the current mock data.
              </Text>
            ) : (
              groupBlocks.map((block) => (
                <View key={block.id} style={styles.scheduleRow}>
                  <View style={styles.scheduleTime}>
                    <Text style={Typography.cardTitle}>{block.time}</Text>
                    <Text style={Typography.supporting}>{block.endTime}</Text>
                  </View>
                  <View style={styles.scheduleCopy}>
                    <Text style={Typography.cardTitle}>{block.concept}</Text>
                    <Text style={Typography.bodySecondary}>{block.subject}</Text>
                  </View>
                  <Badge label={modeLabels[block.mode]} level={modeLevels[block.mode]} />
                </View>
              ))
            )}
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
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  heroCopy: {
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metricBox: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    padding: Spacing.sm,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarLabel: {
    color: Colors.accent,
    fontWeight: '700',
  },
  studentCopy: {
    flex: 1,
  },
  studentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  scheduleTime: {
    width: 60,
  },
  scheduleCopy: {
    flex: 1,
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
