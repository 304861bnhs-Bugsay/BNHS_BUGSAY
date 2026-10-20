import React, { useState } from 'react';
import { 
  Teacher, 
  Cadre, 
  ObservationRecord, 
  TechnicalAssistanceRecord 
} from '../types';
import { 
  Search, 
  Plus, 
  Award, 
  BookOpen, 
  Calendar, 
  LifeBuoy, 
  X, 
  Mail, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface TeacherDirectoryProps {
  teachers: Teacher[];
  observations: ObservationRecord[];
  technicalAssistance: TechnicalAssistanceRecord[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onStartObservationWithTeacher: (teacherId: string) => void;
  onLogTAWithTeacher: (teacherId: string) => void;
  onViewObservation: (obs: ObservationRecord) => void;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  teachers,
  observations,
  technicalAssistance,
  onAddTeacher,
  onUpdateTeacher,
  onStartObservationWithTeacher,
  onLogTAWithTeacher,
  onViewObservation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCadre, setSelectedCadre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedTeacherForDossier, setSelectedTeacherForDossier] = useState<Teacher | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Teacher Form state
  const [newTeacherData, setNewTeacherData] = useState({
    fullName: '',
    employeeId: '',
    cadre: 'Teacher I' as Cadre,
    department: 'Science & Technology' as any,
    gradeLevels: 'Grade 7, Grade 8',
    subjects: 'General Science',
    email: '',
    yearsTeaching: 1,
    targetObservations: 4
  });

  const cadreList = ['All', 'Teacher I', 'Teacher II', 'Teacher III', 'Special Science Teacher I'];
  const statusList = ['All', 'Proficient', 'Consolidating', 'Developing', 'Needs Coaching'];

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = 
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCadre = selectedCadre === 'All' || t.cadre === selectedCadre;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

    return matchesSearch && matchesCadre && matchesStatus;
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Teacher = {
      id: `tch-${Date.now()}`,
      fullName: newTeacherData.fullName,
      employeeId: newTeacherData.employeeId || `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
      cadre: newTeacherData.cadre,
      department: newTeacherData.department,
      gradeLevels: newTeacherData.gradeLevels.split(',').map(s => s.trim()),
      subjects: newTeacherData.subjects.split(',').map(s => s.trim()),
      email: newTeacherData.email || `${newTeacherData.fullName.toLowerCase().replace(/\s+/g, '.')}@deped.gov.ph`,
      yearsTeaching: Number(newTeacherData.yearsTeaching) || 1,
      targetObservations: Number(newTeacherData.targetObservations) || 4,
      completedObservations: 0,
      averageRating: 0,
      status: 'Developing'
    };
    onAddTeacher(created);
    setIsAddModalOpen(false);
    setNewTeacherData({
      fullName: '',
      employeeId: '',
      cadre: 'Teacher I',
      department: 'Science & Technology',
      gradeLevels: 'Grade 7, Grade 8',
      subjects: 'General Science',
      email: '',
      yearsTeaching: 1,
      targetObservations: 4
    });
  };

  // Observations for the selected dossier teacher
  const dossierObservations = selectedTeacherForDossier 
    ? observations.filter(o => o.teacherId === selectedTeacherForDossier.id)
    : [];

  // TA logs for the selected dossier teacher
  const dossierTAs = selectedTeacherForDossier
    ? technicalAssistance.filter(t => t.teacherId === selectedTeacherForDossier.id)
    : [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Faculty Directory &amp; Mentee Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise teacher cadres, monitor annual observation quotas, and track pedagogical growth
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Teacher</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by teacher name, subject, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
            />
          </div>

          {/* Cadre Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {cadreList.map((cadre) => (
              <button
                key={cadre}
                type="button"
                onClick={() => setSelectedCadre(cadre)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCadre === cadre
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cadre}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter by Pedagogical Status */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-medium text-slate-700 shrink-0">Performance Status:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusList.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  selectedStatus === st
                    ? 'font-semibold text-slate-900 underline'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Listing View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => {
            const teacherObs = observations.filter(o => o.teacherId === teacher.id && o.status !== 'Draft');
            const completedCount = teacherObs.length;
            const progressPct = Math.round((completedCount / (teacher.targetObservations || 4)) * 100);

            // Compute current average from real observations if present
            const ratedTeacherObs = teacherObs.filter(o => o.overallScore > 0);
            const liveAvg = ratedTeacherObs.length > 0 
              ? Number((ratedTeacherObs.reduce((sum, o) => sum + o.overallScore, 0) / ratedTeacherObs.length).toFixed(2))
              : teacher.averageRating;

            return (
              <div 
                key={teacher.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Top profile line */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                      {teacher.avatarUrl ? (
                        <img 
                          src={teacher.avatarUrl} 
                          alt={teacher.fullName} 
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <span>{teacher.fullName.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-bold text-slate-900 truncate" title={teacher.fullName}>
                        {teacher.fullName}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span>{teacher.cadre}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-[11px]">{teacher.employeeId}</span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      teacher.status === 'Proficient' || teacher.status === 'Consolidating'
                        ? 'bg-emerald-50 text-emerald-700'
                        : teacher.status === 'Needs Coaching'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {teacher.status}
                    </span>
                  </div>

                  {/* Subjects & Grade levels */}
                  <div className="space-y-1 text-xs">
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.subjects.join(', ')}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] pl-5">
                      {teacher.gradeLevels.join(' · ')} · {teacher.yearsTeaching} yrs in service
                    </div>
                  </div>

                  {/* Observation Quota Progress Bar */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Annual COT Observations:</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900">
                        {completedCount} / {teacher.targetObservations || 4}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-slate-900 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rating Score snippet */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-600">Average COT Rating</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                        {liveAvg > 0 ? liveAvg.toFixed(2) : 'Unrated'}
                      </span>
                      {liveAvg > 0 && <span className="text-[10px] text-slate-500">/ 7.00</span>}
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onStartObservationWithTeacher(teacher.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 py-1"
                  >
                    <span>Observe COT</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLogTAWithTeacher(teacher.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 hover:bg-white rounded transition-colors"
                      title="Log Technical Assistance"
                    >
                      Log TA
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTeacherForDossier(teacher)}
                      className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Tabular View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Teacher Name</th>
                <th className="py-3 px-4">Cadre &amp; Dept</th>
                <th className="py-3 px-4">Assigned Subjects</th>
                <th className="py-3 px-4 text-center">COT Progress</th>
                <th className="py-3 px-4 text-right">Avg Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => {
                const teacherObs = observations.filter(o => o.teacherId === teacher.id && o.status !== 'Draft');
                const completedCount = teacherObs.length;
                return (
                  <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {teacher.employeeId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {teacher.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{teacher.cadre}</div>
                      <div className="text-[11px] text-slate-400">{teacher.department}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {teacher.subjects.join(', ')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-900 font-medium">
                      {completedCount} / {teacher.targetObservations || 4}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      {teacher.averageRating > 0 ? teacher.averageRating.toFixed(2) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium">
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onStartObservationWithTeacher(teacher.id)}
                        className="text-xs font-semibold text-slate-900 hover:underline"
                      >
                        Observe
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTeacherForDossier(teacher)}
                        className="text-xs text-slate-600 hover:text-slate-900"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Teacher Supervisory Dossier Modal / Drawer */}
      {selectedTeacherForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedTeacherForDossier.fullName}
                  </h2>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedTeacherForDossier.cadre}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Employee ID: <span className="font-mono tabular-nums">{selectedTeacherForDossier.employeeId}</span> · {selectedTeacherForDossier.department} · {selectedTeacherForDossier.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeacherForDossier(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">COT Observations</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {dossierObservations.length} / {selectedTeacherForDossier.targetObservations}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Average Rating</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {selectedTeacherForDossier.averageRating > 0 ? selectedTeacherForDossier.averageRating.toFixed(2) : '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">TA Mentorship Logs</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {dossierTAs.length}
                </span>
              </div>
            </div>

            {/* Past Observations Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                  Conducted Classroom Observations (COT)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const tid = selectedTeacherForDossier.id;
                    setSelectedTeacherForDossier(null);
                    onStartObservationWithTeacher(tid);
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  + Conduct New COT
                </button>
              </div>

              {dossierObservations.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-lg">
                  No observation forms completed for this teacher yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {dossierObservations.map((obs) => (
                    <div 
                      key={obs.id}
                      className="p-3 border border-slate-200 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                          <span>{obs.subject}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-slate-500">{obs.quarter}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {obs.topicLesson} · Date: <span className="font-mono tabular-nums">{obs.date}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono tabular-nums text-slate-900 block">
                            {obs.overallScore.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {obs.verbalInterpretation}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacherForDossier(null);
                            onViewObservation(obs);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Assistance History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                  Technical Assistance &amp; Coaching Logs
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const tid = selectedTeacherForDossier.id;
                    setSelectedTeacherForDossier(null);
                    onLogTAWithTeacher(tid);
                  }}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  + Log TA Session
                </button>
              </div>

              {dossierTAs.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-lg">
                  No technical assistance sessions logged for this teacher yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {dossierTAs.map((ta) => (
                    <div key={ta.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span>{ta.objectiveDomain}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-500">{ta.date}</span>
                      </div>
                      <p className="text-slate-700 text-[11px]">
                        <strong>TA Provided:</strong> {ta.technicalAssistanceProvided}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>Status: <strong className="text-slate-800">{ta.status}</strong></span>
                        <span>Follow-up: <span className="font-mono tabular-nums">{ta.followUpDate}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeacherForDossier(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add New Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Add New Faculty Member to Supervisory Roster
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter the teacher's profile and curriculum assignment for monitoring and evaluation.
            </p>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (with Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Clara Santos"
                  value={newTeacherData.fullName}
                  onChange={(e) => setNewTeacherData({ ...newTeacherData, fullName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-64812"
                    value={newTeacherData.employeeId}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, employeeId: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cadre Designation
                  </label>
                  <select
                    value={newTeacherData.cadre}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, cadre: e.target.value as Cadre })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Teacher I">Teacher I</option>
                    <option value="Teacher II">Teacher II</option>
                    <option value="Teacher III">Teacher III</option>
                    <option value="Special Science Teacher I">Special Science Teacher I</option>
                    <option value="Master Teacher I (Mentee)">Master Teacher I (Mentee)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Subjects
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biology, Chemistry"
                    value={newTeacherData.subjects}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, subjects: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grade Levels
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 9, Grade 10"
                    value={newTeacherData.gradeLevels}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, gradeLevels: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years in Service
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={newTeacherData.yearsTeaching}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, yearsTeaching: Number(e.target.value) })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Target COTs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newTeacherData.targetObservations}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, targetObservations: Number(e.target.value) })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
