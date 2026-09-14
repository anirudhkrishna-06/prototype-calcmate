import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    academicPlans,
    academicYearMonths,
    gradeOptions,
    type Grade,
    type GradeStatus,
} from '../../data/plannerStore';

type PlannerTab = 'timetable' | 'academic';

type WeekSlot = {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  grade: string;
  subject: string;
  startTime: string;
  endTime: string;
};

const timetableSlots: WeekSlot[] = [
  { day: 'Monday', grade: 'Grade 1', subject: 'Mathematics', startTime: '08:30', endTime: '09:15' },
  { day: 'Monday', grade: 'Grade 2', subject: 'English', startTime: '09:15', endTime: '10:00' },
  { day: 'Monday', grade: '---', subject: 'BREAK', startTime: '10:00', endTime: '10:15' },
  { day: 'Monday', grade: 'Grade 3', subject: 'EVS', startTime: '10:15', endTime: '11:00' },
  { day: 'Tuesday', grade: 'Grade 4', subject: 'Science', startTime: '08:30', endTime: '09:15' },
  { day: 'Tuesday', grade: 'Grade 1', subject: 'English', startTime: '09:15', endTime: '10:00' },
  { day: 'Tuesday', grade: '---', subject: 'BREAK', startTime: '10:00', endTime: '10:15' },
  { day: 'Tuesday', grade: 'Grade 2', subject: 'Tamil', startTime: '10:15', endTime: '11:00' },
  { day: 'Wednesday', grade: 'Grade 3', subject: 'Mathematics', startTime: '08:30', endTime: '09:15' },
  { day: 'Wednesday', grade: 'Grade 5', subject: 'English', startTime: '09:15', endTime: '10:00' },
  { day: 'Wednesday', grade: '---', subject: 'BREAK', startTime: '10:00', endTime: '10:15' },
  { day: 'Wednesday', grade: 'Grade 4', subject: 'EVS', startTime: '10:15', endTime: '11:00' },
  { day: 'Thursday', grade: 'Grade 2', subject: 'Mathematics', startTime: '08:30', endTime: '09:15' },
  { day: 'Thursday', grade: 'Grade 3', subject: 'English', startTime: '09:15', endTime: '10:00' },
  { day: 'Thursday', grade: '---', subject: 'BREAK', startTime: '10:00', endTime: '10:15' },
  { day: 'Thursday', grade: 'Grade 5', subject: 'Science', startTime: '10:15', endTime: '11:00' },
  { day: 'Friday', grade: 'Grade 1', subject: 'EVS', startTime: '08:30', endTime: '09:15' },
  { day: 'Friday', grade: 'Grade 4', subject: 'Mathematics', startTime: '09:15', endTime: '10:00' },
  { day: 'Friday', grade: '---', subject: 'BREAK', startTime: '10:00', endTime: '10:15' },
  { day: 'Friday', grade: 'Grade 2', subject: 'English', startTime: '10:15', endTime: '11:00' },
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function PlanScreen() {
  const [activeTab, setActiveTab] = useState<PlannerTab>('timetable');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const filteredPlans = useMemo(() => {
    const rows = academicPlans.filter((plan) => plan.grade === selectedGrade);
    return rows.sort((a, b) => academicYearMonths.indexOf(a.month) - academicYearMonths.indexOf(b.month));
  }, [selectedGrade]);

  const selectedDayTimetable = useMemo(() => {
    return timetableSlots.filter((slot) => slot.day === selectedDay);
  }, [selectedDay]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.crumb}>Calcmate</Text>
            <Text style={styles.title}>Academic Plan</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'timetable' && styles.tabButtonActive]}
            onPress={() => setActiveTab('timetable')}
          >
            <Text style={[styles.tabText, activeTab === 'timetable' && styles.tabTextActive]}>Weekly Timetable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'academic' && styles.tabButtonActive]}
            onPress={() => setActiveTab('academic')}
          >
            <Text style={[styles.tabText, activeTab === 'academic' && styles.tabTextActive]}>Academic Planner</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'timetable' ? (
          <View style={styles.timetableView}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Weekly Timetable</Text>
            </View>

            <View style={styles.dayChipRow}>
              {weekdays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
              <View style={styles.timetableTable}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, styles.tableTimeHeader]} numberOfLines={1}>Time</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableGradeHeader]} numberOfLines={1}>Grade</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableSubjectHeader]} numberOfLines={1}>Subject</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableActionHeader]} numberOfLines={1}>Actions</Text>
                </View>

                {selectedDayTimetable.map((slot, index) => (
                  <View key={`${slot.day}-${slot.startTime}-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableTimeCell]} numberOfLines={1} ellipsizeMode="tail">{slot.startTime}-{slot.endTime}</Text>
                    <Text style={[styles.tableCell, styles.tableGradeCell]} numberOfLines={1} ellipsizeMode="tail">{slot.grade}</Text>
                    <Text style={[styles.tableCell, styles.tableSubjectCell]} numberOfLines={1} ellipsizeMode="tail">{slot.subject}</Text>
                    <View style={[styles.tableCell, styles.tableActionCell]}>
                      <View style={styles.rowActionRow}>
                        <TouchableOpacity style={styles.rowIconButton}>
                          <Feather name="edit-2" size={14} color="#163C40" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowIconButton}>
                          <Feather name="trash-2" size={14} color="#A96B6B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.plannerView}>
            <View style={styles.plannerHeader}>
              <Text style={styles.calendarTitle}>Academic Planner</Text>
              <TouchableOpacity style={styles.headerButton}>
                <Feather name="plus" size={18} color="#163C40" />
                <Text style={styles.headerButtonText}>Add Monthly Plan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gradeSelectorRow}>
              {gradeOptions.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[styles.gradePill, selectedGrade === grade && styles.gradePillActive]}
                  onPress={() => setSelectedGrade(grade as Grade)}
                >
                  <Text style={[styles.gradePillText, selectedGrade === grade && styles.gradePillTextActive]}>Grade {grade}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
              <View style={styles.plannerTable}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, styles.tableMonthHeader]} numberOfLines={1}>Month</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableSubjectHeader]} numberOfLines={1}>Subject</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableUnitHeader]} numberOfLines={1}>Unit</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableTopicHeader]} numberOfLines={1}>Planned Topics</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableStatusHeader]} numberOfLines={1}>Status</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableActionHeader]} numberOfLines={1}>Actions</Text>
                </View>

                {filteredPlans.map((plan) => (
                  <View key={plan.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableMonthCell]} numberOfLines={1} ellipsizeMode="tail">{plan.month}</Text>
                    <Text style={[styles.tableCell, styles.tableSubjectCell]} numberOfLines={1} ellipsizeMode="tail">{plan.subject}</Text>
                    <Text style={[styles.tableCell, styles.tableUnitCell]} numberOfLines={1} ellipsizeMode="tail">{plan.unit}</Text>
                    <Text style={[styles.tableCell, styles.tableTopicCell]} numberOfLines={2} ellipsizeMode="tail">{plan.plannedTopics}</Text>
                    <View style={[styles.tableCell, styles.tableStatusCell]}>
                      <View style={[styles.statusPill, statusStyle(plan.status)]}>
                        <Text style={styles.statusText} numberOfLines={1} ellipsizeMode="tail">{plan.status}</Text>
                      </View>
                    </View>
                    <View style={[styles.tableCell, styles.tableActionCell]}>
                      <View style={styles.rowActionRow}>
                        <TouchableOpacity style={styles.rowIconButton}>
                          <Feather name="edit-2" size={14} color="#163C40" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowIconButton}>
                          <Feather name="trash-2" size={14} color="#A96B6B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function statusStyle(status: GradeStatus) {
  if (status === 'Completed') return styles.statusComplete;
  if (status === 'In Progress') return styles.statusProgress;
  return styles.statusPlanned;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef4f4',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 36,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  crumb: {
    color: '#126B65',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#163C40',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerButtonText: {
    color: '#163C40',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 8,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#163C40',
  },
  tabText: {
    color: '#607878',
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  timetableView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarTitle: {
    color: '#163C40',
    fontSize: 22,
    fontWeight: '800',
  },
  dayChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  dayChip: {
    backgroundColor: '#EFF6F5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DCE7E6',
    minWidth: 56,
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: '#163C40',
    borderColor: '#163C40',
  },
  dayChipText: {
    color: '#163C40',
    fontWeight: '800',
    fontSize: 11,
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  tableScrollContent: {
    paddingBottom: 8,
  },
  timetableTable: {
    minWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE7E6',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#163C40',
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    paddingVertical: 12,
    paddingHorizontal: 8,
    textAlign: 'center',
    flexShrink: 0,
  },
  tableTimeHeader: {
    width: 120,
  },
  tableGradeHeader: {
    width: 100,
  },
  tableSubjectHeader: {
    width: 150,
  },
  tableActionHeader: {
    width: 100,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DCE7E6',
    backgroundColor: '#F8FBFA',
    alignItems: 'center',
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#DCE7E6',
    fontSize: 12,
    fontWeight: '700',
    color: '#163C40',
    textAlign: 'center',
    flexShrink: 0,
  },
  tableTimeCell: {
    width: 120,
    color: '#126B65',
    fontWeight: '800',
  },
  tableGradeCell: {
    width: 100,
  },
  tableSubjectCell: {
    width: 150,
  },
  tableActionCell: {
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRightWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowIconButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 7,
    borderWidth: 1,
    borderColor: '#DCE7E6',
  },
  plannerView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  plannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  gradeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    marginBottom: 16,
  },
  gradePill: {
    backgroundColor: '#EFF6F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  gradePillActive: {
    backgroundColor: '#163C40',
  },
  gradePillText: {
    color: '#163C40',
    fontWeight: '700',
    fontSize: 12,
  },
  gradePillTextActive: {
    color: '#FFFFFF',
  },
  plannerTable: {
    minWidth: 680,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE7E6',
    overflow: 'hidden',
  },
  tableMonthHeader: {
    width: 90,
  },
  tableMonthCell: {
    width: 90,
  },
  tableUnitHeader: {
    width: 120,
  },
  tableUnitCell: {
    width: 120,
  },
  tableTopicHeader: {
    width: 220,
  },
  tableTopicCell: {
    width: 220,
  },
  tableStatusHeader: {
    width: 110,
  },
  tableStatusCell: {
    width: 110,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    maxWidth: '100%',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  statusComplete: {
    backgroundColor: '#0D6A52',
  },
  statusProgress: {
    backgroundColor: '#126B65',
  },
  statusPlanned: {
    backgroundColor: '#8B6B41',
  },
});
