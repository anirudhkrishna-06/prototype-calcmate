import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AnalyticsTopic =
  | 'Attendance Analytics'
  | 'Assessment Analytics'
  | 'Topic Mastery Heatmap'
  | 'Student Risk Analysis'
  | 'Grade Performance';

type TopicDetail = {
  heading: string;
  title: string;
  description: string;
  metrics: { label: string; value: string; trend?: string }[];
};

const analyticsDetails: Record<AnalyticsTopic, TopicDetail> = {
  'Attendance Analytics': {
    heading: 'Attendance Analytics',
    title: 'Attendance Flow',
    description: 'Attendance health across the learning week, including absenteeism and daily participation signals.',
    metrics: [
      { label: 'Average attendance', value: '94.2%', trend: '+2.1% vs last cycle' },
      { label: 'Absenteeism rate', value: '3.8%', trend: '-1.2% improvement' },
      { label: 'Participation signal', value: 'High', trend: '91% engaged' },
    ],
  },
  'Assessment Analytics': {
    heading: 'Assessment Analytics',
    title: 'Assessment Quality',
    description: 'Assessment completeness, score quality, and subject performance trends by grade and learning domain.',
    metrics: [
      { label: 'Assessments completed', value: '24', trend: '+4 this cycle' },
      { label: 'Assessment quality', value: '87%', trend: '+12% completion' },
      { label: 'Assessment growth', value: '+4.6%', trend: 'Across all grades' },
    ],
  },
  'Topic Mastery Heatmap': {
    heading: 'Topic Mastery Heatmap',
    title: 'Mastery by Topic',
    description: 'Topic mastery trends reveal strengths and gaps across grades and curriculum strands.',
    metrics: [
      { label: 'Strongest topic', value: 'Phonics', trend: '94% mastery' },
      { label: 'Priority topic', value: 'Fractions', trend: '76% mastery' },
      { label: 'Learning signal', value: 'Warm trend', trend: '+5% growth' },
    ],
  },
  'Student Risk Analysis': {
    heading: 'Student Risk Analysis',
    title: 'Risk Intelligence',
    description: 'Student risk indicators combine attendance, assessment performance, and topic mastery patterns.',
    metrics: [
      { label: 'Students monitored', value: '06', trend: '3 high priority' },
      { label: 'Attendance risk', value: '32%', trend: 'Lower than target' },
      { label: 'Mastery risk', value: '49%', trend: 'Needs follow-up' },
    ],
  },
  'Grade Performance': {
    heading: 'Grade Performance',
    title: 'Grade Performance Signal',
    description: 'Grade-level learning strength, assessment outcomes, and classroom performance by learning objective.',
    metrics: [
      { label: 'Overall grade performance', value: '86%', trend: '+4.8% growth' },
      { label: 'Attendance grade signal', value: '95%', trend: 'Stable' },
      { label: 'Mastery grade signal', value: '84%', trend: 'Positive' },
    ],
  },
};

export default function AnalyticsTopicDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topic?: string }>();
  const topic = String(params.topic || 'Attendance Analytics') as AnalyticsTopic;
  const detail = analyticsDetails[topic] ?? analyticsDetails['Attendance Analytics'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.crumb}>Calcmate Intelligence</Text>
            <Text style={styles.title}>{detail.heading}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#163C40" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <Feather name="bar-chart-2" size={30} color="#163C40" />
            <Text style={styles.cardTitle}>{detail.title}</Text>
          </View>
          <Text style={styles.description}>{detail.description}</Text>

          <View style={styles.metricsList}>
            {detail.metrics.map((metric) => (
              <View key={metric.label} style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                </View>
                <View style={styles.metricRight}>
                  <Text style={styles.metricTrend}>{metric.trend}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Text style={styles.actionText}>Return to Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef4f4' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  crumb: { color: '#126B65', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#163C40', fontSize: 30, fontWeight: '800', marginTop: 8 },
  headerButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { color: '#163C40', fontSize: 22, fontWeight: '900' },
  description: { color: '#607878', fontSize: 13, fontWeight: '700', lineHeight: 20, marginTop: 14 },
  metricsList: { marginTop: 16 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#DCEBE8' },
  metricLeft: { flex: 1 },
  metricLabel: { color: '#607878', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  metricValue: { color: '#163C40', fontSize: 25, fontWeight: '900', marginTop: 8 },
  metricRight: { flexShrink: 1, alignItems: 'flex-end' },
  metricTrend: { color: '#126B65', fontSize: 11, fontWeight: '800' },
  actionButton: { marginTop: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#163C40', borderRadius: 14, paddingVertical: 14 },
  actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
});
