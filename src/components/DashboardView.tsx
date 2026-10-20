import React from 'react';
import { 
  MasterTeacherProfile, 
  Teacher, 
  ObservationRecord, 
  TechnicalAssistanceRecord, 
  SupervisoryScheduleItem 
} from '../types';
import { PPST_INDICATORS } from '../data/mockData';
import { 
  Users, 
  ClipboardCheck, 
  Award, 
  LifeBuoy, 
  Calendar, 
  ArrowRight, 
  Eye, 
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface DashboardViewProps {
  masterTeacher: MasterTeacherProfile;
  teachers: Teacher[];
  observations: ObservationRecord[];
  technicalAssistance: TechnicalAssistanceRecord[];
  schedule: SupervisoryScheduleItem[];
  onNavigateTab: (tab: string) => void;
  onSelectObservationForView: (obs: ObservationRecord) => void;
  onStartObservationWithTeacher?: (teacherId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  masterTeacher,
  teachers,
  observations,
  technicalAssistance,
  schedule,
  onNavigateTab,
  onSelectObservationForView,
  onStartObservationWithTeacher
}) => {
  // Metric calculations
  const totalSupervised = teachers.length;
  const totalCompletedObservations = observations.filter(o => o.status !== 'Draft').length;
  const totalTargetObservations = teachers.reduce((acc, t) => acc + (t.targetObservations || 4), 0);
  const completionPercentage = Math.round((totalCompletedObservations / (totalTargetObservations || 1)) * 100);

  const ratedObservations = observations.filter(o => o.overallScore > 0);
  const averageDeptScore = ratedObservations.length > 0
    ? Number((ratedObservations.reduce((acc, o) => acc + o.overallScore, 0) / ratedObservations.length).toFixed(2))
    : 0;

  const activeTASessions = technicalAssistance.filter(t => t.status === 'In Progress').length;
  const upcomingSchedules = schedule.filter(s => s.status === 'Scheduled').slice(0, 3);

  // Compute Indicator averages across all rated observations
  const indicatorStats = PPST_INDICATORS.map(ind => {
    let sum = 0;
    let count = 0;
    observations.forEach(obs => {
      const ratingItem = obs.ratings.find(r => r.indicatorId === ind.id);
      if (ratingItem && ratingItem.rating !== null && ratingItem.rating > 0) {
        sum += ratingItem.rating;
        count++;
      }
    });
    const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;
    return {
      ...ind,
      average: avg,
      sampleSize: count
    };
  });

  // Find lowest and highest indicator
  const validIndicators = indicatorStats.filter(i => i.sampleSize > 0);
  const sortedIndicators = [...validIndicators].sort((a, b) => b.average - a.average);
  const highestIndicator = sortedIndicators[0];
  const lowestIndicator = sortedIndicators[sortedIndicators.length - 1];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Editorial Hero Feature Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-sm">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_pedagogy_observation_1792479588584.jpg"
            alt="Classroom Observation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
            <span>PPST-Aligned Supervisory Framework</span>
            <span aria-hidden="true">·</span>
            <span>{masterTeacher.schoolName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
            Instructional Supervision &amp; Pedagogical Evaluation
          </h1>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Conduct standardized Classroom Observation Tool (COT-RPMS) evaluations, track pedagogical competencies across the 9 PPST indicators, and provide documented Technical Assistance to empower teaching excellence.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('observations')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Conduct Classroom Observation</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('schedule')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Supervisory Plan ({schedule.filter(s => s.status === 'Scheduled').length} Scheduled)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('reports')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Print Official Rating Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 High-Density Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Teachers Supervised</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalSupervised}
            </span>
            <span className="text-xs text-slate-500 font-sans">
              active mentees
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{teachers.filter(t => t.status === 'Proficient' || t.status === 'Consolidating').length} Proficient / Consolidating</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Classroom Observations</span>
            <ClipboardCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalCompletedObservations}
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              / {totalTargetObservations} Target ({completionPercentage}%)
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-slate-900 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Dept. Average COT Rating</span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {averageDeptScore > 0 ? averageDeptScore.toFixed(2) : '—'}
            </span>
            <span className="text-xs font-medium text-slate-600 font-sans">
              / 7.00
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Benchmark: 5.00 (Proficient)</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-emerald-700">
              {averageDeptScore >= 5.0 ? 'Met Standard' : 'Support Required'}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Technical Assistance (TA)</span>
            <LifeBuoy className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {technicalAssistance.length}
            </span>
            <span className="text-xs text-slate-500 font-sans">
              sessions logged
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-mono tabular-nums font-medium text-amber-600">{activeTASessions}</span>
            <span>ongoing coaching actions</span>
          </div>
        </div>

      </div>

      {/* Main Grid: PPST Indicator Barometer & Priority Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PPST Indicator Barometer (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                PPST 9-Indicator Pedagogical Barometer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated ratings across completed classroom observations (DepEd 7-Point Scale)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-900 rounded-xs" /> Dept Score
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-amber-500" /> 5.0 Target
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {indicatorStats.map((ind) => {
              const pct = (ind.average / 7) * 100;
              const isAboveBenchmark = ind.average >= 5.0;

              return (
                <div key={ind.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[70%]">
                      <span className="font-mono font-semibold text-slate-500 shrink-0">
                        Ind {ind.id}
                      </span>
                      <span className="text-slate-800 font-medium truncate" title={ind.title}>
                        {ind.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold tabular-nums text-slate-900 text-xs">
                        {ind.average > 0 ? ind.average.toFixed(2) : '—'}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                        isAboveBenchmark ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                      }`}>
                        {ind.average >= 6.0 ? 'Consolidating' : ind.average >= 5.0 ? 'Proficient' : 'Developing'}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
                    {/* Target line at 5.0 / 7 = 71.4% */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10" 
                      style={{ left: '71.4%' }} 
                      title="Proficient Target (5.00)" 
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAboveBenchmark ? 'bg-slate-900' : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Coaching Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            {highestIndicator && (
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/80">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Departmental Strength</span>
                </div>
                <p className="text-slate-700">
                  <strong className="font-medium text-slate-900">{highestIndicator.code}: {highestIndicator.title}</strong>{' '}
                  averaging <span className="font-mono font-semibold text-emerald-800">{highestIndicator.average.toFixed(2)}/7.00</span>.
                </p>
              </div>
            )}

            {lowestIndicator && (
              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100/80">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Priority for Technical Assistance (LAC)</span>
                </div>
                <p className="text-slate-700">
                  <strong className="font-medium text-slate-900">{lowestIndicator.code}: {lowestIndicator.title}</strong>{' '}
                  at <span className="font-mono font-semibold text-amber-800">{lowestIndicator.average.toFixed(2)}/7.00</span>. Focus for next LAC session.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Schedule & Action Priorities */}
        <div className="space-y-5">
          
          {/* Supervisory Schedule Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Upcoming Observations
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('schedule')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingSchedules.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No observations currently scheduled.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingSchedules.map((sch) => {
                  const teacher = teachers.find(t => t.id === sch.teacherId);
                  return (
                    <div 
                      key={sch.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-900">
                          {teacher?.fullName || 'Teacher'}
                        </span>
                        <span className="font-mono tabular-nums text-slate-500 text-[11px]">
                          {sch.scheduledDate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        {sch.subject} · {sch.roomSection}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono tabular-nums text-[11px] text-slate-500">
                          {sch.timeSlot}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (onStartObservationWithTeacher) {
                              onStartObservationWithTeacher(sch.teacherId);
                            } else {
                              onNavigateTab('observations');
                            }
                          }}
                          className="text-xs font-semibold text-slate-900 hover:underline"
                        >
                          Start COT →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Technical Assistance Follow-ups */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Coaching Commitments
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('technical-assistance')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
              >
                <span>All TA logs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {technicalAssistance.slice(0, 3).map((ta) => {
                const teacher = teachers.find(t => t.id === ta.teacherId);
                return (
                  <div key={ta.id} className="p-2.5 border border-slate-100 rounded-lg text-xs">
                    <div className="flex items-center justify-between font-medium text-slate-800">
                      <span>{teacher?.fullName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        ta.status === 'Satisfied' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ta.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">
                      {ta.criticalIncident}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>Follow-up: <span className="font-mono tabular-nums text-slate-600">{ta.followUpDate}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Observations Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Conducted Classroom Observations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Formal and walkthrough observation records with finalized post-observation conference notes
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('observations')}
            className="text-xs font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1"
          >
            <span>View All Observation Files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Teacher Observed</th>
                <th className="py-3 px-4">Subject &amp; Section</th>
                <th className="py-3 px-4">Quarter / Round</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4">Verbal Interpretation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.map((obs) => {
                const teacher = teachers.find(t => t.id === obs.teacherId);
                return (
                  <tr key={obs.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                      {obs.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {teacher?.fullName || 'Teacher'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {teacher?.cadre}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium truncate max-w-xs">
                        {obs.subject}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {obs.topicLesson}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {obs.quarter} · COT #{obs.observationNumber}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                      {obs.overallScore > 0 ? obs.overallScore.toFixed(2) : '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-xs font-medium ${
                        obs.overallScore >= 6.0 
                          ? 'text-emerald-700' 
                          : obs.overallScore >= 5.0 
                            ? 'text-blue-700' 
                            : 'text-amber-700'
                      }`}>
                        {obs.verbalInterpretation || 'Evaluating'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-600">
                        {obs.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectObservationForView(obs)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Form</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
