// File: types/index.ts
// Shared shape definitions for all mock data used across the prototype.
// Nothing here is wired to a backend — it exists purely so screens share
// a consistent, typed data contract.

export type AttendanceStatus = 'present' | 'absent';

export type KnowledgeLevel = 'strong' | 'developing' | 'needs-attention';

export interface AttendanceChange {
  time: string; // e.g. "12:30 PM"
  from: AttendanceStatus;
  to: AttendanceStatus;
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  grade: string;
  groupId: string;
  attendance: AttendanceStatus;
  attendanceNote?: string; // e.g. "Left at 12:30"
  attendanceChanges?: AttendanceChange[];
  currentConcept: string;
  knowledgeLevel: KnowledgeLevel;
  recommendation?: string;
}

export interface Group {
  id: string;
  grade: string; // "Grade 4"
  studentCount: number;
  presentCount: number;
  currentConcept: string;
  currentSubject: string;
  activityMode: 'teacher-led' | 'independent' | 'parallel' | 'assessment';
  minutesRemaining?: number;
}

export type ScheduleMode = 'teacher-led' | 'parallel' | 'independent' | 'assessment';

export interface ScheduleBlock {
  id: string;
  time: string; // "09:00"
  endTime?: string;
  groupId: string;
  grade: string;
  subject: string;
  concept: string;
  mode: ScheduleMode;
}

export interface PriorityStudent {
  rank: number;
  studentId: string;
  name: string;
  reason: string;
  recommendation: string;
}

export interface UpcomingClass {
  groupId: string;
  grade: string;
  subject: string;
  concept: string;
  time: string;
  endTime: string;
  studentsNeedingAttention: number;
  objective: string;
  priorities: PriorityStudent[];
}

export interface ClassroomState {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  activeGroups: number;
  attendanceCompleted: boolean;
}

export type AssessmentStatus = 'upcoming' | 'scheduled' | 'live' | 'completed';

export interface Assessment {
  id: string;
  grade: string;
  subject: string;
  concept: string;
  date: string;
  duration: string;
  status: AssessmentStatus;
  difficulty: 'core' | 'support' | 'challenge';
  prerequisite?: string;
}

export interface AssessmentResult {
  assessmentId: string;
  mastery: number;
  strongCount: number;
  developingCount: number;
  needsAttentionCount: number;
  topStudents: string[];
}

export interface InsightMetric {
  label: string;
  value: string;
  detail: string;
  trend: 'up' | 'down' | 'flat';
}

export interface CurriculumNode {
  id: string;
  subject: string;
  grade: string;
  concept: string;
  prerequisiteIds: string[];
  status: 'mastered' | 'developing' | 'upcoming';
}

export interface KnowledgeTracePoint {
  id: string;
  studentId: string;
  concept: string;
  time: string;
  mastery: number;
  evidence: string;
}
