import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, BookOpen, Award, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { getSupervisorTeamProgress } from "./api";
import { MODULES, ROLE_LABELS } from "./data";
import { hexAlpha } from "./PhaseIcon";

interface LearnerRow {
  userId: string;
  name: string;
  role: string;
  completedModules: number;
  inProgressModules: number;
}

export function InstructorDashboard() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cohortSize, setCohortSize] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [learners, setLearners] = useState<LearnerRow[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    getSupervisorTeamProgress(accessToken)
      .then((res) => {
        const team: LearnerRow[] = (res?.team ?? []);
        setLearners(team);
        setCohortSize(team.length);
        const completers = team.filter((l) => l.completedModules >= MODULES.length).length;
        setCompletionRate(team.length > 0 ? Math.round((completers / team.length) * 100) : 0);
        setAvgScore(null); // per-user score not aggregated in supervisor endpoint
      })
      .catch((e) => setError(e.message || "Failed to load team data"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center gap-3 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1">Instructor Dashboard</h1>
        <p className="text-muted-foreground text-sm">Monitor cohort progress and facilitate training outcomes.</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-3 gap-4"
      >
        {[
          { icon: Users, label: "Cohort Size", value: cohortSize, hex: "#0D3B22" },
          { icon: TrendingUp, label: "Completion Rate", value: `${completionRate}%`, hex: "#1C4D36" },
          { icon: Award, label: "Avg. Score", value: avgScore != null ? `${avgScore}%` : "—", hex: "#C9A84C" },
        ].map(({ icon: Icon, label, value, hex }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-5" style={{ borderLeft: `4px solid ${hex}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: hexAlpha(hex, 0.08) }}>
                <Icon className="w-5 h-5" style={{ color: hex }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Module completion overview */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base">Cohort Module Coverage</h2>
        </div>
        <div className="space-y-3">
          {MODULES.map((mod) => {
            const completed = learners.filter((l) => l.completedModules >= mod.id).length;
            const pct = cohortSize > 0 ? Math.round((completed / cohortSize) * 100) : 0;
            return (
              <div key={mod.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-6 shrink-0">M{mod.id}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "#0D3B22" }} />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                <span className="text-xs text-muted-foreground hidden sm:block flex-1 truncate">{mod.title}</span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Learner roster */}
      {learners.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-base">Learner Roster</h2>
            <span className="ml-auto text-xs text-muted-foreground">{learners.length} learners</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Progress</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Avg Score</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((learner) => {
                  const pct = Math.round(((learner.completedModules || 0) / MODULES.length) * 100);
                  const statusLabel = learner.completedModules >= MODULES.length
                    ? "Completed"
                    : learner.inProgressModules > 0
                    ? "In Progress"
                    : "Not Started";
                  return (
                    <tr key={learner.userId} className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 text-sm">{learner.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{ROLE_LABELS[learner.role] || learner.role}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#0D3B22" }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">—</td>
                      <td className="p-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={
                            statusLabel === "Completed"
                              ? { background: hexAlpha("#0D3B22", 0.06), color: "#0D3B22" }
                              : { background: hexAlpha("#C9A84C", 0.1), color: "#8A6A10" }
                          }
                        >
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}
    </div>
  );
}
