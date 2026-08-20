// File: app/(tabs)/schedule.tsx
// Phase 3 - instructional timeline with grade filters.
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { Card } from '@/components/calcmate/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { groups, scheduleToday } from '@/data/mockData';
import { Group, ScheduleBlock } from '@/types';

type FilterKey = 'All' | Group['grade'];

const filters: FilterKey[] = ['All', ...groups.map((group) => group.grade)];

const modeLabels: Record<ScheduleBlock['mode'], string> = {
  'teacher-led': 'Teacher-led',
  independent: 'Independent',
  parallel: 'Parallel',
  assessment: 'Assessment',
};

const modeLevels: Record<ScheduleBlock['mode'], 'strong' | 'developing' | 'attention' | 'critical'> = {
  'teacher-led': 'strong',
  independent: 'developing',
  parallel: 'attention',
  assessment: 'critical',
};

function groupBlocksByTime(blocks: ScheduleBlock[]) {
  return blocks.reduce<Record<string, ScheduleBlock[]>>((acc, block) => {
    acc[block.time] = acc[block.time] ?? [];
    acc[block.time].push(block);
    return acc;
  }, {});
}

export default function ScheduleScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = React.useState<FilterKey>('All');

  const visibleBlocks = React.useMemo(() => {
    return activeFilter === 'All'
      ? scheduleToday
      : scheduleToday.filter((block) => block.grade === activeFilter);
  }, [activeFilter]);

  const groupedBlocks = React.useMemo(
    () => groupBlocksByTime(visibleBlocks),
    [visibleBlocks]
  );

  const times = React.useMemo(() => Object.keys(groupedBlocks).sort(), [groupedBlocks]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={Typography.screenTitle}>Schedule</Text>
        <Text style={[Typography.bodySecondary, styles.subtitle]}>
          A vertical instructional timeline that shows what the teacher and each group are doing right now.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Card style={styles.summaryCard}>
          <Text style={Typography.eyebrow}>Classroom Plan</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{visibleBlocks.length}</Text>
              <Text style={Typography.supporting}>Visible blocks</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {visibleBlocks.filter((block) => block.mode === 'teacher-led').length}
              </Text>
              <Text style={Typography.supporting}>Teacher-led</Text>
            </View>
          </View>
        </Card>

        {times.map((time) => (
          <View key={time} style={styles.timeSection}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTime}>{time}</Text>
              <View style={styles.timelineLine} />
            </View>

            {groupedBlocks[time].map((block) => (
              <Card key={block.id} style={styles.blockCard}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push(`/groups/${block.groupId}` as never)}
                >
                  <View style={styles.blockHeader}>
                    <View style={styles.blockHeaderCopy}>
                      <Text style={Typography.cardTitle}>{block.grade}</Text>
                      <Text style={Typography.bodySecondary}>{block.subject}</Text>
                    </View>
                    <Badge label={modeLabels[block.mode]} level={modeLevels[block.mode]} />
                  </View>

                  <Text style={[Typography.body, styles.blockConcept]}>{block.concept}</Text>

                  <View style={styles.blockFooter}>
                    <View style={styles.blockMeta}>
                      <Feather name="clock" size={14} color={Colors.textSecondary} />
                      <Text style={Typography.supporting}>{block.endTime ? `${block.time} - ${block.endTime}` : block.time}</Text>
                    </View>
                    <Text style={styles.openText}>Open group</Text>
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        ))}
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
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
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
    backgroundColor: '#E9F4F3',
    borderColor: Colors.accent,
  },
  filterLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: Colors.accent,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  timeSection: {
    marginBottom: Spacing.lg,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  timelineTime: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    width: 58,
  },
  timelineLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  blockCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  blockHeaderCopy: {
    flex: 1,
  },
  blockConcept: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  blockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
