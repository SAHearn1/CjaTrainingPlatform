import { Link } from "react-router";
import { MODULES } from "./data";
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  Circle,
  ArrowRight,
  BookOpen,
  FileText,
  Gamepad2,
  ClipboardCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./AuthContext";
import { PhaseIconSmall } from "./PhaseIcon";

const PHASE_NAMES = ["Root", "Regulate", "Reflect", "Restore", "Reconnect"];

// 5Rs brand colors for section progress bars
const PHASE_HEX = ["#0D3B22", "#1C4D36", "#1E3A5F", "#5C3200", "#3A1550"];

export function ModuleList() {
  const { progress: userProgress } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1">Training Modules</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Complete all 7 modules following the RootWork 5Rs framework to earn your certification
        </p>
      </motion.div>

      {/* Module Structure Guide */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-5 mb-8"
        style={{ borderLeft: "4px solid #C9A84C" }}
      >
        <h3 className="text-sm mb-3">Each Module Includes:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: ClipboardCheck, label: "Pre-Assessment", desc: "Baseline knowledge check" },
            { icon: BookOpen, label: "5 Learning Sections", desc: "Root → Regulate → Reflect → Restore → Reconnect" },
            { icon: Gamepad2, label: "Scenario Simulations", desc: "Decision-tree exercises" },
            { icon: FileText, label: "Post-Assessment", desc: "Competency evaluation" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>
                <item.icon className="w-4 h-4" style={{ color: "#082A19" }} />
              </div>
              <div>
                <p className="text-xs">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {MODULES.map((module, idx) => {
          const progress = userProgress.find((p) => p.moduleId === module.id);
          const completedSections = progress?.sectionsCompleted?.length || 0;
          const totalSections = module.sections.length;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
            >
              <Link
                to={`/modules/${module.id}`}
                className="block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group h-full"
              >
                <div className="relative h-32 overflow-hidden">
                  <ImageWithFallback
                    src={module.image}
                    alt={module.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-xs backdrop-blur-sm" style={{
                      background: progress?.status === "completed" ? "rgba(13,59,34,0.3)" : progress?.status === "in_progress" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.1)",
                      color: progress?.status === "completed" ? "#C9A84C" : progress?.status === "in_progress" ? "#E8D484" : "rgba(255,255,255,0.7)",
                      border: `1px solid ${progress?.status === "completed" ? "rgba(201,168,76,0.4)" : progress?.status === "in_progress" ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.2)"}`,
                    }}>
                      {progress?.status === "completed" ? "Completed" : progress?.status === "in_progress" ? "In Progress" : "Not Started"}
                    </span>
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {module.duration}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${!progress?.status || progress.status === "not_started" ? "bg-muted text-muted-foreground" : ""}`}
                        style={progress?.status && progress.status !== "not_started" ? {
                          background: progress.status === "completed" ? "rgba(13,59,34,0.08)" : "rgba(201,168,76,0.12)",
                          color: progress.status === "completed" ? "#0D3B22" : "#C9A84C",
                        } : undefined}
                      >
                        {progress?.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : progress?.status === "in_progress" ? <PlayCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </span>
                      <span className="text-xs text-muted-foreground">Module {module.id}</span>
                    </div>
                  </div>

                  <h3 className="mb-2 group-hover:text-primary transition-colors text-base">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{module.description}</p>

                  {/* 5Rs Progress */}
                  <div className="flex gap-1 mb-4">
                    {module.sections.map((section, si) => {
                      const isCompleted = progress?.sectionsCompleted?.includes(section.id);
                      return (
                        <div key={section.id} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full h-1.5 rounded-full" style={{ background: isCompleted ? PHASE_HEX[si] : "var(--muted)" }} />
                          <PhaseIconSmall phase={PHASE_NAMES[si]} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {progress?.preAssessmentScore !== null && progress?.preAssessmentScore !== undefined && (
                        <span>Pre: {progress.preAssessmentScore}%</span>
                      )}
                      {progress?.postAssessmentScore !== null && progress?.postAssessmentScore !== undefined && (
                        <span style={{ color: "#0D3B22" }}>Post: {progress.postAssessmentScore}%</span>
                      )}
                    </div>
                    <span className="text-xs flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#C9A84C" }}>
                      {progress?.status === "completed" ? "Review" : progress?.status === "in_progress" ? "Continue" : "Start"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}