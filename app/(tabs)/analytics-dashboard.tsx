import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { gradeOptions, students as allStudents, type Grade, type StudentProfile } from '../../data/tamilStudentData';

type Tone = 'success' | 'warning' | 'danger' | 'info';
type AnalyticsTopic =
  | 'Attendance Analytics'
  | 'Assessment Analytics'
  | 'Topic Mastery Heatmap'
  | 'Student Risk Analysis'
  | 'Grade Performance';

type SummaryMetric = {
  label: string;
  value: string;
  detail: string;
  icon: keyof typeof Feather.glyphMap;
  tone: Tone;
};

type TopicScore = {
  topic: string;
  score: number;
  count: number;
};

type Insight = {
  title: string;
  detail: string;
  tone: Tone;
  icon: keyof typeof Feather.glyphMap;
};

type DeepReport = {
  title: string;
  detail: string;
  topic: AnalyticsTopic;
  icon: keyof typeof Feather.glyphMap;
};

const toneStyles: Record<Tone, { color: string; background: string; border: string }> = {
  success: { color: '#006A4E', background: '#E4F5EF', border: '#BFE7D5' },
  warning: { color: '#A96716', background: '#FFF3DF', border: '#F1D6A8' },
  danger: { color: '#B9423A', background: '#FCE8E5', border: '#F1C4BE' },
  info: { color: '#1E5B8C', background: '#E8F2FA', border: '#BFD8EC' },
};

const deepReports: DeepReport[] = [
  { title: 'Attendance', detail: 'Daily pattern and grade risk', topic: 'Attendance Analytics', icon: 'user-check' },
  { title: 'Assessments', detail: 'Scores, completion, and growth', topic: 'Assessment Analytics', icon: 'clipboard' },
  { title: 'Topic Mastery', detail: 'Strong and weak concepts', topic: 'Topic Mastery Heatmap', icon: 'target' },
  { title: 'Student Support', detail: 'Intervention priorities', topic: 'Student Risk Analysis', icon: 'alert-triangle' },
];

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getAssessmentAverage(students: StudentProfile[]) {
  return average(students.flatMap((student) => Object.values(student.scores)));
}

function getTopicScores(students: StudentProfile[]): TopicScore[] {
  const topicMap = new Map<string, number[]>();

  students.forEach((student) => {
    student.assessmentHistory.forEach((row) => {
      topicMap.set(row.topic, [...(topicMap.get(row.topic) ?? []), row.score]);
    });
    student.weakConcepts.forEach((topic) => {
      topicMap.set(topic, [...(topicMap.get(topic) ?? []), Math.max(48, student.readiness - 14)]);
    });
    student.strengthAreas.forEach((topic) => {
      topicMap.set(topic, [...(topicMap.get(topic) ?? []), Math.min(96, student.readiness + 5)]);
    });
  });

  return [...topicMap.entries()]
    .map(([topic, scores]) => ({ topic, score: average(scores), count: scores.length }))
    .sort((a, b) => b.score - a.score);
}

function getStudentsForTopic(students: StudentProfile[], topic: string) {
  return students.filter((student) => {
    const weakMatch = student.weakConcepts.includes(topic);
    const assessmentMatch = student.assessmentHistory.some((row) => row.topic === topic && row.score < 80);
    return weakMatch || assessmentMatch;
  });
}

function getSupportStudents(students: StudentProfile[]) {
  return [...students]
    .filter((student) => student.riskLevel !== 'Low')
    .sort((a, b) => {
      const severity = { High: 2, Medium: 1, Low: 0 };
      return severity[b.riskLevel] - severity[a.riskLevel] || a.readiness - b.readiness || a.attendance - b.attendance;
    });
}

function GradeSelector({ selectedGrade, onSelect }: { selectedGrade: Grade; onSelect: (grade: Grade) => void }) {
  return (
    <View style={styles.gradeSelector}>
      {gradeOptions.map((grade) => (
        <TouchableOpacity
          key={grade}
          style={[styles.gradeButton, selectedGrade === grade && styles.gradeButtonActive]}
          onPress={() => onSelect(grade)}
          activeOpacity={0.86}>
          <Text style={[styles.gradeButtonText, selectedGrade === grade && styles.gradeButtonTextActive]}>G{grade}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const SummaryCard = memo(function SummaryCard({ metric }: { metric: SummaryMetric }) {
  const tone = toneStyles[metric.tone];

  return (
    <View style={[styles.summaryCard, { borderColor: tone.border }]}>
      <View style={[styles.summaryIcon, { backgroundColor: tone.background }]}>
        <Feather name={metric.icon} size={18} color={tone.color} />
      </View>
      <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>{metric.value}</Text>
      <Text style={styles.summaryLabel} numberOfLines={2}>{metric.label}</Text>
      <Text style={styles.summaryDetail} numberOfLines={2}>{metric.detail}</Text>
    </View>
  );
});

function InsightCard({ insight }: { insight: Insight }) {
  const tone = toneStyles[insight.tone];

  return (
    <View style={styles.insightCard}>
      <View style={[styles.insightIcon, { backgroundColor: tone.background }]}>
        <Feather name={insight.icon} size={17} color={tone.color} />
      </View>
      <View style={styles.insightCopy}>
        <Text style={styles.insightTitle} numberOfLines={2}>{insight.title}</Text>
        <Text style={styles.insightDetail} numberOfLines={3}>{insight.detail}</Text>
      </View>
    </View>
  );
}

function StudentPriorityCard({ student }: { student: StudentProfile }) {
  const tone = student.riskLevel === 'High' ? toneStyles.danger : toneStyles.warning;
  const averageScore = getAssessmentAverage([student]);

  return (
    <View style={styles.studentPriorityCard}>
      <View style={[styles.studentRiskIcon, { backgroundColor: tone.background }]}>
        <Feather name={student.riskLevel === 'High' ? 'alert-triangle' : 'target'} size={16} color={tone.color} />
      </View>
      <View style={styles.studentPriorityCopy}>
        <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
        <Text style={styles.studentNeed} numberOfLines={1}>{student.weakConcepts.join(', ')}</Text>
      </View>
      <View style={styles.studentScorePill}>
        <Text style={styles.studentScoreText}>{averageScore}%</Text>
      </View>
    </View>
  );
}

function ReportCard({ report, onPress }: { report: DeepReport; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.reportCard} activeOpacity={0.86} onPress={onPress}>
      <View style={styles.reportIcon}>
        <Feather name={report.icon} size={18} color="#006A4E" />
      </View>
      <View style={styles.reportCopy}>
        <Text style={styles.reportTitle} numberOfLines={1}>{report.title}</Text>
        <Text style={styles.reportDetail} numberOfLines={2}>{report.detail}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="#607878" />
    </TouchableOpacity>
  );
}

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<Grade>(3);

  const gradeStudents = useMemo(() => {
    return allStudents.filter((student) => student.grade === selectedGrade);
  }, [selectedGrade]);

  const topicScores = useMemo(() => getTopicScores(gradeStudents), [gradeStudents]);
  const supportStudents = useMemo(() => getSupportStudents(gradeStudents), [gradeStudents]);

  const attendance = average(gradeStudents.map((student) => student.attendance));
  const assessmentAverage = getAssessmentAverage(gradeStudents);
  const strongestTopic = topicScores[0] ?? { topic: 'No topic', score: 0, count: 0 };
  const weakestTopic = topicScores[topicScores.length - 1] ?? strongestTopic;
  const weakestTopicStudents = getStudentsForTopic(gradeStudents, weakestTopic.topic);
  const readingStudents = getStudentsForTopic(gradeStudents, 'Reading Fluency');
  const highRiskStudent = supportStudents.find((student) => student.riskLevel === 'High');

  const summaryMetrics: SummaryMetric[] = [
    {
      label: 'Attendance %',
      value: `${attendance}%`,
      detail: attendance >= 92 ? 'Healthy this cycle' : 'Needs follow-up',
      icon: 'user-check',
      tone: attendance >= 92 ? 'success' : 'warning',
    },
    {
      label: 'Assessment Average',
      value: `${assessmentAverage}%`,
      detail: 'Across core subjects',
      icon: 'clipboard',
      tone: assessmentAverage >= 82 ? 'success' : 'info',
    },
    {
      label: 'Students Needing Support',
      value: String(supportStudents.length),
      detail: supportStudents.length > 0 ? 'Open intervention group' : 'No urgent support',
      icon: 'alert-triangle',
      tone: supportStudents.some((student) => student.riskLevel === 'High') ? 'danger' : 'warning',
    },
    {
      label: 'Strongest Topic',
      value: strongestTopic.topic,
      detail: `${strongestTopic.score}% mastery`,
      icon: 'trending-up',
      tone: 'success',
    },
    {
      label: 'Weakest Topic',
      value: weakestTopic.topic,
      detail: `${weakestTopic.score}% mastery`,
      icon: 'target',
      tone: weakestTopic.score < 75 ? 'danger' : 'warning',
    },
  ];

  const actionableInsights: Insight[] = [
    {
      title: `${Math.max(weakestTopicStudents.length, supportStudents.length)} students struggling with ${weakestTopic.topic}.`,
      detail: supportStudents.slice(0, 3).map((student) => student.name).join(', ') || 'No urgent learners flagged.',
      tone: supportStudents.length > 0 ? 'danger' : 'success',
      icon: 'alert-triangle',
    },
    {
      title: 'Reading Fluency improving.',
      detail: readingStudents.length > 0
        ? `${readingStudents.map((student) => student.name).slice(0, 2).join(', ')} still need short practice checks.`
        : 'Most learners show steady reading confidence.',
      tone: 'success',
      icon: 'book-open',
    },
    {
      title: `Grade ${selectedGrade} attendance ${attendance < 92 ? 'decreasing' : 'stable'}.`,
      detail: attendance < 92 ? 'Start with a quick attendance check-in before instruction.' : 'Keep the current morning routine.',
      tone: attendance < 92 ? 'warning' : 'success',
      icon: attendance < 92 ? 'trending-down' : 'check-circle',
    },
    {
      title: highRiskStudent ? `${highRiskStudent.name} needs priority intervention.` : 'No high-risk learner this grade.',
      detail: highRiskStudent ? `Focus on ${highRiskStudent.weakConcepts.join(', ')} today.` : 'Use enrichment cards for on-track learners.',
      tone: highRiskStudent ? 'danger' : 'success',
      icon: highRiskStudent ? 'user-plus' : 'award',
    },
  ];

  const openReport = (topic: AnalyticsTopic) => {
    router.push({ pathname: '/analytics-topic-detail', params: { topic } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Calcmate Intelligence</Text>
            <Text style={styles.title}>Analytics</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.86} onPress={() => openReport('Grade Performance')}>
            <Feather name="bar-chart-2" size={18} color="#006A4E" />
          </TouchableOpacity>
        </View>

        <GradeSelector selectedGrade={selectedGrade} onSelect={setSelectedGrade} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.sectionCaption}>Grade {selectedGrade} action snapshot</Text>
        </View>
        <View style={styles.summaryGrid}>
          {summaryMetrics.map((metric) => (
            <SummaryCard key={metric.label} metric={metric} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actionable Insights</Text>
          <Text style={styles.sectionCaption}>Start with these classroom moves</Text>
        </View>
        <View style={styles.insightList}>
          {actionableInsights.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Students To Check First</Text>
          <Text style={styles.sectionCaption}>Tamil learners sorted by intervention priority</Text>
        </View>
        <View style={styles.priorityCard}>
          {supportStudents.length > 0 ? (
            supportStudents.slice(0, 4).map((student) => (
              <StudentPriorityCard key={student.id} student={student} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={20} color="#006A4E" />
              <Text style={styles.emptyText}>No urgent intervention group for this grade.</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Deep Reports</Text>
          <Text style={styles.sectionCaption}>Tap only when you need more detail</Text>
        </View>
        <View style={styles.reportList}>
          {deepReports.map((report) => (
            <ReportCard key={report.title} report={report} onPress={() => openReport(report.topic)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F6F5' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 104 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1, minWidth: 0 },
  eyebrow: { color: '#006A4E', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#1A2B4C', fontSize: 30, lineHeight: 36, fontWeight: '900', marginTop: 4 },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7E5',
  },
  gradeSelector: { flexDirection: 'row', gap: 8, marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 8 },
  gradeButton: { flex: 1, minHeight: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF5F4' },
  gradeButtonActive: { backgroundColor: '#1A5C50' },
  gradeButtonText: { color: '#4F6064', fontSize: 12, fontWeight: '900' },
  gradeButtonTextActive: { color: '#FFFFFF' },
  sectionHeader: { marginTop: 22, marginBottom: 10 },
  sectionTitle: { color: '#1A2B4C', fontSize: 20, lineHeight: 25, fontWeight: '900' },
  sectionCaption: { color: '#607878', fontSize: 12, lineHeight: 16, fontWeight: '700', marginTop: 4 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 142,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  summaryIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { color: '#1A2B4C', fontSize: 23, lineHeight: 28, fontWeight: '900', marginTop: 12 },
  summaryLabel: { color: '#4F6064', fontSize: 12, lineHeight: 16, fontWeight: '900', marginTop: 4 },
  summaryDetail: { color: '#607878', fontSize: 11, lineHeight: 15, fontWeight: '700', marginTop: 5 },
  insightList: { gap: 10 },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE7E5',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  insightIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  insightCopy: { flex: 1, minWidth: 0 },
  insightTitle: { color: '#1A2B4C', fontSize: 15, lineHeight: 20, fontWeight: '900' },
  insightDetail: { color: '#607878', fontSize: 12, lineHeight: 17, fontWeight: '700', marginTop: 4 },
  priorityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE7E5',
    padding: 12,
    gap: 8,
  },
  studentPriorityCard: {
    minHeight: 58,
    borderRadius: 8,
    backgroundColor: '#F8FBFA',
    borderWidth: 1,
    borderColor: '#E3EAE8',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  studentRiskIcon: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  studentPriorityCopy: { flex: 1, minWidth: 0 },
  studentName: { color: '#1A2B4C', fontSize: 14, fontWeight: '900' },
  studentNeed: { color: '#607878', fontSize: 11, fontWeight: '700', marginTop: 3 },
  studentScorePill: { minWidth: 48, minHeight: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F2FA', paddingHorizontal: 8 },
  studentScoreText: { color: '#1E5B8C', fontSize: 12, fontWeight: '900' },
  emptyState: { minHeight: 58, borderRadius: 8, backgroundColor: '#E4F5EF', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  emptyText: { flex: 1, minWidth: 0, color: '#006A4E', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  reportList: { gap: 10 },
  reportCard: {
    minHeight: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE7E5',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reportIcon: { width: 38, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4F5EF' },
  reportCopy: { flex: 1, minWidth: 0 },
  reportTitle: { color: '#1A2B4C', fontSize: 14, fontWeight: '900' },
  reportDetail: { color: '#607878', fontSize: 12, lineHeight: 16, fontWeight: '700', marginTop: 4 },
});
