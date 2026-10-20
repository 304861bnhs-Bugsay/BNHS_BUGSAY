import React, { useState } from 'react';
import { 
  ObservationRecord, 
  Teacher, 
  Quarter 
} from '../types';
import { 
  Search, 
  Plus, 
  Printer, 
  Eye, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

interface ObservationsListProps {
  observations: ObservationRecord[];
  teachers: Teacher[];
  onNewObservation: () => void;
  onViewObservation: (obs: ObservationRecord) => void;
  onEditObservation: (obs: ObservationRecord) => void;
  onDeleteObservation: (id: string) => void;
  onPrintObservation: (obs: ObservationRecord) => void;
}

export const ObservationsList: React.FC<ObservationsListProps> = ({
  observations,
  teachers,
  onNewObservation,
  onViewObservation,
  onEditObservation,
  onDeleteObservation,
  onPrintObservation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('All');

  const quarters: (string | Quarter)[] = ['All', 'Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

  const filteredObservations = observations.filter((obs) => {
    const teacher = teachers.find(t => t.id === obs.teacherId);
    const teacherName = teacher?.fullName || '';
    const matchesSearch = 
      teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.topicLesson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQuarter = selectedQuarter === 'All' || obs.quarter === selectedQuarter;
    const matchesTeacher = selectedTeacherId === 'All' || obs.teacherId === selectedTeacherId;

    return matchesSearch && matchesQuarter && matchesTeacher;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title & Top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Classroom Observation Records (COT-RPMS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official observation rating sheets, post-conference coaching records, and signed evaluations
          </p>
        </div>

        <button
          type="button"
          onClick={onNewObservation}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Conduct Observation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teacher, subject, topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
          />
        </div>

        {/* Quarter Filter Tabs */}
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

        {/* Teacher Select */}
        <div className="w-full sm:w-auto sm:ml-auto">
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="All">All Teachers</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observations Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredObservations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No observation records found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No classroom observations match the current filter criteria. Click "Conduct Observation" to start a new COT evaluation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Teacher Observed</th>
                  <th className="py-3 px-4">Subject &amp; Section</th>
                  <th className="py-3 px-4">Quarter &amp; Type</th>
                  <th className="py-3 px-4 text-right">Score</th>
                  <th className="py-3 px-4">Interpretation</th>
                  <th className="py-3 px-4">Signed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredObservations.map((obs) => {
                  const teacher = teachers.find(t => t.id === obs.teacherId);
                  return (
                    <tr key={obs.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                        {obs.date}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{teacher?.fullName || 'Teacher'}</div>
                        <div className="text-[11px] text-slate-500">{teacher?.cadre}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-medium truncate max-w-xs">{obs.subject} · {obs.gradeAndSection}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{obs.topicLesson}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <div>{obs.quarter} (COT #{obs.observationNumber})</div>
                        <div className="text-[11px] text-slate-400">{obs.observationType}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                        {obs.overallScore > 0 ? obs.overallScore.toFixed(2) : '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-xs font-medium ${
                          obs.overallScore >= 6.0 
                            ? 'text-emerald-700' 
                            : obs.overallScore >= 5.0 
                              ? 'text-blue-700' 
                              : 'text-amber-700'
                        }`}>
                          {obs.verbalInterpretation || 'Draft'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {obs.signedByTeacher && obs.signedByObserver ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Both Signed</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewObservation(obs)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View complete observation details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintObservation(obs)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Print DepEd COT Form"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditObservation(obs)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit observation"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this observation record?')) {
                              onDeleteObservation(obs.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete observation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
