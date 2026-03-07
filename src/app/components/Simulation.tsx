import { useState } from "react";
import { useParams, Link } from "react-router";
import { MODULES } from "./data";
import type { ScenarioChoice } from "./data";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Quote,
  BookOpenText,
  GitBranch,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TTSControls, InlineTTSButton } from "./TTSControls";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoVignette } from "./VideoVignette";
import { useAuth } from "./AuthContext";
import { TraceIcon, type TraceLetter } from "./TraceIcon";

export function Simulation() {
  const { moduleId } = useParams();
  const module = MODULES.find((m) => m.id === Number(moduleId));
  const scenarios = module?.scenarios || [];
  const { saveSimulationResult, updateModuleProgress, progress: userProgress } = useAuth();

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  const [decisions, setDecisions] = useState<ScenarioChoice[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [vignetteComplete, setVignetteComplete] = useState(false);
  const [activeBranchKey, setActiveBranchKey] = useState<string | null>(null);

  if (!module || scenarios.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No scenarios available for this module</p>
        <Link
          to={`/modules/${module?.id || ""}`}
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          Back to module
        </Link>
      </div>
    );
  }

  const scenario = scenarios[scenarioIdx];
  const step = scenario.steps[stepIdx];
  const isLastStep = stepIdx === scenario.steps.length - 1;
  const totalSteps = scenario.steps.length;

  // Resolve branch-specific vignette and narrative
  const resolvedVignettes = (() => {
    if (activeBranchKey && step.branchVignettes?.[activeBranchKey]) {
      return step.branchVignettes[activeBranchKey];
    }
    return step.vignette || [];
  })();

  const resolvedNarrative = (() => {
    if (activeBranchKey && step.branchNarratives?.[activeBranchKey]) {
      return step.branchNarratives[activeBranchKey];
    }
    return step.narrative;
  })();

  const isBranched = !!(activeBranchKey && (step.branchVignettes?.[activeBranchKey] || step.branchNarratives?.[activeBranchKey]));

  const handleChoose = (choice: ScenarioChoice) => {
    setSelectedChoice(choice);
  };

  const handleContinue = () => {
    if (!selectedChoice) return;
    const newDecisions = [...decisions, selectedChoice];
    setDecisions(newDecisions);

    if (isLastStep) {
      setIsComplete(true);
      // Save simulation result to Supabase
      const optimalCount = newDecisions.filter((d) => d.isOptimal).length;
      saveSimulationResult({
        moduleId: module.id,
        scenarioId: scenario.id,
        decisions: newDecisions.map((d) => ({
          text: d.text,
          isOptimal: d.isOptimal,
          tracePhase: d.tracePhase,
          branchKey: d.branchKey || null,
        })),
        optimalCount,
        totalSteps,
        branchPath: newDecisions.map((d) => d.branchKey || "default"),
      }).catch((e) => console.error("Failed to save simulation:", e));

      // Update module progress
      const currentProgress = userProgress.find((p) => p.moduleId === module.id);
      const currentScenarios = currentProgress?.scenariosCompleted || [];
      if (!currentScenarios.includes(scenario.id)) {
        updateModuleProgress(module.id, {
          scenariosCompleted: [...currentScenarios, scenario.id],
          status: "in_progress",
        }).catch((e) => console.error("Failed to update progress:", e));
      }
    } else {
      setActiveBranchKey(selectedChoice.branchKey || null);
      setStepIdx((prev) => prev + 1);
      setSelectedChoice(null);
      setVignetteComplete(false);
    }
  };

  const handleRestart = () => {
    setStepIdx(0);
    setSelectedChoice(null);
    setDecisions([]);
    setIsComplete(false);
    setVignetteComplete(false);
    setActiveBranchKey(null);
  };

  const handleNextScenario = () => {
    setScenarioIdx((prev) => prev + 1);
    setStepIdx(0);
    setSelectedChoice(null);
    setDecisions([]);
    setIsComplete(false);
    setVignetteComplete(false);
    setActiveBranchKey(null);
  };

  const hasVignette = resolvedVignettes.length > 0;
  const showChoices = !hasVignette || vignetteComplete;
  const optimalCount = decisions.filter((d) => d.isOptimal).length;

  const buildNarrativeTTS = () => `Step ${stepIdx + 1} of ${totalSteps}. ${resolvedNarrative}`;
  const buildChoiceTTS = () => {
    let text = "What do you do? Your options are: ";
    step.choices.forEach((c, i) => { text += `Option ${i + 1}: ${c.text}. `; });
    return text;
  };

  if (isComplete) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="relative h-32 overflow-hidden">
            <ImageWithFallback src={module.image} alt={module.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(to bottom, rgba(58,21,80,0.6), rgba(58,21,80,0.9))" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: optimalCount === totalSteps ? "rgba(13,59,34,0.2)" : "rgba(92,50,0,0.2)" }}>
                {optimalCount === totalSteps ? <CheckCircle2 className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2>Scenario Complete</h2>
              <p className="text-muted-foreground text-sm mt-1">{scenario.title}</p>
              <div className="relative w-28 h-28 mx-auto mt-4 mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--muted)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={optimalCount === totalSteps ? "#059669" : "#ea580c"} strokeWidth="10" strokeDasharray={`${(optimalCount / totalSteps) * 314} 314`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl" style={{ color: optimalCount === totalSteps ? "#059669" : "#ea580c" }}>{optimalCount}/{totalSteps}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Optimal Decisions</p>
            </div>
            <div className="mb-6">
              <TTSControls text={`Scenario complete. You made ${optimalCount} out of ${totalSteps} optimal decisions. ${optimalCount === totalSteps ? "Excellent work applying trauma-informed principles." : "Review the feedback below to understand the TRACE analysis for each decision."}`} label="Listen to results" />
            </div>
            <div className="space-y-4 mb-8">
              <h3 className="text-sm flex items-center gap-2"><BookOpenText className="w-4 h-4" /> TRACE Analysis of Your Decisions</h3>
              {decisions.map((decision, i) => (
                <div key={i} className="p-4 rounded-xl border-2" style={{
                  borderColor: decision.isOptimal ? "rgba(13,59,34,0.2)" : "rgba(92,50,0,0.2)",
                  background: decision.isOptimal ? "rgba(13,59,34,0.04)" : "rgba(92,50,0,0.04)",
                }}>
                  <div className="flex items-start gap-3">
                    {decision.isOptimal ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#C9A84C" }} />}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm"><span className="text-muted-foreground">Step {i + 1}:</span> {decision.text}</p>
                        <InlineTTSButton text={`Step ${i + 1}: ${decision.text}. Outcome: ${decision.outcome}. TRACE: ${decision.tracePhase}. ${decision.citation || ""}`} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{decision.outcome}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-xs" style={{
                          background: decision.isOptimal ? "rgba(13,59,34,0.08)" : "rgba(92,50,0,0.1)",
                          color: decision.isOptimal ? "#0D3B22" : "#5C3200",
                        }}>{decision.isOptimal ? "Optimal" : "Suboptimal"}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                          <TraceIcon letter={decision.tracePhase?.charAt(0) as TraceLetter} size={14} />
                          TRACE: {decision.tracePhase}
                        </span>
                      </div>
                      {decision.citation && (
                        <div className="mt-3 pl-3 border-l-2 border-primary/20">
                          <p className="text-xs text-primary flex items-center gap-1 mb-1"><Quote className="w-3 h-3" /> Reference (APA)</p>
                          <p className="text-xs text-muted-foreground leading-relaxed" style={{ textIndent: "-1.5em", paddingLeft: "1.5em" }}>{decision.citation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRestart} className="px-5 py-2.5 rounded-lg border border-border hover:bg-secondary text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Try Again</button>
              {scenarioIdx < scenarios.length - 1 && (
                <button onClick={handleNextScenario} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 flex items-center gap-2">
                  Next Scenario <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link to={`/modules/${module.id}`} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90">Return to Module</Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link to={`/modules/${module.id}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3 h-3" /> Back to Module {module.id}
        </Link>
        <div className="relative h-28 rounded-xl overflow-hidden mb-4">
          <ImageWithFallback src={module.image} alt={scenario.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center px-5" style={{ background: "linear-gradient(to right, rgba(58,21,80,0.8), rgba(58,21,80,0.4))" }}>
            <div>
              <div className="flex items-center gap-2 mb-1"><Gamepad2 className="w-5 h-5 text-white" /><h2 className="text-white">{scenario.title}</h2></div>
              <p className="text-white/70 text-sm">{scenario.description}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {scenario.steps.map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-all"
              style={{
                background: i < stepIdx
                  ? (decisions[i]?.isOptimal ? "#0D3B22" : "#C9A84C")
                  : i === stepIdx ? "var(--primary)" : "var(--muted)",
              }}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={`${stepIdx}-${activeBranchKey || "default"}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {isBranched && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(58,21,80,0.06)", borderColor: "rgba(58,21,80,0.2)" }}>
              <GitBranch className="w-4 h-4" style={{ color: "#3A1550" }} />
              <p className="text-xs" style={{ color: "#3A1550" }}><span className="font-medium">Branching narrative:</span> This scene reflects the consequences of your previous choice.</p>
            </motion.div>
          )}

          {hasVignette && !vignetteComplete && (
            <div className="mb-6">
              <VideoVignette scenes={resolvedVignettes} title={scenario.title} onComplete={() => setVignetteComplete(true)} />
            </div>
          )}

          {showChoices && (
            <>
              <div className="mb-4"><TTSControls text={buildNarrativeTTS()} label="Listen to scenario" /></div>
              <motion.div initial={hasVignette ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs rounded" style={{ background: "rgba(58,21,80,0.08)", color: "#3A1550" }}>Step {stepIdx + 1} of {totalSteps}</span>
                  <span className="text-xs text-muted-foreground">Scenario Narrative</span>
                  {isBranched && <span className="px-2 py-0.5 text-xs rounded flex items-center gap-1" style={{ background: "rgba(30,58,95,0.08)", color: "#1E3A5F" }}><GitBranch className="w-3 h-3" /> Branched</span>}
                </div>
                <p className="text-sm leading-relaxed">{resolvedNarrative}</p>
              </motion.div>
              <div className="mb-3"><TTSControls text={buildChoiceTTS()} label="Listen to options" compact /></div>
            </>
          )}

          {showChoices && (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> What do you do?</p>
              {step.choices.map((choice, i) => {
                const isSelected = selectedChoice === choice;
                const showOutcome = selectedChoice !== null;
                return (
                  <button
                    key={i}
                    onClick={() => !showOutcome && handleChoose(choice)}
                    disabled={showOutcome && !isSelected}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showOutcome && isSelected
                        ? ""
                        : isSelected ? "border-primary bg-primary/5"
                        : showOutcome ? "border-border opacity-40"
                        : "border-border hover:border-primary/30 hover:bg-secondary/50"
                    }`}
                    style={showOutcome && isSelected ? {
                      borderColor: choice.isOptimal ? "rgba(13,59,34,0.4)" : "rgba(92,50,0,0.3)",
                      background: choice.isOptimal ? "rgba(13,59,34,0.04)" : "rgba(92,50,0,0.04)",
                    } : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          !(showOutcome && isSelected) ? "bg-muted text-muted-foreground" : ""
                        }`}
                        style={
                          showOutcome && isSelected
                            ? { background: choice.isOptimal ? "#0D3B22" : "#5C3200", color: "white" }
                            : undefined
                        }
                      >{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm">{choice.text}</p>
                        {showOutcome && isSelected && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2">
                            <p className="text-sm text-foreground/70">{choice.outcome}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-xs" style={{
                                background: choice.isOptimal ? "rgba(13,59,34,0.08)" : "rgba(92,50,0,0.1)",
                                color: choice.isOptimal ? "#0D3B22" : "#5C3200",
                              }}>{choice.isOptimal ? "Optimal Response" : "Suboptimal Response"}</span>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                                <TraceIcon letter={choice.tracePhase?.charAt(0) as TraceLetter} size={14} />
                                TRACE: {choice.tracePhase}
                              </span>
                            </div>
                            {choice.citation && (
                              <div className="pl-3 border-l-2 border-primary/20 mt-2">
                                <p className="text-xs text-primary flex items-center gap-1 mb-1"><Quote className="w-3 h-3" /> Reference (APA)</p>
                                <p className="text-xs text-muted-foreground leading-relaxed" style={{ textIndent: "-1.5em", paddingLeft: "1.5em" }}>{choice.citation}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {showChoices && selectedChoice && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
              <button onClick={handleContinue} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
                {isLastStep ? "View Results" : "Continue"} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}