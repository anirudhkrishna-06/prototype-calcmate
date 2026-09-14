import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getInitials, getStudentById } from '../data/tamilStudentData';

export default function StudentDetailPage() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  const student = getStudentById(Number(studentId ?? 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.crumb}>Learner Intelligence</Text>
            <Text style={styles.title}>Student Detail</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Feather name='arrow-left' size={18} color='#163C40' />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeaderCard}>
          <View style={styles.profileIdentity}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>{getInitials(student.name)}</Text></View>
            <View style={styles.identityText}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.gradeRow}>Grade {student.grade} • Roll No. {student.rollNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}><Text style={styles.statValue}>{student.attendance}%</Text><Text style={styles.statLabel}>Attendance</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{student.readiness}%</Text><Text style={styles.statLabel}>Readiness</Text></View>
          <View style={styles.statBox}><Text style={styles.statValue}>{student.rank}</Text><Text style={styles.statLabel}>Class Rank</Text></View>
          <View style={styles.statBox}><Text style={[styles.statValue, student.riskLevel === 'High' ? styles.riskHigh : student.riskLevel === 'Medium' ? styles.riskMedium : styles.riskLow]}>{student.riskLevel}</Text><Text style={styles.statLabel}>Risk Level</Text></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Assessment Scores</Text>
          <View style={styles.scoreGrid}>
            <View style={styles.scoreRow}><Text style={styles.scoreSubject}>Mathematics</Text><Text style={styles.scoreValue}>{student.scores.Mathematics}%</Text></View>
            <View style={styles.scoreRow}><Text style={styles.scoreSubject}>English</Text><Text style={styles.scoreValue}>{student.scores.English}%</Text></View>
            <View style={styles.scoreRow}><Text style={styles.scoreSubject}>Science</Text><Text style={styles.scoreValue}>{student.scores.Science}%</Text></View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weak Concepts</Text>
          <View style={styles.tagWrap}>{student.weakConcepts.map((topic) => <Text key={topic} style={styles.tag}>{topic}</Text>)}</View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Strength Areas</Text>
          <View style={styles.tagWrap}>{student.strengthAreas.map((topic) => <Text key={topic} style={[styles.tag, styles.tagGreen]}>{topic}</Text>)}</View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Assessments</Text>
          <View style={styles.tableWrap}>
            {student.assessmentHistory.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableSubject}>{row.subject}</Text>
                <Text style={styles.tableTopic}>{row.topic}</Text>
                <Text style={styles.tableScore}>{row.score}%</Text>
                <Text style={styles.tableDate}>{row.date}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>AI Learning Insights</Text>
          <Text style={styles.insightText}>{student.aiInsight}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef4f4' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  crumb: { color: '#126B65', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#163C40', fontSize: 30, fontWeight: '800', marginTop: 8 },
  headerButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  profileHeaderCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  profileIdentity: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#163C40', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 25, fontWeight: '800' },
  identityText: { marginLeft: 12 },
  studentName: { color: '#163C40', fontSize: 22, fontWeight: '800' },
  gradeRow: { color: '#607878', fontSize: 12, fontWeight: '700', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  statBox: { width: '48%', backgroundColor: '#F8FBFA', borderRadius: 14, padding: 12, alignItems: 'center', marginBottom: 10 },
  statValue: { color: '#163C40', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#607878', fontSize: 11, fontWeight: '700', marginTop: 4 },
  riskHigh: { color: '#B65656' },
  riskMedium: { color: '#B77925' },
  riskLow: { color: '#126B65' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginTop: 14 },
  sectionTitle: { color: '#163C40', fontSize: 16, fontWeight: '800' },
  scoreGrid: { marginTop: 12 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomColor: '#DCE7E6', borderBottomWidth: 1 },
  scoreSubject: { color: '#607878', fontWeight: '700', fontSize: 12 },
  scoreValue: { color: '#163C40', fontWeight: '800', fontSize: 14 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { backgroundColor: '#EEF5F4', color: '#163C40', fontWeight: '800', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, fontSize: 11, marginRight: 8, marginBottom: 8 },
  tagGreen: { backgroundColor: '#DCFCE7', color: '#126B65' },
  tableWrap: { marginTop: 12 },
  tableRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomColor: '#DCE7E6', borderBottomWidth: 1 },
  tableSubject: { flex: 1, color: '#163C40', fontWeight: '800', fontSize: 12 },
  tableTopic: { flex: 1.3, color: '#607878', fontWeight: '700', fontSize: 11 },
  tableScore: { flex: .8, color: '#126B65', fontWeight: '900', fontSize: 12, textAlign: 'right' },
  tableDate: { flex: .8, color: '#607878', fontWeight: '700', fontSize: 11, textAlign: 'right' },
  insightText: { color: '#607878', fontSize: 12, fontWeight: '700', lineHeight: 20, marginTop: 12 },
});
