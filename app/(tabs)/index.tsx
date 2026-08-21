// File: app/(tabs)/index.tsx
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
        <View style={styles.headerRow}>
          <View>
            <Text style={Typography.screenTitle}>Good morning</Text>
            <Text style={[Typography.bodySecondary, styles.dateText]}>{today}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/more' as never)} style={styles.settingsIcon}>
            <Feather name="settings" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Classroom status */}
        <Card style={styles.attendanceCard}>
          <Text style={Typography.eyebrow}>Total Classroom Attendance</Text>
          <View style={styles.attendanceRow}>
            <Text style={styles.presentCount}>
              {classroomState.presentToday}
              <Text style={styles.presentCountTotal}> / {classroomState.totalStudents}</Text>
            </Text>
            <Button
              label={classroomState.attendanceCompleted ? 'Update' : 'Mark'}
              style={styles.attendanceButton}
              onPress={() => router.push('/attendance' as never)}
            />
          </View>
        </Card>

        {/* Upcoming class */}
        <Text style={[Typography.eyebrow, styles.blockHeading]}>Next Class</Text>
        <Card style={styles.heroCard}>
          <View style={styles.classHeaderRow}>
            <Text style={Typography.sectionTitle}>{upcomingClass.grade}</Text>
            <View style={styles.timeBadge}>
              <Feather name="clock" size={12} color={Colors.accent} />
              <Text style={styles.time}>{upcomingClass.time}</Text>
            </View>
          </View>
          
          <Text style={[Typography.body, styles.subjectText]}>{upcomingClass.subject}</Text>
          <Text style={[Typography.body, styles.concept]}>{upcomingClass.concept}</Text>

          {upcomingClass.studentsNeedingAttention > 0 && (
            <View style={styles.attentionRow}>
              <Feather name="alert-triangle" size={16} color={Colors.attention} />
              <Text style={styles.attentionText}>
                {upcomingClass.studentsNeedingAttention} students need attention
              </Text>
            </View>
          )}

          <Button
            label="Start Class"
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
        <Text style={[Typography.eyebrow, styles.blockHeading]}>Parallel Tasks (Other Grades)</Text>
        <Card style={styles.section}>
          <OtherGroupsStrip groups={otherGroups} />
        </Card>

        <Button
          label="View Full Schedule"
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  settingsIcon: {
    padding: Spacing.xs,
  },
  dateText: {
    marginTop: 2,
  },
  attendanceCard: {
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presentCount: {
    fontSize: 28,
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
    minWidth: 100,
  },
  blockHeading: {
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  heroCard: {
    marginBottom: Spacing.lg,
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  classHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0ED',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  subjectText: {
    marginTop: Spacing.sm,
    color: Colors.textSecondary,
  },
  concept: {
    fontWeight: '600',
    marginTop: 2,
    fontSize: 16,
  },
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EB',
    padding: Spacing.sm,
    borderRadius: 8,
    gap: 8,
    marginTop: Spacing.md,
  },
  attentionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.attention,
  },
  viewClassButton: {
    marginTop: Spacing.lg,
  },
  scheduleButton: {
    marginTop: Spacing.xs,
  },
});
