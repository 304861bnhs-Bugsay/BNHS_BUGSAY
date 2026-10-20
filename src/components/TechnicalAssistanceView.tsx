import React, { useState } from 'react';
import { 
  TechnicalAssistanceRecord, 
  Teacher, 
  Quarter 
} from '../types';
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Trash2, 
  Edit2, 
  Sparkles,
  Users
} from 'lucide-react';

interface TechnicalAssistanceViewProps {
  records: TechnicalAssistanceRecord[];
  teachers: Teacher[];
  activeQuarter: Quarter;
  onAddRecord: (record: TechnicalAssistanceRecord) => void;
  onUpdateRecord: (record: TechnicalAssistanceRecord) => void;
  onDeleteRecord: (id: string) => void;
  initialTeacherId?: string;
}

export const TechnicalAssistanceView: React.FC<TechnicalAssistanceViewProps> = ({
  records,
  teachers,
  activeQuarter,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  initialTeacherId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TechnicalAssistanceRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    teacherId: initialTeacherId || (teachers[0]?.id || ''),
    date: new Date().toISOString().split('T')[0],
    quarter: activeQuarter,
    objectiveDomain: 'PPST 1.5.2: Developing Critical Thinking and HOTS',
    criticalIncident: '',
    technicalAssistanceProvided: '',
    agreedCommitments: '',
    lacRecommendation: 'School-Based LAC on HOTS Questioning & Inquiry',
    followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'In Progress' as 'In Progress' | 'Satisfied' | 'Follow-up Needed'
  });

  const quarters: (string | Quarter)[] = ['All', 'Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

  const filteredRecords = records.filter((r) => {
    const teacher = teachers.find(t => t.id === r.teacherId);
    const teacherName = teacher?.fullName || '';
    const matchesSearch = 
      teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.objectiveDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.criticalIncident.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQuarter = selectedQuarter === 'All' || r.quarter === selectedQuarter;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;

    return matchesSearch && matchesQuarter && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormData({
      teacherId: initialTeacherId || (teachers[0]?.id || ''),
      date: new Date().toISOString().split('T')[0],
      quarter: activeQuarter,
      objectiveDomain: 'PPST 1.5.2: Developing Critical Thinking and HOTS',
      criticalIncident: '',
      technicalAssistanceProvided: '',
      agreedCommitments: '',
      lacRecommendation: 'School-Based LAC on HOTS Questioning & Inquiry',
      followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'In Progress'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rec: TechnicalAssistanceRecord) => {
    setEditingRecord(rec);
    setFormData({
      teacherId: rec.teacherId,
      date: rec.date,
      quarter: rec.quarter,
      objectiveDomain: rec.objectiveDomain,
      criticalIncident: rec.criticalIncident,
      technicalAssistanceProvided: rec.technicalAssistanceProvided,
      agreedCommitments: rec.agreedCommitments,
      lacRecommendation: rec.lacRecommendation,
      followUpDate: rec.followUpDate,
      status: rec.status
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      onUpdateRecord({
        ...editingRecord,
        ...formData
      });
    } else {
      const newRec: TechnicalAssistanceRecord = {
        id: `ta-${Date.now()}`,
        ...formData
      };
      onAddRecord(newRec);
    }
    setIsModalOpen(false);
  };

  // Extract LAC topics for the Department Planner
  const lacTopics = Array.from(new Set(records.map(r => r.lacRecommendation).filter(Boolean)));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Technical Assistance &amp; Instructional Coaching Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Document 1-on-1 pedagogical mentorship, clinical supervision, and agreed instructional adjustments
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Technical Assistance</span>
        </button>
      </div>

      {/* Top High-Density Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total TA Sessions</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {records.length}
            </span>
          </div>
          <LifeBuoy className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">In Progress Commitments</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {records.filter(r => r.status === 'In Progress').length}
            </span>
          </div>
          <Clock className="w-5 h-5 text-amber-500" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Satisfied / Closed</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {records.filter(r => r.status === 'Satisfied').length}
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teacher, PPST domain, or incident..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {quarters.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedQuarter === q
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:ml-auto">
          {['All', 'In Progress', 'Satisfied', 'Follow-up Needed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-2 py-1 text-[11px] rounded transition-colors ${
                selectedStatus === st
                  ? 'font-semibold text-slate-900 underline'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TA Cards Grid */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 space-y-2">
            <LifeBuoy className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No Technical Assistance logs recorded</p>
            <p className="text-xs text-slate-400">
              Document your coaching interventions and follow-up support for supervised teachers.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const teacher = teachers.find(t => t.id === rec.teacherId);
            return (
              <div 
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3 hover:border-slate-300 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {teacher?.fullName || 'Teacher'}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({teacher?.cadre})
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {rec.quarter}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">
                      {rec.objectiveDomain}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      rec.status === 'Satisfied'
                        ? 'bg-emerald-50 text-emerald-700'
                        : rec.status === 'Follow-up Needed'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}>
                      {rec.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(rec)}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors"
                      title="Edit Log"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this technical assistance record?')) {
                          onDeleteRecord(rec.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Critical Incident & TA Provided split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-700 block">
                      Critical Incident / Pedagogical Need:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {rec.criticalIncident}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100/70 space-y-1">
                    <span className="font-semibold text-blue-900 block">
                      Technical Assistance Provided by Master Teacher:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {rec.technicalAssistanceProvided}
                    </p>
                  </div>
                </div>

                {/* Agreed Commitments & Dates */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                  <div>
                    <strong>Agreed Commitment:</strong> {rec.agreedCommitments}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-slate-500 font-mono tabular-nums text-[11px]">
                    <span>Logged: {rec.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-800">Follow-up: {rec.followUpDate}</span>
                  </div>
                </div>

                {/* Recommended LAC Topic if present */}
                {rec.lacRecommendation && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Recommended for School LAC Session: <strong className="text-slate-700">{rec.lacRecommendation}</strong></span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* School LAC Department Agenda Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">
            Identified Learning Action Cell (LAC) Topics for Department Meetings
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Topics derived directly from common pedagogical challenges documented across 1-on-1 teacher coaching sessions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {lacTopics.map((topic, idx) => (
            <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs text-slate-800 font-medium">
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Log TA Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingRecord ? 'Edit Technical Assistance Log' : 'Log Technical Assistance & Coaching Session'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Record 1-on-1 pedagogical interventions, clinical mentoring, and teacher agreements.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mentee / Teacher *
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.cadre})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Session *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quarter
                  </label>
                  <select
                    value={formData.quarter}
                    onChange={(e) => setFormData({ ...formData, quarter: e.target.value as Quarter })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Quarter 1">Quarter 1</option>
                    <option value="Quarter 2">Quarter 2</option>
                    <option value="Quarter 3">Quarter 3</option>
                    <option value="Quarter 4">Quarter 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Intervention Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Satisfied">Satisfied / Resolved</option>
                    <option value="Follow-up Needed">Follow-up Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PPST Objective / Competency Focus *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PPST 1.5.2: Higher Order Thinking Skills Questioning & Rubrics"
                  value={formData.objectiveDomain}
                  onChange={(e) => setFormData({ ...formData, objectiveDomain: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Critical Incident / Pedagogical Challenge *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the classroom challenge or teacher request (e.g. difficulty engaging students in HOTS analysis during lab)..."
                  value={formData.criticalIncident}
                  onChange={(e) => setFormData({ ...formData, criticalIncident: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Assistance Provided by Master Teacher *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the coaching actions: modeling questioning frameworks, co-designing lesson plan, reviewing assessment rubric..."
                  value={formData.technicalAssistanceProvided}
                  onChange={(e) => setFormData({ ...formData, technicalAssistanceProvided: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agreed Teacher Action &amp; Commitments
                </label>
                <textarea
                  rows={2}
                  placeholder="What the teacher will implement in class before the next follow-up check..."
                  value={formData.agreedCommitments}
                  onChange={(e) => setFormData({ ...formData, agreedCommitments: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recommended LAC Topic
                  </label>
                  <input
                    type="text"
                    value={formData.lacRecommendation}
                    onChange={(e) => setFormData({ ...formData, lacRecommendation: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  {editingRecord ? 'Update Log' : 'Save TA Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
