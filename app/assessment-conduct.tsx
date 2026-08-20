// File: app/assessment-conduct.tsx
// Phase 6 - conduct an assessment with a lightweight teacher workflow.
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
import { assessments, getAssessmentById } from '@/data/mockData';

const questions = [
  {
    id: 'q1',
    prompt: 'Which fraction is larger?',
    choices: ['1/4', '1/2', '1/8'],
    answer: '1/2',
  },
  {
    id: 'q2',
    prompt: 'What is the first step when comparing fractions?',
    choices: ['Compare numerators only', 'Compare denominator only', 'Find a common denominator or visual match'],
    answer: 'Find a common denominator or visual match',
  },
  {
    id: 'q3',
    prompt: 'Which answer shows reasoning?',
    choices: ['Because it looks bigger', 'Because both parts are compared', 'I guessed'],
    answer: 'Because both parts are compared',
  },
];

export default function AssessmentConductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ assessmentId?: string | string[] }>();
  const assessmentId = Array.isArray(params.assessmentId) ? params.assessmentId[0] : params.assessmentId ?? assessments[0].id;
  const assessment = getAssessmentById(assessmentId) ?? assessments[0];
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});

  return (
    <>
      <Stack.Screen options={{ title: 'Conduct Assessment', headerBackTitle: 'Assessments' }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={Typography.screenTitle}>Conduct Assessment</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            A small, structured assessment flow with just enough scaffolding for the teacher to use mid-workflow.
          </Text>

          <Card style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={Typography.eyebrow}>Live Assessment</Text>
                <Text style={Typography.sectionTitle}>
                  {assessment.grade} - {assessment.concept}
                </Text>
                <Text style={Typography.bodySecondary}>{assessment.subject}</Text>
              </View>
              <Badge label={assessment.status} level="critical" />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="clock" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>{assessment.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="layers" size={14} color={Colors.textSecondary} />
                <Text style={Typography.supporting}>{assessment.difficulty}</Text>
              </View>
            </View>
          </Card>

          {questions.map((question, index) => {
            const selected = selectedAnswers[question.id];
            return (
              <Card key={question.id} style={styles.questionCard}>
                <Text style={Typography.eyebrow}>Question {index + 1}</Text>
                <Text style={[Typography.body, styles.questionPrompt]}>{question.prompt}</Text>

                <View style={styles.choiceList}>
                  {question.choices.map((choice) => {
                    const active = selected === choice;
                    return (
                      <TouchableOpacity
                        key={choice}
                        activeOpacity={0.9}
                        onPress={() => setSelectedAnswers((prev) => ({ ...prev, [question.id]: choice }))}
                        style={[styles.choiceChip, active && styles.choiceChipActive]}
                      >
                        <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{choice}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {selected ? (
                  <View style={styles.feedbackRow}>
                    <Feather
                      name={selected === question.answer ? 'check-circle' : 'alert-circle'}
                      size={14}
                      color={selected === question.answer ? Colors.accent : Colors.attention}
                    />
                    <Text style={Typography.supporting}>
                      {selected === question.answer ? 'Good response to keep moving.' : 'This answer needs a short follow-up.'}
                    </Text>
                  </View>
                ) : null}
              </Card>
            );
          })}

          <Card style={styles.sectionCard}>
            <Text style={Typography.eyebrow}>Assessment Notes</Text>
            <Text style={[Typography.bodySecondary, styles.sectionBody]}>
              Use this only when the class needs evidence. The review screen will turn this into a concise result summary.
            </Text>
          </Card>

          <View style={styles.actionStack}>
            <Button
              label="Complete Assessment"
              onPress={() => router.push('/assessment-results' as never)}
            />
            <Button
              label="Back to Assessments"
              variant="outline"
              onPress={() => router.back()}
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
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  heroCopy: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  questionCard: {
    marginBottom: Spacing.md,
  },
  questionPrompt: {
    marginTop: Spacing.xs,
  },
  choiceList: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  choiceChip: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  choiceChipActive: {
    borderColor: Colors.accent,
    backgroundColor: '#E9F4F3',
  },
  choiceText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  choiceTextActive: {
    color: Colors.accent,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  actionStack: {
    gap: Spacing.sm,
  },
});
