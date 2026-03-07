// Auto-generated from data.ts split (issue #27) — mock/dev data and phase vignettes
import type { VignetteScene, UserProgress } from './types';



export const MOCK_PROGRESS: UserProgress[] = [
  {
    moduleId: 1,
    preAssessmentScore: 80,
    postAssessmentScore: 92,
    sectionsCompleted: ["m1-root", "m1-regulate", "m1-reflect", "m1-restore", "m1-reconnect"],
    scenariosCompleted: ["m1-s1"],
    timeSpent: 245,
    status: "completed",
    completedDate: "2026-02-15",
  },
  {
    moduleId: 2,
    preAssessmentScore: 67,
    postAssessmentScore: null,
    sectionsCompleted: ["m2-root", "m2-regulate", "m2-reflect"],
    scenariosCompleted: [],
    timeSpent: 180,
    status: "in_progress",
  },
  { moduleId: 3, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 4, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 5, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 6, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 7, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
];

// DEV ONLY — placeholder mock data for local development. Never use in production code paths.
export const ADMIN_STATS = {
  totalLearners: 342,
  activeLearners: 187,
  completionRate: 68,
  avgScore: 84,
  agencyBreakdown: [
    { name: "Metro PD", learners: 45, completion: 72 },
    { name: "County CPS", learners: 68, completion: 65 },
    { name: "DA Office", learners: 32, completion: 81 },
    { name: "Family Court", learners: 28, completion: 75 },
    { name: "Regional Hospital", learners: 41, completion: 62 },
    { name: "School District", learners: 56, completion: 58 },
    { name: "Victim Services", learners: 38, completion: 79 },
    { name: "CAC", learners: 34, completion: 88 },
  ],
  moduleCompletion: [
    { module: "Module 1", completed: 234, inProgress: 58, notStarted: 50 },
    { module: "Module 2", completed: 189, inProgress: 72, notStarted: 81 },
    { module: "Module 3", completed: 156, inProgress: 64, notStarted: 122 },
    { module: "Module 4", completed: 142, inProgress: 55, notStarted: 145 },
    { module: "Module 5", completed: 128, inProgress: 48, notStarted: 166 },
    { module: "Module 6", completed: 112, inProgress: 62, notStarted: 168 },
  ],
  monthlyEnrollment: [
    { month: "Sep", enrolled: 45 },
    { month: "Oct", enrolled: 62 },
    { month: "Nov", enrolled: 38 },
    { month: "Dec", enrolled: 28 },
    { month: "Jan", enrolled: 72 },
    { month: "Feb", enrolled: 55 },
    { month: "Mar", enrolled: 42 },
  ],
  assessmentDistribution: [
    { range: "90-100%", count: 89 },
    { range: "80-89%", count: 112 },
    { range: "70-79%", count: 78 },
    { range: "60-69%", count: 42 },
    { range: "Below 60%", count: 21 },
  ],
};

/** Phase intro vignettes for learning sections — short animated introductions for each 5Rs phase */
export const PHASE_VIGNETTES: Record<string, VignetteScene[]> = {
  Root: [
    {
      id: "phase-root-1",
      duration: 5,
      setting: "A quiet study — books and case files on the desk",
      mood: "calm",
      characters: [
        { name: "Mentor", role: "Senior Investigator", avatar: "📚", position: "left", emotion: "calm", dialogue: "Before you can respond to trauma, you have to understand it. That starts here — at the root." },
        { name: "You", role: "Trainee", avatar: "🎓", position: "right", emotion: "focused", action: "Opening a case study binder" },
      ],
      narration: "Every investigation begins long before you arrive at a scene. It begins with knowledge — the legal frameworks, the neurobiology, the research. The Root phase grounds you in the foundational understanding that every decision you make will rest upon.",
      ambientDetail: "Research articles are spread across the desk. A diagram of the brain's stress response system is pinned to the wall.",
    },
    {
      id: "phase-root-2",
      duration: 4,
      setting: "The same study — a key concept emerging",
      mood: "neutral",
      characters: [
        { name: "Mentor", role: "Senior Investigator", avatar: "📚", position: "center", emotion: "focused", dialogue: "When you understand why a child responds the way they do, you stop mistaking survival for defiance." },
      ],
      narration: "Understanding changes everything. A child who won't make eye contact isn't being uncooperative — they're protecting themselves. A parent who becomes hostile may be terrified, not guilty. Root knowledge transforms how you see every person in every case.",
      soundCue: "Pages turning, pen scratching on paper",
    },
  ],
  Regulate: [
    {
      id: "phase-regulate-1",
      duration: 5,
      setting: "Outside a home — before knocking on the door",
      mood: "tense",
      characters: [
        { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "anxious", action: "Standing at the door, hand raised, pausing before knocking" },
      ],
      narration: "Your heart is racing. The referral described severe injuries. You know what you might see on the other side of this door. The Regulate phase teaches you to notice this moment — the moment between trigger and response — and use it.",
      ambientDetail: "Your hand hovers over the door. You take one deliberate breath.",
      soundCue: "Heartbeat, a steadying exhale",
    },
    {
      id: "phase-regulate-2",
      duration: 4,
      setting: "Same doorstep — after a breath",
      mood: "calm",
      characters: [
        { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "calm", action: "Lowering shoulders, centering posture, then knocking steadily" },
      ],
      narration: "One breath. That's sometimes all you get. But in that breath, you can shift from reactive to regulated. The child behind this door needs you to be present, not overwhelmed. Regulation isn't about suppressing emotion — it's about choosing your professional response.",
    },
  ],
  Reflect: [
    {
      id: "phase-reflect-1",
      duration: 5,
      setting: "Case review room — after an investigation",
      mood: "emotional",
      characters: [
        { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "focused", action: "Reviewing case notes, pausing at a critical decision point" },
        { name: "Supervisor", role: "Team Lead", avatar: "👤", position: "right", emotion: "calm", dialogue: "Walk me through what happened when the child recanted. What were you feeling in that moment?" },
      ],
      narration: "Reflection isn't hindsight — it's a professional skill. The Reflect phase asks you to examine your decisions, your assumptions, and your emotional responses with the same rigor you apply to evidence. What did you see? What did you miss? What would you do differently?",
      ambientDetail: "Case photographs are face-down on the table. A timeline is drawn on the whiteboard.",
    },
  ],
  Restore: [
    {
      id: "phase-restore-1",
      duration: 5,
      setting: "Training room — practicing a protocol",
      mood: "hopeful",
      characters: [
        { name: "Instructor", role: "Protocol Specialist", avatar: "📋", position: "left", emotion: "focused", dialogue: "The protocol exists to protect both the child and the integrity of your investigation. When in doubt, return to the structure." },
        { name: "You", role: "Investigator", avatar: "🔍", position: "right", emotion: "focused", action: "Practicing documentation procedures with a standardized form" },
      ],
      narration: "Restore is about correction — replacing harmful or ineffective practices with evidence-based protocols. It's where knowledge becomes procedure, where understanding becomes action. Every checklist, every interview protocol, every documentation standard exists because someone learned from a case that went wrong.",
      ambientDetail: "A laminated NICHD protocol card sits on the desk. Practice interview recordings play on a screen.",
      soundCue: "Training video audio, pen clicking",
    },
  ],
  Reconnect: [
    {
      id: "phase-reconnect-1",
      duration: 5,
      setting: "MDT conference room — professionals gathered around a table",
      mood: "hopeful",
      characters: [
        { name: "Detective", role: "Law Enforcement", avatar: "🔍", position: "left", emotion: "focused", dialogue: "We can't do this alone." },
        { name: "Social Worker", role: "CPS", avatar: "📋", position: "center", emotion: "caring", dialogue: "The family needs services that extend beyond our investigation." },
        { name: "Advocate", role: "Victim Services", avatar: "💜", position: "right", emotion: "hopeful", dialogue: "And the child needs to know that the adults in the room are working together — for them." },
      ],
      narration: "No single professional can protect a child alone. The Reconnect phase brings the multidisciplinary team together — law enforcement, child welfare, prosecution, medical, education, and advocacy — united by a shared commitment to the child's safety and healing.",
      ambientDetail: "A child's drawing is taped to the whiteboard — a sun, a house, and stick figures holding hands.",
      soundCue: "Collaborative discussion, papers shuffling",
    },
  ],
};
