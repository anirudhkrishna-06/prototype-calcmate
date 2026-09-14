import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getInitials, gradeOptions, students, type Grade } from '../../data/tamilStudentData';

export default function StudentsPage() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);

  const gradeStudents = useMemo(() => {
    return students.filter((student) => student.grade === selectedGrade);
  }, [selectedGrade]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.smallLabel}>Learner Intelligence</Text>
            <Text style={styles.title}>Students</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name='search' size={18} color='#163C40' />
          </TouchableOpacity>
        </View>

        <View style={styles.gradeSelector}>
          {gradeOptions.map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[styles.gradeButton, selectedGrade === grade && styles.gradeButtonActive]}
              onPress={() => setSelectedGrade(grade)}
            >
              <Text style={[styles.gradeButtonText, selectedGrade === grade && styles.gradeButtonTextActive]}>Grade {grade}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.studentGridPanel}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Student List</Text>
            <Text style={styles.cardCount}>{gradeStudents.length} learners</Text>
          </View>

          <View style={styles.studentGrid}>
            {gradeStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.studentCard}
                onPress={() => router.push({ pathname: '/student-detail', params: { studentId: String(student.id) } })}
              >
                <View style={styles.studentCardTop}>
                  <View style={styles.avatarCircle}><Text style={styles.avatarText}>{getInitials(student.name)}</Text></View>
                  <View style={styles.cardScore}><Text style={styles.cardScoreText}>{student.attendance}%</Text><Text style={styles.cardScoreLabel}>Attendance</Text></View>
                </View>
                <Text style={styles.studentName}>{student.name}</Text>
                <View style={styles.cardSubRow}>
                  <Text style={styles.cardSubLabel}>Attendance</Text>
                  <Text style={styles.cardSubValue}>{student.attendance}%</Text>
                </View>
                <View style={styles.cardSubRow}>
                  <Text style={styles.cardSubLabel}>Readiness</Text>
                  <Text style={styles.cardSubValue}>{student.readiness}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  smallLabel: { color: '#126B65', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  title: { color: '#163C40', fontSize: 30, fontWeight: '800', marginTop: 6 },
  headerButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  gradeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 10 },
  gradeButton: { backgroundColor: '#EEF5F4', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  gradeButtonActive: { backgroundColor: '#163C40' },
  gradeButtonText: { color: '#163C40', fontWeight: '700', fontSize: 12 },
  gradeButtonTextActive: { color: '#FFFFFF' },
  studentGridPanel: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: '#163C40', fontSize: 18, fontWeight: '800' },
  cardCount: { color: '#607878', fontSize: 11, fontWeight: '700' },
  studentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
  studentCard: { width: '48%', backgroundColor: '#F8FBFA', borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#DCE9E7' },
  studentCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#163C40', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  cardScore: { alignItems: 'flex-end' },
  cardScoreText: { color: '#126B65', fontSize: 16, fontWeight: '900' },
  cardScoreLabel: { color: '#607878', fontSize: 10, fontWeight: '700', marginTop: 2 },
  studentName: { color: '#163C40', fontSize: 14, fontWeight: '800', marginTop: 12 },
  cardSubRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cardSubLabel: { color: '#607878', fontSize: 11, fontWeight: '700' },
  cardSubValue: { color: '#163C40', fontSize: 12, fontWeight: '800' },
});
