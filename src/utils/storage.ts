import { 
  MasterTeacherProfile, 
  Teacher, 
  ObservationRecord, 
  TechnicalAssistanceRecord, 
  SupervisoryScheduleItem 
} from '../types';
import { 
  INITIAL_MASTER_TEACHER, 
  INITIAL_TEACHERS, 
  INITIAL_OBSERVATIONS, 
  INITIAL_TECHNICAL_ASSISTANCE, 
  INITIAL_SCHEDULE 
} from '../data/mockData';

const STORAGE_KEYS = {
  MASTER_TEACHER: 'bnhs_me_master_teacher',
  TEACHERS: 'bnhs_me_teachers',
  OBSERVATIONS: 'bnhs_me_observations',
  TECHNICAL_ASSISTANCE: 'bnhs_me_technical_assistance',
  SCHEDULE: 'bnhs_me_schedule',
};

export const getMasterTeacher = (): MasterTeacherProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTER_TEACHER);
    return raw ? JSON.parse(raw) : INITIAL_MASTER_TEACHER;
  } catch {
    return INITIAL_MASTER_TEACHER;
  }
};

export const saveMasterTeacher = (profile: MasterTeacherProfile): void => {
  localStorage.setItem(STORAGE_KEYS.MASTER_TEACHER, JSON.stringify(profile));
};

export const getTeachers = (): Teacher[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return raw ? JSON.parse(raw) : INITIAL_TEACHERS;
  } catch {
    return INITIAL_TEACHERS;
  }
};

export const saveTeachers = (teachers: Teacher[]): void => {
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
};

export const getObservations = (): ObservationRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
    return raw ? JSON.parse(raw) : INITIAL_OBSERVATIONS;
  } catch {
    return INITIAL_OBSERVATIONS;
  }
};

export const saveObservations = (observations: ObservationRecord[]): void => {
  localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));
};

export const getTechnicalAssistance = (): TechnicalAssistanceRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TECHNICAL_ASSISTANCE);
    return raw ? JSON.parse(raw) : INITIAL_TECHNICAL_ASSISTANCE;
  } catch {
    return INITIAL_TECHNICAL_ASSISTANCE;
  }
};

export const saveTechnicalAssistance = (records: TechnicalAssistanceRecord[]): void => {
  localStorage.setItem(STORAGE_KEYS.TECHNICAL_ASSISTANCE, JSON.stringify(records));
};

export const getSchedule = (): SupervisoryScheduleItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return raw ? JSON.parse(raw) : INITIAL_SCHEDULE;
  } catch {
    return INITIAL_SCHEDULE;
  }
};

export const saveSchedule = (schedule: SupervisoryScheduleItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
};

export const resetAllDataToDefault = (): void => {
  localStorage.setItem(STORAGE_KEYS.MASTER_TEACHER, JSON.stringify(INITIAL_MASTER_TEACHER));
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
  localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(INITIAL_OBSERVATIONS));
  localStorage.setItem(STORAGE_KEYS.TECHNICAL_ASSISTANCE, JSON.stringify(INITIAL_TECHNICAL_ASSISTANCE));
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE));
};

export const exportAllDataAsJSON = (): string => {
  const data = {
    masterTeacher: getMasterTeacher(),
    teachers: getTeachers(),
    observations: getObservations(),
    technicalAssistance: getTechnicalAssistance(),
    schedule: getSchedule(),
    exportedAt: new Date().toISOString(),
    system: 'PedagogyTrack - Master Teacher M&E System'
  };
  return JSON.stringify(data, null, 2);
};

export const importAllDataFromJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.masterTeacher) saveMasterTeacher(parsed.masterTeacher);
    if (Array.isArray(parsed.teachers)) saveTeachers(parsed.teachers);
    if (Array.isArray(parsed.observations)) saveObservations(parsed.observations);
    if (Array.isArray(parsed.technicalAssistance)) saveTechnicalAssistance(parsed.technicalAssistance);
    if (Array.isArray(parsed.schedule)) saveSchedule(parsed.schedule);
    return true;
  } catch (err) {
    console.error('Failed to import backup data:', err);
    return false;
  }
};

export const calculateVerbalInterpretation = (score: number): string => {
  if (score >= 6.5) return 'Distinguished';
  if (score >= 5.5) return 'Consolidating';
  if (score >= 4.5) return 'Proficient';
  if (score >= 3.5) return 'Sufficient';
  return 'Developing';
};
