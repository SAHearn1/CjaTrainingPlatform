import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { MODULES } from "./data";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Award,
  RotateCcw,
  BookOpenText,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TTSControls, InlineTTSButton } from "./TTSControls";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./AuthContext";

/**
 * Mulberry32 seeded PRNG — deterministic per seed.
 * Returns a function that produces numbers in [0, 1).
 */
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using a seeded RNG (returns a new array). */
function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rng = seededRng(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Assessment() {
  const { moduleId, type } = useParams();
  const navigate = useNavigate();
  const module = MODULES.find((m) => m.id === Number(moduleId));
  const assessment = type === "pre" ? module?.preAssessment : module?.postAssessment;
  const { updateModuleProgress, user } = useAuth();

  // Shuffle questions once per session using a seed derived from userId + moduleId + type.
  // This gives each user a consistent but unique ordering.
  const shuffledQuestions = useMemo(() => {
    if (!assessment?.questions) return [];
    const userId = user?.id || "anon";
    let seed = 0;
    for (let i = 0; i < userId.length; i++) seed = ((seed << 5) - seed + userId.charCodeAt(i)) | 0;
    seed = (seed ^ Number(moduleId) * 31) | 0;
    seed = (seed ^ (type === "pre" ? 7 : 13)) | 0;
    return shuffleWithSeed(assessment.questions, seed >>> 0);
  }, [assessment, user?.id, moduleId, type]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(assessment?.questions.length || 0).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!module || !assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Assessment not found</p>
        <Link to="/modules" className="text-primary hover:underline text-sm mt-2 inline-block">
          Back to modules
        </Link>
      </div>
    );
  }

  const question = shuffledQuestions[currentQuestion];
  const totalQuestions = shuffledQuestions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsComplete(true);
      // Save score to Supabase
      const finalAnswers = [...answers];
      finalAnswers[currentQuestion] = selectedAnswer;
      const correct = finalAnswers.filter(
        (a, i) => a === shuffledQuestions[i]?.correctIndex
      ).length;
      const finalScore = Math.round((correct / totalQuestions) * 100);
      const field = type === "pre" ? "preAssessmentScore" : "postAssessmentScore";
      updateModuleProgress(module.id, {
        [field]: finalScore,
        status: "in_progress",
      }).catch((e) => console.error("Failed to save assessment score:", e));
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const correctCount = answers.filter(
    (a, i) => a === shuffledQuestions[i]?.correctIndex
  ).length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 70;

  const buildQuestionTTS = () => {
    let text = `Question ${currentQuestion + 1} of ${totalQuestions}. ${question.text} `;
    question.options.forEach((opt, i) => {
      text += `Option ${String.fromCharCode(65 + i)}: ${opt}. `;
    });
    return text;
  };

  const buildExplanationTTS = () => {
    let text = `${
      selectedAnswer === question.correctIndex ? "Correct!" : "Incorrect."
    } ${question.explanation} `;
    text += "References: ";
    question.citations.forEach((c, i) => {
      text += `Citation ${i + 1}: ${c} `;
    });
    return text;
  };

  if (isComplete) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="relative h-32 overflow-hidden">
            <ImageWithFallback src={module.image} alt={module.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90 flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center`} style={{ background: passed ? "rgba(201,168,76,0.2)" : "rgba(224,71,158,0.2)" }}>
                {passed ? <Award className="w-10 h-10" style={{ color: "#C9A84C" }} /> : <RotateCcw className="w-10 h-10 text-white" />}
              </div>
            </div>
          </div>

          <div className="p-8 text-center">
            <h1 className="mb-2">
              {type === "pre" ? "Pre-Assessment" : "Competency Evaluation"} Complete
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Module {module.id}: {module.title}
            </p>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={passed ? "#0D3B22" : "#E0479E"} strokeWidth="10" strokeDasharray={`${(score / 100) * 314} 314`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl" style={{ color: passed ? "#0D3B22" : "#E0479E" }}>{score}%</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-2">{correctCount} of {totalQuestions} correct</p>
            <p className="text-sm mb-8">{passed ? "You've demonstrated competency in this area." : "Review the material and try again to achieve a passing score of 70%."}</p>

            <div className="mb-8">
              <TTSControls text={`Assessment complete. You scored ${score} percent, answering ${correctCount} out of ${totalQuestions} questions correctly. ${passed ? "Congratulations, you have demonstrated competency." : "Please review the material and try again."}`} label="Listen to results" />
            </div>

            <div className="text-left space-y-4 mb-8">
              <h3 className="text-sm flex items-center gap-2"><BookOpenText className="w-4 h-4" /> Detailed Review with Citations</h3>
              {shuffledQuestions.map((q, i) => {
                const isCorrect = answers[i] === q.correctIndex;
                return (
                  <div key={q.id} className="p-4 rounded-xl border-2" style={{ background: isCorrect ? "rgba(13,59,34,0.04)" : "rgba(224,71,158,0.04)", borderColor: isCorrect ? "rgba(13,59,34,0.2)" : "rgba(224,71,158,0.2)" }}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#E0479E" }} />}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm">{q.text}</p>
                          <InlineTTSButton text={`${q.explanation}. References: ${q.citations.join(". ")}`} />
                        </div>
                        {!isCorrect && (
                          <p className="text-xs mt-1 rounded px-2 py-1 inline-block" style={{ background: "rgba(13,59,34,0.08)", color: "#0D3B22" }}>
                            Correct: {q.options[q.correctIndex]}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>
                        <div className="mt-3 pl-3" style={{ borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
                          <p className="text-xs flex items-center gap-1 mb-1.5" style={{ color: "#C9A84C" }}><Quote className="w-3 h-3" /> References (APA 7th ed.)</p>
                          {q.citations.map((citation, ci) => (
                            <p key={ci} className="text-xs text-muted-foreground mb-1.5 leading-relaxed" style={{ textIndent: "-1.5em", paddingLeft: "1.5em" }}>{citation}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <Link to={`/modules/${module.id}`} className="px-6 py-2.5 rounded-full border border-border hover:bg-secondary transition-colors text-sm">Return to Module</Link>
              {passed && type === "post" && (
                <Link to="/certificates" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90">View Certificate</Link>
              )}
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
        <div className="relative h-24 rounded-xl overflow-hidden mb-4">
          <ImageWithFallback src={module.image} alt={module.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center px-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ClipboardCheck className="w-5 h-5" style={{ color: "#C9A84C" }} />
                <h2 style={{ color: "#C9A84C" }}>{assessment.title}</h2>
              </div>
              <p style={{ color: "rgba(242,244,202,0.7)" }} className="text-sm">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          {shuffledQuestions.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all`} style={{ background: i < currentQuestion ? (answers[i] === shuffledQuestions[i].correctIndex ? "#0D3B22" : "#E0479E") : i === currentQuestion ? "var(--primary)" : "var(--muted)" }} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="mb-4"><TTSControls text={buildQuestionTTS()} label="Listen to question" /></div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm mb-6">{question.text}</p>
            <div className="space-y-3 mb-6">
              {question.options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === question.correctIndex;
                const showResult = showExplanation;
                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={showExplanation} className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${isSelected && !showResult ? "border-primary bg-primary/5" : !showResult && !isSelected ? "border-border hover:border-primary/30" : ""}`}
                    style={showResult ? {
                      borderColor: isCorrect ? "rgba(13,59,34,0.4)" : isSelected ? "rgba(224,71,158,0.4)" : "var(--border)",
                      background: isCorrect ? "rgba(13,59,34,0.05)" : isSelected && !isCorrect ? "rgba(224,71,158,0.05)" : undefined,
                      opacity: !isCorrect && !isSelected ? 0.5 : 1,
                    } : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs"
                        style={showResult ? {
                          borderColor: isCorrect ? "#0D3B22" : isSelected ? "#E0479E" : "var(--muted-foreground)",
                          background: isCorrect ? "#0D3B22" : isSelected && !isCorrect ? "#E0479E" : undefined,
                          color: isCorrect || (isSelected && !isCorrect) ? "white" : undefined,
                        } : isSelected ? { borderColor: "var(--primary)", background: "var(--primary)", color: "white" } : { borderColor: "rgba(0,0,0,0.15)" }}
                      >
                        {showResult && isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : showResult && isSelected && !isCorrect ? <XCircle className="w-3.5 h-3.5" /> : String.fromCharCode(65 + i)}
                      </span>
                      <span className="pt-0.5">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                  <TTSControls text={buildExplanationTTS()} label="Listen to explanation" />
                  <div className="rounded-xl p-5" style={{ background: "rgba(201,168,76,0.08)" }}>
                    <div className="flex items-start gap-2 mb-2">
                      <BookOpenText className="w-4 h-4 mt-0.5" style={{ color: "#C9A84C" }} />
                      <p className="text-xs" style={{ color: "#C9A84C" }}>Explanation</p>
                    </div>
                    <p className="text-sm leading-relaxed">{question.explanation}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Quote className="w-4 h-4 text-primary" />
                      <p className="text-xs text-primary">References (APA 7th Edition)</p>
                    </div>
                    <div className="space-y-2">
                      {question.citations.map((citation, ci) => (
                        <p key={ci} className="text-xs text-muted-foreground leading-relaxed pl-6" style={{ textIndent: "-1.5em" }}>{citation}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 mt-4">
              {!showExplanation ? (
                <button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                  Submit Answer
                </button>
              ) : (
                <button onClick={handleNext} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 flex items-center gap-2">
                  {isLastQuestion ? "View Results" : "Next Question"} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}