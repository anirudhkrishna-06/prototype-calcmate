export type Grade = 1 | 2 | 3 | 4 | 5;
export type GradeStatus = 'Planned' | 'In Progress' | 'Completed';

export type AcademicPlanRow = {
  id: number;
  grade: Grade;
  month: string;
  subject: string;
  unit: string;
  plannedTopics: string;
  status: GradeStatus;
};

export const gradeOptions: Grade[] = [1, 2, 3, 4, 5];

export const academicPlans: AcademicPlanRow[] = [
  { id: 1, grade: 1, month: 'June', subject: 'Mathematics', unit: 'Number Sense', plannedTopics: 'Counting, place value, comparisons', status: 'In Progress' },
  { id: 2, grade: 1, month: 'July', subject: 'English', unit: 'Reading Foundations', plannedTopics: 'Phonics, vocabulary, reading fluency', status: 'Planned' },
  { id: 3, grade: 1, month: 'August', subject: 'EVS', unit: 'Family and Community', plannedTopics: 'Relationships, school and family roles', status: 'Planned' },
  { id: 4, grade: 1, month: 'September', subject: 'Tamil', unit: 'Language Foundations', plannedTopics: 'Tamil letters and classroom phrases', status: 'Completed' },
  { id: 5, grade: 2, month: 'June', subject: 'Mathematics', unit: 'Number Operations', plannedTopics: 'Addition, subtraction, patterns', status: 'In Progress' },
  { id: 6, grade: 2, month: 'July', subject: 'Science', unit: 'Plants and Animals', plannedTopics: 'Living systems and observation', status: 'In Progress' },
  { id: 7, grade: 2, month: 'August', subject: 'English', unit: 'Reading Skills', plannedTopics: 'Comprehension and sentence building', status: 'Planned' },
  { id: 8, grade: 2, month: 'September', subject: 'Tamil', unit: 'Writing Basics', plannedTopics: 'Vocabulary and simple narration', status: 'Planned' },
  { id: 9, grade: 3, month: 'June', subject: 'Mathematics', unit: 'Fractions', plannedTopics: 'Fraction concepts and comparison', status: 'Completed' },
  { id: 10, grade: 3, month: 'July', subject: 'Science', unit: 'Energy', plannedTopics: 'Light, sound and basic forces', status: 'In Progress' },
  { id: 11, grade: 3, month: 'August', subject: 'English', unit: 'Reading Fluency', plannedTopics: 'Text reading and storytelling', status: 'In Progress' },
  { id: 12, grade: 3, month: 'September', subject: 'Social Science', unit: 'Local Community', plannedTopics: 'Places, people and institutions', status: 'Planned' },
  { id: 13, grade: 4, month: 'June', subject: 'Mathematics', unit: 'Geometry', plannedTopics: 'Angles, lines and shapes', status: 'In Progress' },
  { id: 14, grade: 4, month: 'July', subject: 'Science', unit: 'Matter', plannedTopics: 'States of matter and changes', status: 'Planned' },
  { id: 15, grade: 4, month: 'August', subject: 'Social Science', unit: 'Civics', plannedTopics: 'Rights, duties and public roles', status: 'Planned' },
  { id: 16, grade: 4, month: 'September', subject: 'English', unit: 'Writing', plannedTopics: 'Narratives and informational writing', status: 'In Progress' },
  { id: 17, grade: 5, month: 'June', subject: 'Mathematics', unit: 'Data Analysis', plannedTopics: 'Graphs, tables and statistics', status: 'In Progress' },
  { id: 18, grade: 5, month: 'July', subject: 'Science', unit: 'Human Body', plannedTopics: 'Nutrition and organ systems', status: 'Planned' },
  { id: 19, grade: 5, month: 'August', subject: 'English', unit: 'Writing and Grammar', plannedTopics: 'Paragraphs and edit skills', status: 'In Progress' },
  { id: 20, grade: 5, month: 'September', subject: 'Social Science', unit: 'History', plannedTopics: 'Local history and timelines', status: 'Planned' },
];

export const academicYearMonths = [
  'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'
];
