export type Cadre = 
  | 'Teacher I' 
  | 'Teacher II' 
  | 'Teacher III' 
  | 'Special Science Teacher I' 
  | 'Master Teacher I (Mentee)';

export type Department = 
  | 'Science & Technology' 
  | 'Mathematics' 
  | 'English' 
  | 'Filipino' 
  | 'Araling Panlipunan' 
  | 'TLE / TVL' 
  | 'MAPEH' 
  | 'Edukasyon sa Pagpapakatao';

export type Quarter = 'Quarter 1' | 'Quarter 2' | 'Quarter 3' | 'Quarter 4';

export interface Teacher {
  id: string;
  fullName: string;
  employeeId: string;
  cadre: Cadre;
  department: Department;
  gradeLevels: string[];
  subjects: string[];
  email: string;
  avatarUrl?: string;
  yearsTeaching: number;
  targetObservations: number;
  completedObservations: number;
  averageRating: number;
  status: 'Proficient' | 'Developing' | 'Consolidating' | 'Needs Coaching';
}

export interface MasterTeacherProfile {
  id: string;
  fullName: string;
  designation: 'Master Teacher I' | 'Master Teacher II';
  schoolName: string;
  schoolId: string;
  division: string;
  region: string;
  department: Department;
  academicYear: string;
  activeQuarter: Quarter;
  avatarUrl?: string;
}

export interface PPSTIndicator {
  id: number;
  code: string;
  domain: string;
  title: string;
  description: string;
  rubricLevels: {
    level: number;
    name: string;
    descriptor: string;
  }[];
}

export interface ObservationRating {
  indicatorId: number;
  rating: number | null; // 3 to 7, or null for Not Observed
  observerRemarks: string;
}

export interface ObservationRecord {
  id: string;
  teacherId: string;
  masterTeacherId: string;
  date: string;
  quarter: Quarter;
  observationNumber: number; // e.g. 1, 2, 3, 4
  subject: string;
  gradeAndSection: string;
  topicLesson: string;
  observationType: 'Formal Announced' | 'Unannounced' | 'Peer Mentoring' | 'Post-Coaching Follow-up';
  preConferenceNotes: {
    learningObjectives: string;
    targetCompetencies: string;
    instructionalMaterials: string;
    specialLearnerContext: string;
  };
  ratings: ObservationRating[];
  overallScore: number;
  verbalInterpretation: string;
  postConferenceNotes: {
    strengthsCommendations: string;
    areasForImprovement: string;
    agreedActionPlans: string;
    technicalAssistanceAgreed: string;
  };
  status: 'Draft' | 'Completed' | 'Post-Conference Signed';
  signedByTeacher: boolean;
  signedByObserver: boolean;
  signedDate?: string;
}

export interface TechnicalAssistanceRecord {
  id: string;
  teacherId: string;
  date: string;
  quarter: Quarter;
  criticalIncident: string;
  objectiveDomain: string;
  technicalAssistanceProvided: string;
  agreedCommitments: string;
  lacRecommendation: string;
  followUpDate: string;
  status: 'In Progress' | 'Satisfied' | 'Follow-up Needed';
}

export interface SupervisoryScheduleItem {
  id: string;
  teacherId: string;
  scheduledDate: string;
  timeSlot: string;
  subject: string;
  roomSection: string;
  quarter: Quarter;
  observationType: 'Formal Announced' | 'Unannounced' | 'Follow-up';
  status: 'Scheduled' | 'Completed' | 'Postponed';
  notes?: string;
}
