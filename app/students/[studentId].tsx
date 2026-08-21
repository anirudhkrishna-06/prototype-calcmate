// File: app/students/[studentId].tsx
// High-Fidelity Comprehensive Student Profile Dashboard
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
} from 'react-native-reanimated';

import { getStudentById, setStudentAttendance } from '@/data/mockData';
import { Student } from '@/types';

// Mock expanded learner analytics for deep profile presentation
function getLearnerMetrics(student: Student) {
  const isStrong = student.knowledgeLevel === 'strong';
  const isDev = student.knowledgeLevel === 'developing';

  return {
    rollNumber: `STU-${student.id.padStart(4, '0')}`,
    overallScore: isStrong ? 88 : isDev ? 72 : 54,
    attendanceRate: student.attendance === 'present' ? '94%' : '82%',
    engagementScore: isStrong ? '4.9 / 5' : isDev ? '4.1 / 5' : '3.2 / 5',
    rankInClass: isStrong ? 'Top 10%' : isDev ? 'Top 40%' : 'Needs Focus',
    parent: {
      name: 'Sarah & Mark Johnson',
      relation: 'Parents',
      phone: '+1 (555) 234-5678',
      email: 'parents@example.com',
    },
    skills: [
      { name: 'Equivalent Fractions', score: isStrong ? 94 : isDev ? 75 : 45, level: 'Mastered', color: '#147D7A' },
      { name: 'Numerator Comparison', score: isStrong ? 88 : isDev ? 68 : 38, level: isStrong ? 'Strong' : 'Developing', color: '#2563EB' },
      { name: 'Mixed Fraction Addition', score: isStrong ? 82 : isDev ? 55 : 28, level: isStrong ? 'Proficient' : 'Needs Practice', color: '#B45309' },
      { name: 'Decimal Conversions', score: isStrong ? 76 : isDev ? 42 : 20, level: isStrong ? 'Developing' : 'Emerging', color: '#DC2626' },
    ],
    classHistory: [
      { code: 'MATH-101', unit: 'Unit 4: Fraction Multiplications', score: '88%', status: 'In Progress', date: 'Active' },
      { code: 'MATH-100', unit: 'Unit 3: Intro to Rational Numbers', score: '92%', status: 'Passed', date: 'Oct 14' },
      { code: 'MATH-099', unit: 'Unit 2: Greatest Common Divisors', score: '85%', status: 'Passed', date: 'Sep 28' },
      { code: 'MATH-098', unit: 'Unit 1: Basic Operations & Modulo', score: '95%', status: 'Passed', date: 'Sep 10' },
    ],
  };
}

export default function StudentProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId?: string | string[] }>();
  const studentId = Array.isArray(params.studentId) ? params.studentId[0] : params.studentId;
  const [student, setStudent] = useState<Student | undefined>(() =>
    studentId ? getStudentById(studentId) : undefined
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'history' | 'contacts'>('overview');

  useEffect(() => {
    setStudent(studentId ? getStudentById(studentId) : undefined);
  }, [studentId]);

  const updateAttendance = useCallback(
    (attendance: Student['attendance']) => {
      if (!student) return;
      setStudentAttendance(
        student.id,
        attendance,
        new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      );
      setStudent(getStudentById(student.id));
    },
    [student]
  );

  if (!student) {
    return (
      <>
        <Stack.Screen options={{ title: 'Learner Record' }} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.notFoundCard}>
            <Feather name="user-x" size={40} color="#DC2626" />
            <Text style={styles.notFoundTitle}>Learner Profile Not Found</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
              <Text style={styles.primaryBtnText}>Return to Directory</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const metrics = getLearnerMetrics(student);
  const isPresent = student.attendance === 'present';
  const attendanceHistory = [...(student.attendanceChanges ?? [])].reverse();

  return (
    <>
      <Stack.Screen
        options={{
          title: student.name,
          headerBackTitle: 'Roster',
          headerTitleStyle: { fontWeight: '800', color: '#17233C' },
          headerStyle: { backgroundColor: '#F7F8F5' },
        }}
      />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Header Hero Profile Card */}
          <Animated.View entering={FadeInDown.duration(280)} style={styles.heroCard}>
            <View style={styles.heroMainRow}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>{student.initials}</Text>
              </View>

              <View style={styles.heroMeta}>
                <View style={styles.nameRow}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View style={styles.rollBadge}>
                    <Text style={styles.rollBadgeText}>{metrics.rollNumber}</Text>
                  </View>
                </View>

                <Text style={styles.gradeText}>{student.grade} • Classroom Group A</Text>

                <View style={styles.chipRow}>
                  <View style={[styles.statusChip, { backgroundColor: isPresent ? '#E6F4F1' : '#FEE2E2' }]}>
                    <View style={[styles.dot, { backgroundColor: isPresent ? '#147D7A' : '#DC2626' }]} />
                    <Text style={[styles.statusChipText, { color: isPresent ? '#147D7A' : '#DC2626' }]}>
                      {isPresent ? 'Present Today' : 'Marked Absent'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Attendance Toggle Bar */}
            <View style={styles.actionToolbar}>
              <Pressable
                onPress={() => updateAttendance('present')}
                style={[styles.toggleBtn, isPresent && styles.togglePresentActive]}
              >
                <Feather name="check-circle" size={14} color={isPresent ? '#FFFFFF' : '#667085'} />
                <Text style={[styles.toggleBtnText, isPresent && styles.toggleTextActive]}>Present</Text>
              </Pressable>

              <Pressable
                onPress={() => updateAttendance('absent')}
                style={[styles.toggleBtn, !isPresent && styles.toggleAbsentActive]}
              >
                <Feather name="x-circle" size={14} color={!isPresent ? '#FFFFFF' : '#667085'} />
                <Text style={[styles.toggleBtnText, !isPresent && styles.toggleTextActive]}>Absent</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Navigation Tab Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
            {(['overview', 'skills', 'history', 'contacts'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabChip, active && styles.tabChipActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabChipText, active && styles.tabChipTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <Animated.View layout={Layout.springify()} style={styles.sectionGroup}>
              {/* Quick Stat Grid */}
              <View style={styles.statGrid}>
                <View style={styles.statCard}>
                  <Feather name="award" size={18} color="#147D7A" />
                  <Text style={styles.statValue}>{metrics.overallScore}%</Text>
                  <Text style={styles.statLabel}>Concept Score</Text>
                </View>
                <View style={styles.statCard}>
                  <Feather name="calendar" size={18} color="#2563EB" />
                  <Text style={styles.statValue}>{metrics.attendanceRate}</Text>
                  <Text style={styles.statLabel}>Attendance</Text>
                </View>
                <View style={styles.statCard}>
                  <Feather name="activity" size={18} color="#B45309" />
                  <Text style={styles.statValue}>{metrics.engagementScore}</Text>
                  <Text style={styles.statLabel}>Engagement</Text>
                </View>
                <View style={styles.statCard}>
                  <Feather name="trending-up" size={18} color="#7E22CE" />
                  <Text style={styles.statValue}>{metrics.rankInClass}</Text>
                  <Text style={styles.statLabel}>Standing</Text>
                </View>
              </View>

              {/* Instructional Priority Recommendation Card */}
              {student.recommendation && (
                <View style={styles.calloutCard}>
                  <View style={styles.calloutHeader}>
                    <Feather name="zap" size={16} color="#B45309" />
                    <Text style={styles.calloutTitle}>Instructional Priority Action</Text>
                  </View>
                  <Text style={styles.calloutBody}>{student.recommendation}</Text>
                </View>
              )}

              {/* Quick Knowledge Summary */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Current Knowledge Focus</Text>
                  <TouchableOpacity onPress={() => router.push('/knowledge-trace' as never)}>
                    <Text style={styles.linkText}>Trace Matrix →</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.conceptHighlight}>{student.currentConcept}</Text>
                <Text style={styles.bodySecondary}>
                  Currently working through teacher-led subgroup exercises and parallel independent study units.
                </Text>
              </View>
            </Animated.View>
          )}

          {/* TAB 2: SKILLS & KNOWLEDGE GRAPH */}
          {activeTab === 'skills' && (
            <Animated.View layout={Layout.springify()} style={styles.sectionGroup}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Skill Competency Graph</Text>
                  <Text style={styles.cardMeta}>{student.grade}</Text>
                </View>

                <View style={styles.skillsList}>
                  {metrics.skills.map((skill, index) => (
                    <View key={skill.name} style={styles.skillRow}>
                      <View style={styles.skillMeta}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <Text style={[styles.skillBadge, { color: skill.color }]}>
                          {skill.score}% • {skill.level}
                        </Text>
                      </View>
                      <View style={styles.trackBg}>
                        <Animated.View
                          entering={FadeInRight.delay(index * 100).duration(300)}
                          style={[styles.trackFill, { width: `${skill.score}%`, backgroundColor: skill.color }]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}

          {/* TAB 3: CLASS & CURRICULUM HISTORY */}
          {activeTab === 'history' && (
            <Animated.View layout={Layout.springify()} style={styles.sectionGroup}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Completed & Active Units</Text>
                <View style={styles.historyList}>
                  {metrics.classHistory.map((item) => (
                    <View key={item.code} style={styles.historyCardItem}>
                      <View style={styles.historyMeta}>
                        <Text style={styles.historyCode}>{item.code}</Text>
                        <Text style={styles.historyTitle}>{item.unit}</Text>
                      </View>
                      <View style={styles.historyScoreBox}>
                        <Text style={styles.historyScore}>{item.score}</Text>
                        <Text style={styles.historyDate}>{item.date}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Attendance Log */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Attendance Activity Log</Text>
                {attendanceHistory.length === 0 ? (
                  <Text style={styles.bodySecondary}>No attendance updates recorded today.</Text>
                ) : (
                  attendanceHistory.map((log, idx) => (
                    <View key={idx} style={styles.logRow}>
                      <View style={[styles.logDot, { backgroundColor: log.to === 'present' ? '#147D7A' : '#DC2626' }]} />
                      <Text style={styles.logText}>
                        Changed to <Text style={{ fontWeight: '800' }}>{log.to}</Text>
                      </Text>
                      <Text style={styles.logTime}>{log.time}</Text>
                    </View>
                  ))
                )}
              </View>
            </Animated.View>
          )}

          {/* TAB 4: GUARDIAN & CONTACT DETAILS */}
          {activeTab === 'contacts' && (
            <Animated.View layout={Layout.springify()} style={styles.sectionGroup}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Parent / Guardian Information</Text>
                <View style={styles.contactRow}>
                  <Feather name="users" size={16} color="#147D7A" />
                  <View style={styles.contactMeta}>
                    <Text style={styles.contactName}>{metrics.parent.name}</Text>
                    <Text style={styles.contactRole}>{metrics.parent.relation}</Text>
                  </View>
                </View>

                <View style={styles.contactButtons}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => Linking.openURL(`tel:${metrics.parent.phone}`)}
                  >
                    <Feather name="phone" size={14} color="#147D7A" />
                    <Text style={styles.actionBtnText}>Call Phone</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => Linking.openURL(`mailto:${metrics.parent.email}`)}
                  >
                    <Feather name="mail" size={14} color="#2563EB" />
                    <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>Send Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  notFoundCard: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17233C',
  },
  primaryBtn: {
    backgroundColor: '#17233C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAECE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  heroMainRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#E6F4F1',
    borderWidth: 2,
    borderColor: '#147D7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#147D7A',
  },
  heroMeta: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17233C',
  },
  rollBadge: {
    backgroundColor: '#F0F2EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rollBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#667085',
  },
  gradeText: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionToolbar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2EE',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F7F8F5',
  },
  togglePresentActive: {
    backgroundColor: '#147D7A',
  },
  toggleAbsentActive: {
    backgroundColor: '#DC2626',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  tabBar: {
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECE8',
  },
  tabChipActive: {
    backgroundColor: '#17233C',
    borderColor: '#17233C',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  sectionGroup: {
    gap: 14,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAECE8',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#17233C',
  },
  statLabel: {
    fontSize: 11,
    color: '#667085',
    fontWeight: '600',
  },
  calloutCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  calloutBody: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350F',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAECE8',
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17233C',
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#147D7A',
  },
  conceptHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#147D7A',
  },
  bodySecondary: {
    fontSize: 12,
    color: '#667085',
    lineHeight: 18,
  },
  skillsList: {
    gap: 12,
  },
  skillRow: {
    gap: 4,
  },
  skillMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17233C',
  },
  skillBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  trackBg: {
    height: 6,
    backgroundColor: '#F0F2EE',
    borderRadius: 999,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 999,
  },
  historyList: {
    gap: 10,
  },
  historyCardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2EE',
  },
  historyMeta: {
    flex: 1,
  },
  historyCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#147D7A',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#17233C',
  },
  historyScoreBox: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17233C',
  },
  historyDate: {
    fontSize: 10,
    color: '#667085',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logText: {
    fontSize: 12,
    color: '#17233C',
    flex: 1,
  },
  logTime: {
    fontSize: 11,
    color: '#667085',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  contactMeta: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17233C',
  },
  contactRole: {
    fontSize: 11,
    color: '#667085',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F0F2EE',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#147D7A',
  },
});