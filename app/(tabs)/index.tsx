// File: app/(tabs)/index.tsx
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AIButton } from '@/components/calcmate/AIButton';
import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { OtherGroupsStrip } from '@/components/calcmate/OtherGroupsStrip';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { getClassroomState, getOtherGroups, upcomingClass } from '@/data/mockData';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export default function HomeScreen() {
  const router = useRouter();
  const classroomState = getClassroomState();
  const otherGroups = getOtherGroups(upcomingClass.groupId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={Typography.screenTitle}>Good morning, Teacher</Text>
        <Text style={[Typography.bodySecondary, styles.dateText]}>{today}</Text>

        {/* Classroom status */}
        <Card style={styles.section}>
          <Text style={Typography.eyebrow}>Classroom Today</Text>
          <Text style={styles.presentCount}>
            {classroomState.presentToday}
            <Text style={styles.presentCountTotal}> / {classroomState.totalStudents} students present</Text>
          </Text>
          <Text style={Typography.bodySecondary}>
            {classroomState.attendanceCompleted ? 'Attendance completed' : 'Attendance pending'}
          </Text>
          <Button
            label="Mark Attendance"
            style={styles.attendanceButton}
            onPress={() => router.push('/attendance' as never)}
          />
        </Card>

        {/* Upcoming class */}
        <Text style={[Typography.eyebrow, styles.blockHeading]}>Upcoming Class</Text>
        <Card style={styles.section}>
          <View style={styles.classHeaderRow}>
            <Text style={Typography.sectionTitle}>{upcomingClass.grade}</Text>
            <Text style={styles.time}>{upcomingClass.time}</Text>
          </View>
          <Text style={Typography.body}>{upcomingClass.subject}</Text>
          <Text style={[Typography.body, styles.concept]}>{upcomingClass.concept}</Text>

          <View style={styles.attentionRow}>
            <Feather name="alert-circle" size={14} color={Colors.attention} />
            <Text style={styles.attentionText}>
              {upcomingClass.studentsNeedingAttention} students need attention
            </Text>
          </View>

          <Button
            label="View Class"
            onPress={() =>
              router.push({
                pathname: '/pre-class',
                params: { groupId: upcomingClass.groupId },
              } as never)
            }
            style={styles.viewClassButton}
          />
        </Card>

        {/* Other groups */}
        <Card style={styles.section}>
          <OtherGroupsStrip groups={otherGroups} />
        </Card>

        <Button
          label="Schedule for the Day"
          variant="outline"
          onPress={() => router.push('/(tabs)/schedule' as never)}
          style={styles.scheduleButton}
        />
      </ScrollView>

      <AIButton />
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
  dateText: {
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.md,
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
  attendanceButton: {
    marginTop: Spacing.md,
  },
  blockHeading: {
    marginBottom: Spacing.sm,
    marginLeft: 2,
  },
  classHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  concept: {
    fontWeight: '600',
    marginTop: 2,
  },
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  attentionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.attention,
  },
  viewClassButton: {
    marginTop: Spacing.md,
  },
  scheduleButton: {
    marginTop: Spacing.xs,
  },
});
