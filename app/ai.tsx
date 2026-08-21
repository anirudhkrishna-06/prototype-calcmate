// File: app/ai.tsx
// Phase 5 - simplified AI workspace with a clean chat-style shell.
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/calcmate/Badge';
import { Card } from '@/components/calcmate/Card';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { getClassroomState, getGroupById, upcomingClass } from '@/data/mockData';

type AssistantMode = 'general' | 'class';

type PromptItem = {
  id: string;
  label: string;
  detail: string;
};

const generalPrompts: PromptItem[] = [
  { id: 'plan', label: 'Plan instruction', detail: 'Build a calm sequence for the next lesson.' },
  { id: 'prereq', label: 'Check prerequisites', detail: 'Surface the smallest useful prior knowledge.' },
  { id: 'practice', label: 'Generate practice', detail: 'Create teacher-ready practice with low overhead.' },
  { id: 'status', label: 'Classroom status', detail: 'Summarize the day in one glance.' },
];

const classPrompts: PromptItem[] = [
  { id: 'simple', label: 'Explain simply', detail: 'Turn the concept into teacher-friendly language.' },
  { id: 'example', label: 'Give an example', detail: 'Show a short worked example for the lesson.' },
  { id: 'check', label: 'Quick check', detail: 'Create a fast check for understanding.' },
  { id: 'misconception', label: 'Common misconception', detail: 'Surface what to watch for.' },
  { id: 'student', label: 'Help a student', detail: 'Shape support for a specific learner.' },
];

function getMode(paramsMode?: string | string[]): AssistantMode {
  const value = Array.isArray(paramsMode) ? paramsMode[0] : paramsMode;
  return value === 'class' ? 'class' : 'general';
}

function PromptChip({
  item,
  active,
  onPress,
}: {
  item: PromptItem;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.promptChip, active && styles.promptChipActive]}
    >
      <Text style={[styles.promptLabel, active && styles.promptLabelActive]}>{item.label}</Text>
      <Text style={[styles.promptDetail, active && styles.promptDetailActive]}>{item.detail}</Text>
    </TouchableOpacity>
  );
}

function ContextCard({ mode, groupId }: { mode: AssistantMode; groupId: string }) {
  const group = getGroupById(groupId) ?? getGroupById(upcomingClass.groupId);
  const classroomState = getClassroomState();

  if (mode === 'class' && group) {
    return (
      <Card style={styles.contextCard}>
        <View style={styles.contextTopRow}>
          <View style={styles.contextCopy}>
            <Text style={Typography.eyebrow}>Class AI</Text>
            <Text style={Typography.sectionTitle}>{group.grade}</Text>
            <Text style={[Typography.bodySecondary, styles.contextSubtitle]}>{group.currentSubject}</Text>
            <Text style={[Typography.cardTitle, styles.contextConcept]}>{group.currentConcept}</Text>
          </View>
          <View style={styles.contextMark}>
            <Feather name="book-open" size={18} color={Colors.accent} />
          </View>
        </View>

        <View style={styles.contextMetaRow}>
          <View style={styles.contextPill}>
            <Feather name="clock" size={13} color={Colors.accent} />
            <Text style={styles.contextPillText}>{upcomingClass.time}</Text>
          </View>
          <View style={styles.contextPill}>
            <Feather name="users" size={13} color={Colors.accent} />
            <Text style={styles.contextPillText}>{upcomingClass.studentsNeedingAttention} need attention</Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.contextCard}>
      <View style={styles.contextTopRow}>
        <View style={styles.contextCopy}>
          <Text style={Typography.eyebrow}>General AI</Text>
          <Text style={Typography.sectionTitle}>How can I help?</Text>
          <Text style={[Typography.bodySecondary, styles.contextSubtitle]}>
            A quiet, teacher-first workspace for planning, prerequisites, and classroom support.
          </Text>
        </View>
        <View style={styles.contextMark}>
          <Feather name="zap" size={18} color={Colors.accent} />
        </View>
      </View>

      <View style={styles.contextGrid}>
        <View style={styles.contextMetric}>
          <Text style={styles.contextMetricValue}>{classroomState.presentToday}</Text>
          <Text style={Typography.supporting}>Present today</Text>
        </View>
        <View style={styles.contextMetric}>
          <Text style={styles.contextMetricValue}>{classroomState.activeGroups}</Text>
          <Text style={Typography.supporting}>Active groups</Text>
        </View>
        <View style={styles.contextMetric}>
          <Text style={styles.contextMetricValue}>{upcomingClass.grade}</Text>
          <Text style={Typography.supporting}>Next focus</Text>
        </View>
      </View>
    </Card>
  );
}

export default function AIScreen() {
  const params = useLocalSearchParams<{ mode?: string | string[]; groupId?: string | string[] }>();
  const mode = getMode(params.mode);
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId ?? upcomingClass.groupId;
  const promptSet = mode === 'class' ? classPrompts : generalPrompts;
  const [selectedPromptId, setSelectedPromptId] = React.useState(promptSet[0].id);
  const [draft, setDraft] = React.useState('');

  React.useEffect(() => {
    setSelectedPromptId(promptSet[0].id);
    setDraft('');
  }, [mode, groupId, promptSet]);

  const selectedPrompt = promptSet.find((item) => item.id === selectedPromptId) ?? promptSet[0];

  const onSend = () => {
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.backdropTop} />
        <View style={styles.backdropBottom} />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={Typography.eyebrow}>Calm Intelligence</Text>
              <Text style={styles.title}>{mode === 'class' ? 'Class AI' : 'Calcmate'}</Text>
              <Text style={[Typography.bodySecondary, styles.subtitle]}>
                {mode === 'class'
                  ? 'Sample prompts only for the current lesson. No response panel yet.'
                  : 'A clean, chat-style workspace for teacher-first assistance.'}
              </Text>
            </View>
            <View style={styles.logoMark}>
              <Feather name="star" size={18} color={Colors.white} />
            </View>
          </View>

          <ContextCard mode={mode} groupId={groupId} />

          <Card style={styles.promptCard}>
            <View style={styles.promptHeaderRow}>
              <Text style={Typography.eyebrow}>Sample Prompts</Text>
              <Badge label={mode === 'class' ? 'Class context' : 'General workspace'} level="developing" />
            </View>

            <View style={styles.promptGrid}>
              {promptSet.map((item) => (
                <PromptChip
                  key={item.id}
                  item={item}
                  active={selectedPromptId === item.id}
                  onPress={() => setSelectedPromptId(item.id)}
                />
              ))}
            </View>

            <Text style={[Typography.supporting, styles.promptHint]}>
              Tap a prompt to prefill the composer, or type your own request below.
            </Text>
          </Card>

          <Card style={styles.canvasCard}>
            <View style={styles.canvasHeader}>
              <Text style={Typography.eyebrow}>Conversation Canvas</Text>
              <Text style={Typography.supporting}>Empty for now by design.</Text>
            </View>
            <View style={styles.canvasBody}>
              <View style={styles.canvasPlaceholder}>
                <View style={styles.canvasIcon}>
                  <Feather name="zap" size={18} color={Colors.accent} />
                </View>
                <Text style={Typography.cardTitle}>Ready when you are</Text>
                <Text style={[Typography.bodySecondary, styles.canvasPlaceholderText]}>
                  {mode === 'class'
                    ? 'Class mode stays lightweight with sample prompts only.'
                    : 'Start a new teacher-first conversation from the composer below.'}
                </Text>
              </View>
            </View>
          </Card>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.composerWrap}>
          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={
                mode === 'class'
                  ? `Ask about ${selectedPrompt.label.toLowerCase()}...`
                  : 'Ask Calcmate anything...'
              }
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendButton, !draft.trim() && styles.sendButtonMuted]}
              activeOpacity={0.85}
              onPress={onSend}
            >
              <View style={styles.sendIconBox}>
                <Feather name="star" size={14} color={Colors.white} />
              </View>
              <Text style={styles.sendLabel}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  backdropTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(20, 125, 122, 0.08)',
  },
  backdropBottom: {
    position: 'absolute',
    bottom: 120,
    left: -100,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(23, 35, 60, 0.05)',
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 170,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    ...Typography.screenTitle,
    marginTop: 2,
  },
  subtitle: {
    marginTop: 4,
    maxWidth: 320,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  contextCard: {
    marginBottom: Spacing.md,
  },
  contextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  contextCopy: {
    flex: 1,
  },
  contextSubtitle: {
    marginTop: 2,
  },
  contextConcept: {
    marginTop: 8,
  },
  contextMark: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: '#E9F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  contextMetric: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
  },
  contextMetricValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  contextMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  contextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
  },
  contextPillText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  promptCard: {
    marginBottom: Spacing.md,
  },
  promptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  promptGrid: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  promptChip: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  promptChipActive: {
    borderColor: Colors.accent,
    backgroundColor: '#E9F4F3',
  },
  promptLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  promptLabelActive: {
    color: Colors.accent,
  },
  promptDetail: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  promptDetailActive: {
    color: Colors.accent,
  },
  promptHint: {
    marginTop: Spacing.sm,
  },
  canvasCard: {
    marginBottom: Spacing.md,
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  canvasBody: {
    minHeight: 140,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FBFCFD',
    padding: Spacing.md,
    justifyContent: 'flex-start',
  },
  canvasPlaceholder: {
    flex: 1,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: Spacing.md,
  },
  canvasIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: '#E9F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasPlaceholderText: {
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
  spacer: {
    height: 12,
  },
  composerWrap: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    bottom: Spacing.md,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    ...Shadow.card,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    borderRadius: Radius.lg,
    color: Colors.text,
    fontSize: 14,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 12,
    textAlignVertical: 'center',
  },
  sendButton: {
    minHeight: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendButtonMuted: {
    opacity: 0.7,
  },
  sendIconBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
