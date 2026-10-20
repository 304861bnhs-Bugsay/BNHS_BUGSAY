import React, { useState, useEffect } from 'react';
import { 
  MasterTeacherProfile, 
  Teacher, 
  ObservationRecord, 
  ObservationRating,
  Quarter 
} from '../types';
import { PPST_INDICATORS } from '../data/mockData';
import { calculateVerbalInterpretation } from '../utils/storage';
import { 
  ClipboardCheck, 
  Check, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Printer, 
  ArrowLeft,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface ObservationToolProps {
  masterTeacher: MasterTeacherProfile;
  teachers: Teacher[];
  initialTeacherId?: string;
  existingObservation?: ObservationRecord | null;
  onSaveObservation: (record: ObservationRecord) => void;
  onCancel: () => void;
  onPrintPreview: (record: ObservationRecord) => void;
}

export const ObservationTool: React.FC<ObservationToolProps> = ({
  masterTeacher,
  teachers,
  initialTeacherId,
  existingObservation,
  onSaveObservation,
  onCancel,
  onPrintPreview
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [expandedIndicator, setExpandedIndicator] = useState<number | null>(null);

  // Form State
  const [teacherId, setTeacherId] = useState<string>(
    existingObservation?.teacherId || initialTeacherId || (teachers[0]?.id || '')
  );
  const [date, setDate] = useState<string>(
    existingObservation?.date || new Date().toISOString().split('T')[0]
  );
  const [quarter, setQuarter] = useState<Quarter>(
    existingObservation?.quarter || masterTeacher.activeQuarter
  );
  const [observationNumber, setObservationNumber] = useState<number>(
    existingObservation?.observationNumber || 1
  );
  const [subject, setSubject] = useState<string>(
    existingObservation?.subject || 'Science 10'
  );
  const [gradeAndSection, setGradeAndSection] = useState<string>(
    existingObservation?.gradeAndSection || 'Grade 10 - Newton'
  );
  const [topicLesson, setTopicLesson] = useState<string>(
    existingObservation?.topicLesson || ''
  );
  const [observationType, setObservationType] = useState<any>(
    existingObservation?.observationType || 'Formal Announced'
  );

  // Pre-Conference
  const [preConference, setPreConference] = useState({
    learningObjectives: existingObservation?.preConferenceNotes.learningObjectives || '',
    targetCompetencies: existingObservation?.preConferenceNotes.targetCompetencies || '',
    instructionalMaterials: existingObservation?.preConferenceNotes.instructionalMaterials || '',
    specialLearnerContext: existingObservation?.preConferenceNotes.specialLearnerContext || ''
  });

  // Ratings State (Initialize for all 9 indicators)
  const [ratings, setRatings] = useState<ObservationRating[]>(() => {
    if (existingObservation?.ratings && existingObservation.ratings.length > 0) {
      return existingObservation.ratings;
    }
    return PPST_INDICATORS.map(ind => ({
      indicatorId: ind.id,
      rating: 5, // Default proficient
      observerRemarks: ''
    }));
  });

  // Post-Conference
  const [postConference, setPostConference] = useState({
    strengthsCommendations: existingObservation?.postConferenceNotes.strengthsCommendations || '',
    areasForImprovement: existingObservation?.postConferenceNotes.areasForImprovement || '',
    agreedActionPlans: existingObservation?.postConferenceNotes.agreedActionPlans || '',
    technicalAssistanceAgreed: existingObservation?.postConferenceNotes.technicalAssistanceAgreed || ''
  });

  // Signatures
  const [signedByObserver, setSignedByObserver] = useState<boolean>(
    existingObservation?.signedByObserver ?? true
  );
  const [signedByTeacher, setSignedByTeacher] = useState<boolean>(
    existingObservation?.signedByTeacher ?? true
  );

  // When teacherId changes, update suggested subject
  useEffect(() => {
    const selected = teachers.find(t => t.id === teacherId);
    if (selected && !existingObservation) {
      if (selected.subjects.length > 0) {
        setSubject(selected.subjects[0]);
      }
      if (selected.gradeLevels.length > 0) {
        setGradeAndSection(`${selected.gradeLevels[0]} - Section A`);
      }
      setObservationNumber(Math.min((selected.completedObservations || 0) + 1, 4));
    }
  }, [teacherId, teachers, existingObservation]);

  // Compute live score
  const validRatings = ratings.filter(r => r.rating !== null && r.rating > 0);
  const overallScore = validRatings.length > 0
    ? Number((validRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / validRatings.length).toFixed(2))
    : 0;
  const verbalInterpretation = calculateVerbalInterpretation(overallScore);

  const handleRatingChange = (indicatorId: number, score: number | null) => {
    setRatings(prev => prev.map(r => r.indicatorId === indicatorId ? { ...r, rating: score } : r));
  };

  const handleRemarksChange = (indicatorId: number, text: string) => {
    setRatings(prev => prev.map(r => r.indicatorId === indicatorId ? { ...r, observerRemarks: text } : r));
  };

  const insertRemarksTemplate = (indicatorId: number, promptText: string) => {
    setRatings(prev => prev.map(r => {
      if (r.indicatorId === indicatorId) {
        const existing = r.observerRemarks ? `${r.observerRemarks} ` : '';
        return { ...r, observerRemarks: `${existing}${promptText}` };
      }
      return r;
    }));
  };

  const handleSubmit = (finalized: boolean) => {
    const record: ObservationRecord = {
      id: existingObservation?.id || `obs-${Date.now()}`,
      teacherId,
      masterTeacherId: masterTeacher.id,
      date,
      quarter,
      observationNumber,
      subject,
      gradeAndSection,
      topicLesson: topicLesson || 'Curricular Lesson',
      observationType,
      preConferenceNotes: preConference,
      ratings,
      overallScore,
      verbalInterpretation,
      postConferenceNotes: postConference,
      status: finalized ? 'Post-Conference Signed' : 'Draft',
      signedByObserver,
      signedByTeacher,
      signedDate: finalized ? date : undefined
    };

    onSaveObservation(record);
  };

  const currentTeacher = teachers.find(t => t.id === teacherId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Return without saving"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Classroom Observation Tool (COT-RPMS)
            </h1>
            <p className="text-xs text-slate-500">
              Standardized Philippine Professional Standards for Teachers (PPST) Evaluation Sheet
            </p>
          </div>
        </div>

        {/* Live Score Display Badge */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-xs text-slate-500">Live COT Score:</span>
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {overallScore > 0 ? overallScore.toFixed(2) : '—'}
              </span>
              <span className="text-xs text-slate-400">/ 7.00</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {verbalInterpretation}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const dummy: ObservationRecord = {
                id: existingObservation?.id || 'preview',
                teacherId,
                masterTeacherId: masterTeacher.id,
                date,
                quarter,
                observationNumber,
                subject,
                gradeAndSection,
                topicLesson: topicLesson || 'Classroom Lesson',
                observationType,
                preConferenceNotes: preConference,
                ratings,
                overallScore,
                verbalInterpretation,
                postConferenceNotes: postConference,
                status: 'Completed',
                signedByObserver,
                signedByTeacher,
                signedDate: date
              };
              onPrintPreview(dummy);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs"
            title="Preview official printable rating sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Form</span>
          </button>
        </div>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
            activeStep === 1
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Pre-Observation &amp; Class Details
        </button>
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
            activeStep === 2
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. PPST Indicators Evaluation ({validRatings.length}/9 Rated)
        </button>
        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
            activeStep === 3
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Post-Conference Coaching &amp; Sign-off
        </button>
      </div>

      {/* STEP 1: PRE-OBSERVATION & CONTEXT */}
      {activeStep === 1 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Observation Profile &amp; Pre-Conference Notes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify instructional context, target competencies, and pre-observation agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Teacher Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ratee / Teacher Observed *
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.cadre})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Quarter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supervisory Quarter *
              </label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as Quarter)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="Quarter 1">Quarter 1</option>
                <option value="Quarter 2">Quarter 2</option>
                <option value="Quarter 3">Quarter 3</option>
                <option value="Quarter 4">Quarter 4</option>
              </select>
            </div>

            {/* Observation Round */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation Cycle Round
              </label>
              <select
                value={observationNumber}
                onChange={(e) => setObservationNumber(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value={1}>Observation 1 (COT-1)</option>
                <option value={2}>Observation 2 (COT-2)</option>
                <option value={3}>Observation 3 (COT-3)</option>
                <option value={4}>Observation 4 (COT-4)</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Area *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 10 Science - Biology"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Grade & Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grade Level &amp; Section *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grade 10 - Newton"
                value={gradeAndSection}
                onChange={(e) => setGradeAndSection(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Topic / Lesson Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lesson Topic &amp; Unit
            </label>
            <input
              type="text"
              placeholder="e.g. Plate Boundaries and Volcanic Formation in Northern Mindanao"
              value={topicLesson}
              onChange={(e) => setTopicLesson(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Pre-Observation Detailed Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Learning Objectives (DLL / DLP)
              </label>
              <textarea
                rows={3}
                placeholder="State the measurable cognitive, psychomotor, and affective objectives..."
                value={preConference.learningObjectives}
                onChange={(e) => setPreConference({ ...preConference, learningObjectives: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target DepEd MELCs / Curriculum Code
              </label>
              <textarea
                rows={3}
                placeholder="e.g. MELC S10ES-Ia-j-36.2: Compare and contrast oceanic-continental collision..."
                value={preConference.targetCompetencies}
                onChange={(e) => setPreConference({ ...preConference, targetCompetencies: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructional Materials &amp; Media Used
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 3D block models, PhET interactive simulation, laboratory activity sheets..."
                value={preConference.instructionalMaterials}
                onChange={(e) => setPreConference({ ...preConference, instructionalMaterials: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Learner Diversity Considerations &amp; Focus Group
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 4 struggling readers accommodated with diagrammatic prompts, 5 visual-spatial learners..."
                value={preConference.specialLearnerContext}
                onChange={(e) => setPreConference({ ...preConference, specialLearnerContext: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              Continue to PPST Rubric Ratings →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PPST INDICATORS EVALUATION */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                DepEd PPST 9-Indicator Observation Form
              </h2>
              <p className="text-xs text-slate-500">
                Rate observed teacher behaviors on the standard 7-Point scale (3: Developing to 7: Distinguished).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Ratee: <strong>{currentTeacher?.fullName}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs text-slate-600">{subject}</span>
            </div>
          </div>

          {/* Indicator Cards */}
          <div className="space-y-4">
            {PPST_INDICATORS.map((indicator) => {
              const currentRating = ratings.find(r => r.indicatorId === indicator.id);
              const score = currentRating?.rating;
              const isExpanded = expandedIndicator === indicator.id;

              return (
                <div 
                  key={indicator.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {indicator.code}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {indicator.domain}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {indicator.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                          {indicator.description}
                        </p>
                      </div>

                      {/* Rubric descriptor toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
                        className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors border border-slate-200/60"
                      >
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        <span>Rubric Levels</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Expandable Rubric Details */}
                    {isExpanded && (
                      <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 space-y-2 text-xs animate-in fade-in duration-150">
                        <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wide">
                          Behavioral Descriptors by Level:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                          {indicator.rubricLevels.map((lvl) => (
                            <div 
                              key={lvl.level}
                              className={`p-2.5 rounded-lg border text-[11px] ${
                                score === lvl.level 
                                  ? 'bg-slate-900 text-white border-slate-900' 
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              <div className="font-bold flex items-center justify-between mb-1">
                                <span>Level {lvl.level}</span>
                                <span className="opacity-90">{lvl.name}</span>
                              </div>
                              <p className="leading-normal opacity-90">{lvl.descriptor}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating Buttons Group */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-slate-700 mr-2">
                          Rating:
                        </span>

                        {[3, 4, 5, 6, 7].map((lvl) => {
                          const isSelected = score === lvl;
                          const levelName = lvl === 3 ? 'Dev' : lvl === 4 ? 'Suff' : lvl === 5 ? 'Prof' : lvl === 6 ? 'Cons' : 'Dist';

                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleRatingChange(indicator.id, lvl)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-slate-900 text-white shadow-xs scale-102 ring-2 ring-slate-900 ring-offset-1'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-mono tabular-nums">{lvl}</span>
                              <span className="text-[10px] font-normal opacity-85">{levelName}</span>
                            </button>
                          );
                        })}

                        {/* Not Observed (NO) Option */}
                        <button
                          type="button"
                          onClick={() => handleRatingChange(indicator.id, null)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ml-2 ${
                            score === null
                              ? 'bg-amber-100 text-amber-900 font-semibold ring-1 ring-amber-300'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          Not Observed (NO)
                        </button>
                      </div>

                      {/* Selected Level Badge */}
                      <div className="text-xs font-medium text-slate-600">
                        {score !== null && score !== undefined ? (
                          <span>
                            Selected: <strong className="text-slate-900 font-bold">{score}</strong> (
                            {score === 3 ? 'Developing' : score === 4 ? 'Sufficient' : score === 5 ? 'Proficient' : score === 6 ? 'Consolidating' : 'Distinguished'}
                            )
                          </span>
                        ) : (
                          <span className="text-amber-700 italic">Indicator not observed in this session</span>
                        )}
                      </div>
                    </div>

                    {/* Observer Remarks with Evidence Starters */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-slate-700">
                          Observer Evidentiary Remarks &amp; Concrete Classroom Notes:
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertRemarksTemplate(indicator.id, 'Teacher demonstrated clear evidence of ...')}
                            className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline px-1"
                          >
                            + Clear Evidence
                          </button>
                          <span className="text-slate-300">·</span>
                          <button
                            type="button"
                            onClick={() => insertRemarksTemplate(indicator.id, 'Learners actively engaged when ...')}
                            className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline px-1"
                          >
                            + Learner Engagement
                          </button>
                          <span className="text-slate-300">·</span>
                          <button
                            type="button"
                            onClick={() => insertRemarksTemplate(indicator.id, 'Suggested technical assistance: ...')}
                            className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline px-1"
                          >
                            + Mentoring Point
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        placeholder={`Document specific factual observations for ${indicator.code}...`}
                        value={currentRating?.observerRemarks || ''}
                        onChange={(e) => handleRemarksChange(indicator.id, e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
                      />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 2 Bottom Controls */}
          <div className="flex items-center justify-between pt-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Back to Context
            </button>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              Proceed to Post-Conference &amp; Coaching →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: POST-CONFERENCE & COACHING */}
      {activeStep === 3 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Post-Observation Conference &amp; Mentoring Agreement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Discuss findings with the ratee, record commendations, identify development targets, and agree upon concrete technical assistance.
            </p>
          </div>

          {/* Summary Scorecard preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium block">
                Consolidated Observation Result
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                  {overallScore.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  / 7.00 · {verbalInterpretation}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-0.5 sm:text-right">
              <div>Ratee: <strong className="text-slate-900">{currentTeacher?.fullName}</strong></div>
              <div>Observer: <strong className="text-slate-900">{masterTeacher.fullName}</strong></div>
              <div>Date Observed: <span className="font-mono tabular-nums">{date}</span></div>
            </div>
          </div>

          {/* Post-Conference Text Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Commendations &amp; Observed Pedagogical Strengths *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Highlight what the teacher did exceptionally well (e.g. content depth, classroom rapport, high-level inquiry)..."
                value={postConference.strengthsCommendations}
                onChange={(e) => setPostConference({ ...postConference, strengthsCommendations: e.target.value })}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Areas for Pedagogical Improvement / Competency Gaps *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Identify specific indicators or lesson phases requiring refinement (e.g. formative feedback timeliness, differentiated pacing)..."
                value={postConference.areasForImprovement}
                onChange={(e) => setPostConference({ ...postConference, areasForImprovement: e.target.value })}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agreed Action Plans (Teacher’s Commitment)
                </label>
                <textarea
                  rows={3}
                  placeholder="Concrete instructional adjustments the teacher will practice in upcoming classes..."
                  value={postConference.agreedActionPlans}
                  onChange={(e) => setPostConference({ ...postConference, agreedActionPlans: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Assistance to be Provided by Master Teacher
                </label>
                <textarea
                  rows={3}
                  placeholder="Mentorship commitments: co-planning lesson plans, sharing OER materials, demonstration teaching..."
                  value={postConference.technicalAssistanceAgreed}
                  onChange={(e) => setPostConference({ ...postConference, technicalAssistanceAgreed: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Official Signatures Confirmation */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              Official Signatures &amp; Concurrence
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={signedByObserver}
                  onChange={(e) => setSignedByObserver(e.target.checked)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Master Teacher (Observer) Signature</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {masterTeacher.fullName} · {masterTeacher.designation}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={signedByTeacher}
                  onChange={(e) => setSignedByTeacher(e.target.checked)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ratee (Teacher Observed) Concurrence</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {currentTeacher?.fullName} · {currentTeacher?.cadre}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Back to Ratings
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Finalize &amp; Sign Observation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
