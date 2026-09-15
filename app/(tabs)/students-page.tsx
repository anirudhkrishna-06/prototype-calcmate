import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getInitials, gradeOptions, students, type Grade, type StudentProfile } from '../../data/tamilStudentData';

type LearningGroup = {
  id: string;
  label: string;
  focus: string;
  tone: 'danger' | 'warning' | 'success';
  students: StudentProfile[];
};

const riskWeight = { High: 0, Medium: 1, Low: 2 };

function getAssessmentAverage(student: StudentProfile) {
  return Math.round((student.scores.Mathematics + student.scores.English + student.scores.Science) / 3);
}

function sortByNeed(groupStudents: StudentProfile[]) {
  return [...groupStudents].sort((a, b) => {
    return riskWeight[a.riskLevel] - riskWeight[b.riskLevel] || a.readiness - b.readiness || a.attendance - b.attendance;
  });
}

function buildLearningGroups(gradeStudents: StudentProfile[]): LearningGroup[] {
  const placeValueSupport = sortByNeed(
    gradeStudents.filter((student) => student.riskLevel !== 'Low' && (student.weakConcepts.includes('Measurement') || student.weakConcepts.includes('Word Problems'))),
  );
  const readingFluencySupport = sortByNeed(
    gradeStudents.filter((student) => student.riskLevel !== 'Low' || student.scores.English < 82),
  ).slice(0, 5);
  const advancedActivities = [...gradeStudents]
    .filter((student) => student.riskLevel === 'Low' && student.readiness >= 86)
    .sort((a, b) => b.readiness - a.readiness)
    .slice(0, 3);

  return [
    { id: 'A', label: 'Group A', focus: 'Place Value Support', tone: 'danger', students: placeValueSupport },
    { id: 'B', label: 'Group B', focus: 'Reading Fluency Support', tone: 'warning', students: readingFluencySupport },
    { id: 'C', label: 'Group C', focus: 'Ready for Advanced Activities', tone: 'success', students: advancedActivities },
  ];
}

function OverviewCard({ label, value, tone }: { label: string; value: number; tone?: 'danger' | 'warning' | 'success' }) {
  return (
    <View style={[styles.overviewCard, tone === 'danger' && styles.overviewDanger, tone === 'warning' && styles.overviewWarning, tone === 'success' && styles.overviewSuccess]}>
      <Text style={styles.overviewValue}>{value}</Text>
      <Text style={styles.overviewLabel}>{label}</Text>
    </View>
  );
}

function StudentMiniCard({ student, onPress }: { student: StudentProfile; onPress: () => void }) {
  const average = getAssessmentAverage(student);

  return (
    <TouchableOpacity style={styles.studentMiniCard} onPress={onPress} activeOpacity={0.86}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{getInitials(student.name)}</Text>
      </View>
      <View style={styles.studentCopy}>
        <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
        <Text style={styles.studentMeta} numberOfLines={1}>Roll {student.rollNumber} - {student.weakConcepts[0] ?? 'Review'}</Text>
      </View>
      <View style={[styles.riskBadge, student.riskLevel === 'High' ? styles.riskHighBadge : student.riskLevel === 'Medium' ? styles.riskMediumBadge : styles.riskLowBadge]}>
        <Text style={[styles.riskBadgeText, student.riskLevel === 'High' ? styles.riskHighText : student.riskLevel === 'Medium' ? styles.riskMediumText : styles.riskLowText]}>{average}%</Text>
      </View>
    </TouchableOpacity>
  );
}

function LearningGroupCard({ group, onStudentPress }: { group: LearningGroup; onStudentPress: (student: StudentProfile) => void }) {
  const visibleStudents = group.students.slice(0, 4);

  return (
    <View style={styles.groupCard}>
      <View style={styles.groupTopRow}>
        <View style={[styles.groupIcon, group.tone === 'danger' && styles.groupIconDanger, group.tone === 'warning' && styles.groupIconWarning, group.tone === 'success' && styles.groupIconSuccess]}>
          <Feather name={group.tone === 'success' ? 'trending-up' : 'target'} size={18} color={group.tone === 'danger' ? '#B9423A' : group.tone === 'warning' ? '#A96716' : '#006A4E'} />
        </View>
        <View style={styles.groupTitleBlock}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <Text style={styles.groupFocus}>{group.focus}</Text>
        </View>
        <Text style={styles.groupCount}>{group.students.length} Students</Text>
      </View>

      <View style={styles.groupStudentList}>
        {visibleStudents.length > 0 ? (
          visibleStudents.map((student) => (
            <StudentMiniCard
              key={student.id}
              student={student}
              onPress={() => onStudentPress(student)}
            />
          ))
        ) : (
          <View style={styles.emptyGroup}>
            <Text style={styles.emptyGroupText}>No learners need this group right now.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function StudentsPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const gradeStudents = useMemo(() => {
    return students.filter((student) => student.grade === selectedGrade);
  }, [selectedGrade]);

  const overview = useMemo(() => {
    const atRisk = gradeStudents.filter((student) => student.riskLevel === 'High').length;
    const needSupport = gradeStudents.filter((student) => student.riskLevel === 'Medium').length;
    const highPerformers = gradeStudents.filter((student) => student.riskLevel === 'Low' && student.readiness >= 86).length;
    const onTrack = gradeStudents.length - atRisk - needSupport - highPerformers;

    return {
      total: gradeStudents.length,
      atRisk,
      needSupport,
      onTrack: Math.max(0, onTrack),
      highPerformers,
    };
  }, [gradeStudents]);

  const learningGroups = useMemo(() => buildLearningGroups(gradeStudents), [gradeStudents]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return sortByNeed(gradeStudents).filter((student) => {
      const searchable = `${student.name} ${student.rollNumber} ${student.weakConcepts.join(' ')} ${student.strengthAreas.join(' ')}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [gradeStudents, searchQuery]);

  const openStudent = (student: StudentProfile) => {
    router.push({ pathname: '/student-detail', params: { studentId: String(student.id) } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
      >
        <View style={styles.stickySearchWrap}>
          <View style={styles.searchHeader}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.smallLabel}>Student Search</Text>
              <Text style={styles.sectionCaption}>Find by name, roll number, topic, or strength</Text>
            </View>
            <View style={styles.headerButton}>
              <Feather name="search" size={18} color="#163C40" />
            </View>
          </View>

          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#607878" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search students"
              placeholderTextColor="#8AA09F"
              returnKeyType="search"
            />
          </View>

          <View style={styles.gradeSelector}>
            {gradeOptions.map((grade) => (
              <TouchableOpacity
                key={grade}
                style={[styles.gradeButton, selectedGrade === grade && styles.gradeButtonActive]}
                onPress={() => setSelectedGrade(grade)}
                activeOpacity={0.86}>
                <Text style={[styles.gradeButtonText, selectedGrade === grade && styles.gradeButtonTextActive]}>G{grade}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResults}>
            {searchResults.length > 0 ? (
              searchResults.map((student) => (
                <StudentMiniCard key={student.id} student={student} onPress={() => openStudent(student)} />
              ))
            ) : (
              <View style={styles.emptyGroup}>
                <Text style={styles.emptyGroupText}>No matching learners found.</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Student Overview</Text>
          <Text style={styles.sectionCaption}>Grade {selectedGrade} intervention snapshot</Text>
        </View>
        <View style={styles.overviewGrid}>
          <OverviewCard label="Total Students" value={overview.total} />
          <OverviewCard label="At Risk" value={overview.atRisk} tone="danger" />
          <OverviewCard label="Need Support" value={overview.needSupport} tone="warning" />
          <OverviewCard label="On Track" value={overview.onTrack} />
          <OverviewCard label="High Performers" value={overview.highPerformers} tone="success" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learning Groups</Text>
          <Text style={styles.sectionCaption}>Open the first red or amber card when time is tight</Text>
        </View>
        {learningGroups.map((group) => (
          <LearningGroupCard key={group.id} group={group} onStudentPress={openStudent} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F6F5' },
  scrollView: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 96 },
  stickySearchWrap: {
    backgroundColor: '#F3F6F5',
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 10,
  },
  searchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerTextBlock: { flex: 1, minWidth: 0 },
  smallLabel: { color: '#126B65', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  headerButton: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  gradeSelector: { flexDirection: 'row', gap: 8, marginTop: 10, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 8 },
  gradeButton: { flex: 1, minHeight: 40, backgroundColor: '#EEF5F4', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  gradeButtonActive: { backgroundColor: '#163C40' },
  gradeButtonText: { color: '#163C40', fontWeight: '900', fontSize: 12 },
  gradeButtonTextActive: { color: '#FFFFFF' },
  sectionHeader: { marginTop: 14, marginBottom: 10 },
  sectionTitle: { color: '#163C40', fontSize: 20, fontWeight: '900' },
  sectionCaption: { color: '#607878', fontSize: 12, fontWeight: '700', marginTop: 4 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  overviewCard: { flexGrow: 1, flexBasis: '30%', minHeight: 82, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#DCE9E7', justifyContent: 'space-between' },
  overviewDanger: { backgroundColor: '#FFF1EF', borderColor: '#F1C4BE' },
  overviewWarning: { backgroundColor: '#FFF6E8', borderColor: '#F1D6A8' },
  overviewSuccess: { backgroundColor: '#EAF7F1', borderColor: '#BFE7D5' },
  overviewValue: { color: '#163C40', fontSize: 25, fontWeight: '900' },
  overviewLabel: { color: '#607878', fontSize: 11, lineHeight: 15, fontWeight: '800' },
  groupCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14, borderWidth: 1, borderColor: '#DCE9E7', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  groupTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  groupIcon: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF5F4' },
  groupIconDanger: { backgroundColor: '#FFF1EF' },
  groupIconWarning: { backgroundColor: '#FFF6E8' },
  groupIconSuccess: { backgroundColor: '#EAF7F1' },
  groupTitleBlock: { flex: 1, minWidth: 0 },
  groupLabel: { color: '#607878', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  groupFocus: { color: '#163C40', fontSize: 16, lineHeight: 21, fontWeight: '900', marginTop: 2 },
  groupCount: { color: '#126B65', fontSize: 12, fontWeight: '900' },
  groupStudentList: { gap: 8, marginTop: 12 },
  studentMiniCard: { minHeight: 60, borderRadius: 8, backgroundColor: '#F8FBFA', borderWidth: 1, borderColor: '#DCE9E7', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: { width: 38, height: 38, borderRadius: 8, backgroundColor: '#163C40', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  studentCopy: { flex: 1, minWidth: 0 },
  studentName: { color: '#163C40', fontSize: 14, fontWeight: '900' },
  studentMeta: { color: '#607878', fontSize: 11, fontWeight: '700', marginTop: 3 },
  riskBadge: { minWidth: 50, minHeight: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  riskHighBadge: { backgroundColor: '#FFE5E1' },
  riskMediumBadge: { backgroundColor: '#FFF1DD' },
  riskLowBadge: { backgroundColor: '#DCFCE7' },
  riskBadgeText: { fontSize: 12, fontWeight: '900' },
  riskHighText: { color: '#B9423A' },
  riskMediumText: { color: '#A96716' },
  riskLowText: { color: '#126B65' },
  emptyGroup: { borderRadius: 8, backgroundColor: '#F8FBFA', borderWidth: 1, borderColor: '#DCE9E7', padding: 14 },
  emptyGroupText: { color: '#607878', fontSize: 12, lineHeight: 18, fontWeight: '700' },
  searchBox: { minHeight: 48, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE9E7', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  searchInput: { flex: 1, minWidth: 0, color: '#163C40', fontSize: 14, fontWeight: '800', paddingVertical: 10 },
  searchResults: { gap: 8, marginTop: 4 },
});
