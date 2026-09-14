import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { gradeOptions, students as allStudents, type Grade, type StudentProfile } from '../../data/tamilStudentData';

type Period = 'This Week' | 'This Month' | 'Term' | 'Academic Year';
type Tone = 'success' | 'warning' | 'danger' | 'info';

type Kpi = {
  label: string;
  value: string;
  trend: string;
  icon: keyof typeof Feather.glyphMap;
  tone: Tone;
};

type TrendPoint = {
  month: string;
  attendance: number;
  assessment: number;
};

type SubjectScore = {
  subject: string;
  score: number;
  delta: string;
};

type HeatmapTopic = {
  topic: string;
  mastery: number;
};

type RiskStudent = {
  name: string;
  topic: string;
  risk: 'High' | 'Medium';
};

type InsightItem = {
  kind: 'good' | 'watch';
  text: string;
};

type ActionItem = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  routeTopic?: string;
};

const periods: Period[] = ['This Week', 'This Month', 'Term', 'Academic Year'];

const actionItems: ActionItem[] = [
  { label: 'Attendance Analytics', icon: 'user-check', routeTopic: 'Attendance Analytics' },
  { label: 'Assessment Analytics', icon: 'clipboard', routeTopic: 'Assessment Analytics' },
  { label: 'Topic Mastery', icon: 'grid', routeTopic: 'Topic Mastery Heatmap' },
  { label: 'Risk Analysis', icon: 'alert-triangle', routeTopic: 'Student Risk Analysis' },
  { label: 'Grade Comparison', icon: 'bar-chart-2', routeTopic: 'Grade Performance' },
  { label: 'Export Reports', icon: 'download' },
];

const toneColors: Record<Tone, { icon: string; background: string; trend: string }> = {
  success: { icon: '#006A4E', background: '#E3F3ED', trend: '#006A4E' },
  warning: { icon: '#A96716', background: '#FFF1DD', trend: '#A96716' },
  danger: { icon: '#B9423A', background: '#FCE8E5', trend: '#B9423A' },
  info: { icon: '#1E5B8C', background: '#E8F2FA', trend: '#1E5B8C' },
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getAssessmentAverage(gradeStudents: StudentProfile[]) {
  return average(gradeStudents.flatMap((student) => Object.values(student.scores)));
}

function getTopicMastery(gradeStudents: StudentProfile[]) {
  return average(gradeStudents.map((student) => Math.round((student.readiness + getAssessmentAverage([student])) / 2)));
}

function getKpis(gradeStudents: StudentProfile[], period: Period): Kpi[] {
  const periodBoost = periods.indexOf(period);
  const attendance = average(gradeStudents.map((student) => student.attendance));
  const assessment = getAssessmentAverage(gradeStudents);
  const mastery = getTopicMastery(gradeStudents);
  const risk = gradeStudents.filter((student) => student.riskLevel !== 'Low').length;
  const completion = Math.min(99, 88 + periodBoost * 2 + Math.round(gradeStudents.filter((student) => student.assessmentHistory.length >= 3).length / Math.max(1, gradeStudents.length) * 7));
  const trend = Math.max(1.8, (assessment - 76) / 3 + periodBoost * 0.3);

  return [
    { label: 'Attendance', value: `${attendance}%`, trend: '+2.1%', icon: 'user-check', tone: attendance >= 92 ? 'success' : 'warning' },
    { label: 'Assessment Average', value: `${assessment}%`, trend: '+4.6%', icon: 'clipboard', tone: 'info' },
    { label: 'Topic Mastery', value: `${mastery}%`, trend: '+5.2%', icon: 'target', tone: mastery >= 80 ? 'success' : 'warning' },
    { label: 'At-Risk Students', value: String(risk), trend: risk > 0 ? 'Needs review' : 'Stable', icon: 'alert-triangle', tone: risk > 1 ? 'danger' : 'warning' },
    { label: 'Assessment Completion', value: `${completion}%`, trend: '+8.0%', icon: 'check-circle', tone: 'success' },
    { label: 'Improvement Trend', value: `+${trend.toFixed(1)}%`, trend: '6 month avg', icon: 'trending-up', tone: 'info' },
  ];
}

function getSubjectScores(gradeStudents: StudentProfile[]): SubjectScore[] {
  const math = average(gradeStudents.map((student) => student.scores.Mathematics));
  const english = average(gradeStudents.map((student) => student.scores.English));
  const science = average(gradeStudents.map((student) => student.scores.Science));
  const socialStudies = average(gradeStudents.map((student) => Math.round((student.readiness + student.attendance) / 2)));

  return [
    { subject: 'Mathematics', score: math, delta: `+${Math.max(1, Math.round((math - 72) / 4))}%` },
    { subject: 'English', score: english, delta: `+${Math.max(1, Math.round((english - 74) / 4))}%` },
    { subject: 'Science', score: science, delta: `+${Math.max(1, Math.round((science - 73) / 4))}%` },
    { subject: 'Social Studies', score: socialStudies, delta: `+${Math.max(1, Math.round((socialStudies - 75) / 5))}%` },
  ];
}

function getHeatmapTopics(gradeStudents: StudentProfile[]): HeatmapTopic[] {
  const topicScores = new Map<string, number[]>();
  const requiredTopics = ['Number Sense', 'Measurement', 'Fractions', 'Reading Fluency', 'Phonics', 'Life Cycles'];

  requiredTopics.forEach((topic) => topicScores.set(topic, []));
  gradeStudents.forEach((student) => {
    student.assessmentHistory.forEach((row) => {
      const normalizedTopic = row.topic.includes('Plant') || row.topic.includes('Energy') || row.topic.includes('Human')
        ? 'Life Cycles'
        : row.topic.includes('Reading') ? 'Reading Fluency' : row.topic;
      topicScores.set(normalizedTopic, [...(topicScores.get(normalizedTopic) ?? []), row.score]);
    });
    student.weakConcepts.forEach((topic) => {
      topicScores.set(topic, [...(topicScores.get(topic) ?? []), Math.max(52, student.readiness - 12)]);
    });
    student.strengthAreas.forEach((topic) => {
      topicScores.set(topic, [...(topicScores.get(topic) ?? []), Math.min(96, student.readiness + 6)]);
    });
  });

  return requiredTopics.map((topic) => ({
    topic,
    mastery: average(topicScores.get(topic) ?? gradeStudents.map((student) => student.readiness)),
  }));
}

function getRiskStudents(gradeStudents: StudentProfile[]): RiskStudent[] {
  return [...gradeStudents]
    .filter((student) => student.riskLevel !== 'Low')
    .sort((a, b) => {
      const severity = { High: 2, Medium: 1, Low: 0 };
      return severity[b.riskLevel] - severity[a.riskLevel] || a.readiness - b.readiness;
    })
    .slice(0, 3)
    .map((student) => ({
      name: student.name,
      topic: student.weakConcepts[0] ?? 'Foundational Practice',
      risk: student.riskLevel === 'High' ? 'High' : 'Medium',
    }));
}

function getInsights(grade: Grade, gradeStudents: StudentProfile[], subjectScores: SubjectScore[], heatmapTopics: HeatmapTopic[]): InsightItem[] {
  const strongestSubject = [...subjectScores].sort((a, b) => b.score - a.score)[0];
  const weakestTopic = [...heatmapTopics].sort((a, b) => a.mastery - b.mastery)[0];
  const riskCount = gradeStudents.filter((student) => student.riskLevel !== 'Low').length;
  const attendance = average(gradeStudents.map((student) => student.attendance));

  return [
    { kind: 'good', text: `Grade ${grade} attendance is ${attendance}% across ${gradeStudents.length} Tamil learners` },
    { kind: 'good', text: `${strongestSubject.subject} is the strongest subject at ${strongestSubject.score}%` },
    { kind: 'watch', text: `${weakestTopic.topic} remains the weakest topic at ${weakestTopic.mastery}%` },
    { kind: 'watch', text: `${riskCount} students may require intervention` },
  ];
}

function getTrendData(gradeStudents: StudentProfile[]): TrendPoint[] {
  const attendance = average(gradeStudents.map((student) => student.attendance));
  const assessment = getAssessmentAverage(gradeStudents);
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  return months.map((month, index) => ({
    month,
    attendance: Math.max(72, Math.min(98, attendance - (5 - index))),
    assessment: Math.max(65, Math.min(96, assessment - Math.round((5 - index) * 1.8))),
  }));
}

function masteryTone(score: number) {
  if (score >= 80) return { label: 'Strong', color: '#006A4E', background: '#DDF4EA' };
  if (score >= 65) return { label: 'Average', color: '#A96716', background: '#FFF1DD' };
  return { label: 'Weak', color: '#B9423A', background: '#FCE8E5' };
}

const KpiCard = memo(function KpiCard({ item }: { item: Kpi }) {
  const tone = toneColors[item.tone];

  return (
    <View style={styles.kpiCard}>
      <View style={styles.kpiTop}>
        <View style={[styles.kpiIcon, { backgroundColor: tone.background }]}>
          <Feather name={item.icon} size={18} color={tone.icon} />
        </View>
        <View style={styles.trendPill}>
          <Feather name="arrow-up" size={12} color={tone.trend} />
          <Text style={[styles.trendText, { color: tone.trend }]} numberOfLines={1}>{item.trend}</Text>
        </View>
      </View>
      <Text style={styles.kpiValue} numberOfLines={1}>{item.value}</Text>
      <Text style={styles.kpiLabel} numberOfLines={2}>{item.label}</Text>
    </View>
  );
});

function PeriodFilter({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  return (
    <View style={styles.periodGrid}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          style={[styles.periodChip, value === period && styles.periodChipActive]}
          activeOpacity={0.86}
          onPress={() => onChange(period)}>
          <Text style={[styles.periodText, value === period && styles.periodTextActive]} numberOfLines={1}>
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function GradeSelector({ value, onChange }: { value: Grade; onChange: (grade: Grade) => void }) {
  return (
    <View style={styles.gradeRow}>
      {gradeOptions.map((grade) => (
        <TouchableOpacity
          key={grade}
          style={[styles.gradePill, value === grade && styles.gradePillActive]}
          activeOpacity={0.86}
          onPress={() => onChange(grade)}>
          <Text style={[styles.gradeText, value === grade && styles.gradeTextActive]}>G{grade}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TrendChart({ data }: { data: TrendPoint[] }) {
  const trendData = data.length > 0 ? data : [{ month: 'Sep', attendance: 0, assessment: 0 }];
  const [selectedPoint, setSelectedPoint] = useState(trendData[trendData.length - 1]);

  return (
    <DashboardCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>Student Performance Trend</Text>
          <Text style={styles.sectionCaption}>Attendance vs assessment, last 6 months</Text>
        </View>
        <View style={styles.tooltipCard}>
          <Text style={styles.tooltipMonth}>{selectedPoint.month}</Text>
          <Text style={styles.tooltipValue}>A {selectedPoint.attendance}%  S {selectedPoint.assessment}%</Text>
        </View>
      </View>

      <View style={styles.chartLegend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.attendanceDot]} /><Text style={styles.legendText}>Attendance</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.assessmentDot]} /><Text style={styles.legendText}>Assessment</Text></View>
      </View>

      <View style={styles.chartArea}>
        {trendData.map((point) => {
          const attendanceHeight = Math.max(18, Math.round((point.attendance - 70) * 2.7));
          const assessmentHeight = Math.max(18, Math.round((point.assessment - 70) * 2.7));
          const selected = selectedPoint.month === point.month;

          return (
            <Pressable key={point.month} style={styles.chartColumn} onPress={() => setSelectedPoint(point)}>
              <View style={styles.chartPlot}>
                <View style={[styles.chartStem, styles.assessmentStem, { height: assessmentHeight }]} />
                <View style={[styles.chartStem, styles.attendanceStem, { height: attendanceHeight }]} />
                <View style={[styles.chartPoint, styles.assessmentPoint, selected && styles.pointSelected, { bottom: assessmentHeight }]} />
                <View style={[styles.chartPoint, styles.attendancePoint, selected && styles.pointSelected, { bottom: attendanceHeight }]} />
              </View>
              <Text style={[styles.chartMonth, selected && styles.chartMonthActive]}>{point.month}</Text>
            </Pressable>
          );
        })}
      </View>
    </DashboardCard>
  );
}

function SubjectPerformance({ data }: { data: SubjectScore[] }) {
  return (
    <DashboardCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
          <Text style={styles.sectionCaption}>Class average by subject</Text>
        </View>
      </View>
      <View style={styles.subjectList}>
        {data.map((subject) => (
          <View key={subject.subject} style={styles.subjectCard}>
            <View style={styles.subjectTop}>
              <Text style={styles.subjectName} numberOfLines={1}>{subject.subject}</Text>
              <Text style={styles.subjectScore}>{subject.score}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${subject.score}%` }]} />
            </View>
            <Text style={styles.subjectDelta}>{subject.delta} from previous cycle</Text>
          </View>
        ))}
      </View>
    </DashboardCard>
  );
}

function Heatmap({ data }: { data: HeatmapTopic[] }) {
  return (
    <DashboardCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>Topic Mastery Heatmap</Text>
          <Text style={styles.sectionCaption}>Green strong, yellow average, red weak</Text>
        </View>
      </View>
      <View style={styles.heatmapGrid}>
        {data.map((topic) => {
          const tone = masteryTone(topic.mastery);
          return (
            <View key={topic.topic} style={[styles.heatCell, { backgroundColor: tone.background }]}>
              <Text style={[styles.heatScore, { color: tone.color }]}>{topic.mastery}%</Text>
              <Text style={styles.heatTopic} numberOfLines={2}>{topic.topic}</Text>
              <Text style={[styles.heatLabel, { color: tone.color }]}>{tone.label}</Text>
            </View>
          );
        })}
      </View>
    </DashboardCard>
  );
}

function RiskStudents({ data }: { data: RiskStudent[] }) {
  return (
    <DashboardCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>At-Risk Students</Text>
          <Text style={styles.sectionCaption}>Top intervention priorities</Text>
        </View>
      </View>
      {data.map((student) => (
        <View key={student.name} style={styles.riskRow}>
          <View style={styles.riskIcon}>
            <Feather name="alert-triangle" size={17} color={student.risk === 'High' ? '#B9423A' : '#A96716'} />
          </View>
          <View style={styles.riskCopy}>
            <Text style={styles.riskName} numberOfLines={1}>{student.name}</Text>
            <Text style={styles.riskTopic} numberOfLines={1}>{student.topic}</Text>
          </View>
          <View style={[styles.riskBadge, student.risk === 'High' ? styles.highRisk : styles.mediumRisk]}>
            <Text style={[styles.riskBadgeText, student.risk === 'High' ? styles.highRiskText : styles.mediumRiskText]}>{student.risk}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.86}>
        <Text style={styles.viewAllText}>View All Students</Text>
        <Feather name="chevron-right" size={17} color="#006A4E" />
      </TouchableOpacity>
    </DashboardCard>
  );
}

function Insights({ data }: { data: InsightItem[] }) {
  return (
    <DashboardCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <Text style={styles.sectionCaption}>Generated from attendance and assessment signals</Text>
        </View>
      </View>
      <View style={styles.insightList}>
        {data.map((insight) => (
          <View key={insight.text} style={styles.insightRow}>
            <View style={[styles.insightIcon, insight.kind === 'good' ? styles.goodInsight : styles.watchInsight]}>
              <Feather name={insight.kind === 'good' ? 'check' : 'alert-triangle'} size={15} color={insight.kind === 'good' ? '#006A4E' : '#A96716'} />
            </View>
            <Text style={styles.insightText}>{insight.text}</Text>
          </View>
        ))}
      </View>
    </DashboardCard>
  );
}

function QuickActions({ onOpen }: { onOpen: (topic?: string) => void }) {
  return (
    <DashboardCard>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>Quick Analytics Actions</Text>
          <Text style={styles.sectionCaption}>Open focused reports and exports</Text>
        </View>
      </View>
      <View style={styles.actionGrid}>
        {actionItems.map((action) => (
          <TouchableOpacity key={action.label} style={styles.actionCard} activeOpacity={0.86} onPress={() => onOpen(action.routeTopic)}>
            <View style={styles.actionIcon}>
              <Feather name={action.icon} size={18} color="#006A4E" />
            </View>
            <Text style={styles.actionLabel} numberOfLines={2}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DashboardCard>
  );
}

function DashboardCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.dashboardCard}>{children}</View>;
}

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<Grade>(3);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('This Month');
  const gradeStudents = useMemo(() => {
    return allStudents.filter((student) => student.grade === selectedGrade);
  }, [selectedGrade]);
  const kpis = useMemo(() => getKpis(gradeStudents, selectedPeriod), [gradeStudents, selectedPeriod]);
  const subjectScores = useMemo(() => getSubjectScores(gradeStudents), [gradeStudents]);
  const heatmapTopics = useMemo(() => getHeatmapTopics(gradeStudents), [gradeStudents]);
  const riskStudents = useMemo(() => getRiskStudents(gradeStudents), [gradeStudents]);
  const insightItems = useMemo(() => getInsights(selectedGrade, gradeStudents, subjectScores, heatmapTopics), [gradeStudents, heatmapTopics, selectedGrade, subjectScores]);
  const trendData = useMemo(() => getTrendData(gradeStudents), [gradeStudents]);

  const openTopic = (topic?: string) => {
    if (topic) {
      router.push({ pathname: '/analytics-topic-detail', params: { topic } });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Calcmate Intelligence</Text>
            <Text style={styles.title}>Educational Analytics</Text>
          </View>
          <TouchableOpacity style={styles.exportButton} activeOpacity={0.86}>
            <Feather name="download" size={18} color="#006A4E" />
          </TouchableOpacity>
        </View>

        <GradeSelector value={selectedGrade} onChange={setSelectedGrade} />
        <PeriodFilter value={selectedPeriod} onChange={setSelectedPeriod} />

        <View style={styles.kpiGrid}>
          {kpis.map((item) => <KpiCard key={item.label} item={item} />)}
        </View>

        <TrendChart key={`trend-${selectedGrade}`} data={trendData} />
        <SubjectPerformance data={subjectScores} />
        <Heatmap data={heatmapTopics} />
        <RiskStudents data={riskStudents} />
        <Insights data={insightItems} />
        <QuickActions onOpen={openTopic} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F8F7' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 104 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1, minWidth: 0 },
  eyebrow: { color: '#006A4E', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#1A2B4C', fontSize: 27, lineHeight: 33, fontWeight: '900', marginTop: 5 },
  exportButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7E5',
    shadowColor: '#1A2B4C',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  gradeRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  gradePill: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE7E5',
  },
  gradePillActive: { backgroundColor: '#1A5C50', borderColor: '#1A5C50' },
  gradeText: { color: '#5C6B73', fontSize: 13, fontWeight: '900' },
  gradeTextActive: { color: '#FFFFFF' },
  periodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  periodChip: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#E9F0EE',
  },
  periodChipActive: { backgroundColor: '#1A2B4C' },
  periodText: { color: '#4F6064', fontSize: 12, fontWeight: '800' },
  periodTextActive: { color: '#FFFFFF' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  kpiCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 126,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#DDE7E5',
    shadowColor: '#1A2B4C',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  kpiTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  kpiIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  trendPill: { flexShrink: 1, minHeight: 25, borderRadius: 13, paddingHorizontal: 7, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F5F8F7' },
  trendText: { fontSize: 10, fontWeight: '900' },
  kpiValue: { color: '#1A2B4C', fontSize: 25, lineHeight: 30, fontWeight: '900', marginTop: 13 },
  kpiLabel: { color: '#5C6B73', fontSize: 12, lineHeight: 16, fontWeight: '800', marginTop: 3 },
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#DDE7E5',
    shadowColor: '#1A2B4C',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  sectionTitleBlock: { flex: 1, minWidth: 0 },
  sectionTitle: { color: '#1A2B4C', fontSize: 17, lineHeight: 22, fontWeight: '900' },
  sectionCaption: { color: '#5C6B73', fontSize: 12, lineHeight: 16, fontWeight: '700', marginTop: 3 },
  tooltipCard: { minWidth: 92, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#F0F5F4', alignItems: 'flex-end' },
  tooltipMonth: { color: '#1A2B4C', fontSize: 12, fontWeight: '900' },
  tooltipValue: { color: '#5C6B73', fontSize: 10, fontWeight: '800', marginTop: 2 },
  chartLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  attendanceDot: { backgroundColor: '#006A4E' },
  assessmentDot: { backgroundColor: '#1E5B8C' },
  legendText: { color: '#5C6B73', fontSize: 11, fontWeight: '800' },
  chartArea: {
    height: 156,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
    marginTop: 14,
    paddingTop: 8,
    borderRadius: 14,
    backgroundColor: '#F7FAF9',
  },
  chartColumn: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'flex-end' },
  chartPlot: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  chartStem: { position: 'absolute', bottom: 0, width: 5, borderRadius: 5 },
  attendanceStem: { right: '35%', backgroundColor: '#BDE4D6' },
  assessmentStem: { left: '35%', backgroundColor: '#C7DDF0' },
  chartPoint: { position: 'absolute', width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#FFFFFF' },
  attendancePoint: { right: '31%', backgroundColor: '#006A4E' },
  assessmentPoint: { left: '31%', backgroundColor: '#1E5B8C' },
  pointSelected: { width: 16, height: 16, borderRadius: 8 },
  chartMonth: { color: '#6B7C81', fontSize: 10, fontWeight: '800', marginTop: 7, marginBottom: 8 },
  chartMonthActive: { color: '#1A2B4C' },
  subjectList: { marginTop: 12, gap: 10 },
  subjectCard: { borderRadius: 14, backgroundColor: '#F7FAF9', padding: 12 },
  subjectTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  subjectName: { flex: 1, minWidth: 0, color: '#1A2B4C', fontSize: 14, fontWeight: '900' },
  subjectScore: { color: '#006A4E', fontSize: 14, fontWeight: '900' },
  progressTrack: { height: 8, borderRadius: 8, overflow: 'hidden', backgroundColor: '#DDE7E5', marginTop: 10 },
  progressFill: { height: '100%', borderRadius: 8, backgroundColor: '#1A5C50' },
  subjectDelta: { color: '#5C6B73', fontSize: 11, fontWeight: '700', marginTop: 7 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  heatCell: {
    flexGrow: 1,
    flexBasis: '31%',
    minHeight: 92,
    borderRadius: 14,
    padding: 10,
    justifyContent: 'space-between',
  },
  heatScore: { fontSize: 17, fontWeight: '900' },
  heatTopic: { color: '#1A2B4C', fontSize: 11, lineHeight: 14, fontWeight: '900', marginTop: 7 },
  heatLabel: { fontSize: 10, fontWeight: '900', marginTop: 6 },
  riskRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EFED',
  },
  riskIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1DD' },
  riskCopy: { flex: 1, minWidth: 0 },
  riskName: { color: '#1A2B4C', fontSize: 14, fontWeight: '900' },
  riskTopic: { color: '#5C6B73', fontSize: 12, fontWeight: '700', marginTop: 3 },
  riskBadge: { minWidth: 64, minHeight: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  highRisk: { backgroundColor: '#FCE8E5' },
  mediumRisk: { backgroundColor: '#FFF1DD' },
  riskBadgeText: { fontSize: 11, fontWeight: '900' },
  highRiskText: { color: '#B9423A' },
  mediumRiskText: { color: '#A96716' },
  viewAllButton: { minHeight: 42, marginTop: 12, borderRadius: 14, backgroundColor: '#E3F3ED', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  viewAllText: { color: '#006A4E', fontSize: 13, fontWeight: '900' },
  insightList: { marginTop: 12, gap: 8 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, paddingVertical: 4 },
  insightIcon: { width: 26, height: 26, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  goodInsight: { backgroundColor: '#E3F3ED' },
  watchInsight: { backgroundColor: '#FFF1DD' },
  insightText: { flex: 1, minWidth: 0, color: '#1A2B4C', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  actionCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 82,
    borderRadius: 14,
    padding: 11,
    backgroundColor: '#F7FAF9',
    borderWidth: 1,
    borderColor: '#E3EAE8',
  },
  actionIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F3ED', marginBottom: 8 },
  actionLabel: { color: '#1A2B4C', fontSize: 13, lineHeight: 17, fontWeight: '900' },
});
