export type SchoolDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type TimetableSlot = {
  day: SchoolDay;
  grade: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  kind: 'lesson' | 'break';
};

export const schoolDays: SchoolDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const classroomSetup = {
  schoolWeek: 'Monday to Friday',
  periodsPerDay: 4,
  defaultPeriodDuration: '45 minutes',
  breakTime: '10:00 AM to 10:15 AM',
  reminderWindow: '10 minutes before class',
};

export const timetableSlots: TimetableSlot[] = [
  { day: 'Monday', grade: 'Grade 1', subject: 'Mathematics', topic: 'Place Value', startTime: '08:30', endTime: '09:15', durationMinutes: 45, kind: 'lesson' },
  { day: 'Monday', grade: 'Grade 2', subject: 'English', topic: 'Reading Fluency', startTime: '09:15', endTime: '10:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Monday', grade: 'Break', subject: 'Break', topic: 'Morning break', startTime: '10:00', endTime: '10:15', durationMinutes: 15, kind: 'break' },
  { day: 'Monday', grade: 'Grade 3', subject: 'EVS', topic: 'Family and Community', startTime: '10:15', endTime: '11:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Tuesday', grade: 'Grade 4', subject: 'Science', topic: 'Living Systems', startTime: '08:30', endTime: '09:15', durationMinutes: 45, kind: 'lesson' },
  { day: 'Tuesday', grade: 'Grade 1', subject: 'English', topic: 'Phonics', startTime: '09:15', endTime: '10:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Tuesday', grade: 'Break', subject: 'Break', topic: 'Morning break', startTime: '10:00', endTime: '10:15', durationMinutes: 15, kind: 'break' },
  { day: 'Tuesday', grade: 'Grade 2', subject: 'Tamil', topic: 'Writing Basics', startTime: '10:15', endTime: '11:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Wednesday', grade: 'Grade 3', subject: 'Mathematics', topic: 'Fractions', startTime: '08:30', endTime: '09:15', durationMinutes: 45, kind: 'lesson' },
  { day: 'Wednesday', grade: 'Grade 5', subject: 'English', topic: 'Writing Structure', startTime: '09:15', endTime: '10:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Wednesday', grade: 'Break', subject: 'Break', topic: 'Morning break', startTime: '10:00', endTime: '10:15', durationMinutes: 15, kind: 'break' },
  { day: 'Wednesday', grade: 'Grade 4', subject: 'EVS', topic: 'Local Community', startTime: '10:15', endTime: '11:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Thursday', grade: 'Grade 2', subject: 'Mathematics', topic: 'Equivalent Fractions', startTime: '08:30', endTime: '09:15', durationMinutes: 45, kind: 'lesson' },
  { day: 'Thursday', grade: 'Grade 3', subject: 'English', topic: 'Reading Strategies', startTime: '09:15', endTime: '10:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Thursday', grade: 'Break', subject: 'Break', topic: 'Morning break', startTime: '10:00', endTime: '10:15', durationMinutes: 15, kind: 'break' },
  { day: 'Thursday', grade: 'Grade 5', subject: 'Science', topic: 'Human Body', startTime: '10:15', endTime: '11:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Friday', grade: 'Grade 1', subject: 'EVS', topic: 'School and Family Roles', startTime: '08:30', endTime: '09:15', durationMinutes: 45, kind: 'lesson' },
  { day: 'Friday', grade: 'Grade 4', subject: 'Mathematics', topic: 'Geometry', startTime: '09:15', endTime: '10:00', durationMinutes: 45, kind: 'lesson' },
  { day: 'Friday', grade: 'Break', subject: 'Break', topic: 'Morning break', startTime: '10:00', endTime: '10:15', durationMinutes: 15, kind: 'break' },
  { day: 'Friday', grade: 'Grade 2', subject: 'English', topic: 'Sentence Building', startTime: '10:15', endTime: '11:00', durationMinutes: 45, kind: 'lesson' },
];

export const getTimetableSlotsForDay = (day: SchoolDay) => timetableSlots.filter((slot) => slot.day === day);

export const orchestrationTimetableConfig = {
  setup: classroomSetup,
  schoolDays,
  slots: timetableSlots,
};
