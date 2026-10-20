import React, { useState, useRef } from 'react';
import { 
  MasterTeacherProfile, 
  Teacher, 
  ObservationRecord, 
  TechnicalAssistanceRecord 
} from '../types';
import { PPST_INDICATORS } from '../data/mockData';
import { 
  exportAllDataAsJSON, 
  importAllDataFromJSON, 
  resetAllDataToDefault 
} from '../utils/storage';
import { 
  Printer, 
  Download, 
  Upload, 
  RotateCcw, 
  FileText, 
  Award, 
  Building2, 
  CheckCircle,
  FileCheck2
} from 'lucide-react';

interface ReportsAndPrintViewProps {
  masterTeacher: MasterTeacherProfile;
  teachers: Teacher[];
  observations: ObservationRecord[];
  technicalAssistance: TechnicalAssistanceRecord[];
  selectedObservationId?: string;
  onRefreshData: () => void;
}

export const ReportsAndPrintView: React.FC<ReportsAndPrintViewProps> = ({
  masterTeacher,
  teachers,
  observations,
  technicalAssistance,
  selectedObservationId,
  onRefreshData
}) => {
  const [activeReportType, setActiveReportType] = useState<'cot' | 'ta-summary' | 'consolidated'>('cot');
  const [currentObsId, setCurrentObsId] = useState<string>(
    selectedObservationId || (observations[0]?.id || '')
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentObservation = observations.find(o => o.id === currentObsId) || observations[0];
  const observedTeacher = currentObservation 
    ? teachers.find(t => t.id === currentObservation.teacherId)
    : null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BNHS_MasterTeacher_ME_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllDataFromJSON(content);
        if (success) {
          alert('M&E backup data successfully restored!');
          onRefreshData();
        } else {
          alert('Failed to parse the backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all observation, teacher, and schedule data to initial demonstration state?')) {
      resetAllDataToDefault();
      onRefreshData();
      alert('System reset to default state.');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Control Toolbar (Hidden during browser print) */}
      <div className="no-print space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Supervisory Reports &amp; Official Print Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generate official DepEd-standard Classroom Observation Rating Sheets and quarterly monitoring reports
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Document (Ctrl+P)</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
              title="Download full JSON database backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleResetData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset to default data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Selection Tabs & Observation Selector */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveReportType('cot')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeReportType === 'cot' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. DepEd COT-RPMS Rating Sheet
            </button>

            <button
              type="button"
              onClick={() => setActiveReportType('consolidated')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeReportType === 'consolidated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Consolidated Department M&amp;E Report
            </button>

            <button
              type="button"
              onClick={() => setActiveReportType('ta-summary')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeReportType === 'ta-summary' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Technical Assistance Accomplishment Log
            </button>
          </div>

          {activeReportType === 'cot' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 whitespace-nowrap">Select Record:</span>
              <select
                value={currentObsId}
                onChange={(e) => setCurrentObsId(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {observations.map((obs) => {
                  const t = teachers.find(tch => tch.id === obs.teacherId);
                  return (
                    <option key={obs.id} value={obs.id}>
                      {t?.fullName} · {obs.subject} ({obs.quarter} - COT #{obs.observationNumber})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE DOCUMENT CANVAS
          Styled in clean high-contrast black/white DepEd standard format
         ========================================================================= */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none text-slate-900 print:text-black">
        
        {/* DOCUMENT 1: OFFICIAL DEPED COT-RPMS RATING SHEET */}
        {activeReportType === 'cot' && currentObservation && (
          <div className="space-y-6">
            
            {/* DepEd Official Header */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-600 font-serif">
                Republic of the Philippines · Department of Education
              </p>
              <p className="text-xs font-semibold text-slate-800">
                {masterTeacher.region} · {masterTeacher.division}
              </p>
              <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase text-slate-950 font-serif">
                {masterTeacher.schoolName}
              </h2>
              <p className="text-[11px] text-slate-600 font-mono">
                DepEd School ID: {masterTeacher.schoolId}
              </p>
              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide bg-slate-100 py-1 border-y border-slate-300">
                  Classroom Observation Tool (COT-RPMS) Rating Sheet
                </h3>
                <p className="text-[11px] text-slate-600 italic">
                  PPST Resource Package for Proficient and Highly Proficient Teachers
                </p>
              </div>
            </div>

            {/* Observation Metadata Box */}
            <div className="border border-slate-900 text-xs">
              <div className="grid grid-cols-2 divide-x divide-slate-900 border-b border-slate-900">
                <div className="p-2 space-y-1">
                  <div><strong>Observer (Master Teacher):</strong> {masterTeacher.fullName}</div>
                  <div><strong>Designation / Cadre:</strong> {masterTeacher.designation}</div>
                  <div><strong>Department:</strong> {masterTeacher.department}</div>
                </div>
                <div className="p-2 space-y-1">
                  <div><strong>Ratee (Teacher Observed):</strong> {observedTeacher?.fullName || 'N/A'}</div>
                  <div><strong>Position / Cadre:</strong> {observedTeacher?.cadre || 'Teacher I'}</div>
                  <div><strong>Employee Number:</strong> <span className="font-mono">{observedTeacher?.employeeId}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-slate-900">
                <div className="p-2">
                  <strong>Date:</strong> <span className="font-mono">{currentObservation.date}</span>
                </div>
                <div className="p-2">
                  <strong>Quarter:</strong> {currentObservation.quarter}
                </div>
                <div className="p-2">
                  <strong>Subject:</strong> {currentObservation.subject}
                </div>
                <div className="p-2">
                  <strong>Grade &amp; Section:</strong> {currentObservation.gradeAndSection}
                </div>
              </div>
            </div>

            {/* Lesson Context */}
            <div className="text-xs p-3 bg-slate-50 border border-slate-200 space-y-1">
              <div>
                <strong>Curricular Lesson / Topic:</strong> {currentObservation.topicLesson}
              </div>
              {currentObservation.preConferenceNotes.targetCompetencies && (
                <div>
                  <strong>Target Competency (MELC):</strong> {currentObservation.preConferenceNotes.targetCompetencies}
                </div>
              )}
            </div>

            {/* Indicators and Ratings Table */}
            <div>
              <table className="w-full text-left border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 text-slate-900">
                    <th className="p-2 border-r border-slate-900 w-16">PPST Code</th>
                    <th className="p-2 border-r border-slate-900">Observed Indicator &amp; Evidentiary Remarks</th>
                    <th className="p-2 text-center w-20 border-r border-slate-900">Rating (3-7)</th>
                    <th className="p-2 text-center w-28">Verbal Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {PPST_INDICATORS.map((ind) => {
                    const r = currentObservation.ratings.find(x => x.indicatorId === ind.id);
                    const score = r?.rating;
                    const levelName = score 
                      ? (score === 3 ? 'Developing' : score === 4 ? 'Sufficient' : score === 5 ? 'Proficient' : score === 6 ? 'Consolidating' : 'Distinguished')
                      : 'NO';

                    return (
                      <tr key={ind.id} className="print-break-inside-avoid">
                        <td className="p-2 font-mono font-bold align-top border-r border-slate-900 text-slate-700">
                          {ind.code}
                        </td>
                        <td className="p-2 align-top border-r border-slate-900 space-y-1">
                          <div className="font-semibold text-slate-900">
                            {ind.title}
                          </div>
                          {r?.observerRemarks ? (
                            <p className="text-[11px] text-slate-700 italic pl-1 border-l-2 border-slate-300">
                              "{r.observerRemarks}"
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 italic">No evidentiary remarks recorded.</p>
                          )}
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-sm align-top border-r border-slate-900">
                          {score !== null && score !== undefined ? score : 'NO'}
                        </td>
                        <td className="p-2 text-center text-[11px] font-medium align-top">
                          {levelName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-900 font-bold text-xs">
                    <td colSpan={2} className="p-2 text-right border-r border-slate-900 uppercase">
                      Classroom Observation Composite Rating:
                    </td>
                    <td className="p-2 text-center font-mono text-base border-r border-slate-900">
                      {currentObservation.overallScore.toFixed(2)}
                    </td>
                    <td className="p-2 text-center uppercase text-xs">
                      {currentObservation.verbalInterpretation}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Post-Observation Conference & Agreements */}
            <div className="border border-slate-900 p-3 space-y-2 text-xs print-break-inside-avoid">
              <h4 className="font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                Post-Observation Conference Notes &amp; Technical Assistance Agreement
              </h4>

              <div>
                <strong>Observer Commendations &amp; Strengths:</strong>
                <p className="text-slate-800 mt-0.5">
                  {currentObservation.postConferenceNotes.strengthsCommendations || 'High competence demonstrated during instructional delivery.'}
                </p>
              </div>

              <div>
                <strong>Areas for Pedagogical Growth:</strong>
                <p className="text-slate-800 mt-0.5">
                  {currentObservation.postConferenceNotes.areasForImprovement || 'Continue reinforcing differentiated activities and student-led inquiry.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <strong>Agreed Teacher Action Plans:</strong>
                  <p className="text-slate-700 mt-0.5">
                    {currentObservation.postConferenceNotes.agreedActionPlans || 'Implement tiered activity cards in daily lesson log.'}
                  </p>
                </div>
                <div>
                  <strong>Technical Assistance to be Provided by Master Teacher:</strong>
                  <p className="text-slate-700 mt-0.5">
                    {currentObservation.postConferenceNotes.technicalAssistanceAgreed || 'Co-plan differentiated rubrics during scheduled LAC session.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Signature Lines */}
            <div className="grid grid-cols-2 gap-8 pt-8 print-break-inside-avoid text-xs">
              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                  {masterTeacher.fullName}
                </div>
                <div className="text-slate-600">{masterTeacher.designation} · Observer</div>
                <div className="text-[11px] text-slate-500 font-mono">Date: {currentObservation.date}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                  {observedTeacher?.fullName}
                </div>
                <div className="text-slate-600">{observedTeacher?.cadre} · Ratee</div>
                <div className="text-[11px] text-slate-500 font-mono">Date: {currentObservation.date}</div>
              </div>
            </div>

          </div>
        )}

        {/* DOCUMENT 2: CONSOLIDATED DEPARTMENT M&E SUMMARY */}
        {activeReportType === 'consolidated' && (
          <div className="space-y-6">
            
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-600 font-serif">
                Republic of the Philippines · Department of Education
              </p>
              <p className="text-xs font-semibold text-slate-800">
                {masterTeacher.region} · {masterTeacher.division}
              </p>
              <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase text-slate-950 font-serif">
                {masterTeacher.schoolName}
              </h2>
              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide bg-slate-100 py-1 border-y border-slate-300">
                  Master Teacher Quarterly Supervisory Monitoring &amp; Evaluation Report
                </h3>
                <p className="text-[11px] text-slate-600">
                  Department of {masterTeacher.department} · {masterTeacher.academicYear} · {masterTeacher.activeQuarter}
                </p>
              </div>
            </div>

            {/* Supervisory Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 border border-slate-900 p-3 text-center text-xs">
              <div>
                <span className="text-slate-500 block">Total Teachers Supervised</span>
                <span className="text-xl font-bold font-mono">{teachers.length}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Classroom Observations Conducted</span>
                <span className="text-xl font-bold font-mono">{observations.length}</span>
              </div>
              <div>
                <span className="text-slate-500 block">TA Mentoring Sessions</span>
                <span className="text-xl font-bold font-mono">{technicalAssistance.length}</span>
              </div>
            </div>

            {/* Faculty Monitoring Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2">
                Faculty Observation &amp; Evaluation Status Matrix:
              </h4>
              <table className="w-full text-left border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 text-slate-900 font-bold">
                    <th className="p-2 border-r border-slate-900">Teacher Name</th>
                    <th className="p-2 border-r border-slate-900">Cadre</th>
                    <th className="p-2 border-r border-slate-900">Curricular Assignment</th>
                    <th className="p-2 text-center border-r border-slate-900">Completed COTs</th>
                    <th className="p-2 text-right border-r border-slate-900">Avg Rating</th>
                    <th className="p-2">Verbal Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {teachers.map((t) => {
                    const tObs = observations.filter(o => o.teacherId === t.id);
                    const avg = tObs.length > 0 
                      ? (tObs.reduce((sum, o) => sum + o.overallScore, 0) / tObs.length).toFixed(2)
                      : '—';

                    return (
                      <tr key={t.id}>
                        <td className="p-2 font-semibold border-r border-slate-900">{t.fullName}</td>
                        <td className="p-2 border-r border-slate-900 text-slate-600">{t.cadre}</td>
                        <td className="p-2 border-r border-slate-900">{t.subjects.join(', ')} ({t.gradeLevels.join(', ')})</td>
                        <td className="p-2 text-center font-mono border-r border-slate-900">{tObs.length} / {t.targetObservations}</td>
                        <td className="p-2 text-right font-mono font-bold border-r border-slate-900">{avg}</td>
                        <td className="p-2">{t.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 print-break-inside-avoid text-xs">
              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                  {masterTeacher.fullName}
                </div>
                <div className="text-slate-600">{masterTeacher.designation} · Instructional Supervisor</div>
              </div>

              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
                  School Principal IV / Head Teacher VI
                </div>
                <div className="text-slate-600">Noted and Approved</div>
              </div>
            </div>

          </div>
        )}

        {/* DOCUMENT 3: TECHNICAL ASSISTANCE SUMMARY */}
        {activeReportType === 'ta-summary' && (
          <div className="space-y-6">
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-600 font-serif">
                Republic of the Philippines · Department of Education
              </p>
              <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase text-slate-950 font-serif">
                {masterTeacher.schoolName}
              </h2>
              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide bg-slate-100 py-1 border-y border-slate-300">
                  Instructional Technical Assistance &amp; Mentoring Accomplishment Log
                </h3>
                <p className="text-[11px] text-slate-600">
                  Consolidated 1-on-1 Clinical Mentoring Reports · {masterTeacher.academicYear}
                </p>
              </div>
            </div>

            <table className="w-full text-left border-collapse border border-slate-900 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 font-bold">
                  <th className="p-2 border-r border-slate-900 w-20">Date</th>
                  <th className="p-2 border-r border-slate-900 w-32">Teacher Mentee</th>
                  <th className="p-2 border-r border-slate-900">Pedagogy Focus / Incident</th>
                  <th className="p-2 border-r border-slate-900">Technical Assistance Provided</th>
                  <th className="p-2 border-r border-slate-900">Agreed Commitments</th>
                  <th className="p-2 w-20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {technicalAssistance.map((ta) => {
                  const teacher = teachers.find(t => t.id === ta.teacherId);
                  return (
                    <tr key={ta.id}>
                      <td className="p-2 font-mono border-r border-slate-900">{ta.date}</td>
                      <td className="p-2 font-semibold border-r border-slate-900">{teacher?.fullName}</td>
                      <td className="p-2 border-r border-slate-900">
                        <div className="font-semibold text-slate-900">{ta.objectiveDomain}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{ta.criticalIncident}</p>
                      </td>
                      <td className="p-2 border-r border-slate-900 text-slate-800">{ta.technicalAssistanceProvided}</td>
                      <td className="p-2 border-r border-slate-900 text-slate-700">{ta.agreedCommitments}</td>
                      <td className="p-2 font-medium">{ta.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pt-8 text-center max-w-xs mx-auto text-xs">
              <div className="border-b border-slate-900 pb-1 font-bold uppercase">
                {masterTeacher.fullName}
              </div>
              <div className="text-slate-600">{masterTeacher.designation} · Instructional Coach</div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
