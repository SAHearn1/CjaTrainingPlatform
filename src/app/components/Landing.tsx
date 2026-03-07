import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ROLES, type RoleId } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./AuthContext";
import { PhaseIcon, PHASE_HEX } from "./PhaseIcon";
import { TraceIcon, TRACE_ORDER, TRACE_LABELS } from "./TraceIcon";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { LegalFooter, PasswordStrengthMeter } from "./SecurityBadge";

import rootworkLogo from "@/assets/rootwork-logo.png";

import {
  Shield,
  Heart,
  Scale,
  Gavel,
  Stethoscope,
  GraduationCap,
  HandHeart,
  Mic,
  FileWarning,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  LogIn,
  UserPlus,
  Loader2,
  AlertCircle,
  Brain,
  Target,
  Layers,
  Lightbulb,
  ChevronDown,
  MessageCircle,
  X,
  Send,
  ArrowDown,
} from "lucide-react";

/* ─── icon map (roles) ─── */
const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Gavel: <Gavel className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  HandHeart: <HandHeart className="w-6 h-6" />,
  Mic: <Mic className="w-6 h-6" />,
  FileWarning: <FileWarning className="w-6 h-6" />,
};

/* ─── TRACE descriptions ─── */
const TRACE_DESCRIPTIONS: Record<string, string> = {
  T: "Every investigation begins with a trigger \u2014 a report, a disclosure, a scene. Recognizing your own physiological and emotional activation in that moment is the first step toward a measured response.",
  R: "The body responds before the mind decides. Training here focuses on recognizing automatic stress responses \u2014 fight, flight, freeze \u2014 and developing regulation strategies that keep the professional grounded.",
  A: "Once regulated, the professional can appraise the situation systematically: separating fact from assumption, evaluating evidence objectively, and resisting the pull of confirmation bias.",
  C: "Appraisal leads to choice. This stage trains professionals to select actions that are legally sound, trauma-informed, and contextually appropriate \u2014 understanding that each choice shapes the child's experience of the system.",
  E: "Every choice produces an effect. This stage develops the habit of evaluating outcomes, documenting decisions with precision, and feeding lessons learned back into future practice.",
};

/* ─── 5Rs data ─── */
const FIVE_RS = [
  { phase: "Root", subtitle: "Ground in Understanding", desc: "Establish foundational knowledge of trauma's neurobiological impact on children. Understand how ACEs, attachment disruption, and systemic inequity shape the cases you investigate." },
  { phase: "Regulate", subtitle: "Manage Your Response", desc: "Develop capacity to regulate your own nervous system during high-stress encounters. An investigator who is dysregulated cannot create safety for a dysregulated child." },
  { phase: "Reflect", subtitle: "Examine Assumptions", desc: "Cultivate the habit of pausing before acting. Interrogate biases, evaluate evidence without confirmation bias, and consider alternative hypotheses before drawing conclusions." },
  { phase: "Restore", subtitle: "Repair & Rebuild", desc: "Learn restorative approaches that honor the child's dignity. Understand how investigative processes can either contribute to healing or perpetuate cycles of institutional harm." },
  { phase: "Reconnect", subtitle: "Sustain the Practice", desc: "Integrate trauma-informed competencies into your professional identity. Build multidisciplinary relationships and accountability structures that outlast any single case." },
] as const;

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  { q: "Who is this platform designed for?", a: "The platform serves nine professional roles: law enforcement officers, child protective investigators, prosecutors, judges, medical professionals, school personnel, victim advocates, forensic interviewers, and mandated reporters (teachers, community center staff, coaches, clergy, and others designated by state or federal guidelines). Each role receives a customized training path." },
  { q: "What is the RootWork 5Rs Framework?", a: "The 5Rs \u2014 Root, Regulate, Reflect, Restore, Reconnect \u2014 are five sequential stages that guide trauma-informed professional practice. Every training module is structured around these phases, progressing from foundational knowledge through self-regulation, critical reflection, restorative approaches, and sustained reconnected practice." },
  { q: "What is the TRACE Cognitive Cycle?", a: "TRACE stands for Trigger, Response, Appraisal, Choice, and Effect. It maps the cognitive pathway an investigator (or mandated reporter) travels during a critical encounter with a child. By making this cycle visible, professionals learn to interrupt automatic reactions and replace them with deliberate, trauma-informed choices." },
  { q: "How is the Mandated Reporter module different from the investigator modules?", a: "Module 7 is specifically designed for professionals whose duty is to recognize and report suspected abuse \u2014 not to investigate it. Teachers, coaches, childcare workers, clergy, and community center staff learn their legal obligations under Georgia law (O.C.G.A. \u00A7 19-7-5), how to recognize indicators of abuse and neglect, how to call 1-855-GACHILD to make a report, and how to continue supporting a child after a report is made. Georgia's law serves as the baseline \u2014 the core principles (reasonable suspicion standard, good-faith immunity, 24-hour window, don't investigate) are consistent across most U.S. jurisdictions." },
  { q: "How long does the training take?", a: "The complete platform includes 7 modules totaling approximately 28 hours of training content. Each module ranges from 3 to 5 hours and can be completed at your own pace. Pre-assessments personalize instruction, and post-assessments measure competency." },
  { q: "Are continuing education (CE) credits available?", a: "Yes. Upon completing required modules and passing the final assessment, the platform generates verifiable certificates with unique IDs and continuing education credit hours, exportable as PDF or via digital verification link." },
  { q: "What are the license tiers?", a: "The platform offers four license tiers: Individual (single-user access), Team (5\u201325 users with team analytics), Agency (25\u2013500 users with admin dashboards and cohort tracking), and Enterprise (unlimited users with custom integrations, dedicated support, and SSO)." },
  { q: "Is my data secure?", a: "This demonstration platform uses Supabase for authentication and data persistence. In production, the platform would implement full CJIS-compliant security controls, role-based access, and encrypted data storage. The demo environment is not intended for collecting PII or securing sensitive case data." },
];

/* ═══════════════════════════════════════════════════════════════════
   Rooty Chatbot — answers questions about landing page content
   ═══════════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const ROOTY_KNOWLEDGE = `
You are Rooty, a friendly and knowledgeable assistant for the RootWork Framework Trauma-Informed Investigation Training Platform. Answer ONLY about the platform. Be warm, concise (2-4 sentences max), and refer to specific sections when helpful.

KEY FACTS:
- 9 professional roles: Law Enforcement, Child Protective Investigator, Prosecutor, Judge, Medical Professional, School Personnel, Victim Advocate, Forensic Interviewer, Mandated Reporter.
- 7 training modules (6 core + 1 bonus for mandated reporters), ~28 hours total.
- Pedagogical framework: RootWork 5Rs (Root, Regulate, Reflect, Restore, Reconnect) and TRACE Cognitive Cycle (Trigger, Response, Appraisal, Choice, Effect).
- Module 7 "Mandated Reporter Essentials" is for teachers, community center employees, coaches, clergy, childcare workers — people required by law to report suspected abuse but who are NOT investigators.
- Features: role-based learning paths, scenario-based simulations with branching decisions, video vignettes, pre/post assessments, certificates with CE credits.
- 4 design principles: Cognitive Load Awareness, Role-Differentiated Paths, Scaffolded Complexity, Reflective Practice.
- 4 license tiers: Individual, Team, Agency, Enterprise.
- Methodology: scenario-based simulation, adaptive assessment, video vignettes, branching decision trees, disability-inclusive design (Module 3), CE certification.
- Module 3 covers disability law (IDEA, Section 504, ADA) for children with disabilities who are abuse victims.
- The platform is built on the conviction that "competence is the foundation of compassion."
`;

function getRootyResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase();

  if (msg.includes("5r") || msg.includes("five r") || msg.includes("root") && msg.includes("regulate"))
    return "The 5Rs are the heart of our pedagogical framework! They are: Root (ground in understanding), Regulate (manage your response), Reflect (examine assumptions), Restore (repair & rebuild), and Reconnect (sustain the practice). Every module is structured around these five sequential stages. Scroll down to the '5Rs of Trauma-Informed Practice' section to see them in detail!";

  if (msg.includes("trace") || msg.includes("cognitive cycle") || msg.includes("trigger") && msg.includes("response"))
    return "TRACE stands for Trigger, Response, Appraisal, Choice, and Effect. It maps the cognitive pathway professionals travel during critical encounters. By making this cycle visible, you learn to interrupt automatic reactions and replace them with deliberate, trauma-informed choices. Check out the TRACE Cycle section on this page!";

  if (msg.includes("mandated reporter") || msg.includes("module 7") || msg.includes("teacher") || msg.includes("coach") || msg.includes("community center"))
    return "Module 7 is our bonus Mandated Reporter Essentials module! It's designed specifically for teachers, community center staff, coaches, clergy, and others who are legally required to report suspected abuse but are NOT investigators. You'll learn recognition of abuse indicators, reporting procedures, and how to support a child after making a report.";

  if (msg.includes("role") || msg.includes("who is this for") || msg.includes("professional"))
    return "The platform serves 9 professional roles: Law Enforcement, Child Protective Investigators, Prosecutors, Judges, Medical Professionals, School Personnel, Victim Advocates, Forensic Interviewers, and Mandated Reporters. Each role gets a customized training path with role-specific simulations and scenarios!";

  if (msg.includes("module") || msg.includes("how many") || msg.includes("training"))
    return "We have 7 modules totaling about 28 hours of training. The 6 core modules cover trauma-informed foundations, communication, disability law, forensic interviewing, MDT coordination, and secondary trauma prevention. Module 7 is a bonus for mandated reporters. Each module follows the 5Rs framework!";

  if (msg.includes("certificate") || msg.includes("ce credit") || msg.includes("continuing education"))
    return "Yes! Upon completing required modules and passing the final assessment, the platform generates verifiable certificates with unique IDs and CE credit hours. Certificates are exportable as PDF or via a digital verification link.";

  if (msg.includes("license") || msg.includes("pricing") || msg.includes("tier") || msg.includes("cost"))
    return "We offer four license tiers: Individual (single-user), Team (5-25 users with analytics), Agency (25-500 users with admin dashboards), and Enterprise (unlimited users with SSO and custom integrations). Sign up to learn more!";

  if (msg.includes("disability") || msg.includes("module 3") || msg.includes("ada") || msg.includes("idea") || msg.includes("504"))
    return "Module 3 specifically addresses investigations involving children with disabilities. It covers IDEA, Section 504, ADA accommodations during forensic interviews, and communication strategies for children with EBD, ASD, and cognitive disabilities.";

  if (msg.includes("design") || msg.includes("principle") || msg.includes("pedagog"))
    return "Our design is built around four principles: Cognitive Load Awareness (respecting the emotional demands of the material), Role-Differentiated Paths (adapting to your professional context), Scaffolded Complexity (building difficulty as competence grows), and Reflective Practice (developing metacognitive habits). Scroll to the 'Design Principles' section for details!";

  if (msg.includes("scenario") || msg.includes("simulation") || msg.includes("branching"))
    return "Our scenario-based simulations place you in realistic investigative situations with branching decision trees. Every choice has immediate, visible consequences that map back to the TRACE cycle. Rather than linear instruction, scenarios branch based on your decisions, teaching that trauma-informed practice requires context-dependent judgment!";

  if (msg.includes("sign up") || msg.includes("sign in") || msg.includes("start") || msg.includes("begin") || msg.includes("register"))
    return "You can get started by clicking the Sign In or Sign Up button in the top-right corner! After creating your account, you'll select your professional role, and we'll customize your training path. Welcome aboard!";

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("what can you"))
    return "Hi there! I'm Rooty, your guide to the RootWork Framework Training Platform. I can answer questions about our 7 training modules, the 5Rs framework, the TRACE cognitive cycle, the mandated reporter module, license tiers, CE credits, and more. What would you like to know?";

  if (msg.includes("assessment") || msg.includes("test") || msg.includes("quiz"))
    return "Each module includes a pre-assessment to establish your knowledge baseline and personalize instruction, plus a post-assessment that evaluates your competency in legal knowledge, trauma-informed communication, investigative decision-making, and disability accommodation awareness.";

  if (msg.includes("vignette") || msg.includes("video"))
    return "Video vignettes are short dramatized scenarios that let you observe investigative interactions, identify trauma responses in both children and professionals, and practice applying the 5Rs framework to real-world dynamics before encountering them in the field.";

  return "Great question! I can help with information about our 7 training modules, the 5Rs framework (Root, Regulate, Reflect, Restore, Reconnect), the TRACE cognitive cycle, the mandated reporter module, professional roles, CE credits, license tiers, or how to get started. What would you like to know more about?";
}

function RootyChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! I'm Rooty, your guide to the RootWork Framework Training Platform. Ask me anything about our modules, the 5Rs, TRACE, mandated reporting, Georgia reporting law, or how to get started!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const userMsg: ChatMessage = { role: "user", text: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-39a35780/rooty/chat`;
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ messages: updated }),
      });

      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (e) {
      console.log("Rooty Gemini API error, using fallback:", e);
      const response = getRootyResponse(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        style={{ background: "#082A19" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with Rooty"
      >
        {open ? (
          <X className="w-5 h-5" style={{ color: "#C9A84C" }} />
        ) : (
          <MessageCircle className="w-5 h-5" style={{ color: "#C9A84C" }} />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            style={{ maxHeight: "min(520px, calc(100vh - 140px))", background: "var(--card)" }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: "#082A19" }}
            >
              <img
                src={rootworkLogo}
                alt="Rooty"
                className="w-8 h-8 rounded-full object-contain"
              />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#C9A84C" }}>
                  Rooty
                </p>
                <p className="text-[10px]" style={{ color: "rgba(242,244,202,0.5)" }}>
                  RootWork Framework Assistant
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ minHeight: 200 }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "text-white"
                        : "text-foreground border border-border"
                    }`}
                    style={
                      m.role === "user"
                        ? { background: "#082A19" }
                        : { background: "var(--secondary)" }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-xl px-3 py-2 text-xs text-muted-foreground border border-border flex items-center gap-1.5"
                    style={{ background: "var(--secondary)" }}
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Rooty is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-border flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Rooty a question..."
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:border-primary"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50"
                style={{ background: "#082A19" }}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#C9A84C" }} />
                ) : (
                  <Send className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FAQ Accordion
   ═══════════════════════════════════════════════════════════════════ */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-xs text-muted-foreground leading-relaxed pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Auth Modal
   ═══════════════════════════════════════════════════════════════════ */

function AuthModal({
  open,
  onClose,
  defaultMode = "signin",
}: {
  open: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}) {
  const navigate = useNavigate();
  const { user, profile, signIn, signUp, updateProfile } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [step, setStep] = useState<"auth" | "role">("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setError(null);
    }
  }, [open, defaultMode]);

  // If user is authed but has no role, show role picker
  useEffect(() => {
    if (user && !profile?.role) setStep("role");
    if (user && profile?.role) {
      onClose();
      navigate("/dashboard");
    }
  }, [user, profile, navigate, onClose]);

  const handleAuth = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        if (!name || !email || !password) { setError("Please fill in all fields"); return; }
        await signUp(email, password, name);
        setStep("role");
      } else {
        if (!email || !password) { setError("Please enter email and password"); return; }
        await signIn(email, password);
      }
    } catch (e: any) {
      setError(e.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleSelect = async () => {
    if (!selectedRole) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateProfile({ role: selectedRole, name: name || profile?.name || "Learner" });
      navigate("/dashboard");
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to save role");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative z-50 bg-card rounded-2xl shadow-2xl border border-border p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {step === "auth" ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-center mb-2">
                {mode === "signin" ? "Welcome Back" : "Create Your Account"}
              </h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                {mode === "signin"
                  ? "Sign in to continue your training"
                  : "Sign up to access the training platform"}
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-sm mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.smith@agency.gov"
                    className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Create a secure password" : "Enter your password"}
                    className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  />
                  {mode === "signup" && <PasswordStrengthMeter password={password} />}
                </div>
                <button
                  onClick={handleAuth}
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === "signin" ? (
                    <><LogIn className="w-4 h-4" /> Sign In</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Create Account</>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
                  className="text-sm text-primary hover:underline"
                >
                  {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="role"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-center mb-2">Select Your Professional Role</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                Your role determines your personalized training path
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      selectedRole === role.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30 hover:bg-secondary"
                    }`}
                  >
                    <div className={`flex justify-center mb-1.5 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}>
                      {iconMap[role.icon]}
                    </div>
                    <span className="text-[11px] leading-tight block">{role.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleRoleSelect}
                disabled={!selectedRole || submitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Enter Training Platform <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Landing Page
   ═══════════════════════════════════════════════════════════════════ */

export function Landing() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const getStartedRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated with a role
  useEffect(() => {
    if (!authLoading && user && profile?.role) {
      navigate("/dashboard");
    }
  }, [authLoading, user, profile, navigate]);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const scrollToGetStarted = () => {
    getStartedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ scrollBehavior: "smooth" }}>

      {/* ─── Sticky Header with Auth Buttons ─── */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{
          background: "rgba(8,42,25,0.92)",
          borderColor: "rgba(201,168,76,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <img src={rootworkLogo} alt="RootWork" className="w-7 h-7 rounded-full object-contain" />
            <span className="text-sm font-semibold" style={{ color: "#C9A84C", fontFamily: "var(--font-display)" }}>
              RootWork Framework<sup style={{ fontSize: "0.5em" }}>&trade;</sup>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuth("signin")}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
            >
              <span className="hidden sm:inline"><LogIn className="w-3 h-3 inline mr-1 -mt-0.5" /></span>
              Sign In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ background: "#C9A84C", color: "#082A19" }}
            >
              <span className="hidden sm:inline"><UserPlus className="w-3 h-3 inline mr-1 -mt-0.5" /></span>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFpbmluZyUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MjgxOTU1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Training"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              {/* 3D Rotating Logo */}
              <div className="relative" style={{ width: 96, height: 96, perspective: "600px" }}>
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", position: "relative" }}
                >
                  <img src={rootworkLogo} alt="RootWork Framework Logo"
                    style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%", backfaceVisibility: "hidden" }} />
                  <img src={rootworkLogo} alt="RootWork Framework Logo"
                    style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
                </motion.div>
              </div>
              <h1 className="tracking-tight" style={{ color: "#C9A84C" }}>
                RootWork Framework<sup style={{ fontSize: "0.45em", verticalAlign: "super", marginLeft: 2 }}>&trade;</sup>
              </h1>
            </div>
            <p className="max-w-3xl mx-auto mb-4" style={{ color: "rgba(242,244,202,0.8)" }}>
              Trauma-Informed Investigation Training Platform
            </p>
            <p className="max-w-2xl mx-auto text-sm mb-8" style={{ color: "rgba(242,244,202,0.55)" }}>
              Professional training for investigators, prosecutors, judges, medical professionals,
              advocates, and mandated reporters responsible for protecting children from abuse and neglect.
            </p>

            {/* Smooth scroll CTA */}
            <motion.button
              onClick={scrollToGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "#C9A84C", color: "#082A19" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Begin Your Training <ArrowDown className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: <BookOpen className="w-5 h-5" />, label: "7 Modules", sub: "28+ hours" },
              { icon: <Users className="w-5 h-5" />, label: "9 Roles", sub: "Specialized paths" },
              { icon: <Award className="w-5 h-5" />, label: "Certified", sub: "CE credits" },
              { icon: <img src={rootworkLogo} alt="5Rs" className="w-5 h-5 rounded-full object-contain" />, label: "5Rs + TRACE", sub: "Framework" },
            ].map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-sm rounded-xl p-4 text-center"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                <div className="flex justify-center mb-2" style={{ color: "rgba(201,168,76,0.7)" }}>{stat.icon}</div>
                <div className="text-sm" style={{ color: "#C9A84C" }}>{stat.label}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(242,244,202,0.5)" }}>{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NARRATIVE SECTIONS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-background">

        {/* ── Opening Narrative ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="uppercase tracking-[0.2em] text-xs font-medium mb-3" style={{ color: "#C9A84C" }}>
              Why This Platform Exists
            </p>
            <h2 className="mb-6 leading-snug" style={{ fontFamily: "var(--font-display)" }}>
              Professionals who encounter children first shape whether that moment brings safety{" "}
              <span style={{ color: "#C9A84C" }}>or further harm.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When a child discloses abuse, the professional's response in those first critical
              minutes determines whether the encounter establishes psychological safety or
              compounds existing trauma. The RootWork Framework&trade; Training Platform was
              designed from a single conviction: <em>competence is the foundation of compassion.</em>{" "}
              This platform equips investigators, advocates, and mandated reporters with the
              communication, investigative, and trauma-informed competencies necessary to protect children.
            </p>
          </motion.div>
        </section>

        {/* ── Design Thinking Principles ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="uppercase tracking-[0.2em] text-xs font-medium mb-3" style={{ color: "#C9A84C" }}>
              Design Principles
            </p>
            <h2 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Built Around the Learner
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Every design decision is rooted in empathy for the professionals who carry the weight
              of these investigations and the children whose futures depend on their skill.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Brain className="w-5 h-5" />, title: "Cognitive Load Awareness", body: "Content is sequenced to respect the emotional and cognitive demands of trauma-adjacent material. Modules build gradually, with reflection pauses designed to prevent vicarious traumatization." },
              { icon: <Target className="w-5 h-5" />, title: "Role-Differentiated Paths", body: "A forensic interviewer and a mandated reporter face the same child, but from vastly different positions. Every simulation, legal explanation, and scenario adapts to the learner's professional context." },
              { icon: <Layers className="w-5 h-5" />, title: "Scaffolded Complexity", body: "Pre-assessments establish a knowledge baseline, then instruction personalizes. Branching scenarios escalate decision difficulty as competence grows, ensuring productive struggle without overwhelm." },
              { icon: <Lightbulb className="w-5 h-5" />, title: "Reflective Practice", body: "Learning does not end at knowledge transfer. Guided reflection prompts, video vignettes, and journaling exercises develop the metacognitive habits that sustain trauma-informed practice long-term." },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-card rounded-xl border border-border p-6 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C" }}
                >
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold mb-2">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Pedagogical Framework: The 5Rs (with connecting arrows) ── */}
        <section
          className="py-14"
          style={{ background: "linear-gradient(180deg, var(--secondary) 0%, var(--background) 100%)" }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <p className="uppercase tracking-[0.2em] text-xs font-medium mb-3" style={{ color: "#C9A84C" }}>
                Pedagogical Framework
              </p>
              <h2 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>
                The 5Rs of Trauma-Informed Practice
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                Every module is structured around five sequential stages that guide the professional
                from initial awareness to sustained, reconnected practice. The 5Rs are not steps to
                memorize &mdash; they are a living cycle that deepens with each investigation.
              </p>
            </motion.div>

            {/* 5Rs with connecting arrows on desktop */}
            <div className="flex flex-col sm:flex-row items-stretch gap-0">
              {FIVE_RS.map((item, i) => (
                <div key={item.phase} className="flex flex-col sm:flex-row items-stretch flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="bg-card rounded-xl border border-border p-5 text-center flex flex-col items-center flex-1"
                  >
                    <PhaseIcon phase={item.phase} size={44} />
                    <h3 className="text-sm font-bold mt-3 mb-0.5" style={{ color: PHASE_HEX[item.phase] }}>
                      {item.phase}
                    </h3>
                    <p className="text-[11px] font-medium text-muted-foreground mb-2">{item.subtitle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    {/* Step number badge */}
                    <div
                      className="mt-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: PHASE_HEX[item.phase] }}
                    >
                      {i + 1}
                    </div>
                  </motion.div>

                  {/* Connecting arrow (not after last) */}
                  {i < FIVE_RS.length - 1 && (
                    <div className="hidden sm:flex items-center justify-center px-1.5">
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.07 + 0.2 }}
                        className="flex items-center"
                        style={{ color: "#C9A84C" }}
                      >
                        <div className="w-4 sm:w-6 h-0.5" style={{ background: "#C9A84C" }} />
                        <ArrowRight className="w-3.5 h-3.5 -ml-1" />
                      </motion.div>
                    </div>
                  )}
                  {/* Vertical arrow on mobile */}
                  {i < FIVE_RS.length - 1 && (
                    <div className="flex sm:hidden justify-center py-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                        style={{ color: "#C9A84C" }}
                      >
                        <div className="w-0.5 h-4" style={{ background: "#C9A84C" }} />
                        <ChevronDown className="w-3.5 h-3.5 -mt-0.5" />
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Cycle indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-muted-foreground italic flex items-center justify-center gap-2">
                <span className="w-8 h-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.3)" }} />
                The cycle deepens with each investigation
                <span className="w-8 h-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.3)" }} />
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── TRACE Cognitive Cycle ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="uppercase tracking-[0.2em] text-xs font-medium mb-3" style={{ color: "#C9A84C" }}>
              Cognitive Model
            </p>
            <h2 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>
              The TRACE Cycle
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              TRACE maps the cognitive pathway every professional travels during a critical
              encounter. By making this cycle visible, professionals learn to interrupt
              automatic reactions and replace them with deliberate, trauma-informed choices.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-5 gap-4">
            {TRACE_ORDER.map((letter, i) => (
              <motion.div
                key={letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="bg-card rounded-xl border border-border p-5 flex flex-col items-center text-center"
              >
                <TraceIcon letter={letter} size={40} />
                <h3 className="text-sm font-bold mt-3 mb-1" style={{ color: "#082A19" }}>
                  <span className="text-base" style={{ color: "#C9A84C", fontFamily: "var(--font-display)" }}>{letter}</span>
                  {" "}&mdash; {TRACE_LABELS[letter].split(" ")[0]}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {TRACE_DESCRIPTIONS[letter]}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Methodology ── */}
        <section className="py-14" style={{ background: "var(--primary)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <p className="uppercase tracking-[0.2em] text-xs font-medium mb-3" style={{ color: "rgba(201,168,76,0.7)" }}>
                Methodology
              </p>
              <h2 className="mb-3" style={{ fontFamily: "var(--font-display)", color: "#C9A84C" }}>
                How Learning Happens Here
              </h2>
              <p className="max-w-2xl mx-auto text-sm" style={{ color: "rgba(242,244,202,0.65)" }}>
                The platform's instructional design synthesizes established pedagogical research
                with the lived realities of child welfare and criminal investigation work.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "Scenario-Based Simulation", body: "Learners are placed inside realistic investigative situations \u2014 interviewing a suspected abuse victim, interacting with distressed caregivers, coordinating with multidisciplinary teams. Every decision has immediate, visible consequences that map back to the TRACE cycle." },
                { title: "Adaptive Pre/Post Assessment", body: "Each module opens with a baseline knowledge assessment and closes with a competency evaluation measuring legal knowledge, trauma-informed communication skills, investigative decision-making, and disability accommodation awareness." },
                { title: "Video Vignette Analysis", body: "Short dramatized scenarios allow learners to observe investigative interactions, identify trauma responses in both the child and the professional, and practice applying the 5Rs framework to real-world dynamics before they encounter them in the field." },
                { title: "Branching Decision Trees", body: "Rather than linear instruction, scenarios branch based on the learner's choices. Each branch reveals different outcomes, teaching professionals that trauma-informed practice is not a checklist but a series of context-dependent judgments." },
                { title: "Disability-Inclusive Design", body: "Module 3 specifically addresses investigations involving children with disabilities. Training covers IDEA, Section 504, ADA accommodations during forensic interviews, and communication strategies for children with EBD, ASD, and cognitive disabilities." },
                { title: "Mandated Reporter Track", body: "Module 7 provides dedicated training for teachers, community center staff, coaches, and other mandated reporters \u2014 focusing on recognition, reporting, and post-report support. Distinct from investigative modules, it emphasizes the reporter's unique legal obligations and emotional needs." },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-xl p-6 flex flex-col"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}
                >
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "#C9A84C" }}>{card.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(242,244,202,0.6)" }}>{card.body}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mt-10 max-w-2xl mx-auto text-sm italic"
              style={{ color: "rgba(242,244,202,0.5)" }}
            >
              "The way we investigate shapes what children believe about the systems designed
              to protect them. This platform exists to ensure that belief is one of safety,
              not betrayal."
            </motion.p>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="uppercase tracking-[0.2em] text-xs font-medium mb-3" style={{ color: "#C9A84C" }}>
              Questions & Answers
            </p>
            <h2 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Everything you need to know about the platform, or ask Rooty using the chat widget below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border p-6 sm:p-8"
          >
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </section>

        {/* ── Get Started CTA (scroll target) ── */}
        <section ref={getStartedRef} className="py-16" style={{ background: "var(--secondary)" }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={rootworkLogo} alt="RootWork" className="w-16 h-16 mx-auto mb-4 rounded-full object-contain" />
              <h2 className="mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Ready to Begin?
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                Create your account, select your professional role, and start your
                personalized trauma-informed training path today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => openAuth("signup")}
                  className="px-8 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90 flex items-center gap-2"
                  style={{ background: "#082A19", color: "#C9A84C" }}
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </button>
                <button
                  onClick={() => openAuth("signin")}
                  className="px-8 py-3 rounded-lg text-sm font-medium border transition-all hover:bg-card flex items-center gap-2"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <LegalFooter variant="full" />

      {/* ── Auth Modal ── */}
      <AnimatePresence>
        {authOpen && (
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            defaultMode={authMode}
          />
        )}
      </AnimatePresence>

      {/* ── Rooty Chatbot ── */}
      <RootyChatbot />
    </div>
  );
}
