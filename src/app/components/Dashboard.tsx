import { Link } from "react-router";
import { MODULES } from "./data";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Circle,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { TTSControls } from "./TTSControls";
import { useAuth } from "./AuthContext";
import { PhaseIcon, PHASE_HEX as PHASE_HEX_MAP } from "./PhaseIcon";
import { TraceIcon, type TraceLetter } from "./TraceIcon";

// GALS × RWFW Brand 5Rs Colors
const PHASE_HEX: Record<string, string> = PHASE_HEX_MAP;

// TRACE brand colors
const TRACE_COLORS = [
  { letter: "T" as const, x: 100, y: 20, color: "#0D3B22" },
  { letter: "R" as const, x: 175, y: 75, color: "#1C4D36" },
  { letter: "A" as const, x: 150, y: 165, color: "#1E3A5F" },
  { letter: "C" as const, x: 50, y: 165, color: "#5C3200" },
  { letter: "E" as const, x: 25, y: 75, color: "#3A1550" },
];

export function Dashboard() {
  const { profile, progress: userProgress } = useAuth();
  const displayName = profile?.name || "Learner";

  const completedModules = userProgress.filter((p) => p.status === "completed").length;
  const inProgressModules = userProgress.filter((p) => p.status === "in_progress").length;
  const totalTime = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const scoredProgress = userProgress.filter((p) => p.postAssessmentScore !== null && p.postAssessmentScore !== undefined);
  const avgScore = scoredProgress.length > 0
    ? scoredProgress.reduce((sum, p) => sum + (p.postAssessmentScore || 0), 0) / scoredProgress.length
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1>Welcome back, {displayName}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Continue your trauma-informed investigation training journey
        </p>
        <div className="mt-3">
          <TTSControls
            text={`Welcome back, ${displayName}. You have completed ${completedModules} of 7 modules, with ${inProgressModules} in progress. Your average assessment score is ${Math.round(avgScore)} percent.`}
            label="Listen to your progress summary"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "Completed", value: `${completedModules}/7`, sub: "modules", bg: "rgba(13,59,34,0.08)", fg: "#0D3B22" },
          { icon: PlayCircle, label: "In Progress", value: inProgressModules.toString(), sub: "modules", bg: "rgba(28,77,54,0.08)", fg: "#1C4D36" },
          { icon: Clock, label: "Time Invested", value: `${Math.round(totalTime / 60)}h ${totalTime % 60}m`, sub: "total", bg: "rgba(30,58,95,0.08)", fg: "#1E3A5F" },
          { icon: Trophy, label: "Avg Score", value: `${Math.round(avgScore)}%`, sub: "post-assessment", bg: "rgba(8,42,25,0.08)", fg: "#0D3B22" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border p-4"
            style={{ borderLeft: `4px solid ${stat.fg}` }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: stat.bg, color: stat.fg }}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">
              {stat.label} <span className="text-muted-foreground/60">· {stat.sub}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* RootWork Framework + TRACE */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
          style={{ borderLeft: "4px solid #C9A84C" }}
        >
          <h3 className="mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: "#C9A84C" }} />
            RootWork 5Rs Framework
          </h3>
          <div className="flex items-center justify-between mb-5 px-2">
            {[
              { phase: "Root" },
              { phase: "Regulate" },
              { phase: "Reflect" },
              { phase: "Restore" },
              { phase: "Reconnect" },
            ].map((item, i, arr) => (
              <div key={item.phase} className="flex items-center">
                <div className="flex flex-col items-center">
                  <PhaseIcon phase={item.phase} size={40} withBg className="rounded-full shadow-md" />
                  <span className="text-[10px] text-muted-foreground mt-1">{item.phase}</span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground mx-1 mt-[-12px]" />
                )}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { phase: "Root", desc: "Establish core concepts & legal context" },
              { phase: "Regulate", desc: "Trauma-informed professional conduct" },
              { phase: "Reflect", desc: "Interactive scenario analysis" },
              { phase: "Restore", desc: "Correct investigative procedures" },
              { phase: "Reconnect", desc: "MDT collaboration & victim support" },
            ].map((item) => (
              <div key={item.phase} className="flex items-center gap-3">
                <PhaseIcon phase={item.phase} size={20} />
                <div>
                  <span className="text-sm">{item.phase}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
          style={{ borderLeft: "4px solid #C9A84C" }}
        >
          <h3 className="mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: "#C9A84C" }} />
            TRACE Cognitive Cycle
          </h3>
          <div className="relative mx-auto w-48 h-48 mb-4">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="75" fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="4 4" />
              {TRACE_COLORS.map((item) => (
                <g key={item.letter}>
                  <circle cx={item.x} cy={item.y} r="18" fill={item.color} opacity="0.15" />
                  <circle cx={item.x} cy={item.y} r="14" fill={item.color} />
                  <text x={item.x} y={item.y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                    {item.letter}
                  </text>
                </g>
              ))}
              {[
                { x1: 115, y1: 30, x2: 162, y2: 60 },
                { x1: 178, y1: 92, x2: 160, y2: 148 },
                { x1: 135, y1: 170, x2: 65, y2: 170 },
                { x1: 38, y1: 148, x2: 22, y2: 92 },
                { x1: 38, y1: 60, x2: 85, y2: 30 },
              ].map((arrow, i) => (
                <line
                  key={i}
                  x1={arrow.x1} y1={arrow.y1}
                  x2={arrow.x2} y2={arrow.y2}
                  stroke="var(--muted-foreground)"
                  strokeWidth="1"
                  opacity="0.3"
                  markerEnd="url(#arrowhead)"
                />
              ))}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="var(--muted-foreground)" opacity="0.4" />
                </marker>
              </defs>
            </svg>
          </div>
          <div className="space-y-3">
            {[
              { letter: "T", word: "Trigger", desc: "What activates the investigator's response" },
              { letter: "R", word: "Response", desc: "The immediate emotional/behavioral reaction" },
              { letter: "A", word: "Appraisal", desc: "Professional evaluation of the situation" },
              { letter: "C", word: "Choice", desc: "The informed decision made" },
              { letter: "E", word: "Effect", desc: "The outcome and its impact" },
            ].map((item, i) => (
              <div key={item.letter} className="flex items-center gap-3">
                <TraceIcon letter={item.letter as TraceLetter} size={28} />
                <div>
                  <span className="text-sm">{item.word}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Module Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2>Training Modules</h2>
          <Link
            to="/modules"
            className="text-sm hover:underline flex items-center gap-1"
            style={{ color: "#C9A84C" }}
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {MODULES.map((module) => {
            const progress = userProgress.find((p) => p.moduleId === module.id);
            const completedSections = progress?.sectionsCompleted?.length || 0;
            const totalSections = module.sections.length;
            const pct = Math.round((completedSections / totalSections) * 100);

            return (
              <Link
                key={module.id}
                to={`/modules/${module.id}`}
                className="block bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${!progress?.status || progress.status === "not_started" ? "bg-muted text-muted-foreground" : ""}`}
                    style={progress?.status && progress.status !== "not_started" ? {
                      background: progress.status === "completed" ? "rgba(13,59,34,0.08)" : "rgba(28,77,54,0.08)",
                      color: progress.status === "completed" ? "#0D3B22" : "#1C4D36",
                    } : undefined}
                  >
                    {progress?.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : progress?.status === "in_progress" ? (
                      <PlayCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Module {module.id}</p>
                        <h4 className="text-sm mt-0.5">{module.title}</h4>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs shrink-0"
                        style={{
                          background: progress?.status === "completed" ? "rgba(13,59,34,0.08)" : progress?.status === "in_progress" ? "rgba(28,77,54,0.08)" : undefined,
                          color: progress?.status === "completed" ? "#0D3B22" : progress?.status === "in_progress" ? "#1C4D36" : "#767676",
                          border: `1px solid ${progress?.status === "completed" ? "rgba(13,59,34,0.15)" : progress?.status === "in_progress" ? "rgba(28,77,54,0.15)" : "var(--border)"}`,
                        }}
                      >
                        {progress?.status === "completed" ? "Completed" : progress?.status === "in_progress" ? "In Progress" : "Not Started"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: progress?.status === "completed" ? "#0D3B22" : "#1C4D36" }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {module.duration}
                      </span>
                      <span>
                        {completedSections}/{totalSections} sections
                      </span>
                      {progress?.postAssessmentScore && (
                        <span style={{ color: "#0D3B22" }}>
                          Score: {progress.postAssessmentScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}