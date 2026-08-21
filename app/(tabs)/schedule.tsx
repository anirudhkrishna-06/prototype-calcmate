// File: app/(tabs)/schedule.tsx
// Phase 3 - High-Fidelity Instructional Timeline with Visual Hierarchy & Animations
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
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
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { groups, scheduleToday } from '@/data/mockData';
import { Group, ScheduleBlock } from '@/types';

type FilterKey = 'All' | Group['grade'];

// Color visual system for instructional modes
const MODE_THEMES: Record<ScheduleBlock['mode'], {
  label: string;
  bg: string;
  border: string;
  text: string;
  icon: keyof typeof Feather.glyphMap;
}> = {
  'teacher-led': {
    label: 'Teacher-Led',
    bg: '#E6F4F1',
    border: '#147D7A',
    text: '#147D7A',
    icon: 'user-check',
  },
  parallel: {
    label: 'Parallel',
    bg: '#EEF2F6',
    border: '#3B82F6',
    text: '#2563EB',
    icon: 'layers',
  },
  independent: {
    label: 'Independent',
    bg: '#FEF3C7',
    border: '#C58A24',
    text: '#B45309',
    icon: 'user',
  },
  assessment: {
    label: 'Assessment',
    bg: '#FEE2E2',
    border: '#EF4444',
    text: '#DC2626',
    icon: 'edit-3',
  },
};

const ScheduleCard = React.memo(({ block, onPress }: { block: ScheduleBlock; onPress: () => void }) => {
  const theme = MODE_THEMES[block.mode] || MODE_THEMES['teacher-led'];

  return (
    <Animated.View
      layout={Layout.springify().damping(16)}
      entering={FadeInDown.duration(280)}
      style={styles.cardWrapper}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { borderLeftColor: theme.border },
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>{block.grade}</Text>
            <Text style={styles.subjectText}>• {block.subject}</Text>
          </View>
          
          <View style={[styles.modeChip, { backgroundColor: theme.bg }]}>
            <Feather name={theme.icon} size={11} color={theme.text} />
            <Text style={[styles.modeText, { color: theme.text }]}>{theme.label}</Text>
          </View>
        </View>

        <Text style={styles.conceptTitle}>{block.concept}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.timeBadge}>
            <Feather name="clock" size={12} color="#667085" />
            <Text style={styles.timeText}>
              {block.time}{block.endTime ? ` — ${block.endTime}` : ''}
            </Text>
          </View>

          <View style={styles.actionLink}>
            <Text style={styles.actionText}>Open group</Text>
            <Feather name="arrow-right" size={12} color="#147D7A" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default function ScheduleScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  const filters: FilterKey[] = useMemo(() => ['All', ...groups.map((g) => g.grade)], []);

  const visibleBlocks = useMemo(() => {
    return activeFilter === 'All'
      ? scheduleToday
      : scheduleToday.filter((block) => block.grade === activeFilter);
  }, [activeFilter]);

  const groupedBlocks = useMemo(() => {
    return visibleBlocks.reduce<Record<string, ScheduleBlock[]>>((acc, block) => {
      acc[block.time] = acc[block.time] ?? [];
      acc[block.time].push(block);
      return acc;
    }, {});
  }, [visibleBlocks]);

  const sortedTimes = useMemo(() => Object.keys(groupedBlocks).sort(), [groupedBlocks]);
  
  const teacherLedCount = useMemo(() => {
    return visibleBlocks.filter((b) => b.mode === 'teacher-led').length;
  }, [visibleBlocks]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Visual Title Area */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Today's Schedule</Text>
            <Text style={styles.screenSub}>Instructional Timeline & Multi-Grade Plan</Text>
          </View>
          <View style={styles.todayPill}>
            <Text style={styles.todayPillText}>Live</Text>
          </View>
        </View>

        {/* Grade Filter Pill Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {filter === 'All' ? 'All Classes' : filter.replace('Grade ', 'G')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Visual Mode Distribution Bar */}
        <View style={styles.distributionCard}>
          <View style={styles.distHeader}>
            <Text style={styles.distTitle}>Classroom Focus</Text>
            <Text style={styles.distMeta}>
              <Text style={styles.distHighlight}>{teacherLedCount}</Text> Teacher-Led Sessions
            </Text>
          </View>
          <View style={styles.distTrack}>
            <View style={[styles.distSegment, { flex: teacherLedCount || 1, backgroundColor: '#147D7A' }]} />
            <View style={[styles.distSegment, { flex: (visibleBlocks.length - teacherLedCount) || 1, backgroundColor: '#C58A24' }]} />
          </View>
        </View>

        {/* Interactive Timeline View */}
        <View style={styles.timelineContainer}>
          {sortedTimes.map((time) => (
            <View key={time} style={styles.timeGroup}>
              {/* Timeline Time Axis Node */}
              <View style={styles.axisHeader}>
                <View style={styles.timeDot} />
                <Text style={styles.axisTime}>{time}</Text>
                <View style={styles.axisLine} />
              </View>

              {/* Cards for this block */}
              <View style={styles.cardsGroup}>
                {groupedBlocks[time].map((block) => (
                  <ScheduleCard
                    key={block.id}
                    block={block}
                    onPress={() => router.push(`/groups/${block.groupId}` as never)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#17233C',
    letterSpacing: -0.5,
  },
  screenSub: {
    fontSize: 13,
    color: '#667085',
    marginTop: 2,
    fontWeight: '500',
  },
  todayPill: {
    backgroundColor: '#147D7A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  todayPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  distributionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAECE8',
  },
  distHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  distMeta: {
    fontSize: 13,
    color: '#667085',
  },
  distHighlight: {
    fontWeight: '800',
    color: '#17233C',
  },
  distTrack: {
    height: 6,
    flexDirection: 'row',
    borderRadius: 999,
    overflow: 'hidden',
    gap: 2,
    backgroundColor: '#F0F2EE',
  },
  distSegment: {
    borderRadius: 999,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timeGroup: {
    marginBottom: 20,
  },
  axisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#147D7A',
  },
  axisTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17233C',
  },
  axisLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAECE8',
  },
  cardsGroup: {
    paddingLeft: 18,
    gap: 10,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAECE8',
    borderLeftWidth: 4,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17233C',
  },
  subjectText: {
    fontSize: 13,
    color: '#667085',
    fontWeight: '500',
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  conceptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17233C',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2EE',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '600',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#147D7A',
  },
});