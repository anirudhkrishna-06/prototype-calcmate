// File: app/settings.tsx
// Phase 7 - classroom settings and polish.
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/calcmate/EmptyState';
import { Card } from '@/components/calcmate/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';

const settingsGroups = [
  {
    title: 'Teacher profile',
    items: ['Display name', 'Primary classroom', 'Preferred language'],
  },
  {
    title: 'Classroom behavior',
    items: ['Attendance reminder', 'Lesson timer', 'Parallel learning mode'],
  },
  {
    title: 'AI assistance',
    items: ['Class AI default', 'Suggestion detail', 'Quiet mode'],
  },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={Typography.screenTitle}>Settings</Text>
        <Text style={[Typography.bodySecondary, styles.subtitle]}>
          Lightweight classroom preferences and app behavior. Nothing noisy, nothing decorative.
        </Text>

        <Card style={styles.heroCard}>
          <Text style={Typography.eyebrow}>Teacher Workspace</Text>
          <Text style={[Typography.sectionTitle, styles.heroTitle]}>Calm defaults</Text>
          <Text style={Typography.bodySecondary}>
            The app is tuned for low cognitive load, fast scanning, and teacher-first action placement.
          </Text>
        </Card>

        {settingsGroups.map((group) => (
          <Card key={group.title} style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>{group.title}</Text>
            <View style={styles.settingList}>
              {group.items.map((item) => (
                <TouchableOpacity key={item} style={styles.settingRow} activeOpacity={0.85}>
                  <View style={styles.settingCopy}>
                    <Text style={Typography.cardTitle}>{item}</Text>
                    <Text style={Typography.bodySecondary}>Not configured yet</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}

        <View style={styles.emptyStack}>
          <EmptyState
            icon={<Feather name="bell-off" size={18} color={Colors.accent} />}
            title="No custom alerts yet"
            description="When alerts are added later, they’ll stay minimal and teacher-centered."
          />
          <EmptyState
            icon={<Feather name="star" size={18} color={Colors.accent} />}
            title="No pinned shortcuts"
            description="Saved shortcuts will appear here for faster access during the school day."
          />
        </View>
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
  sectionCard: {
    marginBottom: Spacing.md,
  },
  settingList: {
    marginTop: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  settingCopy: {
    flex: 1,
  },
  emptyStack: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
