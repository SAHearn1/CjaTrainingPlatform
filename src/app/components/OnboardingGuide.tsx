import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  TreePine,
  ArrowRight,
  ArrowLeft,
  X,
  BookOpen,
  LayoutDashboard,
  ClipboardCheck,
  Gamepad2,
  Award,
  BarChart3,
  Volume2,
  Target,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  GraduationCap,
  Compass,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PhaseIcon } from "./PhaseIcon";
import { useAuth } from "./AuthContext";
import { rootyChat } from "./api";
import { ROLE_LABELS } from "./data";
import { ROLE_MODULE_RECS, DEFAULT_MODULE_REC, type RoleModuleRec } from "./data";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  detail: string;
  tip?: string;
  visual?: "framework" | "trace" | "modules" | "tts" | "assessment" | "welcome";
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to RootWork! 🌱",
    description: "Your trauma-informed investigation training journey starts here.",
    icon: <TreePine className="w-6 h-6" />,
    detail:
      "RootWork is a comprehensive training platform designed for professionals across 9 disciplines who investigate suspected child abuse and neglect. This guided tour will walk you through every feature so you feel confident navigating the platform.",
    tip: "You can revisit this tour anytime from the help button in the bottom-right corner.",
    visual: "welcome",
  },
  {
    id: "dashboard",
    title: "Your Personal Dashboard",
    description: "Track your progress and pick up where you left off.",
    icon: <LayoutDashboard className="w-6 h-6" />,
    detail:
      "The Dashboard gives you an at-a-glance view of your training progress, including completed modules, assessment scores, time invested, and your next recommended steps. It also displays the RootWork 5Rs framework and TRACE cognitive cycle as visual reference guides.",
    tip: "The Dashboard updates in real-time as you complete sections, assessments, and simulations.",
  },
  {
    id: "framework",
    title: "The RootWork 5Rs Framework",
    description: "Every module is structured around five phases of trauma-informed practice.",
    icon: <Target className="w-6 h-6" />,
    detail:
      "Each training module follows the 5Rs sequence. This isn't arbitrary — it mirrors how professionals should approach trauma-informed work: first understand the Root causes, then learn to Regulate your own responses, Reflect on practice, Restore correct procedures, and Reconnect through collaboration.",
    visual: "framework",
  },
  {
    id: "trace",
    title: "The TRACE Cognitive Cycle",
    description: "A decision-making framework for high-stakes investigations.",
    icon: <Compass className="w-6 h-6" />,
    detail:
      "TRACE stands for Trigger → Response → Appraisal → Choice → Effect. This cycle helps you understand how your investigative decisions unfold and where you can intervene to make better choices. You'll practice TRACE in scenario simulations throughout the platform.",
    visual: "trace",
  },
  {
    id: "modules",
    title: "7 Training Modules",
    description: "Structured learning content from foundations to advanced practice.",
    icon: <BookOpen className="w-6 h-6" />,
    detail:
      "The platform contains 7 modules covering: Trauma-Informed Foundations, Communication & Interviewing, Disability Law & Rights, Forensic Evidence, MDT Coordination, Preventing Secondary Trauma, and Mandated Reporter Essentials (bonus). Each module contains 5 learning sections (one per R), guided reflections, key terms, and downloadable resources.",
    visual: "modules",
  },
  {
    id: "assessments",
    title: "Pre & Post Assessments",
    description: "Measure your knowledge before and after each module.",
    icon: <ClipboardCheck className="w-6 h-6" />,
    detail:
      "Every module includes a Pre-Assessment (to gauge baseline knowledge) and a Post-Assessment (competency evaluation). Questions include detailed explanations and APA-formatted academic citations supporting each correct answer. You need a 70% score to pass the competency evaluation.",
    visual: "assessment",
    tip: "Don't worry about the Pre-Assessment score — it's meant to identify what you need to learn, not penalize you.",
  },
  {
    id: "simulations",
    title: "Scenario Simulations",
    description: "Practice decision-making in realistic investigation scenarios.",
    icon: <Gamepad2 className="w-6 h-6" />,
    detail:
      "Simulations present you with realistic child abuse investigation scenarios where you make choices at each decision point. Each choice is analyzed through the TRACE framework, showing you whether your response was optimal and why. Choices include supporting academic citations.",
    tip: "You can replay simulations as many times as you like to practice different approaches.",
  },
  {
    id: "tts",
    title: "Audio & Accessibility",
    description: "Listen to any content with built-in text-to-speech.",
    icon: <Volume2 className="w-6 h-6" />,
    detail:
      "Every page includes text-to-speech controls so you can listen to content instead of reading. Look for the speaker icons (🔊) throughout the platform. You can adjust playback speed from 0.5x to 2x, choose from available voices, and pause/resume at any time.",
    visual: "tts",
    tip: "The small inline speaker buttons let you listen to individual paragraphs, key terms, or citations.",
  },
  {
    id: "certificates",
    title: "Certificates & Credentials",
    description: "Earn certificates as you complete modules.",
    icon: <Award className="w-6 h-6" />,
    detail:
      "After passing a module's Post-Assessment with 70% or higher, you'll earn a completion certificate. Certificates include your name, role, module title, completion date, and a unique credential ID. You can download or print them for your professional development records.",
  },
  {
    id: "admin",
    title: "Admin Analytics",
    description: "Organizational leaders can view aggregate training data.",
    icon: <BarChart3 className="w-6 h-6" />,
    detail:
      "The Admin Dashboard provides charts and statistics on learner enrollment, module completion rates, assessment score distributions, and agency-level breakdowns. This helps training coordinators track compliance and identify areas where additional support is needed.",
  },
  {
    id: "ready",
    title: "You're All Set! 🎉",
    description: "Start your training journey with Module 1.",
    icon: <GraduationCap className="w-6 h-6" />,
    detail:
      "We recommend starting with Module 1: Trauma-Informed Foundations. Begin with the Pre-Assessment to establish your baseline, work through each of the 5Rs sections, try the scenario simulation, and then take the Post-Assessment. The help assistant is always available if you need guidance.",
    tip: "The floating help button (bottom-right) gives you quick access to this tour, platform tips, and the 5Rs/TRACE reference at any time.",
  },
];

const STORAGE_KEY = "rootwork_onboarding_complete";

export function OnboardingGuide() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const role = profile?.role ?? "cpi";
  const roleLabel = ROLE_LABELS[role] ?? role;
  const moduleRec = ROLE_MODULE_RECS[role] ?? DEFAULT_MODULE_REC;

  // Replace generic "ready" step with role-specific path recommendation
  const personalizedSteps: OnboardingStep[] = [
    ...ONBOARDING_STEPS.slice(0, -1),
    {
      id: "ready",
      title: `You're All Set, ${roleLabel.split(" ")[0]}! 🎉`,
      description: `Your recommended starting point as a ${roleLabel}.`,
      icon: <GraduationCap className="w-6 h-6" />,
      detail: `Based on your role as a ${roleLabel}, we recommend starting with Module ${moduleRec.id}: ${moduleRec.title}. ${moduleRec.reason} Begin with the Pre-Assessment to establish your baseline, then work through all 5Rs sections. Click "Start Module" below to begin.`,
      tip: "The floating help button (bottom-right) gives you quick access to this tour, platform tips, and the 5Rs/TRACE reference at any time.",
    },
  ];

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Show after a short delay to let the page render
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
    navigate(`/modules/${moduleRec.id}`);
  };

  const handleNext = () => {
    if (currentStep < personalizedSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const step = personalizedSteps[currentStep];
  const progress = ((currentStep + 1) / personalizedSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          aria-label="Skip onboarding guide"
          onClick={handleSkip}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSkip(); }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Close / Skip */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-primary rounded-r-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-1.5 pt-4 px-6">
            {personalizedSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep
                    ? "w-6 bg-primary"
                    : i < currentStep
                    ? "w-1.5 bg-primary/40"
                    : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Step {currentStep + 1} of {personalizedSteps.length}
                    </p>
                    <h2>{step.title}</h2>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Visual */}
                {step.visual && <StepVisual type={step.visual} />}

                {/* Detail */}
                <p className="text-sm text-foreground/80 leading-relaxed mt-4">{step.detail}</p>

                {/* Tip */}
                {step.tip && (
                  <div className="mt-4 bg-accent rounded-xl p-4 flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-accent-foreground leading-relaxed">{step.tip}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="px-6 sm:px-8 py-4 border-t border-border flex items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-2">
              {currentStep > 0 ? (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Skip tour
                </button>
              )}
            </div>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {currentStep === personalizedSteps.length - 1 ? (
                <>
                  Start Module {moduleRec.id} <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Step Visuals ---------- */

function StepVisual({ type }: { type: string }) {
  const [waveHeights] = useState<number[]>(() => Array.from({ length: 16 }, () => Math.random() * 14 + 3));
  const [waveDurations] = useState<number[]>(() => Array.from({ length: 16 }, () => 0.6 + Math.random() * 0.4));

  if (type === "welcome") {
    const phases = ["Root", "Regulate", "Reflect", "Restore", "Reconnect"];
    return (
      <div className="mt-4 bg-gradient-to-br from-primary/10 via-accent/30 to-primary/5 rounded-xl p-5 border border-primary/10">
        <div className="flex items-center justify-center gap-3 mb-3">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center"
            >
              <PhaseIcon phase={phase} size={36} />
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Root → Regulate → Reflect → Restore → Reconnect
        </p>
      </div>
    );
  }

  if (type === "framework") {
    const phases = [
      { name: "Root", color: "#0D3B22", desc: "Foundation & legal context" },
      { name: "Regulate", color: "#1C4D36", desc: "Self-regulation skills" },
      { name: "Reflect", color: "#1E3A5F", desc: "Case analysis & bias check" },
      { name: "Restore", color: "#5C3200", desc: "Correct procedures" },
      { name: "Reconnect", color: "#3A1550", desc: "MDT collaboration" },
    ];
    return (
      <div className="mt-4 bg-secondary rounded-xl p-4">
        <div className="space-y-2">
          {phases.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i + 0.2 }}
              className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 border border-border"
            >
              <PhaseIcon phase={p.name} size={32} withBg bgColor={p.color} className="rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground">Phase {i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "trace") {
    const steps = [
      { letter: "T", label: "Trigger", color: "#0D3B22", desc: "Case details that activate you" },
      { letter: "R", label: "Response", color: "#1C4D36", desc: "Your emotional reaction" },
      { letter: "A", label: "Appraisal", color: "#1E3A5F", desc: "Professional evaluation" },
      { letter: "C", label: "Choice", color: "#5C3200", desc: "Informed action" },
      { letter: "E", label: "Effect", color: "#3A1550", desc: "The outcome" },
    ];
    return (
      <div className="mt-4 bg-secondary rounded-xl p-4">
        <div className="flex items-center justify-between px-2">
          {steps.map((s, i) => (
            <motion.div
              key={s.letter}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i + 0.2, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shadow-md"
                style={{ backgroundColor: s.color }}
              >
                {s.letter}
              </div>
              <p className="text-xs mt-1.5">{s.label}</p>
              <p className="text-[10px] text-muted-foreground text-center max-w-[70px]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between px-7 mt-[-36px] mb-6">
          {[0, 1, 2, 3].map((i) => (
            <ArrowRight key={i} className="w-3 h-3 text-muted-foreground" />
          ))}
        </div>
      </div>
    );
  }

  if (type === "modules") {
    const modules = [
      { num: 1, title: "Trauma-Informed Foundations", time: "4h" },
      { num: 2, title: "Communication & Interviewing", time: "5h" },
      { num: 3, title: "Disability Law & Rights", time: "4.5h" },
      { num: 4, title: "Forensic Evidence", time: "5h" },
      { num: 5, title: "MDT Coordination", time: "3.5h" },
      { num: 6, title: "Preventing Secondary Trauma", time: "3h" },
    ];
    return (
      <div className="mt-4 bg-secondary rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {modules.map((m, i) => (
            <motion.div
              key={m.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.2 }}
              className="bg-card rounded-lg p-2.5 border border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                  {m.num}
                </span>
                <span className="text-[10px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="text-xs leading-snug">{m.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "tts") {
    return (
      <div className="mt-4 bg-secondary rounded-xl p-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/30 rounded-xl px-4 py-3 border border-primary/10 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary/40 rounded-full"
                  animate={{ height: [3, waveHeights[i], 3] }}
                  transition={{ duration: waveDurations[i], repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">1x</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Volume2 className="w-3 h-3 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Inline buttons appear next to individual content items</p>
        </div>
      </div>
    );
  }

  if (type === "assessment") {
    return (
      <div className="mt-4 bg-secondary rounded-xl p-4 space-y-2">
        {["Pre-Assessment → Baseline Knowledge", "5Rs Learning Sections → Core Content", "Scenario Simulations → Applied Practice", "Post-Assessment → Competency Evaluation"].map(
          (label, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.2 }}
              className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 border border-border"
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${i === 3 ? "text-primary" : "text-muted-foreground/40"}`} />
              <p className="text-xs">{label}</p>
            </motion.div>
          )
        )}
      </div>
    );
  }

  return null;
}

/* ---------- Floating Help Button / Assistant ---------- */

const QUICK_TIPS = [
  { title: "Getting Started", text: "Begin with Module 1 and take the Pre-Assessment to see what you already know." },
  { title: "Listen Instead", text: "Every section has a 🔊 button. Click it to have the content read aloud while you follow along." },
  { title: "Use TRACE", text: "In simulations, think: what Triggered this? What's my Response? What's my Appraisal? What Choice will I make? What's the Effect?" },
  { title: "Take Your Time", text: "Reflections are private and ungraded. Use them to genuinely process the material." },
  { title: "Citations Matter", text: "Every answer explanation includes APA references. These support evidence-based practice." },
  { title: "Retake Anytime", text: "You can retake assessments and simulations as many times as you need." },
  { title: "5Rs Order", text: "Root → Regulate → Reflect → Restore → Reconnect. Each phase builds on the previous one." },
  { title: "Score to Pass", text: "You need 70% on the Post-Assessment to earn a module completion certificate." },
];

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function HelpAssistant() {
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTip, setActiveTip] = useState(0);
  const [showPulse, setShowPulse] = useState(true);
  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % QUICK_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Stop pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  async function handleSendMessage() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    const userMsg: ChatMessage = { role: "user", text };
    const history = [...chatMessages, userMsg];
    setChatMessages(history);
    setChatLoading(true);
    try {
      const { reply } = await rootyChat(accessToken, history);
      setChatMessages([...history, { role: "assistant", text: reply }]);
    } catch {
      setChatMessages([...history, { role: "assistant", text: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setChatLoading(false);
    }
  }

  const handleRestartTour = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-[90]">
        {showPulse && (
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isOpen
              ? "bg-muted text-muted-foreground rotate-0"
              : "bg-primary text-primary-foreground hover:scale-105"
          }`}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-5 z-[90] w-80 sm:w-96 max-h-[70vh] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm">RootWork Guide</h3>
                    <p className="text-white/60 text-xs">{chatMode ? "Ask me anything" : "How can I help?"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatMode((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs transition-colors"
                >
                  {chatMode ? <Lightbulb className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                  {chatMode ? "Guide" : "Ask Rooty"}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMode && (
                <div className="space-y-3 min-h-[120px]">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-6">
                      <TreePine className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                      <p className="text-xs text-muted-foreground">Ask Rooty about the 5Rs framework, trauma-informed practices, or your training progress.</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-2xl rounded-bl-sm px-3 py-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
              {!chatMode && <>{/* Quick actions */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRestartTour}
                    className="bg-secondary rounded-lg p-3 text-left hover:bg-accent transition-colors group"
                  >
                    <Compass className="w-4 h-4 text-primary mb-1 group-hover:text-accent-foreground" />
                    <p className="text-xs">Restart Tour</p>
                    <p className="text-[10px] text-muted-foreground">View the guided walkthrough again</p>
                  </button>
                  <a
                    href="/modules"
                    className="bg-secondary rounded-lg p-3 text-left hover:bg-accent transition-colors group"
                  >
                    <BookOpen className="w-4 h-4 text-primary mb-1 group-hover:text-accent-foreground" />
                    <p className="text-xs">Browse Modules</p>
                    <p className="text-[10px] text-muted-foreground">View all 6 training modules</p>
                  </a>
                  <a
                    href="/dashboard"
                    className="bg-secondary rounded-lg p-3 text-left hover:bg-accent transition-colors group"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary mb-1 group-hover:text-accent-foreground" />
                    <p className="text-xs">My Dashboard</p>
                    <p className="text-[10px] text-muted-foreground">Check your progress</p>
                  </a>
                  <a
                    href="/certificates"
                    className="bg-secondary rounded-lg p-3 text-left hover:bg-accent transition-colors group"
                  >
                    <Award className="w-4 h-4 text-primary mb-1 group-hover:text-accent-foreground" />
                    <p className="text-xs">Certificates</p>
                    <p className="text-[10px] text-muted-foreground">View earned credentials</p>
                  </a>
                </div>
              </div>

              {/* 5Rs Quick Reference */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">5Rs Quick Reference</p>
                <div className="bg-secondary rounded-xl p-3 space-y-1.5">
                  {[
                    { phase: "Root", hex: "#0D3B22" },
                    { phase: "Regulate", hex: "#1C4D36" },
                    { phase: "Reflect", hex: "#1E3A5F" },
                    { phase: "Restore", hex: "#5C3200" },
                    { phase: "Reconnect", hex: "#3A1550" },
                  ].map((r) => (
                    <div key={r.phase} className="flex items-center gap-2">
                      <PhaseIcon phase={r.phase} size={20} />
                      <span className="text-xs" style={{ color: r.hex }}>{r.phase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TRACE Quick Reference */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">TRACE Quick Reference</p>
                <div className="bg-secondary rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs">
                    {["Trigger", "Response", "Appraisal", "Choice", "Effect"].map((t, i, arr) => (
                      <span key={t} className="flex items-center gap-0.5">
                        <span className="text-primary">{t.charAt(0)}</span>
                        <span className="text-muted-foreground">{t.slice(1)}</span>
                        {i < arr.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-muted-foreground ml-0.5" />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rotating Tips */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Training Tips
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTip}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-accent rounded-xl p-3"
                  >
                    <p className="text-xs text-accent-foreground">{QUICK_TIPS[activeTip].title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{QUICK_TIPS[activeTip].text}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-center gap-1 mt-2">
                  {QUICK_TIPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTip(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === activeTip ? "bg-primary w-4" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              </>}
            </div>

            {/* Footer — chat input in chat mode, otherwise static label */}
            <div className="px-4 py-3 border-t border-border bg-secondary/30">
              {chatMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question…"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || chatLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground text-center">
                  RootWork Training Platform • 5Rs Framework • TRACE Cognitive Cycle
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}