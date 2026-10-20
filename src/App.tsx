import React, { useState, useEffect } from 'react';
import { 
  MasterTeacherProfile, 
  Teacher, 
  ObservationRecord, 
  TechnicalAssistanceRecord, 
  SupervisoryScheduleItem 
} from './types';
import { 
  getMasterTeacher, 
  saveMasterTeacher, 
  getTeachers, 
  saveTeachers, 
  getObservations, 
  saveObservations, 
  getTechnicalAssistance, 
  saveTechnicalAssistance, 
  getSchedule, 
  saveSchedule 
} from './utils/storage';

import { TopNavigation } from './components/TopNavigation';
import { MasterTeacherHeader } from './components/MasterTeacherHeader';
import { DashboardView } from './components/DashboardView';
import { TeacherDirectory } from './components/TeacherDirectory';
import { ObservationsList } from './components/ObservationsList';
import { ObservationTool } from './components/ObservationTool';
import { TechnicalAssistanceView } from './components/TechnicalAssistanceView';
import { ScheduleView } from './components/ScheduleView';
import { ReportsAndPrintView } from './components/ReportsAndPrintView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Loaded Data States
  const [masterTeacher, setMasterTeacher] = useState<MasterTeacherProfile>(getMasterTeacher);
  const [teachers, setTeachers] = useState<Teacher[]>(getTeachers);
  const [observations, setObservations] = useState<ObservationRecord[]>(getObservations);
  const [technicalAssistance, setTechnicalAssistance] = useState<TechnicalAssistanceRecord[]>(getTechnicalAssistance);
  const [schedule, setSchedule] = useState<SupervisoryScheduleItem[]>(getSchedule);

  // Active observation editing state
  const [isConductingObservation, setIsConductingObservation] = useState(false);
  const [activeObservationForEdit, setActiveObservationForEdit] = useState<ObservationRecord | null>(null);
  const [targetTeacherForObservation, setTargetTeacherForObservation] = useState<string | undefined>(undefined);
  const [selectedObservationForPrint, setSelectedObservationForPrint] = useState<string | undefined>(undefined);
  const [targetTeacherForTA, setTargetTeacherForTA] = useState<string | undefined>(undefined);

  // Sync to local storage
  const handleUpdateProfile = (updated: MasterTeacherProfile) => {
    setMasterTeacher(updated);
    saveMasterTeacher(updated);
  };

  const handleUpdateTeachers = (updated: Teacher[]) => {
    setTeachers(updated);
    saveTeachers(updated);
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    const updated = [newTeacher, ...teachers];
    handleUpdateTeachers(updated);
  };

  const handleSaveObservation = (obs: ObservationRecord) => {
    const existingIndex = observations.findIndex(o => o.id === obs.id);
    let updatedObservations: ObservationRecord[];

    if (existingIndex >= 0) {
      updatedObservations = [...observations];
      updatedObservations[existingIndex] = obs;
    } else {
      updatedObservations = [obs, ...observations];
    }

    setObservations(updatedObservations);
    saveObservations(updatedObservations);

    // Update teacher's statistics (completed observations count & live average)
    const teacherId = obs.teacherId;
    const teacherObs = updatedObservations.filter(o => o.teacherId === teacherId && o.status !== 'Draft');
    const ratedTeacherObs = teacherObs.filter(o => o.overallScore > 0);
    const newAverage = ratedTeacherObs.length > 0 
      ? Number((ratedTeacherObs.reduce((sum, o) => sum + o.overallScore, 0) / ratedTeacherObs.length).toFixed(2))
      : 0;

    const updatedTeachers = teachers.map(t => {
      if (t.id === teacherId) {
        let newStatus: any = t.status;
        if (newAverage >= 6.0) newStatus = 'Consolidating';
        else if (newAverage >= 5.0) newStatus = 'Proficient';
        else if (newAverage >= 4.0) newStatus = 'Developing';
        else if (newAverage > 0) newStatus = 'Needs Coaching';

        return {
          ...t,
          completedObservations: teacherObs.length,
          averageRating: newAverage,
          status: newStatus
        };
      }
      return t;
    });

    handleUpdateTeachers(updatedTeachers);

    // Update schedule if matching observation exists
    const updatedSchedule = schedule.map(s => {
      if (s.teacherId === teacherId && s.status === 'Scheduled') {
        return { ...s, status: 'Completed' as const };
      }
      return s;
    });
    setSchedule(updatedSchedule);
    saveSchedule(updatedSchedule);

    setIsConductingObservation(false);
    setActiveObservationForEdit(null);
    setTargetTeacherForObservation(undefined);
    setActiveTab('observations');
  };

  const handleDeleteObservation = (id: string) => {
    const updated = observations.filter(o => o.id !== id);
    setObservations(updated);
    saveObservations(updated);
  };

  const handleStartObservation = (teacherId?: string) => {
    setActiveObservationForEdit(null);
    setTargetTeacherForObservation(teacherId);
    setIsConductingObservation(true);
  };

  const handleEditObservation = (obs: ObservationRecord) => {
    setActiveObservationForEdit(obs);
    setTargetTeacherForObservation(obs.teacherId);
    setIsConductingObservation(true);
  };

  const handleViewObservationForm = (obs: ObservationRecord) => {
    setSelectedObservationForPrint(obs.id);
    setIsConductingObservation(false);
    setActiveTab('reports');
  };

  const handleStartTAWithTeacher = (teacherId: string) => {
    setTargetTeacherForTA(teacherId);
    setActiveTab('technical-assistance');
  };

  const handleAddTechnicalAssistance = (record: TechnicalAssistanceRecord) => {
    const updated = [record, ...technicalAssistance];
    setTechnicalAssistance(updated);
    saveTechnicalAssistance(updated);
  };

  const handleUpdateTechnicalAssistance = (record: TechnicalAssistanceRecord) => {
    const updated = technicalAssistance.map(r => r.id === record.id ? record : r);
    setTechnicalAssistance(updated);
    saveTechnicalAssistance(updated);
  };

  const handleDeleteTechnicalAssistance = (id: string) => {
    const updated = technicalAssistance.filter(r => r.id !== id);
    setTechnicalAssistance(updated);
    saveTechnicalAssistance(updated);
  };

  const handleAddScheduleItem = (item: SupervisoryScheduleItem) => {
    const updated = [item, ...schedule];
    setSchedule(updated);
    saveSchedule(updated);
  };

  const handleUpdateScheduleItem = (item: SupervisoryScheduleItem) => {
    const updated = schedule.map(s => s.id === item.id ? item : s);
    setSchedule(updated);
    saveSchedule(updated);
  };

  const handleDeleteScheduleItem = (id: string) => {
    const updated = schedule.filter(s => s.id !== id);
    setSchedule(updated);
    saveSchedule(updated);
  };

  const handleRefreshData = () => {
    setMasterTeacher(getMasterTeacher());
    setTeachers(getTeachers());
    setObservations(getObservations());
    setTechnicalAssistance(getTechnicalAssistance());
    setSchedule(getSchedule());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Strict Top Bar Contract Header */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsConductingObservation(false);
          setActiveTab(tab);
        }}
        onNewObservation={() => handleStartObservation()}
      />

      {/* Institutional Context & Quarter Switcher */}
      <MasterTeacherHeader
        profile={masterTeacher}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isConductingObservation ? (
          <ObservationTool
            masterTeacher={masterTeacher}
            teachers={teachers}
            initialTeacherId={targetTeacherForObservation}
            existingObservation={activeObservationForEdit}
            onSaveObservation={handleSaveObservation}
            onCancel={() => {
              setIsConductingObservation(false);
              setActiveObservationForEdit(null);
            }}
            onPrintPreview={(record) => {
              setSelectedObservationForPrint(record.id);
              setActiveTab('reports');
              setIsConductingObservation(false);
            }}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                masterTeacher={masterTeacher}
                teachers={teachers}
                observations={observations}
                technicalAssistance={technicalAssistance}
                schedule={schedule}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectObservationForView={handleViewObservationForm}
                onStartObservationWithTeacher={handleStartObservation}
              />
            )}

            {activeTab === 'teachers' && (
              <TeacherDirectory
                teachers={teachers}
                observations={observations}
                technicalAssistance={technicalAssistance}
                onAddTeacher={handleAddTeacher}
                onUpdateTeacher={(updated) => {
                  const newT = teachers.map(t => t.id === updated.id ? updated : t);
                  handleUpdateTeachers(newT);
                }}
                onStartObservationWithTeacher={handleStartObservation}
                onLogTAWithTeacher={handleStartTAWithTeacher}
                onViewObservation={handleViewObservationForm}
              />
            )}

            {activeTab === 'observations' && (
              <ObservationsList
                observations={observations}
                teachers={teachers}
                onNewObservation={() => handleStartObservation()}
                onViewObservation={handleViewObservationForm}
                onEditObservation={handleEditObservation}
                onDeleteObservation={handleDeleteObservation}
                onPrintObservation={handleViewObservationForm}
              />
            )}

            {activeTab === 'technical-assistance' && (
              <TechnicalAssistanceView
                records={technicalAssistance}
                teachers={teachers}
                activeQuarter={masterTeacher.activeQuarter}
                onAddRecord={handleAddTechnicalAssistance}
                onUpdateRecord={handleUpdateTechnicalAssistance}
                onDeleteRecord={handleDeleteTechnicalAssistance}
                initialTeacherId={targetTeacherForTA}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                schedule={schedule}
                teachers={teachers}
                activeQuarter={masterTeacher.activeQuarter}
                onAddScheduleItem={handleAddScheduleItem}
                onUpdateScheduleItem={handleUpdateScheduleItem}
                onDeleteScheduleItem={handleDeleteScheduleItem}
                onStartObservationWithTeacher={handleStartObservation}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsAndPrintView
                masterTeacher={masterTeacher}
                teachers={teachers}
                observations={observations}
                technicalAssistance={technicalAssistance}
                selectedObservationId={selectedObservationForPrint}
                onRefreshData={handleRefreshData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">PedagogyTrack</span>
            <span aria-hidden="true">·</span>
            <span>Master Teacher Instructional Supervision &amp; Evaluation Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Aligned with PPST &amp; DepEd RPMS Guidelines</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">School ID: {masterTeacher.schoolId}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
