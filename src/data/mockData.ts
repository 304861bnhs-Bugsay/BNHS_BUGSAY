import { 
  MasterTeacherProfile, 
  Teacher, 
  PPSTIndicator, 
  ObservationRecord, 
  TechnicalAssistanceRecord, 
  SupervisoryScheduleItem 
} from '../types';

export const PPST_INDICATORS: PPSTIndicator[] = [
  {
    id: 1,
    code: 'PPST 1.1.2',
    domain: 'Domain 1: Content Knowledge and Pedagogy',
    title: 'Content Knowledge within & across Curriculum',
    description: 'Apply knowledge of content within and across curriculum teaching areas.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Demonstrates basic content knowledge with occasional minor inaccuracies or isolated concepts.' },
      { level: 4, name: 'Sufficient', descriptor: 'Demonstrates accurate, coherent understanding of content and links lesson to prior knowledge.' },
      { level: 5, name: 'Proficient', descriptor: 'Demonstrates in-depth subject mastery, accurately explains complex principles, and seamlessly integrates interdisciplinary linkages.' },
      { level: 6, name: 'Consolidating', descriptor: 'Exhibits extensive content mastery; guides learners to discover interdisciplinary relationships independently.' },
      { level: 7, name: 'Distinguished', descriptor: 'Models exemplary pedagogical content knowledge, anticipating learner misconceptions and fostering real-world application synthesis.' }
    ]
  },
  {
    id: 2,
    code: 'PPST 1.4.2',
    domain: 'Domain 1: Content Knowledge and Pedagogy',
    title: 'Literacy and Numeracy Teaching Strategies',
    description: 'Use a range of teaching strategies that enhance learner achievement in literacy and numeracy skills.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Employs limited strategies with minimal explicit literacy or numeracy reinforcement.' },
      { level: 4, name: 'Sufficient', descriptor: 'Provides opportunities for reading comprehension, vocabulary, and basic quantitative interpretation.' },
      { level: 5, name: 'Proficient', descriptor: 'Skillfully weaves academic vocabulary, data visualization, and computational reasoning into the lesson context.' },
      { level: 6, name: 'Consolidating', descriptor: 'Empowers learners to formulate, analyze, and communicate complex textual and mathematical arguments.' },
      { level: 7, name: 'Distinguished', descriptor: 'Pioneers innovative, contextualized cross-cutting literacy and numeracy scaffolds across diverse learner abilities.' }
    ]
  },
  {
    id: 3,
    code: 'PPST 1.5.2',
    domain: 'Domain 1: Content Knowledge and Pedagogy',
    title: 'Critical, Creative Thinking & Higher-Order Thinking Skills (HOTS)',
    description: 'Apply a range of teaching strategies to develop critical and creative thinking, as well as other higher-order thinking skills.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Relies predominantly on lower-order recall questions (who, what, when) with scarce inquiry.' },
      { level: 4, name: 'Sufficient', descriptor: 'Poses conceptual and comparative questions prompting analytical thinking.' },
      { level: 5, name: 'Proficient', descriptor: 'Prompts learners with HOTS questions (evaluation, synthesis, problem-solving) and allows sufficient wait time.' },
      { level: 6, name: 'Consolidating', descriptor: 'Facilitates student-led inquiry, socratic debates, and authentic scenario investigations.' },
      { level: 7, name: 'Distinguished', descriptor: 'Challs learners to design original prototypes, evaluate conflicting scientific/historical claims, and justify solutions.' }
    ]
  },
  {
    id: 4,
    code: 'PPST 2.3.2',
    domain: 'Domain 2: Learning Environment',
    title: 'Classroom Structure & Learner Engagement',
    description: 'Manage classroom structure to engage learners, individually or in groups, in meaningful exploration, discovery and hands-on activities.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Classroom organization causes minor downtime or fragmented group transitions.' },
      { level: 4, name: 'Sufficient', descriptor: 'Organizes physical/virtual space and resources adequately for collaborative tasks.' },
      { level: 5, name: 'Proficient', descriptor: 'Maintains purposeful learning pace; collaborative routines are seamless and every learner is actively assigned a role.' },
      { level: 6, name: 'Consolidating', descriptor: 'Optimizes instructional time; learners independently self-manage collaborative roles and materials.' },
      { level: 7, name: 'Distinguished', descriptor: 'Fosters an inspiring studio/laboratory environment characterized by total learner agency, safety, and flow.' }
    ]
  },
  {
    id: 5,
    code: 'PPST 2.6.2',
    domain: 'Domain 2: Learning Environment',
    title: 'Positive Discipline & Constructive Behavior',
    description: 'Manage learner behavior constructively by applying positive and non-violent discipline to ensure learning-focused environments.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Corrects misbehavior reactively with occasional disruption to instructional continuity.' },
      { level: 4, name: 'Sufficient', descriptor: 'Establishes clear behavioral norms and applies respectful verbal reminders consistently.' },
      { level: 5, name: 'Proficient', descriptor: 'Proactively redirects off-task behavior with positive reinforcement, praising constructive peer interactions.' },
      { level: 6, name: 'Consolidating', descriptor: 'Nurtures a culture of mutual respect where learners hold each other accountable constructively.' },
      { level: 7, name: 'Distinguished', descriptor: 'Models unconditional empathy and restorative discipline; zero instructional time lost to management.' }
    ]
  },
  {
    id: 6,
    code: 'PPST 3.1.2',
    domain: 'Domain 3: Diversity of Learners',
    title: 'Differentiated Learning Experiences',
    description: 'Use differentiated, developmentally appropriate learning experiences to address learners’ gender, needs, strengths, interests and experiences.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Delivers uniform instruction with uniform pacing regardless of varying learner aptitudes.' },
      { level: 4, name: 'Sufficient', descriptor: 'Offers tiered activity options or varied modalities (visual, auditory, kinesthetic).' },
      { level: 5, name: 'Proficient', descriptor: 'Tailors content, process, or product specifically to diagnosed learning profiles, ensuring equitable challenge.' },
      { level: 6, name: 'Consolidating', descriptor: 'Empowers students to choose pathways aligned with personal interests and cognitive readiness.' },
      { level: 7, name: 'Distinguished', descriptor: 'Seamlessly orchestrates individualized mastery pathways, assistive accommodations, and peer mentorship.' }
    ]
  },
  {
    id: 7,
    code: 'PPST 4.1.2',
    domain: 'Domain 4: Curriculum and Planning',
    title: 'Developmentally Sequenced Lesson Design',
    description: 'Plan, manage and implement developmentally sequenced teaching and learning process to meet curriculum requirements.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Lesson phases feel loosely connected or rush through synthesis.' },
      { level: 4, name: 'Sufficient', descriptor: 'Follows standard 4As / 7Es sequence from priming to formative assessment.' },
      { level: 5, name: 'Proficient', descriptor: 'Flawlessly executes scaffolded progression from foundational schema to complex problem synthesis.' },
      { level: 6, name: 'Consolidating', descriptor: 'Dynamically adapts pacing based on real-time formative check-ins without sacrificing rigor.' },
      { level: 7, name: 'Distinguished', descriptor: 'Curates deeply cohesive learning journeys that spark intrinsic curiosity and lifelong retention.' }
    ]
  },
  {
    id: 8,
    code: 'PPST 4.5.2',
    domain: 'Domain 4: Curriculum and Planning',
    title: 'Teaching Resources & ICT Integration',
    description: 'Select, develop, organize and use appropriate teaching and learning resources, including ICT, to address learning goals.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Uses basic textbook or static slides with minor technical hesitation.' },
      { level: 4, name: 'Sufficient', descriptor: 'Integrates interactive slides, tangible manipulatives, or video clips aligned with objectives.' },
      { level: 5, name: 'Proficient', descriptor: 'Effectively leverages digital simulations, multimedia, or localized realia that accelerate conceptual comprehension.' },
      { level: 6, name: 'Consolidating', descriptor: 'Engages learners directly with interactive technology tools (e.g. digital graphing, lab sensors, polling).' },
      { level: 7, name: 'Distinguished', descriptor: 'Deploys cutting-edge digital pedagogy and custom-authored open educational resources (OERs).' }
    ]
  },
  {
    id: 9,
    code: 'PPST 5.1.2',
    domain: 'Domain 5: Assessment and Reporting',
    title: 'Diagnostic, Formative & Summative Assessment',
    description: 'Design, select, organize and use diagnostic, formative and summative assessment strategies consistent with curriculum requirements.',
    rubricLevels: [
      { level: 3, name: 'Developing', descriptor: 'Conducts only an end-of-lesson multiple-choice quiz with minimal actionable feedback.' },
      { level: 4, name: 'Sufficient', descriptor: 'Embeds formative check-ins (thumbs up/down, exit tickets) to gauge general understanding.' },
      { level: 5, name: 'Proficient', descriptor: 'Utilizes diagnostic baseline data and diverse formative checks (rubrics, peer review) with prompt descriptive feedback.' },
      { level: 6, name: 'Consolidating', descriptor: 'Guides learners in self-assessment against explicit criteria and self-regulated remediation.' },
      { level: 7, name: 'Distinguished', descriptor: 'Employs data-informed adaptive assessments that immediately reshape instructional trajectory.' }
    ]
  }
];

export const INITIAL_MASTER_TEACHER: MasterTeacherProfile = {
  id: 'mt-001',
  fullName: 'Dr. Maria Elena Santos, EdD',
  designation: 'Master Teacher II',
  schoolName: 'Balingasag National High School',
  schoolId: '304861',
  division: 'Division of Misamis Oriental',
  region: 'Region X (Northern Mindanao)',
  department: 'Science & Technology',
  academicYear: 'SY 2026-2027',
  activeQuarter: 'Quarter 2',
  avatarUrl: '/src/assets/images/portrait_master_teacher_1792479588494.jpg'
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-101',
    fullName: 'Clara Mendoza-Reyes',
    employeeId: 'EMP-60291',
    cadre: 'Teacher III',
    department: 'Science & Technology',
    gradeLevels: ['Grade 10', 'Grade 9'],
    subjects: ['Earth and Space Science', 'Biology'],
    email: 'clara.reyes@deped.gov.ph',
    avatarUrl: '/src/assets/images/portrait_teacher_observed_1792479589434.jpg',
    yearsTeaching: 7,
    targetObservations: 4,
    completedObservations: 2,
    averageRating: 5.78,
    status: 'Proficient'
  },
  {
    id: 'tch-102',
    fullName: 'Mark Kenneth Del Rosario',
    employeeId: 'EMP-61104',
    cadre: 'Teacher I',
    department: 'Science & Technology',
    gradeLevels: ['Grade 7', 'Grade 8'],
    subjects: ['General Science', 'Integrated Chemistry'],
    email: 'mark.delrosario@deped.gov.ph',
    yearsTeaching: 2,
    targetObservations: 4,
    completedObservations: 2,
    averageRating: 4.89,
    status: 'Needs Coaching'
  },
  {
    id: 'tch-103',
    fullName: 'Rowena Patricia Bautista',
    employeeId: 'EMP-59441',
    cadre: 'Teacher II',
    department: 'Science & Technology',
    gradeLevels: ['Grade 9'],
    subjects: ['Chemistry', 'Environmental Science'],
    email: 'rowena.bautista@deped.gov.ph',
    yearsTeaching: 4,
    targetObservations: 4,
    completedObservations: 1,
    averageRating: 5.22,
    status: 'Proficient'
  },
  {
    id: 'tch-104',
    fullName: 'Anthony James Villanueva',
    employeeId: 'EMP-62380',
    cadre: 'Special Science Teacher I',
    department: 'Science & Technology',
    gradeLevels: ['Grade 10', 'Grade 12 SHS'],
    subjects: ['Physics', 'General Physics 1'],
    email: 'anthony.villanueva@deped.gov.ph',
    yearsTeaching: 5,
    targetObservations: 4,
    completedObservations: 3,
    averageRating: 6.33,
    status: 'Consolidating'
  },
  {
    id: 'tch-105',
    fullName: 'Gemma Marie Alcantara',
    employeeId: 'EMP-63012',
    cadre: 'Teacher I',
    department: 'Science & Technology',
    gradeLevels: ['Grade 8'],
    subjects: ['Living Things & Environment', 'General Science'],
    email: 'gemma.alcantara@deped.gov.ph',
    yearsTeaching: 1,
    targetObservations: 4,
    completedObservations: 1,
    averageRating: 4.44,
    status: 'Developing'
  },
  {
    id: 'tch-106',
    fullName: 'Eduardo Carlos Tan',
    employeeId: 'EMP-58902',
    cadre: 'Teacher III',
    department: 'Science & Technology',
    gradeLevels: ['Grade 10'],
    subjects: ['Advanced Biology', 'Biotechnology Elective'],
    email: 'eduardo.tan@deped.gov.ph',
    yearsTeaching: 9,
    targetObservations: 4,
    completedObservations: 2,
    averageRating: 6.11,
    status: 'Consolidating'
  }
];

export const INITIAL_OBSERVATIONS: ObservationRecord[] = [
  {
    id: 'obs-2026-001',
    teacherId: 'tch-101',
    masterTeacherId: 'mt-001',
    date: '2026-09-14',
    quarter: 'Quarter 1',
    observationNumber: 1,
    subject: 'Grade 10 Earth & Space Science',
    gradeAndSection: 'Grade 10 - Newton',
    topicLesson: 'Plate Tectonics: Convergent Plate Boundaries and Geological Formations',
    observationType: 'Formal Announced',
    preConferenceNotes: {
      learningObjectives: 'Explain the processes that occur along convergent boundaries (oceanic-continental collision) and identify resulting features (volcanic arc, trench).',
      targetCompetencies: 'MELC S10ES-Ia-j-36.2: Compare and contrast oceanic-continental, oceanic-oceanic, and continental-continental collisions.',
      instructionalMaterials: '3D foam tectonic block models, GeoMap interactive simulation, student lab worksheet, rubric.',
      specialLearnerContext: 'Section Newton has 5 visual-spatial learners requiring tactile modeling and 3 students needing reading assistance with geology terminology.'
    },
    ratings: [
      { indicatorId: 1, rating: 6, observerRemarks: 'Exemplary mastery of plate mechanics; linked tectonic subduction seamlessly to local Philippine Trench and volcanic arcs in Northern Mindanao.' },
      { indicatorId: 2, rating: 6, observerRemarks: 'Effectively engaged students with geological terminology breakdown (subduction, trench, asthenosphere) and calculation of subduction rates.' },
      { indicatorId: 3, rating: 6, observerRemarks: 'High-level open inquiry; asked learners "Why does Northern Mindanao have active geothermal springs while adjacent provinces do not?"' },
      { indicatorId: 4, rating: 6, observerRemarks: 'Classroom workstations were meticulously labeled; students transitioned into 5 collaborative modeling stations within 30 seconds.' },
      { indicatorId: 5, rating: 6, observerRemarks: 'Warm, positive reinforcement; validated divergent student hypotheses during the modeling phase.' },
      { indicatorId: 6, rating: 5, observerRemarks: 'Tiered worksheets provided appropriate scaffolding, though extension questions for rapid finishers could be expanded further.' },
      { indicatorId: 7, rating: 6, observerRemarks: 'Exemplary 7E sequencing from eliciting prior knowledge of earthquake epicenters to tectonic collision synthesis.' },
      { indicatorId: 8, rating: 6, observerRemarks: 'Integrated digital simulation on the interactive screen alongside hands-on foam models.' },
      { indicatorId: 9, rating: 5, observerRemarks: 'Utilized rapid whiteboard check-ins and structured peer evaluation of geological cross-section models.' }
    ],
    overallScore: 5.78,
    verbalInterpretation: 'Consolidating',
    postConferenceNotes: {
      strengthsCommendations: 'Teacher Clara exhibited outstanding subject mastery and seamless integration of local geographical context. The inquiry questioning provoked deep analytical thought among all student groups.',
      areasForImprovement: 'Provide higher-tier extension tasks or peer-tutoring leadership roles for the fast-finishing groups in Newton section.',
      agreedActionPlans: 'Incorporate tiered challenge cards in upcoming lessons and share the tectonic modeling lesson plan during the Science Department LAC session.',
      technicalAssistanceAgreed: 'Master Teacher to co-develop differentiated extension rubrics for Grade 10 Earth Science.'
    },
    status: 'Post-Conference Signed',
    signedByTeacher: true,
    signedByObserver: true,
    signedDate: '2026-09-15'
  },
  {
    id: 'obs-2026-002',
    teacherId: 'tch-102',
    masterTeacherId: 'mt-001',
    date: '2026-10-05',
    quarter: 'Quarter 1',
    observationNumber: 1,
    subject: 'Grade 7 General Science',
    gradeAndSection: 'Grade 7 - Diamond',
    topicLesson: 'Elements and Compounds: Investigating Household Substances',
    observationType: 'Formal Announced',
    preConferenceNotes: {
      learningObjectives: 'Classify substances into elements and compounds based on chemical formula and behavioral properties.',
      targetCompetencies: 'MELC S7MT-Ig-h-5: Recognize that substances are classified into elements and compounds.',
      instructionalMaterials: 'Specimen bottles (Sugar, Salt, Water, Baking Soda, Iron filings, Copper wire), Classification flowcharts.',
      specialLearnerContext: 'Grade 7 students transitioning from modular elementary background; require substantial laboratory safety reminders.'
    },
    ratings: [
      { indicatorId: 1, rating: 5, observerRemarks: 'Accurate distinction between pure substances and mixtures; good blackboard conceptual map.' },
      { indicatorId: 2, rating: 5, observerRemarks: 'Explicit vocabulary drill on Latin symbols (Fe, Cu, Na) and compound chemical formulas.' },
      { indicatorId: 3, rating: 4, observerRemarks: 'Questioning was predominantly focused on identification. Recommend shifting toward evaluative questions like "Why cannot water be separated by filtration like salt water?"' },
      { indicatorId: 4, rating: 5, observerRemarks: 'Group organization was satisfactory; safety protocols were strictly reinforced.' },
      { indicatorId: 5, rating: 5, observerRemarks: 'Calm and encouraging demeanor with young learners.' },
      { indicatorId: 6, rating: 4, observerRemarks: 'Instruction was uniform across all groups; struggled students required more visual clues.' },
      { indicatorId: 7, rating: 5, observerRemarks: 'Followed lesson structure according to daily lesson log (DLL).' },
      { indicatorId: 8, rating: 5, observerRemarks: 'Real household chemicals made the concepts tangible and grounded.' },
      { indicatorId: 9, rating: 4, observerRemarks: 'Assessment was restricted to a 5-item paper quiz at the end; formative checkpoint during group exploration was missed.' }
    ],
    overallScore: 4.67,
    verbalInterpretation: 'Sufficient',
    postConferenceNotes: {
      strengthsCommendations: 'Teacher Mark demonstrated great rapport with Grade 7 learners and managed chemical specimen safety with high diligence.',
      areasForImprovement: 'Needs strengthening in formative assessment techniques during active laboratory work and crafting HOTS questions rather than simple recall.',
      agreedActionPlans: 'Apply "Traffic Light" formative self-assessment disks during lab activities and attend clinical mentoring session on Bloom’s Revised Taxonomy.',
      technicalAssistanceAgreed: 'Master Teacher Dr. Santos to conduct a 1-on-1 coaching session on Designing HOTS Assessment Items for Grade 7 Science.'
    },
    status: 'Post-Conference Signed',
    signedByTeacher: true,
    signedByObserver: true,
    signedDate: '2026-10-06'
  },
  {
    id: 'obs-2026-003',
    teacherId: 'tch-104',
    masterTeacherId: 'mt-001',
    date: '2026-10-12',
    quarter: 'Quarter 1',
    observationNumber: 1,
    subject: 'Grade 10 Physics',
    gradeAndSection: 'Grade 10 - Einstein',
    topicLesson: 'Electromagnetism: Applications of Electric Motors and Generators',
    observationType: 'Formal Announced',
    preConferenceNotes: {
      learningObjectives: 'Demonstrate how a magnetic field exerts a force on a current-carrying wire (Motor Effect) and assemble a mini homopolar motor.',
      targetCompetencies: 'MELC S10FE-IIg-52: Explain the operation of a simple electric motor and generator.',
      instructionalMaterials: 'Neodymium magnets, AA batteries, copper wire coils, paper clips, digital oscilloscopes simulation.',
      specialLearnerContext: 'Science curriculum class with high aptitude; fast paced.'
    },
    ratings: [
      { indicatorId: 1, rating: 7, observerRemarks: 'Distinguished content mastery; explained Lorentz force and Fleming’s Left-Hand rule with superb mathematical and spatial clarity.' },
      { indicatorId: 2, rating: 6, observerRemarks: 'Integrated mathematical calculations of magnetic flux density alongside qualitative reasoning.' },
      { indicatorId: 3, rating: 7, observerRemarks: 'Prompted students to troubleshoot why their individual wire coils failed to rotate; sparked authentic engineering problem-solving.' },
      { indicatorId: 4, rating: 6, observerRemarks: 'Exceptional classroom laboratory management; zero clutter and highly focused group discourse.' },
      { indicatorId: 5, rating: 6, observerRemarks: 'Treated students as young researchers; cultivated deep intellectual curiosity.' },
      { indicatorId: 6, rating: 6, observerRemarks: 'Provided advanced design options (varying coil geometry) for students who mastered the basic homopolar motor early.' },
      { indicatorId: 7, rating: 7, observerRemarks: 'Flawless inquiry-based pedagogical flow from phenomenon observation to mathematical formulation.' },
      { indicatorId: 8, rating: 6, observerRemarks: 'Blended physical motors with real-time digital current measurement.' },
      { indicatorId: 9, rating: 6, observerRemarks: 'Continuous assessment through observation checklist and peer circuit debugging notes.' }
    ],
    overallScore: 6.33,
    verbalInterpretation: 'Consolidating',
    postConferenceNotes: {
      strengthsCommendations: 'Teacher Anthony demonstrated exemplary STEM pedagogy. His hands-on motor troubleshooting protocol serves as a model benchmark for the entire division.',
      areasForImprovement: 'Encourage students to document their experimental failure-to-success iterations in a formal engineering logbook.',
      agreedActionPlans: 'Conduct a demonstration teaching session during the Division Science Fair and author a video-documented instructional guide for other teachers.',
      technicalAssistanceAgreed: 'Master Teacher will mentor Teacher Anthony in preparing his demonstration teaching portfolio for Master Teacher candidacy.'
    },
    status: 'Post-Conference Signed',
    signedByTeacher: true,
    signedByObserver: true,
    signedDate: '2026-10-13'
  }
];

export const INITIAL_TECHNICAL_ASSISTANCE: TechnicalAssistanceRecord[] = [
  {
    id: 'ta-001',
    teacherId: 'tch-102',
    date: '2026-10-08',
    quarter: 'Quarter 1',
    objectiveDomain: 'PPST 1.5.2 & 5.1.2: Formative Assessment and HOTS Questioning',
    criticalIncident: 'Teacher Mark noted that during Grade 7 Chemistry laboratory work, students completed tasks superficially without understanding the underlying particle concepts.',
    technicalAssistanceProvided: 'Coached Teacher Mark on constructing scaffolded "Why & How" questioning stems. Provided templates for Formative Exit Slips and 3-Tiered Diagnostic Checkpoints.',
    agreedCommitments: 'Integrate at least two HOTS questions into each Daily Lesson Log (DLL) and use color-coded reflection cards in the next observation.',
    lacRecommendation: 'School-Based LAC on "Effective Questioning and Formative Feedback in Secondary Science"',
    followUpDate: '2026-10-24',
    status: 'In Progress'
  },
  {
    id: 'ta-002',
    teacherId: 'tch-105',
    date: '2026-09-22',
    quarter: 'Quarter 1',
    objectiveDomain: 'PPST 2.3.2: Differentiated Activity Management & Group Protocols',
    criticalIncident: 'New Teacher Gemma experienced classroom noise and disorganization when transitioning Grade 8 learners into small group biodiversity discussions.',
    technicalAssistanceProvided: 'Introduced Master Teacher’s "Numbered Heads Together" and role-delegation strategy (Facilitator, Scribe, Timekeeper, Materials Steward, Reporter). Co-planned the biodiversity lesson plan.',
    agreedCommitments: 'Adopt structured role cards for all group tasks and establish a non-verbal chime signal for classroom attention.',
    lacRecommendation: 'Instructional Mentorship on "Positive Discipline and Seamless Classroom Transitions"',
    followUpDate: '2026-10-18',
    status: 'Satisfied'
  },
  {
    id: 'ta-003',
    teacherId: 'tch-103',
    date: '2026-10-15',
    quarter: 'Quarter 2',
    objectiveDomain: 'PPST 4.5.2: ICT and Virtual Simulation Integration',
    criticalIncident: 'Teacher Rowena requested assistance in integrating PhET Interactive Simulations for Grade 9 Chemical Bonding without losing instructional focus.',
    technicalAssistanceProvided: 'Demonstrated guided-inquiry worksheet design specifically tailored to PhET ionic and covalent simulation modules. Tested interactive TV projection.',
    agreedCommitments: 'Pilot the guided PhET lab with Grade 9 Section Curie on October 28.',
    lacRecommendation: 'ICT in Science Pedagogy Workshop',
    followUpDate: '2026-11-04',
    status: 'In Progress'
  }
];

export const INITIAL_SCHEDULE: SupervisoryScheduleItem[] = [
  {
    id: 'sch-001',
    teacherId: 'tch-101',
    scheduledDate: '2026-10-28',
    timeSlot: '08:00 AM - 09:00 AM',
    subject: 'Grade 10 Biology',
    roomSection: 'Lab Room 2 · Grade 10 Pasteur',
    quarter: 'Quarter 2',
    observationType: 'Formal Announced',
    status: 'Scheduled',
    notes: 'Focus on Heredity & Mendelian Inheritance with Punnett Square group analysis.'
  },
  {
    id: 'sch-002',
    teacherId: 'tch-102',
    scheduledDate: '2026-10-30',
    timeSlot: '10:15 AM - 11:15 AM',
    subject: 'Grade 7 General Science',
    roomSection: 'Building B Rm 104 · Grade 7 Sapphire',
    quarter: 'Quarter 2',
    observationType: 'Formal Announced',
    status: 'Scheduled',
    notes: 'Follow-up observation focusing on Formative Assessment & HOTS inquiry implementation.'
  },
  {
    id: 'sch-003',
    teacherId: 'tch-105',
    scheduledDate: '2026-11-06',
    timeSlot: '01:30 PM - 02:30 PM',
    subject: 'Grade 8 Science',
    roomSection: 'Main Bldg Rm 202 · Grade 8 Acacia',
    quarter: 'Quarter 2',
    observationType: 'Formal Announced',
    status: 'Scheduled',
    notes: 'Observation of group role delegation and positive discipline management.'
  },
  {
    id: 'sch-004',
    teacherId: 'tch-106',
    scheduledDate: '2026-11-12',
    timeSlot: '09:15 AM - 10:15 AM',
    subject: 'Grade 10 Biotechnology',
    roomSection: 'Science Wing Rm 3 · Grade 10 Fleming',
    quarter: 'Quarter 2',
    observationType: 'Formal Announced',
    status: 'Scheduled',
    notes: 'DNA extraction practical laboratory exercise.'
  }
];
