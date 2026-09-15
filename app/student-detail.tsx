import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, type DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getInitials, getStudentById } from '../data/tamilStudentData';

function getAssessmentAverage(scores: { Mathematics: number; English: number; Science: number }) {
  return Math.round((scores.Mathematics + scores.English + scores.Science) / 3);
}

function TrendCard({ label, value, change, tone }: { label: string; value: string; change: string; tone: 'good' | 'watch' }) {
  return (
    <View style={styles.trendCard}>
      <View style={styles.trendTopRow}>
        <Text style={styles.trendLabel}>{label}</Text>
        <View style={[styles.trendBadge, tone === 'watch' ? styles.trendBadgeWatch : styles.trendBadgeGood]}>
          <Feather name={tone === 'watch' ? 'alert-triangle' : 'trending-up'} size={12} color={tone === 'watch' ? '#A96716' : '#126B65'} />
          <Text style={[styles.trendBadgeText, tone === 'watch' ? styles.trendBadgeWatchText : styles.trendBadgeGoodText]}>{change}</Text>
        </View>
      </View>
      <Text style={styles.trendValue}>{value}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: value as DimensionValue }]} />
      </View>
    </View>
  );
}

function TopicCard({ title, items, tone }: { title: string; items: string[]; tone: 'weak' | 'strong' }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <Feather name={tone === 'weak' ? 'target' : 'zap'} size={17} color={tone === 'weak' ? '#B9423A' : '#126B65'} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.tagWrap}>
        {items.map((topic) => (
          <Text key={topic} style={[styles.tag, tone === 'strong' && styles.tagGreen]}>{topic}</Text>
        ))}
      </View>
    </View>
  );
}

function RecommendationCard({ text }: { text: string }) {
  return (
    <View style={styles.recommendationCard}>
      <View style={styles.recommendationIcon}>
        <Feather name="cpu" size={17} color="#126B65" />
      </View>
      <Text style={styles.recommendationText}>{text}</Text>
    </View>
  );
}

export default function StudentDetailPage() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  const student = getStudentById(Number(studentId ?? 1));
  const [noteDraft, setNoteDraft] = useState('');
  const [notes, setNotes] = useState<string[]>([
    `${student.weakConcepts[0] ?? 'Core skill'} check-in before independent work.`,
  ]);

  const assessmentAverage = getAssessmentAverage(student.scores);
  const attendanceChange = student.attendance >= 92 ? '+2 wk' : '-3 wk';
  const assessmentChange = assessmentAverage >= 82 ? '+4 avg' : '-2 avg';
  const recommendations = useMemo(() => {
    const firstWeakTopic = student.weakConcepts[0] ?? 'foundational skills';
    return [
      student.aiInsight,
      `Plan a 10-minute small-group reteach on ${firstWeakTopic} with one worked example and one exit check.`,
      student.riskLevel === 'High'
        ? 'Prioritize this learner in the first intervention group today.'
        : 'Use peer explanation or independent extension after the first guided check.',
    ];
  }, [student.aiInsight, student.riskLevel, student.weakConcepts]);

  const addNote = () => {
    const cleanNote = noteDraft.trim();
    if (!cleanNote) return;
    setNotes((currentNotes) => [cleanNote, ...currentNotes]);
    setNoteDraft('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.crumb}>Learner Intelligence</Text>
            <Text style={styles.title}>Student Profile</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()} activeOpacity={0.86}>
            <Feather name="arrow-left" size={18} color="#163C40" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeaderCard}>
          <View style={styles.profileIdentity}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(student.name)}</Text>
            </View>
            <View style={styles.identityText}>
              <Text style={styles.studentName} numberOfLines={2}>{student.name}</Text>
              <Text style={styles.gradeRow}>Grade {student.grade} - Roll No. {student.rollNumber}</Text>
            </View>
          </View>
          <View style={[styles.riskPill, student.riskLevel === 'High' ? styles.riskHighPill : student.riskLevel === 'Medium' ? styles.riskMediumPill : styles.riskLowPill]}>
            <Text style={[styles.riskPillText, student.riskLevel === 'High' ? styles.riskHighText : student.riskLevel === 'Medium' ? styles.riskMediumText : styles.riskLowText]}>{student.riskLevel} Risk</Text>
          </View>
        </View>

        <View style={styles.trendGrid}>
          <TrendCard label="Attendance Trend" value={`${student.attendance}%`} change={attendanceChange} tone={student.attendance >= 90 ? 'good' : 'watch'} />
          <TrendCard label="Assessment Trend" value={`${assessmentAverage}%`} change={assessmentChange} tone={assessmentAverage >= 80 ? 'good' : 'watch'} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Assessment Trend</Text>
          <View style={styles.assessmentStack}>
            {student.assessmentHistory.map((row) => (
              <View key={`${row.subject}-${row.topic}-${row.date}`} style={styles.assessmentCard}>
                <View style={styles.assessmentTopRow}>
                  <Text style={styles.assessmentSubject}>{row.subject}</Text>
                  <Text style={styles.assessmentScore}>{row.score}%</Text>
                </View>
                <Text style={styles.assessmentTopic}>{row.topic} - {row.date}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${row.score}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <TopicCard title="Weak Topics" items={student.weakConcepts} tone="weak" />
        <TopicCard title="Strengths" items={student.strengthAreas} tone="strong" />

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Feather name="cpu" size={17} color="#126B65" />
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
          </View>
          <View style={styles.recommendationStack}>
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation} text={recommendation} />
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Feather name="edit-3" size={17} color="#163C40" />
            <Text style={styles.sectionTitle}>Quick Teacher Notes</Text>
          </View>
          <View style={styles.noteComposer}>
            <TextInput
              style={styles.noteInput}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Add a quick observation"
              placeholderTextColor="#8AA09F"
              multiline
            />
            <TouchableOpacity style={styles.noteButton} onPress={addNote} activeOpacity={0.86}>
              <Feather name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.notesStack}>
            {notes.map((note, index) => (
              <View key={`${note}-${index}`} style={styles.noteCard}>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F6F5' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerTextBlock: { flex: 1, minWidth: 0 },
  crumb: { color: '#126B65', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: '#163C40', fontSize: 30, fontWeight: '800', marginTop: 8 },
  headerButton: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  profileHeaderCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#DCE9E7' },
  profileIdentity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#163C40', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 23, fontWeight: '900' },
  identityText: { flex: 1, minWidth: 0 },
  studentName: { color: '#163C40', fontSize: 22, lineHeight: 28, fontWeight: '900' },
  gradeRow: { color: '#607878', fontSize: 12, fontWeight: '800', marginTop: 4 },
  riskPill: { minHeight: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 14 },
  riskHighPill: { backgroundColor: '#FFE5E1' },
  riskMediumPill: { backgroundColor: '#FFF1DD' },
  riskLowPill: { backgroundColor: '#DCFCE7' },
  riskPillText: { fontSize: 12, fontWeight: '900' },
  riskHighText: { color: '#B9423A' },
  riskMediumText: { color: '#A96716' },
  riskLowText: { color: '#126B65' },
  trendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  trendCard: { flexGrow: 1, flexBasis: '47%', backgroundColor: '#FFFFFF', borderRadius: 8, padding: 13, borderWidth: 1, borderColor: '#DCE9E7' },
  trendTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  trendLabel: { flex: 1, minWidth: 0, color: '#607878', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  trendBadge: { minHeight: 24, borderRadius: 8, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendBadgeGood: { backgroundColor: '#DCFCE7' },
  trendBadgeWatch: { backgroundColor: '#FFF1DD' },
  trendBadgeText: { fontSize: 10, fontWeight: '900' },
  trendBadgeGoodText: { color: '#126B65' },
  trendBadgeWatchText: { color: '#A96716' },
  trendValue: { color: '#163C40', fontSize: 25, fontWeight: '900', marginTop: 10 },
  progressTrack: { height: 8, borderRadius: 8, backgroundColor: '#E8EFEE', marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8, backgroundColor: '#126B65' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, marginTop: 14, borderWidth: 1, borderColor: '#DCE9E7' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: '#163C40', fontSize: 16, fontWeight: '900' },
  assessmentStack: { gap: 10, marginTop: 12 },
  assessmentCard: { backgroundColor: '#F8FBFA', borderRadius: 8, borderWidth: 1, borderColor: '#DCE9E7', padding: 12 },
  assessmentTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  assessmentSubject: { flex: 1, minWidth: 0, color: '#163C40', fontSize: 13, fontWeight: '900' },
  assessmentScore: { color: '#126B65', fontSize: 14, fontWeight: '900' },
  assessmentTopic: { color: '#607878', fontSize: 12, fontWeight: '700', marginTop: 4 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { backgroundColor: '#FFF1EF', color: '#B9423A', fontWeight: '900', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 8, fontSize: 11 },
  tagGreen: { backgroundColor: '#DCFCE7', color: '#126B65' },
  recommendationStack: { gap: 10, marginTop: 12 },
  recommendationCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#F8FBFA', borderRadius: 8, borderWidth: 1, borderColor: '#DCE9E7', padding: 12 },
  recommendationIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  recommendationText: { flex: 1, minWidth: 0, color: '#4F6665', fontSize: 12, lineHeight: 19, fontWeight: '700' },
  noteComposer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 12 },
  noteInput: { flex: 1, minHeight: 52, maxHeight: 110, borderRadius: 8, borderWidth: 1, borderColor: '#DCE9E7', backgroundColor: '#F8FBFA', color: '#163C40', fontSize: 13, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 10, textAlignVertical: 'top' },
  noteButton: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#126B65', alignItems: 'center', justifyContent: 'center' },
  notesStack: { gap: 8, marginTop: 12 },
  noteCard: { borderRadius: 8, backgroundColor: '#F8FBFA', borderWidth: 1, borderColor: '#DCE9E7', padding: 12 },
  noteText: { color: '#4F6665', fontSize: 12, lineHeight: 18, fontWeight: '700' },
});
