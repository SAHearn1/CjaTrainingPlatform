import { useState, useEffect } from "react";
import { MODULES, ROLE_LABELS } from "./data";
import {
  Users,
  TrendingUp,
  Award,
  BarChart3,
  BookOpen,
  Download,
  Filter,
  Search,
  UserCheck,
  Clock,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useAuth } from "./AuthContext";
import * as api from "./api";
import { RequireRole } from "./SecurityBadge";

// Brand 5Rs chart palette
const CHART_COLORS = {
  root: "#0D3B22",
  regulate: "#1C4D36",
  reflect: "#1E3A5F",
  restore: "#5C3200",
  reconnect: "#3A1550",
  gold: "#C9A84C",
  completed: "#0D3B22",
  inProgress: "#C9A84C",
  notStarted: "var(--muted)",
};

function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface AdminStatsData {
  totalLearners: number;
  activeLearners: number;
  completionRate: number;
  avgScore: number;
  agencyBreakdown: { name: string; learners: number; completion: number }[];
  moduleCompletion: { module: string; completed: number; inProgress: number; notStarted: number }[];
  monthlyEnrollment?: { month: string; enrolled: number }[];
  assessmentDistribution?: { range: string; count: number }[];
  scoreDistribution?: { range: string; count: number }[];
}

export function AdminDashboard() {
  return (
    <RequireRole permission="admin:dashboard">
      <AdminDashboardInner />
    </RequireRole>
  );
}

function AdminDashboardInner() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "agencies" | "modules" | "learners">("overview");
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [accessToken]);

  async function loadStats() {
    setLoading(true);
    setError(null);
    try {
      if (!accessToken) {
        setError("No access token available. Please sign in again.");
        return;
      }
      const res = await api.getAdminStats(accessToken);
      if (res.stats) {
        setStats(res.stats);
      } else {
        setError("The server returned no statistics data. Please try again.");
      }
    } catch (e: any) {
      console.error("Admin stats API failed:", e.message);
      setError(e.message || "Unable to load live data. Please refresh or contact support.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "agencies" as const, label: "Roles", icon: Users },
    { id: "modules" as const, label: "Modules", icon: BookOpen },
    { id: "learners" as const, label: "Learners", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C9A84C" }} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="w-8 h-8" style={{ color: "var(--destructive)" }} />
        <p className="text-sm font-medium">Failed to load admin statistics</p>
        {error && (
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            {error} — Please retry or contact support if the problem persists.
          </p>
        )}
        <button onClick={loadStats} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
          Retry
        </button>
      </div>
    );
  }

  // Normalise score distribution key (server returns scoreDistribution or assessmentDistribution)
  const scoreDistribution = stats.scoreDistribution || stats.assessmentDistribution || [];
  const monthlyEnrollment = stats.monthlyEnrollment || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
      >
        <div>
          <h1>Admin Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Training program performance and learner analytics
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: Users,
            label: "Total Learners",
            value: stats.totalLearners.toString(),
            change: "+12%",
            hex: "#0D3B22",
          },
          {
            icon: UserCheck,
            label: "Active Learners",
            value: stats.activeLearners.toString(),
            change: "+8%",
            hex: "#1C4D36",
          },
          {
            icon: Target,
            label: "Completion Rate",
            value: `${stats.completionRate}%`,
            change: "+5%",
            hex: "#1E3A5F",
          },
          {
            icon: Award,
            label: "Avg Assessment",
            value: `${stats.avgScore}%`,
            change: "+3%",
            hex: "#C9A84C",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border p-4"
            style={{ borderLeft: `4px solid ${stat.hex}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: hexAlpha(stat.hex, 0.08), color: stat.hex }}
              >
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs" style={{ color: "#0D3B22" }}>{stat.change}</span>
            </div>
            <p className="text-2xl">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollment Trend */}
          {monthlyEnrollment.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h3 className="text-sm mb-4">Monthly Enrollment</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyEnrollment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrolled"
                    stroke={CHART_COLORS.root}
                    fill={CHART_COLORS.root}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Assessment Distribution */}
          {scoreDistribution.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h3 className="text-sm mb-4">Assessment Score Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill={CHART_COLORS.regulate} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Module Completion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-5 lg:col-span-2"
          >
            <h3 className="text-sm mb-4">Module Completion Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.moduleCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="module" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill={CHART_COLORS.completed} name="Completed" />
                <Bar dataKey="inProgress" stackId="a" fill={CHART_COLORS.inProgress} name="In Progress" />
                <Bar dataKey="notStarted" stackId="a" fill="#E4E8E4" name="Not Started" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {activeTab === "agencies" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div>
              <h3 className="text-sm font-medium">Learner Role Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Breakdown of enrolled learners by professional role</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Learners</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Completion Rate</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Progress</th>
                </tr>
              </thead>
              <tbody>
                {stats.agencyBreakdown.map((entry) => (
                  <tr key={entry.name} className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: hexAlpha("#0D3B22", 0.08) }}>
                          <Users className="w-4 h-4" style={{ color: "#0D3B22" }} />
                        </div>
                        <span className="text-sm">{ROLE_LABELS[entry.name] || entry.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{entry.learners}</td>
                    <td className="p-4 text-sm">{entry.completion}%</td>
                    <td className="p-4">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${entry.completion}%`, background: "#0D3B22" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "modules" && (
        <div className="space-y-4">
          {stats.moduleCompletion.map((mod, i) => {
            const total = mod.completed + mod.inProgress + mod.notStarted;
            const module = MODULES[i];
            return (
              <motion.div
                key={mod.module}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{mod.module}</p>
                    <h4 className="text-sm mt-0.5">{module?.title || mod.module}</h4>
                  </div>
                  <span className="text-xs text-muted-foreground">{total} learners</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden mb-3">
                  <div style={{ width: `${(mod.completed / total) * 100}%`, background: CHART_COLORS.completed }} />
                  <div style={{ width: `${(mod.inProgress / total) * 100}%`, background: CHART_COLORS.inProgress }} />
                  <div style={{ width: `${(mod.notStarted / total) * 100}%`, background: "#E4E8E4" }} />
                </div>
                <div className="flex gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS.completed }} />
                    Completed: {mod.completed}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS.inProgress }} />
                    In Progress: {mod.inProgress}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#E4E8E4" }} />
                    Not Started: {mod.notStarted}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === "learners" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search learners..."
                className="w-full pl-9 pr-4 py-2 bg-input-background rounded-lg border border-border text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted-foreground">Learner</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Agency</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Progress</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Avg Score</th>
                  <th className="text-left p-4 text-xs text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Sarah Johnson", role: "CPI", agency: "County CPS", progress: 100, score: 92, status: "Completed" },
                  { name: "Michael Torres", role: "Law Enforcement", agency: "Metro PD", progress: 67, score: 85, status: "In Progress" },
                  { name: "Dr. Amara Singh", role: "Medical", agency: "Regional Hospital", progress: 83, score: 91, status: "In Progress" },
                  { name: "Jennifer Wu", role: "Prosecutor", agency: "DA Office", progress: 100, score: 88, status: "Completed" },
                  { name: "Robert Davis", role: "School Personnel", agency: "School District", progress: 33, score: 76, status: "In Progress" },
                  { name: "Maria Garcia", role: "Victim Advocate", agency: "Victim Services", progress: 100, score: 94, status: "Completed" },
                  { name: "James Okoye", role: "Forensic Interviewer", agency: "CAC", progress: 50, score: 82, status: "In Progress" },
                  { name: "Hon. Patricia Lane", role: "Judge", agency: "Family Court", progress: 100, score: 89, status: "Completed" },
                ].map((learner) => (
                  <tr key={learner.name} className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 text-sm">{learner.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{learner.role}</td>
                    <td className="p-4 text-sm text-muted-foreground">{learner.agency}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${learner.progress}%`, background: "#0D3B22" }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{learner.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{learner.score}%</td>
                    <td className="p-4">
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={
                          learner.status === "Completed"
                            ? { background: hexAlpha("#0D3B22", 0.06), color: "#0D3B22" }
                            : { background: hexAlpha("#C9A84C", 0.1), color: "#8A6A10" }
                        }
                      >
                        {learner.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}