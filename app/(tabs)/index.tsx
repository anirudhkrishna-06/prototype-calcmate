import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { timetableSlots } from '@/data/classroomSetup';

type Grade = 1 | 2 | 3 | 4 | 5;
type AttendanceStatus = 'Present' | 'Absent';
type Tone = 'primary' | 'warning' | 'danger' | 'success';

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

const designTokens = {
  color: {
    primary: '#0F4C45',
    primaryDeep: '#0A3732',
    sage: '#A8C9B8',
    background: '#F7F8F6',
    surface: '#FFFFFF',
    surfaceSoft: '#EEF3EF',
    gold: '#D9A441',
    danger: '#E65A5A',
    text: '#142A2E',
    textSecondary: '#667085',
    muted: '#8A9895',
    success: '#2F9C7C',
    line: '#E4ECE7',
  },
  space: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    md: 16,
    lg: 24,
    xl: 32,
    pill: 999,
  },
  type: {
    hero: 38,
    section: 24,
    card: 18,
    body: 14,
    caption: 12,
  },
} as const;

const C = designTokens.color;

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
  { grade: 'Grade 1', activityName: 'Number Fluency Sprint', duration: '45 min', status: 'In Progress' },
  { grade: 'Grade 2', activityName: 'Fraction Pair Work', duration: '40 min', status: 'Ready' },
  { grade: 'Grade 3', activityName: 'Reading Comprehension', duration: '50 min', status: 'Scheduled' },
  { grade: 'Grade 4', activityName: 'Science Observation', duration: '50 min', status: 'Ready' },
  { grade: 'Grade 5', activityName: 'Data Analysis Task', duration: '55 min', status: 'Scheduled' },
];

const assessments = [
  { grade: 'Grade 1', subject: 'Mathematics', topic: 'Counting and Number Sense', time: '08:30 AM', duration: '20 min' },
  { grade: 'Grade 2', subject: 'English', topic: 'Reading Fluency Check', time: '10:00 AM', duration: '25 min' },
  { grade: 'Grade 3', subject: 'Science', topic: 'Life Cycles Review', time: '11:45 AM', duration: '30 min' },
  { grade: 'Grade 4', subject: 'Mathematics', topic: 'Fractions Assessment', time: '01:15 PM', duration: '30 min' },
  { grade: 'Grade 5', subject: 'English', topic: 'Writing Structure Check', time: '02:00 PM', duration: '35 min' },
];

const teachingSnapshot = [
  { label: 'Classes today', value: String(timetable.length), icon: 'calendar', tone: 'primary' },
  { label: 'Upcoming assessments', value: String(assessments.length), icon: 'clipboard', tone: 'warning' },
  { label: 'Pending lesson plans', value: '2', icon: 'book-open', tone: 'danger' },
  { label: 'AI recommendations', value: '4', icon: 'cpu', tone: 'success' },
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

function toneColor(tone: Tone) {
  if (tone === 'warning') return C.gold;
  if (tone === 'danger') return C.danger;
  if (tone === 'success') return C.success;
  return C.primary;
}

function AnimatedProgress({ value, color }: { value: number; color: string }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value,
      duration: 720,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { backgroundColor: color, width }]} />
    </View>
  );
}

export default function CalcmateMainScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [attendanceVisible, setAttendanceVisible] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [localAttendance, setLocalAttendance] = useState<AttendanceMap>(attendanceMap);
  const [attendanceEntered, setAttendanceEntered] = useState(false);

  const currentClass = timetable.find((lesson) => lesson.kind === 'current') ?? timetable[0];
  const nextClass = timetable.find((lesson) => lesson.kind === 'next') ?? timetable[1] ?? timetable[0];
  const remainingClasses = timetable.filter((lesson) => lesson.kind === 'remaining');
  const isSmallDevice = width < 380;

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

  const attendanceCards = [
    { label: 'Present', value: attendanceOverview.present, trend: '', icon: 'check-circle', tone: 'success' },
    { label: 'Absent', value: attendanceOverview.absent, trend: '', icon: 'user-x', tone: 'danger' },
    { label: 'Pending', value: attendanceOverview.pending, trend: '', icon: 'clock', tone: 'warning' },
  ] as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dashboardShell}>
          <View style={[styles.headerCard, isSmallDevice && styles.headerCardSmall]}>
            <View style={styles.headerShapeLarge} />
            <View style={styles.headerShapeSmall} />
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.72}>
              <Feather name="bell" size={20} color={C.primary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <View style={[styles.headerContent, isSmallDevice && styles.headerContentSmall]}>
              <View style={styles.headerTextWrap}>
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={[styles.greeting, isSmallDevice && styles.greetingSmall]} numberOfLines={2}>
                  Greetings Teacher!
                </Text>
                <View style={styles.schoolChip}>
                  <Feather name="map-pin" size={13} color={C.primary} />
                  <Text style={styles.schoolText} numberOfLines={1}>{schoolInfo.schoolName}</Text>
                </View>
              </View>

              <View style={styles.teacherAvatar}>
                <View style={styles.avatarFace} />
                <View style={styles.avatarHair} />
                <View style={styles.avatarBody} />
                <View style={styles.avatarBook}>
                  <Feather name="book-open" size={18} color={C.primary} />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.markAttendanceButton}
            activeOpacity={0.82}
            onPress={() => setAttendanceVisible(true)}
          >
            <View style={styles.markAttendanceIcon}>
              <Feather name="user-check" size={20} color={C.primary} />
            </View>
            <View style={styles.markAttendanceCopy}>
              <Text style={styles.markAttendanceText}>Mark Attendance</Text>
              <Text style={styles.markAttendanceSubtext}>Grades 1-5 roster is ready</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderCompact}>
              <Text style={styles.sectionTitle}>Attendance Overview</Text>
              <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>Today</Text></View>
            </View>
            <View style={styles.attendanceOverviewGrid}>
              {attendanceCards.map((item) => (
                <View key={item.label} style={[styles.attendanceMetricBox, item.label === 'Pending' && styles.pendingMetricBox]}>
                  <View style={[styles.metricIcon, { backgroundColor: `${toneColor(item.tone)}18` }]}>
                    <Feather name={item.icon} size={15} color={toneColor(item.tone)} />
                  </View>
                  <Text style={styles.attendanceMetricValue}>{item.value}</Text>
                  <Text style={styles.attendanceMetricLabel}>{item.label}</Text>
                  <Text style={[styles.attendanceTrend, { color: toneColor(item.tone) }]}>{item.trend}</Text>
                </View>
              ))}
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
              {teachingSnapshot.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.snapshotItem,
                    index === 0 && styles.snapshotItemHero,
                    index === 3 && styles.snapshotItemAi,
                  ]}
                  activeOpacity={0.82}
                >
                  <View style={[styles.snapshotIcon, { backgroundColor: `${toneColor(item.tone)}18` }]}>
                    <Feather name={item.icon} size={16} color={toneColor(item.tone)} />
                  </View>
                  <Text style={styles.snapshotValue}>{item.value}</Text>
                  <Text style={styles.snapshotLabel}>{item.label}</Text>
                </TouchableOpacity>
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
            {teacherBriefing.map((item, index) => (
              <TouchableOpacity key={item.label} style={styles.briefingRow} activeOpacity={0.84}>
                <View style={styles.timelineColumn}>
                  <View style={[styles.timelineDot, { backgroundColor: toneColor(item.tone) }]} />
                  {index < teacherBriefing.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.briefingCopy}>
                  <View style={styles.briefingTopLine}>
                    <Text style={styles.briefingLabel}>{item.label}</Text>
                    <View style={[styles.priorityPill, { backgroundColor: `${toneColor(item.tone)}18` }]}>
                      <Feather name={item.icon} size={12} color={toneColor(item.tone)} />
                    </View>
                  </View>
                  <Text style={styles.briefingValue} numberOfLines={1}>{item.value}</Text>
                  <Text style={styles.briefingDetail} numberOfLines={2}>{item.detail}</Text>
                </View>
                <Feather name="chevron-right" size={17} color={C.muted} />
              </TouchableOpacity>
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
                <Text style={styles.classStripLabel}>Current Grade</Text>
                <Text style={styles.classStripValue}>{currentClass.grade}</Text>
                <Text style={styles.classStripTopic} numberOfLines={2}>{currentClass.topic}</Text>
              </View>
              <View style={styles.classStripDivider} />
              <View style={styles.classStripBlock}>
                <Text style={styles.classStripLabel}>Next Grade</Text>
                <Text style={styles.classStripValue}>{nextClass.grade}</Text>
                <Text style={styles.classStripTopic} numberOfLines={2}>{nextClass.topic}</Text>
              </View>
            </View>

            <View style={styles.statusList}>
              {multiGradeStatus.map((item, index) => {
                const color = item.support > 1 ? C.gold : index % 2 === 0 ? C.primary : C.success;
                return (
                  <TouchableOpacity
                    key={item.grade}
                    style={styles.statusRow}
                    activeOpacity={0.84}
                    onPress={() => router.push('/analytics-topic-detail')}
                  >
                    <View style={styles.gradeRing}>
                      <View style={[styles.gradeRingFill, { borderColor: color }]}>
                        <Text style={styles.gradeCircleText}>{item.grade}</Text>
                      </View>
                    </View>
                    <View style={styles.statusMain}>
                      <View style={styles.statusHeaderLine}>
                        <Text style={styles.statusTopic}>{item.topic}</Text>
                        <Text style={styles.completionText}>{item.completion}%</Text>
                      </View>
                      <AnimatedProgress value={item.completion} color={color} />
                      <View style={styles.supportBadge}>
                        <Feather name="heart" size={11} color={item.support > 1 ? C.gold : C.success} />
                        <Text style={[styles.supportText, { color: item.support > 1 ? C.gold : C.success }]}>
                          {item.support} student support {item.support > 1 ? 'signals' : 'signal'}
                        </Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={17} color={C.muted} />
                  </TouchableOpacity>
                );
              })}
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
                        <Text style={styles.separatorDot}>.</Text>
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
                        <Feather name="clock" size={13} color={C.primary} />
                        <Text style={styles.metaLabel}> {activity.duration}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Feather name="cpu" size={13} color={C.primary} />
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
            <View style={styles.sheetHandle} />
            <View style={styles.sheetTop}>
              <View>
                <Text style={styles.sheetTitle}>Grade Attendance</Text>
                <Text style={styles.sheetSubtitle}>Grades 1-5</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setAttendanceVisible(false)} activeOpacity={0.75}>
                <Feather name="x" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.gradeSelectorRow}>
              {[1, 2, 3, 4, 5].map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[styles.gradeSelector, selectedGrade === grade && styles.gradeSelectorActive]}
                  onPress={() => setSelectedGrade(grade as Grade)}
                  activeOpacity={0.78}
                >
                  <Text style={[styles.gradeSelectorText, selectedGrade === grade && styles.gradeSelectorTextActive]}>
                    G{grade}
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
                      activeOpacity={0.78}
                    >
                      <Text style={[styles.toggleText, student.status === 'Present' && styles.toggleTextSelected]}>Present</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.toggleButton, student.status === 'Absent' && styles.toggleButtonDanger]}
                      onPress={() => changeStudentStatus(student.name, 'Absent')}
                      activeOpacity={0.78}
                    >
                      <Text style={[styles.toggleText, student.status === 'Absent' && styles.toggleTextSelected]}>Absent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.84}
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

const cardShadow = {
  shadowColor: C.primaryDeep,
  shadowOpacity: 0.1,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 12 },
  elevation: 8,
};

const softShadow = {
  shadowColor: C.primaryDeep,
  shadowOpacity: 0.07,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 5,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 118,
  },
  dashboardShell: {
    paddingHorizontal: 18,
    minWidth: 0,
  },
  headerCard: {
    minHeight: 214,
    backgroundColor: '#EAF1EC',
    borderRadius: 32,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 16,
    ...cardShadow,
  },
  headerCardSmall: {
    minHeight: 226,
    paddingHorizontal: 18,
  },
  headerShapeLarge: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#DDE9E1',
    right: -58,
    top: -56,
  },
  headerShapeSmall: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#F6EACB',
    left: -28,
    bottom: -36,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 34,
  },
  headerContentSmall: {
    gap: 8,
    paddingTop: 40,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  greeting: {
    fontSize: designTokens.type.hero,
    lineHeight: 46,
    fontWeight: '900',
    color: C.text,
    letterSpacing: 0,
    marginTop: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  greetingSmall: {
    fontSize: 32,
    lineHeight: 40,
  },
  dateText: {
    color: C.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  schoolChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: designTokens.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  schoolText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: '800',
    maxWidth: 210,
  },
  iconButton: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    ...softShadow,
  },
  notificationDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.gold,
  },
  teacherAvatar: {
    width: 94,
    height: 118,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatarFace: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F2C9A6',
    zIndex: 2,
  },
  avatarHair: {
    position: 'absolute',
    top: 4,
    width: 64,
    height: 36,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: C.primaryDeep,
    zIndex: 3,
  },
  avatarBody: {
    width: 86,
    height: 56,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: C.primary,
    marginTop: -8,
  },
  avatarBook: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    width: 42,
    height: 34,
    borderRadius: 12,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAttendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.primary,
    borderRadius: 26,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    ...cardShadow,
  },
  markAttendanceIcon: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: C.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAttendanceCopy: {
    flex: 1,
    minWidth: 0,
  },
  markAttendanceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  markAttendanceSubtext: {
    color: '#D7E8E1',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: designTokens.type.section,
    lineHeight: 30,
    fontWeight: '900',
    color: C.text,
  },
  sectionTitleWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  sectionCaption: {
    color: C.textSecondary,
    fontSize: designTokens.type.caption,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 3,
  },
  sectionHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    minWidth: 0,
    gap: 8,
  },
  liveBadge: {
    borderRadius: designTokens.radius.pill,
    backgroundColor: '#EDF6F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  liveBadgeText: {
    color: C.primary,
    fontWeight: '900',
    fontSize: 11,
  },
  todayChip: {
    color: C.primary,
    fontSize: 11,
    fontWeight: '900',
    backgroundColor: '#EDF6F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: designTokens.radius.pill,
  },
  cardSection: {
    backgroundColor: C.surface,
    borderRadius: designTokens.radius.lg,
    padding: 16,
    marginBottom: 18,
    ...softShadow,
  },
  attendanceOverviewGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  attendanceMetricBox: {
    flex: 1,
    minHeight: 138,
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 22,
    backgroundColor: '#F8FAF8',
  },
  pendingMetricBox: {
    backgroundColor: '#FFF8E8',
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceMetricValue: {
    color: C.text,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
  },
  attendanceMetricLabel: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  attendanceTrend: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  snapshotCard: {
    backgroundColor: C.surface,
    borderRadius: designTokens.radius.lg,
    padding: 16,
    marginBottom: 18,
    ...softShadow,
  },
  snapshotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  snapshotItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 130,
    minHeight: 118,
    backgroundColor: '#F7F9F7',
    borderRadius: 22,
    padding: 14,
    justifyContent: 'space-between',
  },
  snapshotItemHero: {
    minHeight: 146,
    backgroundColor: '#EAF1EC',
  },
  snapshotItemAi: {
    backgroundColor: '#F8F0D8',
  },
  snapshotIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotValue: {
    color: C.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },
  snapshotLabel: {
    color: C.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  briefingCard: {
    backgroundColor: C.surface,
    borderRadius: designTokens.radius.lg,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 18,
    ...softShadow,
  },
  briefingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 86,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    minWidth: 0,
  },
  timelineColumn: {
    width: 24,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginRight: 6,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: C.line,
    marginTop: 6,
  },
  briefingCopy: {
    flex: 1,
    minWidth: 0,
  },
  briefingTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  briefingLabel: {
    color: C.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  priorityPill: {
    width: 28,
    height: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefingValue: {
    color: C.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    marginTop: 4,
  },
  briefingDetail: {
    color: C.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 3,
  },
  statusBoardCard: {
    backgroundColor: C.surface,
    borderRadius: 28,
    padding: 16,
    marginTop: 2,
    ...cardShadow,
  },
  classStrip: {
    flexDirection: 'row',
    backgroundColor: C.primary,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    minWidth: 0,
  },
  classStripBlock: {
    flex: 1,
    minWidth: 0,
  },
  classStripDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginHorizontal: 14,
  },
  classStripLabel: {
    color: '#B9D1C8',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  classStripValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 7,
  },
  classStripTopic: {
    color: '#DDEBE6',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 3,
  },
  statusList: {
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F7',
    borderRadius: 22,
    padding: 12,
    minWidth: 0,
  },
  gradeRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gradeRingFill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  gradeCircleText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '900',
  },
  statusMain: {
    flex: 1,
    minWidth: 0,
  },
  statusHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusTopic: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },
  progressTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: '#E3EAE6',
    overflow: 'hidden',
    marginTop: 9,
  },
  progressFill: {
    height: 9,
    borderRadius: 999,
  },
  completionText: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
  },
  supportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: designTokens.radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 9,
  },
  supportText: {
    fontSize: 10,
    fontWeight: '900',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D7E2DD',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 42, 46, 0.34)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: C.surface,
    padding: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 456,
    ...cardShadow,
  },
  sheetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: C.text,
  },
  sheetSubtitle: {
    color: C.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF5F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 8,
  },
  gradeSelector: {
    flex: 1,
    backgroundColor: '#EEF5F1',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  gradeSelectorActive: {
    backgroundColor: C.primary,
  },
  gradeSelectorText: {
    color: C.primary,
    fontWeight: '900',
    fontSize: 12,
  },
  gradeSelectorTextActive: {
    color: '#FFFFFF',
  },
  studentList: {
    marginTop: 18,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  studentLeft: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    color: C.text,
    fontWeight: '900',
    fontSize: 14,
  },
  studentGradeText: {
    color: C.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  studentToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#EEF5F1',
  },
  toggleButtonSelected: {
    backgroundColor: C.primary,
  },
  toggleButtonDanger: {
    backgroundColor: C.danger,
  },
  toggleText: {
    color: C.primary,
    fontWeight: '900',
    fontSize: 11,
  },
  toggleTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  remainingCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 14,
    marginTop: 10,
    ...softShadow,
  },
  remainingCardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remainingCardTitle: { color: C.text, fontSize: 14, fontWeight: '900' },
  remainingCount: { color: C.primary, fontWeight: '900', fontSize: 11, backgroundColor: '#EDF6F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  remainingClassList: { marginTop: 10 },
  remainingClassCard: { backgroundColor: '#F8FAF8', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8, minWidth: 0, maxWidth: '100%' },
  remainingClassCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 0, maxWidth: '100%' },
  remainingClassMetaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%', marginTop: 6 },
  remainingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0, flexShrink: 1 },
  remainingDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.muted, marginRight: 8 },
  remainingGrade: { color: C.text, fontSize: 11, fontWeight: '900', flexShrink: 1 },
  separatorDot: { color: C.muted, fontSize: 11, marginHorizontal: 6 },
  remainingSubject: { color: C.textSecondary, fontSize: 11, fontWeight: '700', flexShrink: 1, maxWidth: '50%' },
  remainingTopic: { color: C.textSecondary, fontSize: 11, fontWeight: '700', flexShrink: 1, maxWidth: '50%' },
  remainingTime: { color: C.primary, fontSize: 11, fontWeight: '900', marginLeft: 8, flexShrink: 0 },
  orchestratorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', backgroundColor: C.surface, borderRadius: 20, padding: 8, gap: 8, ...softShadow },
  orchestratorGridSingleColumn: { flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'stretch' },
  orchestratorCard: { backgroundColor: '#F8FAF8', borderRadius: 18, padding: 12, minHeight: 116, flexBasis: '48%', flexGrow: 1, flexShrink: 1, maxWidth: '48%' },
  orchestratorCardSingleColumn: { width: '100%', maxWidth: '100%', flexBasis: '100%', marginBottom: 8 },
  orchestratorCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gradeBadge: { backgroundColor: C.primary, color: '#FFFFFF', fontWeight: '900', fontSize: 10, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 7, minWidth: 70, textAlign: 'center' },
  statusPill: { backgroundColor: '#EAF8F4', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, color: C.primary, fontWeight: '800', fontSize: 10 },
  activityName: { fontSize: 14, color: C.text, fontWeight: '800', marginTop: 12, flexShrink: 1, flexWrap: 'wrap', maxWidth: '100%' },
  orchestratorMetaRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, flexShrink: 1, minWidth: 0, maxWidth: '100%' },
  metaLabel: { fontSize: 11, color: C.textSecondary, fontWeight: '800', flexShrink: 1, maxWidth: '100%' },
  focusChip: { color: C.primary, fontSize: 11, fontWeight: '900', backgroundColor: '#EDF6F0', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 5 },
  viewAll: { color: C.primary, fontWeight: '900', fontSize: 11 },
  assessmentListCard: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 24, ...softShadow },
  assessmentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  assessmentGradeWrap: { width: 76, backgroundColor: '#EAF8F4', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  assessmentGrade: { color: C.primary, fontWeight: '900', fontSize: 11, textAlign: 'center' },
  assessmentDetail: { flex: 1, paddingHorizontal: 11, alignItems: 'center', justifyContent: 'center' },
  assessmentSubject: { color: C.text, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  assessmentTopic: { color: C.textSecondary, fontSize: 11, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  assessmentTime: { alignItems: 'flex-end', minWidth: 74, justifyContent: 'center' },
  assessmentTimeText: { color: C.text, fontWeight: '900', fontSize: 11, textAlign: 'right' },
  assessmentDuration: { color: C.textSecondary, fontWeight: '700', fontSize: 10, marginTop: 3, textAlign: 'right' },
});
