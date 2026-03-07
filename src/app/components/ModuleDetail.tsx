import { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TTSControls, InlineTTSButton } from "./TTSControls";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoVignette } from "./VideoVignette";
import { useAuth } from "./AuthContext";
import { PhaseIcon, PHASE_HEX as PHASE_HEX_IMPORT, hexAlpha } from "./PhaseIcon";
import { StateSelector, StateComparisonCard } from "./StateSelector";

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
    } catch {}
  };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedState, setSelectedState] = useState(profile?.selectedState || "GA");

  // Sync selectedState when profile loads asynchronously
  useEffect(() => {
    if (profile?.selectedState && profile.selectedState !== selectedState) {
      setSelectedState(profile.selectedState);
    }
  }, [profile?.selectedState]);

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
          <button onClick={() => navigate(`/modules/${module.id}/simulation`)} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all text-left flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: hexAlpha(ACTION_BUTTONS.sim.hex, 0.08) }}>
              <Gamepad2 className="w-5 h-5" style={{ color: ACTION_BUTTONS.sim.hex }} />
            </div>
            <div><p className="text-sm">Scenario Simulation</p><p className="text-xs text-muted-foreground">Interactive TRACE exercises</p></div>
          </button>
        )}
        <button onClick={() => navigate(`/modules/${module.id}/assessment/post`)} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all text-left flex items-start gap-3 group">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: hexAlpha(ACTION_BUTTONS.post.hex, 0.08) }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: ACTION_BUTTONS.post.hex }} />
          </div>
          <div>
            <p className="text-sm">Post-Assessment</p>
            <p className="text-xs text-muted-foreground">Competency evaluation</p>
            {progress?.postAssessmentScore != null && <p className="text-xs mt-1" style={{ color: ACTION_BUTTONS.post.hex }}>Score: {progress.postAssessmentScore}%</p>}
          </div>
        </button>
      </div>

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
                <button onClick={() => toggleSection(section.id)} className="w-full p-4 flex items-center gap-4 text-left">
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
                          {section.content.map((text, i) => (
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

                        {section.keyTerms && section.keyTerms.length > 0 && (
                          <div className="bg-secondary rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3"><Bookmark className="w-4 h-4 text-primary" /><p className="text-xs text-primary">Key Terms & Definitions</p></div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {section.keyTerms.map((kt) => (
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
                        )}

                        <div className="grid sm:grid-cols-2 gap-3 mb-4">
                          <div className="bg-muted rounded-lg p-4 flex items-center gap-3 hover:bg-muted/80 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Video className="w-5 h-5 text-primary" /></div>
                            <div><p className="text-xs">Video Lecture</p><p className="text-xs text-muted-foreground">15-20 min narrated presentation</p></div>
                          </div>
                          <div className="bg-muted rounded-lg p-4 flex items-center gap-3 hover:bg-muted/80 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><FileDown className="w-5 h-5 text-primary" /></div>
                            <div><p className="text-xs">Reference Materials</p><p className="text-xs text-muted-foreground">Downloadable PDF guide</p></div>
                          </div>
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