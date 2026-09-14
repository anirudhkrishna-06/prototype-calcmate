export type Grade = 1 | 2 | 3 | 4 | 5;
export type RiskLevel = 'Low' | 'Medium' | 'High';

export type AssessmentScore = {
  Mathematics: number;
  English: number;
  Science: number;
};

export type AssessmentHistoryRow = {
  subject: string;
  score: number;
  topic: string;
  date: string;
};

export type StudentProfile = {
  id: number;
  grade: Grade;
  name: string;
  rollNumber: number;
  attendance: number;
  readiness: number;
  rank: string;
  riskLevel: RiskLevel;
  scores: {
    Mathematics: number;
    English: number;
    Science: number;
  };
  weakConcepts: string[];
  strengthAreas: string[];
  assessmentHistory: AssessmentHistoryRow[];
  aiInsight: string;
};

export const gradeOptions = [1, 2, 3, 4, 5] as Grade[];

export const students: StudentProfile[] = [
  { id: 1, grade: 1, name: 'Arjun Kumar', rollNumber: 1, attendance: 96, readiness: 88, rank: 'Rank 1', riskLevel: 'Low', scores: { Mathematics: 86, English: 89, Science: 84 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 86, topic: 'Number Sense', date: 'Sep 08' },
    { subject: 'English', score: 89, topic: 'Reading Fluency', date: 'Sep 06' },
    { subject: 'Science', score: 84, topic: 'Plants & Animals', date: 'Sep 11' }
  ], aiInsight: 'Arjun is progressing steadily across foundational numeracy and literacy. Continue strengthening science observation skills.' },
  { id: 2, grade: 1, name: 'Harini S', rollNumber: 2, attendance: 94, readiness: 86, rank: 'Rank 2', riskLevel: 'Low', scores: { Mathematics: 84, English: 91, Science: 82 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 84, topic: 'Number Sense', date: 'Sep 08' },
    { subject: 'English', score: 91, topic: 'Reading Fluency', date: 'Sep 07' },
    { subject: 'Science', score: 82, topic: 'Plants & Animals', date: 'Sep 12' }
  ], aiInsight: 'Harini shows strength in reading fluency and oral classroom discussion. Maintain concept check for measurement practice.' },
  { id: 3, grade: 1, name: 'Pranav Raj', rollNumber: 3, attendance: 91, readiness: 80, rank: 'Rank 3', riskLevel: 'Medium', scores: { Mathematics: 78, English: 86, Science: 76 }, weakConcepts: ['Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 78, topic: 'Number Sense', date: 'Sep 08' },
    { subject: 'English', score: 86, topic: 'Reading Fluency', date: 'Sep 09' },
    { subject: 'Science', score: 76, topic: 'Animals', date: 'Sep 13' }
  ], aiInsight: 'Pranav benefits from short guided word problem routines. Focus on comprehension before solving.' },
  { id: 4, grade: 1, name: 'Diya Lakshmi', rollNumber: 4, attendance: 93, readiness: 82, rank: 'Rank 4', riskLevel: 'Low', scores: { Mathematics: 80, English: 88, Science: 78 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 80, topic: 'Number Sense', date: 'Sep 08' },
    { subject: 'English', score: 88, topic: 'Reading Fluency', date: 'Sep 10' },
    { subject: 'Science', score: 78, topic: 'Plants', date: 'Sep 12' }
  ], aiInsight: 'Diya has strong reading confidence and should be given more opportunities to explain number patterns aloud.' },
  { id: 5, grade: 1, name: 'Kavin M', rollNumber: 5, attendance: 90, readiness: 78, rank: 'Rank 5', riskLevel: 'Medium', scores: { Mathematics: 73, English: 80, Science: 75 }, weakConcepts: ['Measurement', 'Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 73, topic: 'Measurement', date: 'Sep 09' },
    { subject: 'English', score: 80, topic: 'Reading Fluency', date: 'Sep 11' },
    { subject: 'Science', score: 75, topic: 'Plants & Animals', date: 'Sep 14' }
  ], aiInsight: 'Kavin needs more scaffolded practice with measurement vocabulary and step-by-step word problems.' },
  { id: 6, grade: 1, name: 'Nithya Devi', rollNumber: 6, attendance: 95, readiness: 85, rank: 'Rank 6', riskLevel: 'Low', scores: { Mathematics: 85, English: 87, Science: 80 }, weakConcepts: ['Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 85, topic: 'Number Sense', date: 'Sep 08' },
    { subject: 'English', score: 87, topic: 'Reading Fluency', date: 'Sep 10' },
    { subject: 'Science', score: 80, topic: 'Plants', date: 'Sep 11' }
  ], aiInsight: 'Nithya shows strong consistency in class tasks. Add targeted practice for solving verbal mathematics scenarios.' },
  { id: 7, grade: 2, name: 'Surya Prakash', rollNumber: 1, attendance: 92, readiness: 84, rank: 'Rank 1', riskLevel: 'Low', scores: { Mathematics: 82, English: 90, Science: 83 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 82, topic: 'Addition & Patterns', date: 'Sep 06' },
    { subject: 'English', score: 90, topic: 'Reading Comprehension', date: 'Sep 09' },
    { subject: 'Science', score: 83, topic: 'Living Things', date: 'Sep 15' }
  ], aiInsight: 'Surya performs strongly in comprehension. Add visual fraction comparison practice.' },
  { id: 8, grade: 2, name: 'Akshaya R', rollNumber: 2, attendance: 95, readiness: 87, rank: 'Rank 2', riskLevel: 'Low', scores: { Mathematics: 86, English: 92, Science: 85 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 86, topic: 'Patterns', date: 'Sep 07' },
    { subject: 'English', score: 92, topic: 'Reading Comprehension', date: 'Sep 11' },
    { subject: 'Science', score: 85, topic: 'Living Things', date: 'Sep 10' }
  ], aiInsight: 'Akshaya has excellent reading fluency. Continue supporting fraction vocabulary via visual examples.' },
  { id: 9, grade: 2, name: 'Vignesh K', rollNumber: 3, attendance: 89, readiness: 76, rank: 'Rank 3', riskLevel: 'High', scores: { Mathematics: 72, English: 79, Science: 74 }, weakConcepts: ['Fractions', 'Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 72, topic: 'Fractions', date: 'Sep 08' },
    { subject: 'English', score: 79, topic: 'Reading Comprehension', date: 'Sep 09' },
    { subject: 'Science', score: 74, topic: 'Plants', date: 'Sep 12' }
  ], aiInsight: 'Vignesh needs a small intervention group for fractions and transition from word problems to equations.' },
  { id: 10, grade: 2, name: 'Keerthana S', rollNumber: 4, attendance: 94, readiness: 83, rank: 'Rank 4', riskLevel: 'Low', scores: { Mathematics: 84, English: 88, Science: 81 }, weakConcepts: ['Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 84, topic: 'Addition', date: 'Sep 06' },
    { subject: 'English', score: 88, topic: 'Reading Comprehension', date: 'Sep 09' },
    { subject: 'Science', score: 81, topic: 'Living Things', date: 'Sep 10' }
  ], aiInsight: 'Keerthana is ready for more independent problem solving. Encourage sentence explainers for word problems.' },
  { id: 11, grade: 2, name: 'Rithvik Kumar', rollNumber: 5, attendance: 90, readiness: 75, rank: 'Rank 5', riskLevel: 'Medium', scores: { Mathematics: 71, English: 80, Science: 73 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 71, topic: 'Measurement', date: 'Sep 09' },
    { subject: 'English', score: 80, topic: 'Reading', date: 'Sep 12' },
    { subject: 'Science', score: 73, topic: 'Living Things', date: 'Sep 14' }
  ], aiInsight: 'Rithvik should receive a reading-to-math transfer task and a reinforcement schedule for measurement.' },
  { id: 12, grade: 2, name: 'Ananya Devi', rollNumber: 6, attendance: 96, readiness: 89, rank: 'Rank 6', riskLevel: 'Low', scores: { Mathematics: 88, English: 94, Science: 87 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 88, topic: 'Patterns', date: 'Sep 06' },
    { subject: 'English', score: 94, topic: 'Reading', date: 'Sep 11' },
    { subject: 'Science', score: 87, topic: 'Living Things', date: 'Sep 14' }
  ], aiInsight: 'Ananya is a confident learner with high readiness. Plan enrichment around higher-order science reasoning.' },
  { id: 13, grade: 3, name: 'Dhanush M', rollNumber: 1, attendance: 92, readiness: 84, rank: 'Rank 1', riskLevel: 'Low', scores: { Mathematics: 88, English: 86, Science: 84 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 88, topic: 'Multiplication', date: 'Sep 10' },
    { subject: 'English', score: 86, topic: 'Reading Fluency', date: 'Sep 08' },
    { subject: 'Science', score: 84, topic: 'Energy', date: 'Sep 12' }
  ], aiInsight: 'Dhanush is consistent in mathematics practice. Continue building scientific vocabulary through observation logs.' },
  { id: 14, grade: 3, name: 'Harshitha R', rollNumber: 2, attendance: 95, readiness: 88, rank: 'Rank 2', riskLevel: 'Low', scores: { Mathematics: 90, English: 93, Science: 89 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 90, topic: 'Multiplication', date: 'Sep 10' },
    { subject: 'English', score: 93, topic: 'Reading Fluency', date: 'Sep 09' },
    { subject: 'Science', score: 89, topic: 'Energy', date: 'Sep 12' }
  ], aiInsight: 'Harshitha demonstrates high reading confidence and should be guided toward analytical science expression.' },
  { id: 15, grade: 3, name: 'Lokesh Kumar', rollNumber: 3, attendance: 90, readiness: 77, rank: 'Rank 3', riskLevel: 'Medium', scores: { Mathematics: 76, English: 78, Science: 79 }, weakConcepts: ['Word Problems', 'Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 76, topic: 'Multiplication', date: 'Sep 10' },
    { subject: 'English', score: 78, topic: 'Reading Comprehension', date: 'Sep 11' },
    { subject: 'Science', score: 79, topic: 'Energy', date: 'Sep 12' }
  ], aiInsight: 'Lokesh responds to structured problem frames. Pair word problems with visual modeling and teacher-led steps.' },
  { id: 16, grade: 3, name: 'Pooja Devi', rollNumber: 4, attendance: 94, readiness: 82, rank: 'Rank 4', riskLevel: 'Low', scores: { Mathematics: 81, English: 87, Science: 86 }, weakConcepts: ['Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 81, topic: 'Division', date: 'Sep 08' },
    { subject: 'English', score: 87, topic: 'Reading Fluency', date: 'Sep 06' },
    { subject: 'Science', score: 86, topic: 'Energy', date: 'Sep 10' }
  ], aiInsight: 'Pooja has strong classroom communication. Recommend weekly reasoning journal for mathematics writing.' },
  { id: 17, grade: 3, name: 'Sanjay K', rollNumber: 5, attendance: 88, readiness: 73, rank: 'Rank 5', riskLevel: 'High', scores: { Mathematics: 70, English: 74, Science: 72 }, weakConcepts: ['Measurement', 'Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 70, topic: 'Division', date: 'Sep 08' },
    { subject: 'English', score: 74, topic: 'Reading Comprehension', date: 'Sep 09' },
    { subject: 'Science', score: 72, topic: 'Energy', date: 'Sep 13' }
  ], aiInsight: 'Sanjay needs a high-priority intervention focus on measurement and related vocabulary.' },
  { id: 18, grade: 3, name: 'Nivetha M', rollNumber: 6, attendance: 93, readiness: 81, rank: 'Rank 6', riskLevel: 'Low', scores: { Mathematics: 83, English: 84, Science: 82 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 83, topic: 'Division', date: 'Sep 09' },
    { subject: 'English', score: 84, topic: 'Reading Comprehension', date: 'Sep 10' },
    { subject: 'Science', score: 82, topic: 'Energy', date: 'Sep 13' }
  ], aiInsight: 'Nivetha is progressing well in science and reading; add fraction vocabulary reinforcement.' },
  { id: 19, grade: 4, name: 'Bharath Kumar', rollNumber: 1, attendance: 90, readiness: 80, rank: 'Rank 1', riskLevel: 'Low', scores: { Mathematics: 85, English: 84, Science: 83 }, weakConcepts: ['Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 85, topic: 'Geometry', date: 'Sep 08' },
    { subject: 'English', score: 84, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 83, topic: 'Matter', date: 'Sep 11' }
  ], aiInsight: 'Bharath shows a strong mathematical routine. Recommend more advanced reasoning for geometry tasks.' },
  { id: 20, grade: 4, name: 'Janani S', rollNumber: 2, attendance: 95, readiness: 86, rank: 'Rank 2', riskLevel: 'Low', scores: { Mathematics: 89, English: 90, Science: 87 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 89, topic: 'Geometry', date: 'Sep 08' },
    { subject: 'English', score: 90, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 87, topic: 'Matter', date: 'Sep 11' }
  ], aiInsight: 'Janani demonstrates strong reading and mathematics readiness. She can lead peer concept explanation.' },
  { id: 21, grade: 4, name: 'Karthik R', rollNumber: 3, attendance: 87, readiness: 74, rank: 'Rank 3', riskLevel: 'Medium', scores: { Mathematics: 78, English: 76, Science: 75 }, weakConcepts: ['Measurement', 'Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 78, topic: 'Geometry', date: 'Sep 08' },
    { subject: 'English', score: 76, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 75, topic: 'Matter', date: 'Sep 11' }
  ], aiInsight: 'Karthik benefits from domain vocabulary and structured classroom problem-solving routines.' },
  { id: 22, grade: 4, name: 'Monisha Devi', rollNumber: 4, attendance: 89, readiness: 79, rank: 'Rank 4', riskLevel: 'Medium', scores: { Mathematics: 80, English: 79, Science: 81 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 80, topic: 'Fractions', date: 'Sep 09' },
    { subject: 'English', score: 79, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 81, topic: 'Matter', date: 'Sep 11' }
  ], aiInsight: 'Monisha is progressing; support fraction comparison with concrete examples and number lines.' },
  { id: 23, grade: 4, name: 'Naveen Kumar', rollNumber: 5, attendance: 92, readiness: 84, rank: 'Rank 5', riskLevel: 'Low', scores: { Mathematics: 84, English: 82, Science: 83 }, weakConcepts: ['Measurement'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 84, topic: 'Geometry', date: 'Sep 08' },
    { subject: 'English', score: 82, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 83, topic: 'Matter', date: 'Sep 11' }
  ], aiInsight: 'Naveen has a steady performance profile. Use measurement anchor charts for topic transfer.' },
  { id: 24, grade: 4, name: 'Priyadharshini', rollNumber: 6, attendance: 91, readiness: 78, rank: 'Rank 6', riskLevel: 'Medium', scores: { Mathematics: 75, English: 82, Science: 77 }, weakConcepts: ['Fractions', 'Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 75, topic: 'Fractions', date: 'Sep 09' },
    { subject: 'English', score: 82, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 77, topic: 'Matter', date: 'Sep 11' }
  ], aiInsight: 'Priyadharshini would benefit from a paired reading and problem-solving intervention for fraction word contexts.' },
  { id: 25, grade: 5, name: 'Vishal Kumar', rollNumber: 1, attendance: 94, readiness: 90, rank: 'Rank 1', riskLevel: 'Low', scores: { Mathematics: 91, English: 90, Science: 88 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 91, topic: 'Data Analysis', date: 'Sep 07' },
    { subject: 'English', score: 90, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 88, topic: 'Human Body', date: 'Sep 12' }
  ], aiInsight: 'Vishal is a high-performing learner. Provide enrichment in data reasoning and explanation quality.' },
  { id: 26, grade: 5, name: 'Swetha R', rollNumber: 2, attendance: 96, readiness: 91, rank: 'Rank 2', riskLevel: 'Low', scores: { Mathematics: 92, English: 94, Science: 90 }, weakConcepts: ['Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 92, topic: 'Data Analysis', date: 'Sep 08' },
    { subject: 'English', score: 94, topic: 'Writing', date: 'Sep 12' },
    { subject: 'Science', score: 90, topic: 'Human Body', date: 'Sep 10' }
  ], aiInsight: 'Swetha is ready for more complex assessment tasks. Continue extending writing precision.' },
  { id: 27, grade: 5, name: 'Rahul Prakash', rollNumber: 3, attendance: 89, readiness: 76, rank: 'Rank 3', riskLevel: 'Medium', scores: { Mathematics: 77, English: 80, Science: 75 }, weakConcepts: ['Word Problems', 'Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 77, topic: 'Data Analysis', date: 'Sep 08' },
    { subject: 'English', score: 80, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 75, topic: 'Human Body', date: 'Sep 11' }
  ], aiInsight: 'Rahul responds best when tasks are broken into question sequencing. Keep practice tied to concept maps.' },
  { id: 28, grade: 5, name: 'Dharshini S', rollNumber: 4, attendance: 91, readiness: 82, rank: 'Rank 4', riskLevel: 'Low', scores: { Mathematics: 84, English: 88, Science: 86 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 84, topic: 'Decimals', date: 'Sep 09' },
    { subject: 'English', score: 88, topic: 'Writing', date: 'Sep 11' },
    { subject: 'Science', score: 86, topic: 'Human Body', date: 'Sep 12' }
  ], aiInsight: 'Dharshini shows strong reading and science confidence. Use denominator comparisons with visual aids.' },
  { id: 29, grade: 5, name: 'Ajay Kumar', rollNumber: 5, attendance: 86, readiness: 73, rank: 'Rank 5', riskLevel: 'High', scores: { Mathematics: 72, English: 74, Science: 73 }, weakConcepts: ['Measurement', 'Word Problems'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 72, topic: 'Decimals', date: 'Sep 08' },
    { subject: 'English', score: 74, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 73, topic: 'Human Body', date: 'Sep 11' }
  ], aiInsight: 'Ajay needs a structured remedial loop for word problems and measurement units.' },
  { id: 30, grade: 5, name: 'Deepika Devi', rollNumber: 6, attendance: 93, readiness: 81, rank: 'Rank 6', riskLevel: 'Low', scores: { Mathematics: 83, English: 89, Science: 85 }, weakConcepts: ['Fractions'], strengthAreas: ['Number Sense', 'Reading Fluency', 'Pattern Recognition'], assessmentHistory: [
    { subject: 'Mathematics', score: 83, topic: 'Decimals', date: 'Sep 09' },
    { subject: 'English', score: 89, topic: 'Writing', date: 'Sep 10' },
    { subject: 'Science', score: 85, topic: 'Human Body', date: 'Sep 11' }
  ], aiInsight: 'Deepika has consistent achievement. Use enrichment tasks that combine fractions and scientific reasoning.' },
];

export const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

export const getStudentById = (studentId: number | string) => {
  const id = Number(studentId);
  return students.find((student) => student.id === id) ?? students[0];
};
