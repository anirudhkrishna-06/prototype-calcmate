// File: app/curriculum.tsx
// Phase 6 - curriculum knowledge graph view.
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { curriculumNodes, getCurriculumByGrade } from '@/data/mockData';

export default function CurriculumScreen() {
  const router = useRouter();
  const grade4Nodes = getCurriculumByGrade('Grade 4');

  return (
    <>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Curriculum KG</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            A clean prerequisite map that shows how concepts build on each other.
          </Text>

          <Card style={styles.heroCard}>
            <Text style={Typography.eyebrow}>Learning Path</Text>
            <View style={styles.pathRow}>
              {curriculumNodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <NodeCard node={node} />
                  {index < curriculumNodes.length - 1 ? (
                    <Feather name="chevron-down" size={18} color={Colors.textSecondary} />
                  ) : null}
                </React.Fragment>
              ))}
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Grade 4 focus</Text>
            {grade4Nodes.map((node) => (
              <View key={node.id} style={styles.focusRow}>
                <View style={styles.focusLeft}>
                  <Text style={Typography.cardTitle}>{node.concept}</Text>
                  <Text style={Typography.bodySecondary}>{node.grade}</Text>
                </View>
                <Badge
                  label={node.status === 'mastered' ? 'Mastered' : node.status === 'developing' ? 'Developing' : 'Upcoming'}
                  level={node.status === 'mastered' ? 'strong' : node.status === 'developing' ? 'attention' : 'developing'}
                />
              </View>
            ))}
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>How to read this</Text>
            <View style={styles.tipRow}>
              <Feather name="arrow-down" size={14} color={Colors.textSecondary} />
              <Text style={Typography.bodySecondary}>Each concept sits on top of its prerequisite concept.</Text>
            </View>
            <View style={styles.tipRow}>
              <Feather name="book-open" size={14} color={Colors.textSecondary} />
              <Text style={Typography.bodySecondary}>Use this before scheduling an assessment or starting a new unit.</Text>
            </View>
            <View style={styles.tipRow}>
              <Feather name="alert-triangle" size={14} color={Colors.textSecondary} />
              <Text style={Typography.bodySecondary}>If a prerequisite is weak, the teacher should see it before the lesson.</Text>
            </View>
          </Card>

          <Button label="Open Assessments" onPress={() => router.push('/assessments' as never)} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function NodeCard({ node }: { node: (typeof curriculumNodes)[number] }) {
  return (
    <View style={styles.nodeCard}>
      <Text style={Typography.eyebrow}>{node.grade}</Text>
      <Text style={Typography.cardTitle}>{node.concept}</Text>
      <Text style={Typography.bodySecondary}>{node.subject}</Text>
    </View>
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
  pathRow: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  nodeCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  focusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  focusLeft: {
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Spacing.md,
  },
});
