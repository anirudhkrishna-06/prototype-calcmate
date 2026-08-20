// File: app/parallel-learning.tsx
// Phase 4 - what the rest of the classroom is doing while the teacher leads.
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
import { getGroupById, getOtherGroups, upcomingClass } from '@/data/mockData';

const defaultGroupId = upcomingClass.groupId;

export default function ParallelLearningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ groupId?: string | string[] }>();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? defaultGroupId;
  const group = getGroupById(groupId) ?? getGroupById(defaultGroupId);
  const otherGroups = getOtherGroups(defaultGroupId);
  const [selectedGroupId, setSelectedGroupId] = React.useState(otherGroups[0]?.id ?? null);

  const selectedGroup = otherGroups.find((item) => item.id === selectedGroupId) ?? otherGroups[0];

  if (!group || !selectedGroup) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Parallel Learning', headerBackTitle: 'Class Mode' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Parallel Learning</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            The rest of the classroom stays active without requiring extra teacher load.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Current Class</Text>
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.sectionTitle}>{group.grade}</Text>
                <Text style={Typography.bodySecondary}>{group.currentConcept}</Text>
              </View>
              <Badge label="Teacher-led" level="strong" />
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={Typography.sectionTitle}>Select a group</Text>
            <Text style={Typography.supporting}>Tap a group card to see the activity structure.</Text>
          </View>

          {otherGroups.map((item) => {
            const active = item.id === selectedGroup.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => setSelectedGroupId(item.id)}
              >
                <Card style={[styles.groupCard, active && styles.groupCardActive]}>
                  <View style={styles.groupTopRow}>
                    <View style={styles.groupTitleCopy}>
                      <Text style={Typography.cardTitle}>{item.grade}</Text>
                      <Text style={Typography.bodySecondary}>
                        {item.currentSubject} - {item.currentConcept}
                      </Text>
                    </View>
                    <Badge
                      label={item.activityMode === 'parallel' ? 'Parallel learning' : 'Independent work'}
                      level={item.activityMode === 'parallel' ? 'attention' : 'developing'}
                    />
                  </View>

                  <View style={styles.detailRow}>
                    <Feather name="users" size={14} color={Colors.textSecondary} />
                    <Text style={Typography.supporting}>{item.presentCount} of {item.studentCount} present</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Feather name="clock" size={14} color={Colors.textSecondary} />
                    <Text style={Typography.supporting}>
                      {item.minutesRemaining ? `${item.minutesRemaining} min remaining` : 'No timer set'}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Selected Group</Text>
            <Text style={[Typography.sectionTitle, styles.selectedTitle]}>{selectedGroup.grade}</Text>
            <Text style={Typography.bodySecondary}>{selectedGroup.currentConcept}</Text>

            <View style={styles.activityBox}>
              <Text style={Typography.cardTitle}>
                {selectedGroup.activityMode === 'parallel' ? 'Parallel Learning' : 'Independent Work'}
              </Text>
              <Text style={[Typography.bodySecondary, styles.activityBody]}>
                {selectedGroup.activityMode === 'parallel'
                  ? 'A shared task with light structure and low teacher interruption.'
                  : 'A self-guided task designed to keep students moving while attention is elsewhere.'}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <Button
                label="Open Group"
                variant="outline"
                onPress={() => router.push(`/groups/${selectedGroup.id}` as never)}
                style={styles.flexButton}
              />
              <Button
                label="Next Priority"
                onPress={() =>
                  router.push({
                    pathname: '/next-priority',
                    params: { groupId: group.id },
                  } as never)
                }
                style={styles.flexButton}
              />
            </View>
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
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  groupCard: {
    marginBottom: Spacing.sm,
  },
  groupCardActive: {
    borderColor: Colors.accent,
  },
  groupTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  groupTitleCopy: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  sectionCard: {
    marginTop: Spacing.md,
  },
  selectedTitle: {
    marginTop: Spacing.xs,
  },
  activityBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
  },
  activityBody: {
    marginTop: Spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  flexButton: {
    flex: 1,
  },
});
