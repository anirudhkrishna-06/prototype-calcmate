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

import { Button } from '@/components/calcmate/Button';
import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function MoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={Typography.screenTitle}>Educational Tools</Text>
        </View>

        <Text style={styles.sectionHeader}>Teaching</Text>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Feather name="clipboard" size={20} color={Colors.accent} />
            </View>
            <Text style={Typography.cardTitle}>Assessments</Text>
          </View>
          <Text style={Typography.bodySecondary}>Upcoming & Completed Tests</Text>
          <View style={styles.cardActions}>
            <Button
              label="View Results"
              variant="outline"
              style={styles.actionButton}
              onPress={() => router.push('/assessments' as never)}
            />
          </View>
        </Card>

        <Text style={styles.sectionHeader}>Analytics</Text>
        
        <Card style={styles.card}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/insights' as never)}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Feather name="bar-chart-2" size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={Typography.cardTitle}>Insights</Text>
                <Text style={Typography.bodySecondary}>Classroom Progress</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.border} />
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Feather name="trending-up" size={20} color={Colors.accent} />
            </View>
            <Text style={Typography.cardTitle}>Knowledge Trace</Text>
          </View>
          <Text style={Typography.bodySecondary}>Student Learning Progress Over Time</Text>
          <View style={styles.cardActions}>
            <Button
              label="View Trace"
              variant="outline"
              style={styles.actionButton}
              onPress={() => router.push('/knowledge-trace' as never)}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/curriculum' as never)}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Feather name="git-branch" size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={Typography.cardTitle}>Curriculum Graph</Text>
                <Text style={Typography.bodySecondary}>Curriculum Relationships</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.border} />
            </View>
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionHeader}>System</Text>
        <Card style={styles.card}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/settings' as never)}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Feather name="settings" size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={Typography.cardTitle}>Settings</Text>
                <Text style={Typography.bodySecondary}>Preferences & Configuration</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.border} />
            </View>
          </TouchableOpacity>
        </Card>

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
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: '#E7F2F1', // light teal
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActions: {
    marginTop: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});
