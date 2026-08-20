// File: app/(tabs)/more.tsx
// Phase 6 - occasional-use hub for assessments, insights, and curriculum views.
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

import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

const items = [
  {
    title: 'Assessments',
    description: 'Plan, conduct, and review assessments.',
    icon: 'clipboard',
    href: '/assessments',
  },
  {
    title: 'Insights',
    description: 'See attendance, mastery, and attention trends.',
    icon: 'bar-chart-2',
    href: '/insights',
  },
  {
    title: 'Curriculum KG',
    description: 'Inspect prerequisite structure and concept flow.',
    icon: 'git-branch',
    href: '/curriculum',
  },
  {
    title: 'Knowledge Trace',
    description: 'Follow learner state over time.',
    icon: 'trending-up',
    href: '/knowledge-trace',
  },
  {
    title: 'Settings',
    description: 'Manage classroom preferences and quick controls.',
    icon: 'settings',
    href: '/settings',
  },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={Typography.screenTitle}>More</Text>
        <Text style={[Typography.bodySecondary, styles.subtitle]}>
          The deeper analysis layer for assessments, insights, and curriculum structure.
        </Text>

        <Card style={styles.heroCard}>
          <Text style={Typography.eyebrow}>Teacher Workspace</Text>
          <Text style={[Typography.sectionTitle, styles.heroTitle]}>Occasional-use tools</Text>
          <Text style={Typography.bodySecondary}>
            These screens are intentionally secondary to the daily teaching flow.
          </Text>
        </Card>

        {items.map((item) => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.9}
            onPress={() => router.push(item.href as never)}
          >
            <Card style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={styles.iconBox}>
                  <Feather name={item.icon as never} size={18} color={Colors.accent} />
                </View>
                <View style={styles.itemCopy}>
                  <Text style={Typography.cardTitle}>{item.title}</Text>
                  <Text style={Typography.bodySecondary}>{item.description}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
              </View>
            </Card>
          </TouchableOpacity>
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
    marginBottom: Spacing.lg,
  },
  heroCard: {
    marginBottom: Spacing.md,
  },
  heroTitle: {
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  itemCard: {
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCopy: {
    flex: 1,
  },
});
