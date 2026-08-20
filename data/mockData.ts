// File: data/mockData.ts
// Hardcoded prototype data. Replace/extend freely - every screen in this
// prototype reads from here instead of a real backend.

import {
  Assessment,
  AssessmentResult,
  ClassroomState,
  CurriculumNode,
  Group,
  InsightMetric,
  KnowledgeTracePoint,
  ScheduleBlock,
  Student,
  UpcomingClass,
} from '@/types';

export const groups: Group[] = [
  {
    id: 'g1',
    grade: 'Grade 1',
    studentCount: 8,
    presentCount: 8,
    currentSubject: 'Mathematics',
    currentConcept: 'Counting',
    activityMode: 'independent',
    minutesRemaining: 10,
  },
  {
    id: 'g2',
    grade: 'Grade 2',
    studentCount: 10,
    presentCount: 9,
    currentSubject: 'Mathematics',
    currentConcept: 'Addition',
    activityMode: 'parallel',
    minutesRemaining: 15,
  },
  {
    id: 'g3',
    grade: 'Grade 3',
    studentCount: 9,
    presentCount: 9,
    currentSubject: 'Mathematics',
    currentConcept: 'Division',
    activityMode: 'independent',
    minutesRemaining: 12,
  },
  {
    id: 'g4',
    grade: 'Grade 4',
    studentCount: 12,
    presentCount: 11,
    currentSubject: 'Mathematics',
    currentConcept: 'Fractions',
    activityMode: 'teacher-led',
  },
  {
    id: 'g5',
    grade: 'Grade 5',
    studentCount: 8,
    presentCount: 8,
    currentSubject: 'Mathematics',
    currentConcept: 'Decimals',
    activityMode: 'parallel',
    minutesRemaining: 18,
  },
];

const studentSeed: Student[] = [
  {
    id: 's1',
    name: 'Malathi',
    initials: 'M',
    grade: 'Grade 4',
    groupId: 'g4',
    attendance: 'present',
    currentConcept: 'Fractions',
    knowledgeLevel: 'needs-attention',
    recommendation: 'Missed previous fractions lesson - brief prerequisite recap recommended.',
  },
  {
    id: 's2',
    name: 'Ramesh',
    initials: 'R',
    grade: 'Grade 4',
    groupId: 'g4',
    attendance: 'absent',
    attendanceNote: 'Left at 12:30',
    attendanceChanges: [{ time: '12:30 PM', from: 'present', to: 'absent' }],
    currentConcept: 'Division',
    knowledgeLevel: 'developing',
  },
  {
    id: 's3',
    name: 'Arjun',
    initials: 'A',
    grade: 'Grade 4',
    groupId: 'g4',
    attendance: 'present',
    currentConcept: 'Fractions',
    knowledgeLevel: 'developing',
    recommendation: 'Difficulty comparing fractions in previous evidence - provide guided example.',
  },
  {
    id: 's4',
    name: 'Kavya',
    initials: 'K',
    grade: 'Grade 4',
    groupId: 'g4',
    attendance: 'present',
    currentConcept: 'Fractions',
    knowledgeLevel: 'needs-attention',
    recommendation: 'Prerequisite concept requires reinforcement - check understanding during lesson.',
  },
];

function cloneStudents(source: Student[]) {
  return source.map((student) => ({
    ...student,
    attendanceChanges: student.attendanceChanges?.map((change) => ({ ...change })),
  }));
}

export let students: Student[] = cloneStudents(studentSeed);

export function resetStudents() {
  students = cloneStudents(studentSeed);
}

export function getStudentsByGroup(groupId: string) {
  return students.filter((student) => student.groupId === groupId);
}

export function getStudentById(studentId: string) {
  return students.find((student) => student.id === studentId);
}

export function setStudentAttendance(
  studentId: string,
  attendance: 'present' | 'absent',
  time = 'Today'
) {
  students = students.map((student) => {
    if (student.id !== studentId) {
      return student;
    }

    const nextChanges = [...(student.attendanceChanges ?? [])];

    if (student.attendance !== attendance) {
      nextChanges.push({
        time,
        from: student.attendance,
        to: attendance,
      });
    }

    return {
      ...student,
      attendance,
      attendanceNote: attendance === 'absent' ? student.attendanceNote ?? 'Marked absent during class' : undefined,
      attendanceChanges: nextChanges,
    };
  });
}

export function markAllStudentsPresent(time = 'Today') {
  students = students.map((student) => {
    if (student.attendance === 'present') {
      return student;
    }

    return {
      ...student,
      attendance: 'present',
      attendanceNote: undefined,
      attendanceChanges: [
        ...(student.attendanceChanges ?? []),
        {
          time,
          from: 'absent',
          to: 'present',
        },
      ],
    };
  });
}

export function getClassroomState(): ClassroomState {
  const presentToday = students.filter((student) => student.attendance === 'present').length;
  const totalStudents = students.length;

  return {
    totalStudents,
    presentToday,
    absentToday: totalStudents - presentToday,
    activeGroups: groups.length,
    attendanceCompleted: presentToday > 0,
  };
}

export const scheduleToday: ScheduleBlock[] = [
  {
    id: 'b1',
    time: '09:00',
    endTime: '09:20',
    groupId: 'g4',
    grade: 'Grade 4',
    subject: 'Mathematics',
    concept: 'Fractions',
    mode: 'teacher-led',
  },
  {
    id: 'b2',
    time: '09:00',
    endTime: '09:20',
    groupId: 'g3',
    grade: 'Grade 3',
    subject: 'Mathematics',
    concept: 'Division practice',
    mode: 'independent',
  },
  {
    id: 'b3',
    time: '09:00',
    endTime: '09:20',
    groupId: 'g5',
    grade: 'Grade 5',
    subject: 'Mathematics',
    concept: 'Decimals activity',
    mode: 'parallel',
  },
  {
    id: 'b4',
    time: '09:20',
    endTime: '09:35',
    groupId: 'g3',
    grade: 'Grade 3',
    subject: 'Mathematics',
    concept: 'Division',
    mode: 'teacher-led',
  },
  {
    id: 'b5',
    time: '09:20',
    endTime: '09:35',
    groupId: 'g4',
    grade: 'Grade 4',
    subject: 'Mathematics',
    concept: 'Fractions practice',
    mode: 'independent',
  },
  {
    id: 'b6',
    time: '09:20',
    endTime: '09:35',
    groupId: 'g5',
    grade: 'Grade 5',
    subject: 'Mathematics',
    concept: 'Decimals activity',
    mode: 'parallel',
  },
  {
    id: 'b7',
    time: '09:35',
    endTime: '10:00',
    groupId: 'g4',
    grade: 'Grade 4',
    subject: 'Mathematics',
    concept: 'Teacher intervention',
    mode: 'teacher-led',
  },
];

export const upcomingClass: UpcomingClass = {
  groupId: 'g4',
  grade: 'Grade 4',
  subject: 'Mathematics',
  concept: 'Fractions',
  time: '09:30',
  endTime: '10:00',
  studentsNeedingAttention: 3,
  objective: 'Compare equivalent fractions.',
  priorities: [
    {
      rank: 1,
      studentId: 's1',
      name: 'Malathi',
      reason: 'Missed previous fractions lesson',
      recommendation: 'Brief prerequisite recap recommended.',
    },
    {
      rank: 2,
      studentId: 's3',
      name: 'Arjun',
      reason: 'Difficulty comparing fractions',
      recommendation: 'Provide guided example.',
    },
    {
      rank: 3,
      studentId: 's4',
      name: 'Kavya',
      reason: 'Prerequisite reinforcement',
      recommendation: 'Check understanding during lesson.',
    },
  ],
};

export type PriorityDecision = 'pending' | 'resolved' | 'follow-up';

const initialPriorityDecisions: Record<string, PriorityDecision> = {
  s1: 'pending',
  s3: 'pending',
  s4: 'pending',
};

let priorityDecisions: Record<string, PriorityDecision> = {
  ...initialPriorityDecisions,
};

export function getPriorityDecision(studentId: string): PriorityDecision {
  return priorityDecisions[studentId] ?? 'pending';
}

export function setPriorityDecision(studentId: string, decision: PriorityDecision) {
  priorityDecisions = {
    ...priorityDecisions,
    [studentId]: decision,
  };
}

export function resetPriorityDecisions() {
  priorityDecisions = { ...initialPriorityDecisions };
}

// Groups other than whichever group the teacher is currently focused on -
// used by Home + Class Mode "Other Groups" sections.
export function getOtherGroups(currentGroupId: string): Group[] {
  return groups.filter((group) => group.id !== currentGroupId);
}

export function getGroupById(groupId: string) {
  return groups.find((group) => group.id === groupId);
}

export const assessments: Assessment[] = [
  {
    id: 'a1',
    grade: 'Grade 3',
    subject: 'Mathematics',
    concept: 'Subtraction',
    date: '2026-08-22',
    duration: '20 min',
    status: 'scheduled',
    difficulty: 'core',
    prerequisite: 'Addition',
  },
  {
    id: 'a2',
    grade: 'Grade 4',
    subject: 'Mathematics',
    concept: 'Fractions',
    date: '2026-08-23',
    duration: '25 min',
    status: 'upcoming',
    difficulty: 'core',
    prerequisite: 'Equivalent fractions',
  },
  {
    id: 'a3',
    grade: 'Grade 5',
    subject: 'Mathematics',
    concept: 'Decimals',
    date: '2026-08-24',
    duration: '30 min',
    status: 'live',
    difficulty: 'challenge',
    prerequisite: 'Place value',
  },
];

export const assessmentResults: AssessmentResult[] = [
  {
    assessmentId: 'a2',
    mastery: 72,
    strongCount: 18,
    developingCount: 7,
    needsAttentionCount: 4,
    topStudents: ['Malathi', 'Arjun', 'Kavya'],
  },
  {
    assessmentId: 'a1',
    mastery: 64,
    strongCount: 14,
    developingCount: 9,
    needsAttentionCount: 6,
    topStudents: ['Asha', 'Ravi', 'Sneha'],
  },
];

export const insightMetrics: InsightMetric[] = [
  {
    label: 'Attendance',
    value: '94%',
    detail: 'Stable across the week',
    trend: 'up',
  },
  {
    label: 'Mastery',
    value: '72%',
    detail: 'Fractions and subtraction improving',
    trend: 'up',
  },
  {
    label: 'Needs attention',
    value: '4 students',
    detail: 'Focused support required',
    trend: 'flat',
  },
  {
    label: 'Missed lessons',
    value: '3 blocks',
    detail: 'Mostly Grade 4 and Grade 5',
    trend: 'down',
  },
];

export const curriculumNodes: CurriculumNode[] = [
  { id: 'c1', subject: 'Mathematics', grade: 'Grade 1', concept: 'Counting', prerequisiteIds: [], status: 'mastered' },
  { id: 'c2', subject: 'Mathematics', grade: 'Grade 2', concept: 'Addition', prerequisiteIds: ['c1'], status: 'mastered' },
  { id: 'c3', subject: 'Mathematics', grade: 'Grade 3', concept: 'Subtraction', prerequisiteIds: ['c2'], status: 'developing' },
  { id: 'c4', subject: 'Mathematics', grade: 'Grade 4', concept: 'Fractions', prerequisiteIds: ['c3'], status: 'developing' },
  { id: 'c5', subject: 'Mathematics', grade: 'Grade 5', concept: 'Decimals', prerequisiteIds: ['c4'], status: 'upcoming' },
];

export const knowledgeTrace: KnowledgeTracePoint[] = [
  { id: 'k1', studentId: 's1', concept: 'Fractions', time: '08:10', mastery: 0.58, evidence: 'Pre-class recap response' },
  { id: 'k2', studentId: 's1', concept: 'Fractions', time: '09:45', mastery: 0.71, evidence: 'Teacher-guided example' },
  { id: 'k3', studentId: 's1', concept: 'Fractions', time: '10:20', mastery: 0.84, evidence: 'Quick check success' },
  { id: 'k4', studentId: 's3', concept: 'Fractions', time: '09:45', mastery: 0.62, evidence: 'Comparison practice' },
  { id: 'k5', studentId: 's4', concept: 'Fractions', time: '10:20', mastery: 0.55, evidence: 'Prerequisite reminder' },
];

export function getAssessmentById(assessmentId: string) {
  return assessments.find((assessment) => assessment.id === assessmentId);
}

export function getAssessmentResultById(assessmentId: string) {
  return assessmentResults.find((result) => result.assessmentId === assessmentId);
}

export function getKnowledgeTraceForStudent(studentId: string) {
  return knowledgeTrace.filter((point) => point.studentId === studentId);
}

export function getCurriculumByGrade(grade: string) {
  return curriculumNodes.filter((node) => node.grade === grade);
}
