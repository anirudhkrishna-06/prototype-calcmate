import { Feather } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { students as tamilStudents, type Grade } from '../../data/tamilStudentData';

type GradeFilter = Grade | 'All';
type AssessmentStatus = 'Scheduled' | 'In Progress' | 'Draft' | 'Completed';
type TabMode = 'current' | 'marks' | 'history';
type SortMode = 'Newest' | 'Oldest' | 'Highest Score';

type CurrentAssessment = {
  id: string;
  grade: Grade;
  subject: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  status: AssessmentStatus;
};

type HistoryAssessment = {
  id: string;
  grade: Grade;
  subject: string;
  topic: string;
  month: string;
  date: string;
  status: 'Completed';
  score: number;
};

type StudentMarks = {
  id: string;
  rollNumber: string;
  student: string;
  marks: number;
  remarks: string;
};

type StoredMark = {
  marks: number;
  remarks: string;
};

const TODAY = '2026-09-15';
const gradeOptions = [1, 2, 3, 4, 5] as Grade[];
const subjects = ['Mathematics', 'English', 'Science', 'Social Studies'];
const remarksOptions = ['Excellent', 'Good Progress', 'Needs Support', 'Absent'];
const sortOptions: SortMode[] = ['Newest', 'Oldest', 'Highest Score'];

const currentAssessments: CurrentAssessment[] = [
  { id: 'a1', grade: 1, subject: 'Mathematics', topic: 'Number Sense Check', date: '2026-09-13', time: '08:30 AM', duration: '45 min', maxMarks: 100, status: 'In Progress' },
  { id: 'a2', grade: 2, subject: 'English', topic: 'Reading Fluency Review', date: '2026-09-13', time: '10:00 AM', duration: '30 min', maxMarks: 50, status: 'Scheduled' },
  { id: 'a3', grade: 3, subject: 'Science', topic: 'Plants and Animals', date: TODAY, time: '09:45 AM', duration: '50 min', maxMarks: 80, status: 'Draft' },
  { id: 'a4', grade: 4, subject: 'Mathematics', topic: 'Fractions Assessment', date: '2026-09-15', time: '11:15 AM', duration: '60 min', maxMarks: 100, status: 'Scheduled' },
  { id: 'a5', grade: 5, subject: 'English', topic: 'Writing Workshop', date: '2026-09-16', time: '01:30 PM', duration: '40 min', maxMarks: 60, status: 'In Progress' },
];

const historyAssessments: HistoryAssessment[] = [
  { id: 'h1', grade: 1, subject: 'Mathematics', topic: 'Counting Review', month: 'Sep', date: '2026-09-06', status: 'Completed', score: 86 },
  { id: 'h2', grade: 2, subject: 'Science', topic: 'Living Systems', month: 'Sep', date: '2026-09-08', status: 'Completed', score: 82 },
  { id: 'h3', grade: 3, subject: 'English', topic: 'Reading Strategy Check', month: 'Sep', date: '2026-09-10', status: 'Completed', score: 91 },
  { id: 'h4', grade: 4, subject: 'Social Studies', topic: 'Community Roles', month: 'Aug', date: '2026-08-22', status: 'Completed', score: 84 },
  { id: 'h5', grade: 5, subject: 'Mathematics', topic: 'Data Analysis', month: 'Aug', date: '2026-08-30', status: 'Completed', score: 78 },
  { id: 'h6', grade: 5, subject: 'English', topic: 'Argument Writing', month: 'Sep', date: '2026-09-11', status: 'Completed', score: 89 },
];

const marksEntrySeed: Record<string, StoredMark> = tamilStudents.reduce((entries, student) => {
  const averageScore = Math.round((student.scores.Mathematics + student.scores.English + student.scores.Science) / 3);
  entries[String(student.id)] = {
    marks: averageScore,
    remarks: student.riskLevel === 'High' ? 'Needs Support' : student.riskLevel === 'Medium' ? 'Good Progress' : 'Excellent',
  };
  return entries;
}, {} as Record<string, StoredMark>);

const subjectTone: Record<string, { icon: keyof typeof Feather.glyphMap; tint: string; soft: string }> = {
  Mathematics: { icon: 'hash', tint: '#1E5B8C', soft: '#E8F2FA' },
  English: { icon: 'book-open', tint: '#7B4D9D', soft: '#F1EAF7' },
  Science: { icon: 'zap', tint: '#0E7A61', soft: '#E4F5EF' },
  'Social Studies': { icon: 'map', tint: '#A96716', soft: '#FFF1DD' },
};

const statusTone: Record<AssessmentStatus, { color: string; background: string }> = {
  Scheduled: { color: '#1E5B8C', background: '#E8F2FA' },
  'In Progress': { color: '#006A4E', background: '#DDF4EA' },
  Completed: { color: '#44515A', background: '#EDF1F4' },
  Draft: { color: '#A96716', background: '#FFF1DD' },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', weekday: 'short' }).format(new Date(`${value}T00:00:00`));
}

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (nextValue: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.controlLabel}>{label}</Text>
      <Pressable style={styles.dropdownButton} onPress={() => setOpen((current) => !current)}>
        <Text style={styles.dropdownValue} numberOfLines={1}>{value}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#5C6B73" />
      </Pressable>
      {open && (
        <View style={styles.dropdownMenu}>
          {options.map((option) => (
            <Pressable
              key={option}
              style={[styles.dropdownOption, value === option && styles.dropdownOptionActive]}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}>
              <Text style={[styles.dropdownOptionText, value === option && styles.dropdownOptionTextActive]} numberOfLines={1}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const AssessmentCard = memo(function AssessmentCard({ assessment }: { assessment: CurrentAssessment }) {
  const tone = subjectTone[assessment.subject] ?? subjectTone.Mathematics;
  const status = statusTone[assessment.status];
  const isToday = assessment.date === TODAY;

  return (
    <View style={styles.assessmentCard}>
      <View style={styles.cardTopRow}>
        <View style={[styles.subjectIcon, { backgroundColor: tone.soft }]}>
          <Feather name={tone.icon} size={21} color={tone.tint} />
        </View>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.assessmentSubject} numberOfLines={1}>{assessment.subject}</Text>
          <Text style={styles.assessmentTitle} numberOfLines={2}>{assessment.topic}</Text>
        </View>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeBadgeText}>G{assessment.grade}</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Subject</Text>
          <Text style={styles.metaText} numberOfLines={1}>{assessment.subject}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Grade</Text>
          <Text style={styles.metaText} numberOfLines={1}>Grade {assessment.grade}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Date</Text>
          <Feather name="calendar" size={15} color="#5C6B73" />
          <Text style={styles.metaText} numberOfLines={1}>{isToday ? 'Today' : formatDate(assessment.date)}</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: status.background }]}>
          <Text style={styles.metaLabel}>Status</Text>
          <Text style={[styles.statusChipText, { color: status.color }]} numberOfLines={1}>{assessment.status}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.86}>
          <Feather name="play-circle" size={17} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Assessment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const StudentMarkCard = memo(function StudentMarkCard({
  item,
  maxMarks,
  onMarksChange,
  onRemarksChange,
  inputRef,
  isLast,
  onNext,
}: {
  item: StudentMarks;
  maxMarks: number;
  onMarksChange: (id: string, value: string) => void;
  onRemarksChange: (id: string, value: string) => void;
  inputRef: React.Ref<TextInput>;
  isLast: boolean;
  onNext: () => void;
}) {
  const percentage = Math.round((item.marks / maxMarks) * 100);
  const initials = item.student.split(' ').map((part) => part[0]).join('').slice(0, 2);
  const markDigits = String(maxMarks).length;

  return (
    <View style={styles.studentCard}>
      <View style={styles.studentTop}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <View style={styles.studentIdentity}>
          <Text style={styles.studentName} numberOfLines={1}>{item.student}</Text>
          <Text style={styles.rollNumber}>Roll {item.rollNumber}</Text>
        </View>
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageValue}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.entryRow}>
        <View style={styles.marksInputWrap}>
          <Text style={styles.controlLabel}>Marks</Text>
          <View style={styles.marksInputBox}>
            <TextInput
              ref={inputRef}
              style={styles.marksInput}
              value={String(item.marks)}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={markDigits}
              returnKeyType={isLast ? 'done' : 'next'}
              blurOnSubmit={isLast}
              selectTextOnFocus
              onChangeText={(value) => {
                onMarksChange(item.id, value);
                if (!isLast && value.replace(/[^0-9]/g, '').length >= markDigits) {
                  onNext();
                }
              }}
              onSubmitEditing={onNext}
            />
            <Text style={styles.maxMarksText}>/{maxMarks}</Text>
          </View>
        </View>
        <View style={styles.remarksWrap}>
          <Dropdown
            label="Remarks"
            value={item.remarks}
            options={remarksOptions}
            onChange={(value) => onRemarksChange(item.id, value)}
          />
        </View>
      </View>
    </View>
  );
});

function HistoryCard({ item }: { item: HistoryAssessment }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineLine} />
      </View>
      <View style={styles.historyCard}>
        <View style={styles.historyTop}>
          <View style={styles.historyTitleBlock}>
            <Text style={styles.historyTitle} numberOfLines={2}>{item.topic}</Text>
            <Text style={styles.historySubject} numberOfLines={1}>{item.subject}</Text>
          </View>
          <View style={styles.scoreBadge}><Text style={styles.scoreBadgeText}>{item.score}%</Text></View>
        </View>
        <View style={styles.historyMetaWrap}>
          <Text style={styles.historyMeta} numberOfLines={1}>Grade {item.grade}</Text>
          <Text style={styles.historyMeta} numberOfLines={1}>{formatDate(item.date)}</Text>
          <Text style={styles.historyMetaStrong} numberOfLines={1}>Completed</Text>
        </View>
      </View>
    </View>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryTile}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Feather name="clipboard" size={26} color="#006A4E" />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function AssessmentManagementPage() {
  const [activeTab, setActiveTab] = useState<TabMode>('current');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(currentAssessments[0].id);
  const [historyGrade, setHistoryGrade] = useState<GradeFilter>('All');
  const [historySubject, setHistorySubject] = useState('All');
  const [historyMonth, setHistoryMonth] = useState('All');
  const [historySearch, setHistorySearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('Newest');
  const [marks, setMarks] = useState<Record<string, StoredMark>>(marksEntrySeed);
  const [resultsGenerated, setResultsGenerated] = useState(false);
  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const assessmentOptions = useMemo(() => {
    const matched = currentAssessments.filter((item) => item.grade === selectedGrade && item.subject === selectedSubject);
    return matched.length > 0 ? matched : currentAssessments.filter((item) => item.grade === selectedGrade);
  }, [selectedGrade, selectedSubject]);

  const selectedAssessment = useMemo(() => {
    return assessmentOptions.find((item) => item.id === selectedAssessmentId) ?? assessmentOptions[0] ?? currentAssessments[0];
  }, [assessmentOptions, selectedAssessmentId]);

  const selectedGradeMarks = useMemo<StudentMarks[]>(() => {
    return tamilStudents
      .filter((student) => student.grade === selectedGrade)
      .map((student) => {
        const storedMark = marks[String(student.id)] ?? marksEntrySeed[String(student.id)];
        return {
          id: String(student.id),
          rollNumber: String(student.rollNumber).padStart(2, '0'),
          student: student.name,
          marks: Math.min(selectedAssessment.maxMarks, storedMark.marks),
          remarks: storedMark.remarks,
        };
      });
  }, [marks, selectedAssessment.maxMarks, selectedGrade]);

  const sortedCurrentAssessments = useMemo(() => {
    return [...currentAssessments].sort((a, b) => {
      if (a.date === TODAY && b.date !== TODAY) return -1;
      if (b.date === TODAY && a.date !== TODAY) return 1;
      return a.date.localeCompare(b.date);
    });
  }, []);

  const filteredHistory = useMemo(() => {
    const query = historySearch.trim().toLowerCase();

    return historyAssessments
      .filter((assessment) => {
        const gradeMatches = historyGrade === 'All' || assessment.grade === historyGrade;
        const subjectMatches = historySubject === 'All' || assessment.subject === historySubject;
        const monthMatches = historyMonth === 'All' || assessment.month === historyMonth;
        const searchMatches = !query || `${assessment.topic} ${assessment.subject} Grade ${assessment.grade}`.toLowerCase().includes(query);
        return gradeMatches && subjectMatches && monthMatches && searchMatches;
      })
      .sort((a, b) => {
        if (sortMode === 'Highest Score') return b.score - a.score;
        if (sortMode === 'Oldest') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [historyGrade, historyMonth, historySearch, historySubject, sortMode]);

  const classSummary = useMemo(() => {
    const scores = selectedGradeMarks.map((item) => Math.round((item.marks / selectedAssessment.maxMarks) * 100));
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = scores.length > 0 ? Math.round(total / scores.length) : 0;
    const highest = scores.length > 0 ? Math.max(...scores) : 0;
    const lowest = scores.length > 0 ? Math.min(...scores) : 0;
    const passPercent = scores.length > 0 ? Math.round((scores.filter((score) => score >= 40).length / scores.length) * 100) : 0;

    return { average, highest, lowest, passPercent };
  }, [selectedAssessment.maxMarks, selectedGradeMarks]);

  const updateMark = useCallback((studentId: string, newMark: string) => {
    const parsed = Number(newMark.replace(/[^0-9]/g, ''));
    const value = Math.min(selectedAssessment.maxMarks, Math.max(0, Number.isNaN(parsed) ? 0 : parsed));
    setMarks((currentMarks) => ({
      ...currentMarks,
      [studentId]: {
        ...(currentMarks[studentId] ?? { remarks: 'Good Progress' }),
        marks: value,
      },
    }));
  }, [selectedAssessment.maxMarks]);

  const focusNextStudent = useCallback((currentIndex: number) => {
    const nextStudent = selectedGradeMarks[currentIndex + 1];
    if (nextStudent) {
      requestAnimationFrame(() => inputRefs.current[nextStudent.id]?.focus());
      return;
    }
    inputRefs.current[selectedGradeMarks[currentIndex]?.id ?? '']?.blur();
  }, [selectedGradeMarks]);

  const saveMarks = useCallback(() => {
    setResultsGenerated(true);
  }, []);

  const updateRemarks = useCallback((studentId: string, remarks: string) => {
    setMarks((currentMarks) => ({
      ...currentMarks,
      [studentId]: {
        ...(currentMarks[studentId] ?? { marks: 0 }),
        remarks,
      },
    }));
  }, []);

  const handleGradeChange = (value: string) => {
    const grade = Number(value.replace('Grade ', '')) as Grade;
    const nextAssessment = currentAssessments.find((item) => item.grade === grade && item.subject === selectedSubject)
      ?? currentAssessments.find((item) => item.grade === grade);
    setSelectedGrade(grade);
    if (nextAssessment) {
      setSelectedAssessmentId(nextAssessment.id);
      setSelectedSubject(nextAssessment.subject);
    }
    setResultsGenerated(false);
  };

  const handleSubjectChange = (value: string) => {
    const nextAssessment = currentAssessments.find((item) => item.grade === selectedGrade && item.subject === value)
      ?? currentAssessments.find((item) => item.subject === value);
    setSelectedSubject(value);
    if (nextAssessment) {
      setSelectedAssessmentId(nextAssessment.id);
    }
    setResultsGenerated(false);
  };

  const renderHeader = () => (
    <>
      <View style={styles.pageHeader}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.crumb}>Assessment Centre</Text>
          <Text style={styles.title}>Assessment Management</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.86}>
          <Feather name="plus" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {[
          { key: 'current', label: 'Current' },
          { key: 'marks', label: 'Marks' },
          { key: 'history', label: 'History' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key as TabMode)}
            activeOpacity={0.88}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]} numberOfLines={1}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  if (activeTab === 'marks') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={selectedGradeMarks}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.marksListContent}
            ListHeaderComponent={(
              <>
                {renderHeader()}
                <View style={styles.sectionHeader}>
                  <Text style={styles.panelTitle}>Marks Entry</Text>
                  <Text style={styles.panelText}>Fast entry for the selected classroom assessment</Text>
                </View>
                <View style={styles.selectionCard}>
                  <Dropdown
                    label="Grade"
                    value={`Grade ${selectedGrade}`}
                    options={gradeOptions.map((grade) => `Grade ${grade}`)}
                    onChange={handleGradeChange}
                  />
                  <Dropdown
                    label="Subject"
                    value={selectedSubject}
                    options={subjects}
                    onChange={handleSubjectChange}
                  />
                  <Dropdown
                    label="Assessment"
                    value={selectedAssessment.topic}
                    options={assessmentOptions.map((item) => item.topic)}
                    onChange={(value) => {
                      const nextAssessment = assessmentOptions.find((item) => item.topic === value);
                      if (nextAssessment) {
                        setSelectedAssessmentId(nextAssessment.id);
                        setResultsGenerated(false);
                      }
                    }}
                  />
                </View>
                <View style={styles.summaryGrid}>
                  <SummaryTile label="Average Score" value={`${classSummary.average}%`} />
                  <SummaryTile label="Highest Score" value={`${classSummary.highest}%`} />
                  <SummaryTile label="Lowest Score" value={`${classSummary.lowest}%`} />
                  <SummaryTile label="Pass %" value={`${classSummary.passPercent}%`} />
                </View>
                {resultsGenerated && (
                  <View style={styles.generatedBanner}>
                    <Feather name="check-circle" size={18} color="#006A4E" />
                    <Text style={styles.generatedText}>Results generated automatically from saved marks.</Text>
                  </View>
                )}
              </>
            )}
            renderItem={({ item, index }) => (
              <StudentMarkCard
                item={item}
                maxMarks={selectedAssessment.maxMarks}
                onMarksChange={updateMark}
                onRemarksChange={updateRemarks}
                inputRef={(element) => {
                  inputRefs.current[item.id] = element;
                }}
                isLast={index === selectedGradeMarks.length - 1}
                onNext={() => focusNextStudent(index)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.cardGap} />}
            ListEmptyComponent={<EmptyState title="No students found" subtitle="Students will appear here once the assessment is selected." />}
          />
          <View style={styles.saveBar}>
            <View style={styles.saveCopy}>
              <Text style={styles.saveTitle}>{selectedGradeMarks.length} students</Text>
              <Text style={styles.saveSubtitle}>Auto-calculated percentages</Text>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveMarks} activeOpacity={0.88}>
              <Feather name="save" size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Marks</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (activeTab === 'current') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={sortedCurrentAssessments}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={(
            <>
              {renderHeader()}
              <View style={styles.sectionHeader}>
                <Text style={styles.panelTitle}>Current Assessments</Text>
                <Text style={styles.panelText}>Today first, then upcoming classroom flow</Text>
              </View>
            </>
          )}
          renderItem={({ item }) => <AssessmentCard assessment={item} />}
          ItemSeparatorComponent={() => <View style={styles.cardGap} />}
          ListEmptyComponent={<EmptyState title="Nothing to show" subtitle="New assessments will appear here once scheduled." />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={(
          <>
            {renderHeader()}
            <View style={styles.sectionHeader}>
              <Text style={styles.panelTitle}>Assessment History</Text>
              <Text style={styles.panelText}>Completed records with class performance</Text>
            </View>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color="#5C6B73" />
              <TextInput
                style={styles.searchInput}
                value={historySearch}
                placeholder="Search assessments"
                placeholderTextColor="#8B989F"
                onChangeText={setHistorySearch}
              />
            </View>
            <View style={styles.compactFilters}>
              <Dropdown
                label="Grade"
                value={historyGrade === 'All' ? 'All' : `Grade ${historyGrade}`}
                options={['All', ...gradeOptions.map((grade) => `Grade ${grade}`)]}
                onChange={(value) => setHistoryGrade(value === 'All' ? 'All' : Number(value.replace('Grade ', '')) as Grade)}
              />
              <Dropdown
                label="Subject"
                value={historySubject}
                options={['All', ...subjects]}
                onChange={setHistorySubject}
              />
              <Dropdown
                label="Month"
                value={historyMonth}
                options={['All', 'Aug', 'Sep']}
                onChange={setHistoryMonth}
              />
              <View style={styles.sortRow}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.sortChip, sortMode === option && styles.sortChipActive]}
                    onPress={() => setSortMode(option)}
                    activeOpacity={0.86}>
                    <Text style={[styles.sortChipText, sortMode === option && styles.sortChipTextActive]} numberOfLines={1}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
        renderItem={({ item }) => <HistoryCard item={item} />}
        ItemSeparatorComponent={() => <View style={styles.cardGap} />}
        ListEmptyComponent={<EmptyState title="Nothing to show" subtitle="Try changing the filters or search term." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7F6' },
  flex: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 32 },
  marksListContent: { padding: 16, paddingBottom: 118 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerTextBlock: { flex: 1, minWidth: 0 },
  crumb: { color: '#006A4E', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: '#1A2B4C', fontSize: 27, fontWeight: '800', marginTop: 6 },
  headerButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006A4E',
    shadowColor: '#1A2B4C',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: '#E9EFEE',
    borderRadius: 14,
    padding: 4,
  },
  tabButton: { flex: 1, minHeight: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabButtonActive: { backgroundColor: '#1A2B4C' },
  tabText: { color: '#5C6B73', fontWeight: '800', fontSize: 13 },
  tabTextActive: { color: '#FFFFFF' },
  sectionHeader: { marginTop: 20, marginBottom: 12 },
  panelTitle: { color: '#1A2B4C', fontSize: 22, fontWeight: '800' },
  panelText: { color: '#5C6B73', fontWeight: '600', fontSize: 13, marginTop: 4 },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    shadowColor: '#1A2B4C',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subjectIcon: { width: 46, height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardTitleBlock: { flex: 1, minWidth: 0 },
  assessmentSubject: { color: '#5C6B73', fontSize: 12, fontWeight: '800' },
  assessmentTitle: { color: '#1A2B4C', fontSize: 17, lineHeight: 22, fontWeight: '800', marginTop: 3 },
  gradeBadge: { minWidth: 42, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F4F3', paddingHorizontal: 8 },
  gradeBadgeText: { color: '#1A2B4C', fontWeight: '900', fontSize: 13 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  metaItem: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 38,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F5F7F6',
  },
  metaLabel: { color: '#8B989F', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  metaText: { flex: 1, minWidth: 0, color: '#44515A', fontSize: 12, fontWeight: '700' },
  statusChip: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 38,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statusChipText: { fontSize: 12, fontWeight: '900' },
  quickActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  startButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#006A4E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  startButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  selectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    gap: 12,
    marginBottom: 14,
  },
  dropdownWrap: { flex: 1, minWidth: 0 },
  controlLabel: { color: '#5C6B73', fontSize: 11, fontWeight: '800', marginBottom: 7 },
  dropdownButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    backgroundColor: '#F9FBFA',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownValue: { flex: 1, minWidth: 0, color: '#1A2B4C', fontSize: 14, fontWeight: '800' },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownOption: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#EEF2F3' },
  dropdownOptionActive: { backgroundColor: '#E6F3EE' },
  dropdownOptionText: { color: '#44515A', fontSize: 13, fontWeight: '700' },
  dropdownOptionTextActive: { color: '#006A4E', fontWeight: '900' },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDE3EA',
  },
  studentTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  avatar: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#E8F2FA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#1E5B8C', fontSize: 14, fontWeight: '900' },
  studentIdentity: { flex: 1, minWidth: 0 },
  studentName: { color: '#1A2B4C', fontSize: 16, fontWeight: '800' },
  rollNumber: { color: '#5C6B73', fontSize: 12, fontWeight: '700', marginTop: 3 },
  percentageBadge: { minWidth: 58, height: 36, borderRadius: 8, backgroundColor: '#DDF4EA', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  percentageValue: { color: '#006A4E', fontSize: 14, fontWeight: '900' },
  entryRow: { gap: 12, marginTop: 16 },
  marksInputWrap: { width: '100%' },
  marksInputBox: {
    minHeight: 74,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    backgroundColor: '#F9FBFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  marksInput: { flex: 1, color: '#1A2B4C', fontSize: 34, fontWeight: '900', paddingVertical: 8, textAlign: 'center' },
  maxMarksText: { color: '#8B989F', fontSize: 16, fontWeight: '900' },
  remarksWrap: { flex: 1, minWidth: 0 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  summaryTile: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    padding: 13,
  },
  summaryLabel: { color: '#5C6B73', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  summaryValue: { color: '#1A2B4C', fontSize: 22, fontWeight: '900', marginTop: 6 },
  generatedBanner: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#E6F3EE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  generatedText: { flex: 1, minWidth: 0, color: '#006A4E', fontSize: 13, fontWeight: '800' },
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDE3EA',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  saveCopy: { flex: 1, minWidth: 0 },
  saveTitle: { color: '#1A2B4C', fontSize: 14, fontWeight: '900' },
  saveSubtitle: { color: '#5C6B73', fontSize: 12, fontWeight: '700', marginTop: 2 },
  saveButton: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#006A4E',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  searchBox: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, minWidth: 0, color: '#1A2B4C', fontSize: 14, fontWeight: '700', paddingVertical: 10 },
  compactFilters: { gap: 10, marginBottom: 14 },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sortChip: { minHeight: 36, borderRadius: 8, backgroundColor: '#E9EFEE', paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  sortChipActive: { backgroundColor: '#1A2B4C' },
  sortChipText: { color: '#5C6B73', fontSize: 12, fontWeight: '800' },
  sortChipTextActive: { color: '#FFFFFF' },
  timelineRow: { flexDirection: 'row', alignItems: 'stretch' },
  timelineRail: { width: 22, alignItems: 'center' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#006A4E', marginTop: 20 },
  timelineLine: { flex: 1, width: 2, backgroundColor: '#DDE3EA', marginTop: 6 },
  historyCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDE3EA',
  },
  historyTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  historyTitleBlock: { flex: 1, minWidth: 0 },
  historyTitle: { color: '#1A2B4C', fontSize: 16, lineHeight: 21, fontWeight: '900' },
  historySubject: { color: '#5C6B73', fontSize: 13, fontWeight: '800', marginTop: 4 },
  scoreBadge: { minWidth: 58, height: 38, borderRadius: 8, backgroundColor: '#E6F3EE', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  scoreBadgeText: { color: '#006A4E', fontSize: 14, fontWeight: '900' },
  historyMetaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  historyMeta: { color: '#44515A', fontSize: 12, fontWeight: '800', backgroundColor: '#F5F7F6', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7 },
  historyMetaStrong: { color: '#006A4E', fontSize: 12, fontWeight: '900', backgroundColor: '#DDF4EA', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DDE3EA',
  },
  emptyIcon: { width: 52, height: 52, borderRadius: 8, backgroundColor: '#DDF4EA', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { color: '#1A2B4C', fontSize: 16, fontWeight: '900' },
  emptySubtitle: { color: '#5C6B73', fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 5 },
  cardGap: { height: 12 },
});
