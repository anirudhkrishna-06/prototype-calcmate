// File: app/next-priority.tsx
// Phase 4 - recommendation for the teacher's next move.
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/calcmate/Badge';
import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { getGroupById, getOtherGroups, upcomingClass } from '@/data/mockData';

const defaultGroupId = upcomingClass.groupId;

export default function NextPriorityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? defaultGroupId;
  const group = getGroupById(groupId) ?? getGroupById(defaultGroupId);
  const otherGroups = getOtherGroups(defaultGroupId);
  const nextGroup = otherGroups[0];

  if (!group || !nextGroup) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Next Priority', headerBackTitle: 'Class Mode' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Next Priority</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            A restrained recommendation for where teacher attention should go next.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Recommended Move</Text>
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.sectionTitle}>{nextGroup.grade}</Text>
                <Text style={Typography.bodySecondary}>{nextGroup.currentConcept}</Text>
              </View>
              <Badge label="Priority" level="attention" />
            </View>

            <View style={styles.reasonBlock}>
              <View style={styles.reasonRow}>
                <Feather name="clock" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>
                  Current block is active and the next group is already in motion.
                </Text>
              </View>
              <View style={styles.reasonRow}>
                <Feather name="trending-up" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>
                  A short intervention can keep the classroom balanced without extra overhead.
                </Text>
              </View>
              <View style={styles.reasonRow}>
                <Feather name="users" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>
                  {nextGroup.presentCount} of {nextGroup.studentCount} students are present and ready.
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Why now?</Text>
            <Text style={[Typography.body, styles.sectionBody]}>
              The current lesson is stable, the next group is available, and the transition cost is low.
            </Text>
            <View style={styles.smallTimeline}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotDone]} />
                <Text style={styles.timelineLabel}>Current class underway</Text>
              </View>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotActive]} />
                <Text style={styles.timelineLabel}>Move attention to {nextGroup.grade}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Alternative</Text>
            <Text style={[Typography.bodySecondary, styles.sectionBody]}>
              Stay with {group.grade} if the current explanation needs one more minute before switching.
            </Text>
          </Card>

          <View style={styles.actionRow}>
            <Button
              label={`Move to ${nextGroup.grade}`}
              onPress={() => router.push(`/groups/${nextGroup.id}` as never)}
              style={styles.flexButton}
            />
            <Button
              label="Continue Current Class"
              variant="outline"
              onPress={() => router.back()}
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
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  heroCopy: {
    flex: 1,
  },
  reasonBlock: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  smallTimeline: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.border,
  },
  timelineDotDone: {
    backgroundColor: Colors.accent,
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
