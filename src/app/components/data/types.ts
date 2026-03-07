// Auto-generated from data.ts split (issue #27)

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  sections: Section[];
  preAssessment: Assessment;
  postAssessment: Assessment;
  scenarios: Scenario[];
}

export interface Section {
  id: string;
  phase: string;
  title: string;
  description: string;
  content: string[];
  keyTerms?: KeyTerm[];
  videoUrl?: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Assessment {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  citations: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  narrative: string;
  choices: ScenarioChoice[];
  vignette?: VignetteScene[];
  /** Branch-specific vignettes keyed by the previous choice's branchKey */
  branchVignettes?: Record<string, VignetteScene[]>;
  /** Branch-specific narrative overrides keyed by previous choice's branchKey */
  branchNarratives?: Record<string, string>;
}

export interface VignetteScene {
  id: string;
  duration: number;
  setting: string;
  mood: "tense" | "calm" | "urgent" | "emotional" | "neutral" | "hopeful";
  characters: VignetteCharacter[];
  narration: string;
  ambientDetail?: string;
  soundCue?: string;
}

export interface VignetteCharacter {
  name: string;
  role: string;
  avatar: string;
  position: "left" | "center" | "right";
  emotion: "neutral" | "distressed" | "angry" | "calm" | "anxious" | "hopeful" | "withdrawn" | "defensive" | "focused" | "caring";
  dialogue?: string;
  action?: string;
}

export interface ScenarioChoice {
  text: string;
  outcome: string;
  isOptimal: boolean;
  tracePhase: string;
  citation?: string;
  /** Key that selects which branch vignette/narrative the next step should use */
  branchKey?: string;
}

export interface UserProgress {
  moduleId: number;
  preAssessmentScore: number | null;
  postAssessmentScore: number | null;
  sectionsCompleted: string[];
  scenariosCompleted: string[];
  timeSpent: number;
  status: "not_started" | "in_progress" | "completed";
  completedDate?: string;
}
