import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { timetableSlots } from '@/data/classroomSetup';

type Grade = 1 | 2 | 3 | 4 | 5;
type AttendanceStatus = 'Present' | 'Absent';

type Student = {
  name: string;
  status: AttendanceStatus;
};

type AttendanceMap = Record<Grade, Student[]>;

type TimetableLesson = {
  title: string;
  grade: string;
  subject: string;
  topic: string;
  time: string;
  duration: string;
  kind: 'current' | 'next' | 'remaining';
};

const attendanceMap: AttendanceMap = {
  1: [
    { name: 'Aadhira Selvam', status: 'Present' },
    { name: 'Kavin Murugan', status: 'Present' },
    { name: 'Malarvizhi Ravi', status: 'Absent' },
    { name: 'Nithya Arumugam', status: 'Present' },
  ],
  2: [
    { name: 'Arul Kumar', status: 'Present' },
    { name: 'Sanjana Raman', status: 'Present' },
    { name: 'Pavithra Mani', status: 'Absent' },
    { name: 'Vignesh Shanmugam', status: 'Present' },
  ],
  3: [
    { name: 'Deepa Gopal', status: 'Present' },
    { name: 'Hari Prasad', status: 'Present' },
    { name: 'Sneha Raj', status: 'Absent' },
    { name: 'Tharun Balaji', status: 'Present' },
  ],
  4: [
    { name: 'Meena Anand', status: 'Present' },
    { name: 'Sathish Sekar', status: 'Present' },
    { name: 'Ramya Velu', status: 'Present' },
    { name: 'Logesh Pandian', status: 'Absent' },
  ],
  5: [
    { name: 'Kanishka Devi', status: 'Present' },
    { name: 'Bharathi Nagaraj', status: 'Absent' },
    { name: 'Sowmiya Senthil', status: 'Present' },
    { name: 'Rohit Subramanian', status: 'Present' },
  ],
};

const schoolInfo = {
  schoolName: 'Government Primary School, Chennai South',
  district: 'Chennai, Tamil Nadu',
  academicYear: '2026-27',
};

const timetable: TimetableLesson[] = timetableSlots
  .filter((slot) => slot.day === 'Monday' && slot.kind === 'lesson')
  .map((slot, index) => ({
    title: `${slot.subject} Block`,
    grade: slot.grade,
    subject: slot.subject,
    topic: slot.topic,
    time: `${slot.startTime} - ${slot.endTime}`,
    duration: `${slot.durationMinutes} min`,
    kind: index === 0 ? 'current' : index === 1 ? 'next' : 'remaining',
  }));

const orchestrator = [
  {
    grade: 'Grade 1',
    activityName: 'Number Fluency Sprint',
    duration: '45 min',
    status: 'In Progress',
  },
  {
    grade: 'Grade 2',
    activityName: 'Fraction Pair Work',
    duration: '40 min',
    status: 'Ready',
  },
  {
    grade: 'Grade 3',
    activityName: 'Reading Comprehension',
    duration: '50 min',
    status: 'Scheduled',
  },
  {
    grade: 'Grade 4',
    activityName: 'Science Observation',
    duration: '50 min',
    status: 'Ready',
  },
  {
    grade: 'Grade 5',
    activityName: 'Data Analysis Task',
    duration: '55 min',
    status: 'Scheduled',
  },
];

const assessments = [
  {
    grade: 'Grade 1',
    subject: 'Mathematics',
    topic: 'Counting and Number Sense',
    time: '08:30 AM',
    duration: '20 min',
  },
  {
    grade: 'Grade 2',
    subject: 'English',
    topic: 'Reading Fluency Check',
    time: '10:00 AM',
    duration: '25 min',
  },
  {
    grade: 'Grade 3',
    subject: 'Science',
    topic: 'Life Cycles Review',
    time: '11:45 AM',
    duration: '30 min',
  },
  {
    grade: 'Grade 4',
    subject: 'Mathematics',
    topic: 'Fractions Assessment',
    time: '01:15 PM',
    duration: '30 min',
  },
  {
    grade: 'Grade 5',
    subject: 'English',
    topic: 'Writing Structure Check',
    time: '02:00 PM',
    duration: '35 min',
  },
];

const teachingSnapshot = [
  { label: 'Classes today', value: String(timetable.length), icon: 'calendar' },
  { label: 'Upcoming assessments', value: String(assessments.length), icon: 'clipboard' },
  { label: 'Pending lesson plans', value: '2', icon: 'book-open' },
  { label: 'AI recommendations', value: '4', icon: 'cpu' },
] as const;

const teacherBriefing = [
  { label: 'Upcoming class', value: 'Grade 2 Mathematics', detail: '09:15 - Equivalent Fractions', icon: 'clock', tone: 'primary' },
  { label: 'Next assessment', value: 'Grade 2 English', detail: '10:00 - Reading Fluency Check', icon: 'clipboard', tone: 'warning' },
  { label: 'Immediate intervention', value: '5 students', detail: 'Start with high-risk reading support', icon: 'alert-triangle', tone: 'danger' },
  { label: 'AI recommendation', value: 'Pair practice', detail: 'Use 10-minute mixed-grade fraction cards', icon: 'cpu', tone: 'success' },
] as const;

const multiGradeStatus = [
  { grade: 'G1', topic: 'Place Value', completion: 72, support: 1 },
  { grade: 'G2', topic: 'Equivalent Fractions', completion: 58, support: 2 },
  { grade: 'G3', topic: 'Reading Strategies', completion: 81, support: 1 },
  { grade: 'G4', topic: 'Living Systems', completion: 64, support: 2 },
  { grade: 'G5', topic: 'Data Interpretation', completion: 69, support: 1 },
] as const;

export default function CalcmateMainScreen() {
  const router = useRouter();
  const [attendanceVisible, setAttendanceVisible] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [localAttendance, setLocalAttendance] = useState<AttendanceMap>(attendanceMap);
  const [attendanceEntered, setAttendanceEntered] = useState(false);

  const currentClass = timetable.find((lesson) => lesson.kind === 'current') ?? timetable[0];
  const nextClass = timetable.find((lesson) => lesson.kind === 'next') ?? timetable[1] ?? timetable[0];
  const remainingClasses = timetable.filter((lesson) => lesson.kind === 'remaining');
  const isSmallDevice = false;

  const totalStudents = useMemo(() => {
    return Object.values(localAttendance).reduce((sum, gradeList) => sum + gradeList.length, 0);
  }, [localAttendance]);

  const attendanceOverview = useMemo(() => {
    if (!attendanceEntered) {
      return { present: 0, absent: 0, pending: totalStudents };
    }

    const allStudents = Object.values(localAttendance).flat();
    const present = allStudents.filter((student) => student.status === 'Present').length;
    const absent = allStudents.filter((student) => student.status === 'Absent').length;
    return {
      present,
      absent,
      pending: Math.max(totalStudents - present - absent, 0),
    };
  }, [attendanceEntered, localAttendance, totalStudents]);

  const changeStudentStatus = (studentName: string, status: AttendanceStatus) => {
    setLocalAttendance((currentData) => {
      const updated = { ...currentData };
      updated[selectedGrade] = updated[selectedGrade].map((student) =>
        student.name === studentName ? { ...student, status } : student,
      );
      return updated;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dashboardShell}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerTextWrap}>
                <Text style={styles.greeting}>Greetings Teacher!</Text>
                <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                <Text style={styles.schoolText}>{schoolInfo.schoolName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={20} color="#234A5C" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.markAttendanceButton} onPress={() => setAttendanceVisible(true)}>
            <Feather name="user-check" size={16} color="#163C40" />
            <Text style={styles.markAttendanceText}>Mark Attendance</Text>
          </TouchableOpacity>

          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderCompact}>
              <Text style={styles.sectionTitle}>Attendance Overview</Text>
              <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>Today</Text></View>
            </View>
            <View style={styles.attendanceOverviewGrid}>
              <View style={styles.attendanceMetricBox}>
                <Text style={styles.attendanceMetricValue}>{attendanceOverview.present}</Text>
                <Text style={styles.attendanceMetricLabel}>Present</Text>
              </View>
              <View style={styles.attendanceMetricBox}>
                <Text style={styles.attendanceMetricValue}>{attendanceOverview.absent}</Text>
                <Text style={styles.attendanceMetricLabel}>Absent</Text>
              </View>
              <View style={[styles.attendanceMetricBox, styles.attendanceMetricBoxLast]}>
                <Text style={styles.attendanceMetricValue}>{attendanceOverview.pending}</Text>
                <Text style={styles.attendanceMetricLabel}>Pending</Text>
              </View>
            </View>
          </View>

          <View style={styles.snapshotCard}>
            <View style={styles.sectionHeaderCompact}>
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.sectionTitle}>{"Today's Teaching Snapshot"}</Text>
                <Text style={styles.sectionCaption}>What needs attention after attendance</Text>
              </View>
              <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>Now</Text></View>
            </View>
            <View style={styles.snapshotGrid}>
              {teachingSnapshot.map((item) => (
                <View key={item.label} style={styles.snapshotItem}>
                  <View style={styles.snapshotIcon}>
                    <Feather name={item.icon} size={15} color="#2563EB" />
                  </View>
                  <Text style={styles.snapshotValue}>{item.value}</Text>
                  <Text style={styles.snapshotLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>Teacher Briefing</Text>
              <Text style={styles.sectionCaption}>What needs attention before the next period</Text>
            </View>
          </View>

          <View style={styles.briefingCard}>
            {teacherBriefing.map((item) => (
              <View key={item.label} style={styles.briefingRow}>
                <View
                  style={[
                    styles.briefingIcon,
                    item.tone === 'warning' && styles.briefingIconWarning,
                    item.tone === 'danger' && styles.briefingIconDanger,
                    item.tone === 'success' && styles.briefingIconSuccess,
                  ]}
                >
                  <Feather
                    name={item.icon}
                    size={17}
                    color={
                      item.tone === 'warning'
                        ? '#A96716'
                        : item.tone === 'danger'
                          ? '#B9423A'
                          : item.tone === 'success'
                            ? '#0F766E'
                            : '#2563EB'
                    }
                  />
                </View>
                <View style={styles.briefingCopy}>
                  <Text style={styles.briefingLabel}>{item.label}</Text>
                  <Text style={styles.briefingValue} numberOfLines={1}>{item.value}</Text>
                  <Text style={styles.briefingDetail} numberOfLines={2}>{item.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.statusBoardCard}>
            <View style={styles.sectionHeaderCompact}>
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.sectionTitle}>Multi-Grade Status Board</Text>
                <Text style={styles.sectionCaption}>Tap a grade to view details</Text>
              </View>
              <Text style={styles.todayChip}>Grades 1-5</Text>
            </View>

            <View style={styles.classStrip}>
              <View style={styles.classStripBlock}>
                <Text style={styles.classStripLabel}>Current</Text>
                <Text style={styles.classStripValue}>{currentClass.grade}</Text>
                <Text style={styles.classStripTopic}>{currentClass.topic}</Text>
              </View>
              <View style={styles.classStripDivider} />
              <View style={styles.classStripBlock}>
                <Text style={styles.classStripLabel}>Next</Text>
                <Text style={styles.classStripValue}>{nextClass.grade}</Text>
                <Text style={styles.classStripTopic}>{nextClass.topic}</Text>
              </View>
            </View>

            <View style={styles.statusList}>
              {multiGradeStatus.map((item) => (
                <TouchableOpacity
                  key={item.grade}
                  style={styles.statusRow}
                  activeOpacity={0.82}
                  onPress={() => router.push('/analytics-topic-detail')}
                >
                  <View style={styles.gradeCircle}>
                    <Text style={styles.gradeCircleText}>{item.grade}</Text>
                  </View>
                  <View style={styles.statusMain}>
                    <Text style={styles.statusTopic}>{item.topic}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${item.completion}%` }]} />
                    </View>
                  </View>
                  <View style={styles.statusMeta}>
                    <Text style={styles.completionText}>{item.completion}%</Text>
                    <Text style={styles.supportText}>{item.support} support</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {false && (
            <>
          <View style={styles.remainingCard}>
            <View style={styles.remainingCardTitleRow}>
              <Text style={styles.remainingCardTitle}>Remaining Classes</Text>
              <Text style={styles.remainingCount}>{remainingClasses.length}</Text>
            </View>
            <View style={styles.remainingClassList}>
              {remainingClasses.slice(0, 3).map((lesson, index) => (
                <View key={`${lesson.grade}-${index}`} style={styles.remainingClassCard}>
                  <View style={styles.remainingClassCardTop}>
                    <View style={styles.remainingLeft}>
                      <View style={styles.remainingDot} />
                      <Text style={styles.remainingGrade}>{lesson.grade}</Text>
                    </View>
                    <Text style={styles.remainingTime}>{lesson.time}</Text>
                  </View>
                  <View style={styles.remainingClassMetaRow}>
                    <Text style={styles.remainingSubject}>{lesson.subject}</Text>
                    <Text style={styles.separatorDot}>•</Text>
                    <Text style={styles.remainingTopic}>{lesson.topic}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>AI Classroom Orchestrator</Text>
            <Text style={styles.focusChip}>Grades 1-5</Text>
          </View>

          <View style={[styles.orchestratorGrid, isSmallDevice && styles.orchestratorGridSingleColumn]}>
            {orchestrator.map((activity) => (
              <View key={activity.grade} style={[styles.orchestratorCard, isSmallDevice && styles.orchestratorCardSingleColumn]}>
                <View style={styles.orchestratorCardTop}>
                  <Text style={styles.gradeBadge}>{activity.grade}</Text>
                  <Text style={styles.statusPill}>{activity.status}</Text>
                </View>
                <Text style={styles.activityName}>{activity.activityName}</Text>
                <View style={styles.orchestratorMetaRow}>
                  <View style={styles.metaChip}>
                    <Feather name="clock" size={13} color="#126B65" />
                    <Text style={styles.metaLabel}> {activity.duration}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Feather name="cpu" size={13} color="#126B65" />
                    <Text style={styles.metaLabel}> Active</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>{"Today's Assessments"}</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>

          <View style={styles.assessmentListCard}>
            {assessments.map((item, index) => (
              <View key={`${item.grade}-${item.topic}-${index}`} style={styles.assessmentRow}>
                <View style={styles.assessmentGradeWrap}>
                  <Text style={styles.assessmentGrade}>{item.grade}</Text>
                </View>

                <View style={styles.assessmentDetail}>
                  <Text style={styles.assessmentSubject}>{item.subject}</Text>
                  <Text style={styles.assessmentTopic}>{item.topic}</Text>
                </View>

                <View style={styles.assessmentTime}>
                  <Text style={styles.assessmentTimeText}>{item.time}</Text>
                  <Text style={styles.assessmentDuration}>{item.duration}</Text>
                </View>
              </View>
            ))}
          </View>
            </>
          )}
        </View>
      </ScrollView>

      <Modal transparent visible={attendanceVisible} animationType="slide" onRequestClose={() => setAttendanceVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setAttendanceVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetTop}>
              <View>
                <Text style={styles.sheetTitle}>Grade Attendance</Text>
                <Text style={styles.sheetSubtitle}>Grades 1-5</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setAttendanceVisible(false)}>
                <Feather name="x" size={20} color="#243B38" />
              </TouchableOpacity>
            </View>

            <View style={styles.gradeSelectorRow}>
              {[1, 2, 3, 4, 5].map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[styles.gradeSelector, selectedGrade === grade && styles.gradeSelectorActive]}
                  onPress={() => setSelectedGrade(grade as Grade)}
                >
                  <Text style={[styles.gradeSelectorText, selectedGrade === grade && styles.gradeSelectorTextActive]}>
                    Grade {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.studentList}>
              {localAttendance[selectedGrade].map((student) => (
                <View key={student.name} style={styles.studentRow}>
                  <View style={styles.studentLeft}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentGradeText}>Grade {selectedGrade}</Text>
                  </View>
                  <View style={styles.studentToggleRow}>
                    <TouchableOpacity
                      style={[styles.toggleButton, student.status === 'Present' && styles.toggleButtonSelected]}
                      onPress={() => changeStudentStatus(student.name, 'Present')}
                    >
                      <Text style={[styles.toggleText, student.status === 'Present' && styles.toggleTextSelected]}>Present</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.toggleButton, student.status === 'Absent' && styles.toggleButtonSelected]}
                      onPress={() => changeStudentStatus(student.name, 'Absent')}
                    >
                      <Text style={[styles.toggleText, student.status === 'Absent' && styles.toggleTextSelected]}>Absent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setAttendanceEntered(true);
                setAttendanceVisible(false);
              }}
            >
              <Text style={styles.saveButtonText}>Save Attendance</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
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
    paddingVertical: 10,
    paddingBottom: 18,
  },
  dashboardShell: {
    paddingHorizontal: 14,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#163C40',
    letterSpacing: -0.6,
    flexShrink: 1,
  },
  dateText: {
    color: '#5E716E',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
  schoolText: {
    color: '#607878',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  markAttendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C7E6DD',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 9,
    elevation: 2,
    marginBottom: 10,
  },
  markAttendanceText: {
    color: '#163C40',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#163C40',
  },
  todayChip: {
    color: '#126B65',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#DBF5EE',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  sectionTitleWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  sectionCaption: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
    flexWrap: 'wrap',
  },
  snapshotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  snapshotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  snapshotItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 130,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  snapshotIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  snapshotValue: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
  },
  snapshotLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  sectionHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    minWidth: 0,
  },
  liveBadge: {
    borderRadius: 14,
    backgroundColor: '#EAFBF8',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveBadgeText: {
    color: '#126B65',
    fontWeight: '800',
    fontSize: 11,
  },
  attendanceOverviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceMetricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FBF8',
    marginRight: 8,
  },
  attendanceMetricBoxLast: {
    marginRight: 0,
  },
  attendanceMetricValue: {
    color: '#163C40',
    fontSize: 28,
    fontWeight: '900',
  },
  attendanceMetricLabel: {
    color: '#607878',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  briefingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  briefingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 66,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 0,
  },
  briefingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  briefingIconWarning: { backgroundColor: '#FFF1DD' },
  briefingIconDanger: { backgroundColor: '#FFE5E1' },
  briefingIconSuccess: { backgroundColor: '#DCFCE7' },
  briefingCopy: {
    flex: 1,
    minWidth: 0,
  },
  briefingLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  briefingValue: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 3,
  },
  briefingDetail: {
    color: '#475569',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  statusBoardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  classStrip: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 8,
    minWidth: 0,
  },
  classStripBlock: {
    flex: 1,
    minWidth: 0,
  },
  classStripDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  classStripLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  classStripValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  classStripTopic: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  statusList: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    minWidth: 0,
  },
  gradeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  gradeCircleText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '900',
  },
  statusMain: {
    flex: 1,
    minWidth: 0,
  },
  statusTopic: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
    flexWrap: 'wrap',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 7,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  statusMeta: {
    alignItems: 'flex-end',
    marginLeft: 8,
    marginRight: 6,
    minWidth: 58,
    flexShrink: 0,
  },
  completionText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },
  supportText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
    textAlign: 'right',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 0,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAFBF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  activityCopy: {
    flex: 1,
    minWidth: 0,
  },
  activityLabel: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
    flexWrap: 'wrap',
  },
  activityValue: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
    flexWrap: 'wrap',
  },
  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F8FBF8',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECF4F1',
  },
  summaryValue: {
    color: '#163C40',
    fontSize: 25,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#607878',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
    textAlign: 'center',
  },
  timetableGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'nowrap',
    alignItems: 'stretch',
  },
  timelineCardCurrent: {
    backgroundColor: '#F8FFF9',
    borderLeftWidth: 4,
    borderLeftColor: '#1B8B78',
    borderRadius: 16,
    padding: 14,
    minWidth: 150,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    minWidth: 150,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    color: '#5E716E',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  gradeName: {
    fontSize: 22,
    color: '#163C40',
    fontWeight: '800',
    marginTop: 10,
  },
  subjectName: {
    fontSize: 14,
    color: '#34504A',
    fontWeight: '700',
    marginTop: 8,
  },
  topicName: {
    fontSize: 12,
    color: '#607878',
    fontWeight: '500',
    marginTop: 3,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#126B65',
  },
  remainingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  remainingCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remainingCardTitle: {
    color: '#163C40',
    fontSize: 14,
    fontWeight: '800',
  },
  remainingCount: {
    color: '#126B65',
    fontWeight: '800',
    fontSize: 11,
    backgroundColor: '#DBF5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remainingClassList: {
    marginTop: 10,
  },
  remainingClassCard: {
    backgroundColor: '#F8FBF8',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DCEAE7',
    marginBottom: 8,
    minWidth: 0,
    maxWidth: '100%',
  },
  remainingClassCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 0,
    maxWidth: '100%',
  },
  remainingClassMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    minWidth: 0,
    maxWidth: '100%',
    marginTop: 6,
  },
  remainingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  remainingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#9AAEAF',
    marginRight: 8,
  },
  remainingGrade: {
    color: '#163C40',
    fontSize: 11,
    fontWeight: '800',
    flexShrink: 1,
  },
  separatorDot: {
    color: '#94A6A4',
    fontSize: 11,
    marginHorizontal: 6,
  },
  remainingSubject: {
    color: '#607878',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: '50%',
  },
  remainingTopic: {
    color: '#607878',
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
    maxWidth: '50%',
  },
  remainingTime: {
    color: '#126B65',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 8,
    flexShrink: 0,
  },
  orchestratorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  orchestratorGridSingleColumn: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
  },
  orchestratorCard: {
    backgroundColor: '#F8FBF8',
    borderRadius: 16,
    padding: 12,
    minHeight: 116,
    flexBasis: '48%',
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: '#ECF4F1',
  },
  orchestratorCardSingleColumn: {
    width: '100%',
    maxWidth: '100%',
    flexBasis: '100%',
    marginBottom: 8,
  },
  orchestratorCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeBadge: {
    backgroundColor: '#163C40',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
    minWidth: 70,
    textAlign: 'center',
  },
  statusPill: {
    backgroundColor: '#EAF8F4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#126B65',
    fontWeight: '700',
    fontSize: 10,
  },
  activityName: {
    fontSize: 14,
    color: '#163C40',
    fontWeight: '700',
    marginTop: 12,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  orchestratorMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '100%',
  },
  metaLabel: {
    fontSize: 11,
    color: '#668076',
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: '100%',
  },
  focusChip: {
    color: '#126B65',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#DBF5EE',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  viewAll: {
    color: '#126B65',
    fontWeight: '800',
    fontSize: 11,
  },
  assessmentListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomColor: '#EEF1EE',
    borderBottomWidth: 1,
  },
  assessmentGradeWrap: {
    width: 76,
    backgroundColor: '#EAFBF8',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assessmentGrade: {
    color: '#126B65',
    fontWeight: '800',
    fontSize: 11,
    textAlign: 'center',
  },
  assessmentDetail: {
    flex: 1,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assessmentSubject: {
    color: '#163C40',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  assessmentTopic: {
    color: '#607878',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  assessmentTime: {
    alignItems: 'flex-end',
    minWidth: 74,
    justifyContent: 'center',
  },
  assessmentTimeText: {
    color: '#163C40',
    fontWeight: '800',
    fontSize: 11,
    textAlign: 'right',
  },
  assessmentDuration: {
    color: '#607878',
    fontWeight: '600',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 40, 45, 0.24)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    minHeight: 420,
  },
  sheetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#163C40',
  },
  sheetSubtitle: {
    color: '#607878',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAFBF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  gradeSelector: {
    flex: 1,
    backgroundColor: '#EEF5F4',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  gradeSelectorActive: {
    backgroundColor: '#163C40',
  },
  gradeSelectorText: {
    color: '#163C40',
    fontWeight: '700',
    fontSize: 11,
  },
  gradeSelectorTextActive: {
    color: '#FFFFFF',
  },
  studentList: {
    marginTop: 16,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#DCE7E6',
    borderBottomWidth: 1,
  },
  studentLeft: {
    flex: 1,
  },
  studentName: {
    color: '#163C40',
    fontWeight: '700',
    fontSize: 14,
  },
  studentGradeText: {
    color: '#607878',
    fontSize: 11,
    marginTop: 3,
  },
  studentToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EEF5F4',
  },
  toggleButtonSelected: {
    backgroundColor: '#163C40',
  },
  toggleText: {
    color: '#163C40',
    fontWeight: '700',
    fontSize: 11,
  },
  toggleTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#163C40',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
