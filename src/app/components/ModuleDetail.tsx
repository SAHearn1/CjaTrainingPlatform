import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { MODULES, PHASE_VIGNETTES } from "./data";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Video,
  FileDown,
  ChevronDown,
  ChevronUp,
  BookOpenText,
  Lightbulb,
  Bookmark,
  Film,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TTSControls, InlineTTSButton } from "./TTSControls";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoVignette } from "./VideoVignette";
import { VideoEmbed } from "./VideoEmbed";
import { useAuth } from "./AuthContext";
import { PhaseIcon, PHASE_HEX as PHASE_HEX_IMPORT, hexAlpha } from "./PhaseIcon";
import { StateSelector, StateComparisonCard } from "./StateSelector";
import { useContentOverrides } from "./VideoRegistry";

// Brand 5Rs phase colors (hex + computed rgba tints)
const PHASE_HEX: Record<string, string> = PHASE_HEX_IMPORT;

const phaseDescriptions: Record<string, string> = {
  Root: "Establish foundational understanding of core concepts and legal context",
  Regulate: "Learn trauma-informed professional conduct and self-regulation",
  Reflect: "Engage in interactive scenario analysis and case review",
  Restore: "Master correct investigative procedures and protocols",
  Reconnect: "Build multidisciplinary collaboration and victim support",
};

// Action button config aligned to brand palette
const ACTION_BUTTONS = {
  pre: { hex: "#1E3A5F", label: "Pre-Assessment", sub: "Test baseline knowledge", icon: ClipboardCheck },
  sim: { hex: "#3A1550", label: "Scenario Simulation", sub: "Interactive TRACE exercises", icon: Gamepad2 },
  post: { hex: "#0D3B22", label: "Post-Assessment", sub: "Competency evaluation", icon: CheckCircle2 },
};

export function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = MODULES.find((m) => m.id === Number(moduleId));
  const { progress: userProgress, watchedVignettes, markVignetteWatched, unmarkVignetteWatched, updateModuleProgress, profile, updateProfile } = useAuth();
  const { overrides: contentOverrides } = useContentOverrides();
  const progress = userProgress.find((p) => p.moduleId === Number(moduleId));
  // Reflections: controlled state persisted to localStorage per module+section
  const [reflections, setReflections] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(`reflections:module:${moduleId}`) || "{}");
    } catch {
      return {};
    }
  });

  const handleReflectionChange = (sectionId: string, text: string) => {
    const updated = { ...reflections, [sectionId]: text };
    setReflections(updated);
    try {
      localStorage.setItem(`reflections:module:${moduleId}`, JSON.stringify(updated));
    } catch { /* localStorage unavailable — non-critical */ }
  };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedState, setSelectedState] = useState(profile?.selectedState || "GA");

  // Sync selectedState when profile loads asynchronously
  useEffect(() => {
    if (profile?.selectedState && profile.selectedState !== selectedState) {
      setSelectedState(profile.selectedState);
    }
  }, [profile?.selectedState]);

  // ── Time tracking (#67) ──
  // Accumulate seconds spent on this module page and persist every 60 s.
  const sessionStartRef = useRef<number>(Date.now());

  const flushTimeSpent = useCallback(() => {
    const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    sessionStartRef.current = Date.now();
    if (elapsed > 0 && module) {
      const existing = userProgress.find((p) => p.moduleId === module.id)?.timeSpent || 0;
      updateModuleProgress(module.id, { timeSpent: existing + elapsed }).catch(() => {/* non-blocking */});
    }
  }, [module, userProgress, updateModuleProgress]);

  useEffect(() => {
    if (!module) return;
    sessionStartRef.current = Date.now();

    // Sync every 60 s while the tab is visible
    const interval = setInterval(flushTimeSpent, 60_000);

    // Pause timer when tab is hidden, resume when visible
    const handleVisibility = () => {
      if (document.hidden) {
        flushTimeSpent();
      } else {
        sessionStartRef.current = Date.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      flushTimeSpent(); // write final elapsed time on unmount
    };
    // Run only when the module changes or the flush function updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id]);

  const handleStateSelect = (abbrev: string) => {
    setSelectedState(abbrev);
    // Persist to user profile
    updateProfile({ selectedState: abbrev }).catch((e) =>
      console.error("Failed to persist selected state:", e)
    );
  };

  if (!module) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Module not found</p>
        <Link to="/modules" className="text-primary hover:underline text-sm mt-2 inline-block">
          Back to modules
        </Link>
      </div>
    );
  }

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMarkComplete = async (sectionId: string) => {
    const currentCompleted = progress?.sectionsCompleted || [];
    if (currentCompleted.includes(sectionId)) return;
    const newCompleted = [...currentCompleted, sectionId];
    const allDone = newCompleted.length === module.sections.length;
    await updateModuleProgress(module.id, {
      sectionsCompleted: newCompleted,
      status: allDone ? "completed" : "in_progress",
      ...(allDone ? { completedDate: new Date().toISOString() } : {}),
    });
  };

  const completedSections = progress?.sectionsCompleted?.length || 0;
  const totalSections = module.sections.length;
  const pct = Math.round((completedSections / totalSections) * 100);

  const preScore = progress?.preAssessmentScore;
  const preAssessmentDone = preScore != null;
  const simCompleted = (progress?.scenariosCompleted?.length || 0) > 0;
  // Personalization: suggest focused sections when pre-assessment score is low
  const personalizationTip = preScore != null
    ? preScore >= 80
      ? "Your pre-assessment shows strong baseline knowledge. Consider challenging yourself by completing the Post-Assessment first."
      : preScore >= 60
      ? "You have a good foundation. Pay extra attention to the Restore and Reconnect phases to strengthen procedural knowledge."
      : "Complete each section carefully — your pre-assessment indicates this content will be new. Take notes in the Reflection prompts as you go."
    : null;

  async function handleDownloadSection(section: (typeof MODULES)[0]["sections"][0]) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const EVERGREEN = [8, 42, 25] as const;
    const GOLD = [201, 168, 76] as const;
    const CANVAS = [242, 244, 202] as const;
    const WHITE = [255, 255, 255] as const;
    const DARK = [26, 26, 26] as const;
    const MUTED = [100, 100, 100] as const;

    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    // Header bar
    doc.setFillColor(...EVERGREEN);
    doc.rect(0, 0, pw, 28, "F");

    // Gold accent line
    doc.setFillColor(...GOLD);
    doc.rect(0, 28, pw, 2, "F");

    // Title text in header
    doc.setTextColor(...GOLD);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RootWork Framework™", 14, 12);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...CANVAS);
    doc.text("Trauma-Informed Investigation Training Platform", 14, 19);
    doc.text(`Module ${module!.id}: ${module!.title}`, 14, 25);

    // Module badge (right side)
    doc.setFillColor(...GOLD);
    doc.roundedRect(pw - 44, 6, 36, 16, 3, 3, "F");
    doc.setTextColor(...EVERGREEN);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`MODULE ${module!.id}`, pw - 26, 12, { align: "center" });
    doc.setFontSize(7);
    doc.text(section.phase.toUpperCase(), pw - 26, 18, { align: "center" });

    // Section title
    doc.setFillColor(248, 250, 242);
    doc.rect(0, 30, pw, 22, "F");
    doc.setTextColor(...EVERGREEN);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, 14, 41);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(section.description, 14, 49, { maxWidth: pw - 28 });

    let y = 62;

    // Key Concepts section
    doc.setFillColor(...EVERGREEN);
    doc.rect(14, y, 4, section.content.length * 10 + 8, "F");
    doc.setFillColor(248, 250, 242);
    doc.rect(18, y, pw - 32, section.content.length * 10 + 8, "F");

    doc.setTextColor(...EVERGREEN);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("KEY CONCEPTS", 22, y + 7);
    y += 14;

    section.content.forEach((point, i) => {
      if (y > ph - 30) { doc.addPage(); y = 20; }
      doc.setFillColor(...GOLD);
      doc.circle(25, y - 1.5, 2, "F");
      doc.setTextColor(...DARK);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(`${i + 1}.  ${point}`, pw - 50);
      doc.text(lines, 32, y);
      y += lines.length * 5 + 3;
    });

    y += 6;

    // Key Terms section
    if (section.keyTerms && section.keyTerms.length > 0) {
      if (y > ph - 60) { doc.addPage(); y = 20; }

      doc.setFillColor(...GOLD);
      doc.rect(14, y, pw - 28, 10, "F");
      doc.setTextColor(...EVERGREEN);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("KEY TERMS & DEFINITIONS", 18, y + 7);
      y += 14;

      section.keyTerms.forEach((kt) => {
        if (y > ph - 30) { doc.addPage(); y = 20; }
        doc.setFillColor(248, 250, 242);
        const defLines = doc.splitTextToSize(kt.definition, pw - 60);
        const blockH = 8 + defLines.length * 4.5;
        doc.roundedRect(14, y - 4, pw - 28, blockH, 2, 2, "F");
        doc.setTextColor(...EVERGREEN);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(kt.term, 18, y + 1);
        doc.setTextColor(...DARK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(defLines, 18, y + 6);
        y += blockH + 4;
      });
    }

    // Footer on every page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...EVERGREEN);
      doc.rect(0, ph - 14, pw, 14, "F");
      doc.setFillColor(...GOLD);
      doc.rect(0, ph - 14, pw, 1.5, "F");
      doc.setTextColor(...CANVAS);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("© RootWork Framework™ Training Platform — For authorized training use only. GALS × RWFW.", 14, ph - 6);
      doc.setTextColor(...GOLD);
      doc.text(`Page ${i} of ${pageCount}`, pw - 14, ph - 6, { align: "right" });
    }

    doc.save(`RootWork_Module${module!.id}_${section.phase}_Reference.pdf`);
  }

  const buildModuleOverviewTTS = () => {
    return `Module ${module.id}: ${module.title}. ${module.description}. This module takes approximately ${module.duration} to complete and contains ${totalSections} learning sections following the RootWork 5Rs framework: Root, Regulate, Reflect, Restore, and Reconnect.`;
  };

  const buildSectionTTS = (section: (typeof module.sections)[0]) => {
    let text = `${section.phase} phase: ${section.title}. ${section.description}. `;
    section.content.forEach((c, i) => {
      text += `Point ${i + 1}: ${c} `;
    });
    if (section.keyTerms) {
      text += "Key terms: ";
      section.keyTerms.forEach((kt) => {
        text += `${kt.term}: ${kt.definition}. `;
      });
    }
    return text;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link to="/modules" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Modules
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        <div className="relative h-48 sm:h-56">
          <ImageWithFallback src={module.image} alt={module.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-white/70 text-xs">Module {module.id}</span>
            <h1 className="text-white mt-1">{module.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className="px-3 py-1 rounded-full text-xs backdrop-blur-sm border"
                style={
                  progress?.status === "completed"
                    ? { background: hexAlpha("#0D3B22", 0.25), color: "#C9A84C", borderColor: hexAlpha("#0D3B22", 0.4) }
                    : progress?.status === "in_progress"
                    ? { background: hexAlpha("#1C4D36", 0.25), color: "#E8D484", borderColor: hexAlpha("#1C4D36", 0.4) }
                    : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }
                }
              >
                {progress?.status === "completed" ? "Completed" : progress?.status === "in_progress" ? "In Progress" : "Not Started"}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {module.duration}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
          <div className="mb-4"><TTSControls text={buildModuleOverviewTTS()} label="Listen to module overview" /></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm text-muted-foreground">{pct}%</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {module.sections.map((section) => {
              const isCompleted = progress?.sectionsCompleted?.includes(section.id);
              const hex = PHASE_HEX[section.phase];
              return (
                <div
                  key={section.id}
                  className="rounded-lg p-2 text-center transition-all border"
                  style={{
                    background: isCompleted ? hexAlpha("#0D3B22", 0.06) : hexAlpha(hex, 0.08),
                    borderColor: isCompleted ? hexAlpha("#0D3B22", 0.2) : hexAlpha(hex, 0.2),
                  }}
                >
                  <PhaseIcon phase={section.phase} size={28} />
                  <p className="text-xs mt-0.5" style={{ color: isCompleted ? "#0D3B22" : hex }}>{section.phase}</p>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 mx-auto mt-0.5" style={{ color: "#0D3B22" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <button onClick={() => navigate(`/modules/${module.id}/assessment/pre`)} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all text-left flex items-start gap-3 group">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: hexAlpha(ACTION_BUTTONS.pre.hex, 0.08) }}>
            <ClipboardCheck className="w-5 h-5" style={{ color: ACTION_BUTTONS.pre.hex }} />
          </div>
          <div>
            <p className="text-sm">Pre-Assessment</p>
            <p className="text-xs text-muted-foreground">Test baseline knowledge</p>
            {progress?.preAssessmentScore != null && <p className="text-xs mt-1" style={{ color: ACTION_BUTTONS.pre.hex }}>Score: {progress.preAssessmentScore}%</p>}
          </div>
        </button>
        {module.scenarios.length > 0 && (
          <button
            onClick={() => preAssessmentDone && navigate(`/modules/${module.id}/simulation`)}
            className={`bg-card rounded-xl border border-border p-4 text-left flex items-start gap-3 group transition-all ${preAssessmentDone ? "hover:shadow-md cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors relative" style={{ background: hexAlpha(ACTION_BUTTONS.sim.hex, 0.08) }}>
              {!preAssessmentDone
                ? <Lock className="w-5 h-5" style={{ color: ACTION_BUTTONS.sim.hex }} />
                : <Gamepad2 className="w-5 h-5" style={{ color: ACTION_BUTTONS.sim.hex }} />
              }
            </div>
            <div>
              <p className="text-sm">Scenario Simulation</p>
              <p className="text-xs text-muted-foreground">{preAssessmentDone ? "Interactive TRACE exercises" : "Complete pre-assessment to unlock"}</p>
              {simCompleted && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: ACTION_BUTTONS.sim.hex }}><CheckCircle2 className="w-3 h-3" /> Completed</p>}
            </div>
          </button>
        )}
        <button
          onClick={() => preAssessmentDone && navigate(`/modules/${module.id}/assessment/post`)}
          className={`bg-card rounded-xl border border-border p-4 text-left flex items-start gap-3 group transition-all ${preAssessmentDone ? "hover:shadow-md cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: hexAlpha(ACTION_BUTTONS.post.hex, 0.08) }}>
            {!preAssessmentDone
              ? <Lock className="w-5 h-5" style={{ color: ACTION_BUTTONS.post.hex }} />
              : <CheckCircle2 className="w-5 h-5" style={{ color: ACTION_BUTTONS.post.hex }} />
            }
          </div>
          <div>
            <p className="text-sm">Post-Assessment</p>
            <p className="text-xs text-muted-foreground">{preAssessmentDone ? "Competency evaluation" : "Complete pre-assessment to unlock"}</p>
            {progress?.postAssessmentScore != null && <p className="text-xs mt-1" style={{ color: ACTION_BUTTONS.post.hex }}>Score: {progress.postAssessmentScore}%</p>}
          </div>
        </button>
      </div>

      {/* Pre-assessment personalization banner */}
      {personalizationTip && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl border px-5 py-4 flex items-start gap-3"
          style={{ background: "rgba(30,58,95,0.05)", borderColor: "rgba(30,58,95,0.15)" }}
        >
          <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#1E3A5F" }} />
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "#1E3A5F" }}>Personalized Recommendation</p>
            <p className="text-xs text-muted-foreground">{personalizationTip}</p>
          </div>
        </motion.div>
      )}

      {/* State Selector — Module 7 only */}
      {module.id === 7 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-semibold">Compare State Reporting Laws</h3>
            <StateSelector selectedState={selectedState} onSelect={handleStateSelect} compact />
          </div>
          <StateComparisonCard stateAbbrev={selectedState} />
        </motion.div>
      )}

      {/* Pre-assessment gate banner */}
      {!preAssessmentDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border-2 overflow-hidden"
          style={{ borderColor: "#1E3A5F" }}
        >
          <div className="px-5 py-4 flex items-start gap-4" style={{ background: "rgba(30,58,95,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(30,58,95,0.12)" }}>
              <Lock className="w-5 h-5" style={{ color: "#1E3A5F" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1" style={{ color: "#1E3A5F" }}>Complete the Pre-Assessment to Unlock This Module</p>
              <p className="text-xs text-muted-foreground mb-3">The pre-assessment establishes your baseline knowledge and personalizes your learning path. It must be completed before accessing module content.</p>
              <button
                onClick={() => navigate(`/modules/${module.id}/assessment/pre`)}
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{ background: "#1E3A5F", color: "white" }}
              >
                <ClipboardCheck className="w-4 h-4" /> Start Pre-Assessment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Learning Sections */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Learning Sections</h2>
        <div className="space-y-3">
          {module.sections.map((section, idx) => {
            const isCompleted = progress?.sectionsCompleted?.includes(section.id);
            const isExpanded = expandedSections.has(section.id);
            const hex = PHASE_HEX[section.phase];
            const phaseVignette = PHASE_VIGNETTES[section.phase];
            const vignetteKey = `${module.id}-${section.phase}`;
            const vignetteWatched = watchedVignettes.includes(vignetteKey);

            return (
              <div
                key={section.id}
                className="bg-card rounded-xl border overflow-hidden transition-all"
                style={{
                  borderColor: isExpanded ? hexAlpha(hex, 0.35) : "var(--border)",
                  boxShadow: isExpanded ? `0 4px 12px ${hexAlpha(hex, 0.1)}` : undefined,
                }}
              >
                <button onClick={() => preAssessmentDone && toggleSection(section.id)} className={`w-full p-4 flex items-center gap-4 text-left ${!preAssessmentDone ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={
                      isCompleted
                        ? { background: hexAlpha("#0D3B22", 0.06), color: "#0D3B22" }
                        : { background: hex, color: "white" }
                    }
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <PhaseIcon phase={section.phase} size={32} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: hexAlpha(hex, 0.08), color: hex }}
                      >
                        {section.phase}
                      </span>
                      <span className="text-xs text-muted-foreground">Section {idx + 1} of {totalSections}</span>
                    </div>
                    <h4 className="mt-1 text-sm">{section.title}</h4>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-4 pb-5 border-t border-border pt-4">
                        {/* Phase Intro Vignette */}
                        {phaseVignette && phaseVignette.length > 0 && !vignetteWatched && (
                          <div className="mb-5">
                            <div className="flex items-center gap-2 mb-2">
                              <Film className="w-4 h-4" style={{ color: hex }} />
                              <p className="text-xs" style={{ color: hex }}><strong>{section.phase} Phase Introduction</strong> — Watch the animated vignette</p>
                            </div>
                            <VideoVignette scenes={phaseVignette} title={`${section.phase} Phase`} onComplete={() => markVignetteWatched(vignetteKey)} compact />
                          </div>
                        )}

                        {phaseVignette && vignetteWatched && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border"
                            style={{ background: hexAlpha(hex, 0.06), borderColor: hexAlpha(hex, 0.2) }}
                          >
                            <CheckCircle2 className="w-4 h-4" style={{ color: hex }} />
                            <span className="text-xs" style={{ color: hex }}>{section.phase} intro vignette watched</span>
                            <button onClick={() => unmarkVignetteWatched(vignetteKey)} className="text-xs underline ml-auto opacity-60 hover:opacity-100" style={{ color: hex }}>Rewatch</button>
                          </motion.div>
                        )}

                        <div className="rounded-lg p-3 mb-4 flex items-start gap-3" style={{ background: hexAlpha(hex, 0.06) }}>
                          <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" style={{ color: hex }} />
                          <p className="text-xs" style={{ color: hex }}><strong>{section.phase} Phase:</strong> {phaseDescriptions[section.phase]}</p>
                        </div>

                        <div className="mb-4"><TTSControls text={buildSectionTTS(section)} label={`Listen to ${section.phase} section`} /></div>

                        <div className="space-y-3 mb-5">
                          {(contentOverrides[section.videoId ?? ""]?.content ?? section.content).map((text, i) => (
                            <div key={i} className="flex items-start gap-3 group/item">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5"
                                style={{ background: hexAlpha(hex, 0.08), color: hex }}
                              >
                                {i + 1}
                              </div>
                              <p className="text-sm text-foreground/80 flex-1">{text}</p>
                              <InlineTTSButton text={text} />
                            </div>
                          ))}
                        </div>

                        {(() => {
                          const activeKeyTerms = contentOverrides[section.videoId ?? ""]?.keyTerms ?? section.keyTerms;
                          return activeKeyTerms && activeKeyTerms.length > 0 ? (
                          <div className="bg-secondary rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3"><Bookmark className="w-4 h-4 text-primary" /><p className="text-xs text-primary">Key Terms & Definitions</p></div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {activeKeyTerms.map((kt) => (
                                <div key={kt.term} className="bg-card rounded-lg p-3 border border-border">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-primary">{kt.term}</p>
                                    <InlineTTSButton text={`${kt.term}: ${kt.definition}`} />
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{kt.definition}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null; })()}

                        {(section.videoId || section.videoUrl) && (
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5" /> Video Lecture
                            </p>
                            <VideoEmbed videoId={section.videoId} url={section.videoUrl} title={`${section.phase} — ${section.title}`} />
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-3 mb-4">
                          {!section.videoId && !section.videoUrl && (
                          <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Video className="w-5 h-5 text-primary" /></div>
                            <div><p className="text-xs">Video Lecture</p><p className="text-xs text-muted-foreground">Coming soon — check back for updates</p></div>
                          </div>
                          )}
                          <button
                            onClick={() => handleDownloadSection(section)}
                            className="bg-muted rounded-lg p-4 flex items-center gap-3 hover:bg-muted/80 transition-colors cursor-pointer w-full text-left"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileDown className="w-5 h-5 text-primary" /></div>
                            <div><p className="text-xs">Reference Materials</p><p className="text-xs text-muted-foreground">Download section quick-reference guide</p></div>
                          </button>
                        </div>

                        <div className="rounded-xl p-5 border" style={{ background: hexAlpha(hex, 0.05), borderColor: hexAlpha(hex, 0.15) }}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs flex items-center gap-1.5" style={{ color: hex }}><BookOpenText className="w-3.5 h-3.5" /> Guided Reflection</p>
                            <TTSControls text={`Guided Reflection: How does the concept of ${section.phase} apply to your professional role? Consider a recent case or situation where this approach could have changed the outcome.`} compact label="Listen" />
                          </div>
                          <p className="text-sm text-foreground/80 mb-3">How does the concept of "{section.phase}" apply to your professional role? Consider a recent case or situation where this approach could have changed the outcome.</p>
                          <textarea
                            className="w-full p-3 rounded-lg border border-border bg-white text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            rows={3}
                            placeholder="Write your reflection here..."
                            value={reflections[section.id] || ""}
                            onChange={(e) => handleReflectionChange(section.id, e.target.value)}
                          />
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => !isCompleted && handleMarkComplete(section.id)}
                            className="px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all border"
                            style={
                              isCompleted
                                ? { background: hexAlpha("#0D3B22", 0.06), color: "#0D3B22", borderColor: hexAlpha("#0D3B22", 0.2) }
                                : { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "transparent" }
                            }
                          >
                            {isCompleted ? (<><CheckCircle2 className="w-4 h-4" /> Section Completed</>) : (<>Mark as Complete <ArrowRight className="w-4 h-4" /></>)}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}