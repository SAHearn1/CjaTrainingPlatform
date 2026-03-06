/**
 * AuditLog — Superadmin security event viewer
 *
 * CJIS 5.4.1.1: Audit events are immutable, timestamped, and include
 * user ID, event type, outcome, and contextual details.
 * CJIS 5.10: System & Information Integrity monitoring.
 */
import { useState, useEffect, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  LogIn,
  LogOut,
  FileText,
  Lock,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { RequireRole } from "./SecurityBadge";
import * as api from "./api";

interface AuditEntry {
  userId: string;
  eventType: string;
  outcome: "success" | "failure" | "denied";
  timestamp: string;
}

// Event type display configs
const EVENT_CONFIG: Record<string, { icon: any; label: string; category: string; color: string }> = {
  "auth:signup": { icon: LogIn, label: "User Sign Up", category: "Authentication", color: "#0D3B22" },
  "auth:login": { icon: LogIn, label: "User Login", category: "Authentication", color: "#0D3B22" },
  "auth:logout": { icon: LogOut, label: "User Logout", category: "Authentication", color: "#1E3A5F" },
  "auth:failed_login": { icon: XCircle, label: "Failed Login", category: "Authentication", color: "#DC2626" },
  "auth:session_timeout": { icon: Clock, label: "Session Timeout", category: "Authentication", color: "#F59E0B" },
  "auth:session_extended": { icon: Clock, label: "Session Extended", category: "Authentication", color: "#1C4D36" },
  "auth:password_change": { icon: Lock, label: "Password Change", category: "Authentication", color: "#5C3200" },
  "data:profile_read": { icon: Eye, label: "Profile Read", category: "Data Access", color: "#1C4D36" },
  "data:profile_update": { icon: FileText, label: "Profile Update", category: "Data Access", color: "#1E3A5F" },
  "data:progress_read": { icon: Eye, label: "Progress Read", category: "Data Access", color: "#1C4D36" },
  "data:progress_update": { icon: FileText, label: "Progress Update", category: "Data Access", color: "#1E3A5F" },
  "data:assessment_submit": { icon: FileText, label: "Assessment Submitted", category: "Data Access", color: "#0D3B22" },
  "data:simulation_submit": { icon: FileText, label: "Simulation Completed", category: "Data Access", color: "#0D3B22" },
  "data:certificate_generate": { icon: FileText, label: "Certificate Generated", category: "Data Access", color: "#C9A84C" },
  "data:export": { icon: Download, label: "Data Export", category: "Data Access", color: "#5C3200" },
  "admin:dashboard_access": { icon: Activity, label: "Admin Dashboard Access", category: "Administration", color: "#C9A84C" },
  "admin:user_view": { icon: User, label: "User List Viewed", category: "Administration", color: "#C9A84C" },
  "admin:audit_view": { icon: Eye, label: "Audit Log Viewed", category: "Administration", color: "#3A1550" },
  "security:role_change": { icon: ShieldCheck, label: "Role Changed", category: "Security", color: "#5C3200" },
  "security:permission_denied": { icon: Shield, label: "Permission Denied", category: "Security", color: "#DC2626" },
  "security:encryption_key_rotate": { icon: Lock, label: "Encryption Key Rotated", category: "Security", color: "#3A1550" },
};

const OUTCOME_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  success: { bg: "rgba(13,59,34,0.08)", text: "#0D3B22", label: "Success" },
  failure: { bg: "rgba(220,38,38,0.06)", text: "#DC2626", label: "Failure" },
  denied: { bg: "rgba(245,158,11,0.08)", text: "#D97706", label: "Denied" },
};

const CATEGORIES = ["All", "Authentication", "Data Access", "Administration", "Security"];

export function AuditLog() {
  return (
    <RequireRole permission="admin:audit">
      <AuditLogInner />
    </RequireRole>
  );
}

function AuditLogInner() {
  const { accessToken } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterOutcome, setFilterOutcome] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, [accessToken]);

  async function loadAuditLogs() {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAuditLogs(accessToken);
      setEntries(data.entries || []);
    } catch (e: any) {
      console.error("Failed to load audit logs:", e);
      setError(e.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }

  // Filter & sort
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.userId.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          (EVENT_CONFIG[e.eventType]?.label || "").toLowerCase().includes(q)
      );
    }

    // Category
    if (filterCategory !== "All") {
      result = result.filter(
        (e) => (EVENT_CONFIG[e.eventType]?.category || "Other") === filterCategory
      );
    }

    // Outcome
    if (filterOutcome !== "all") {
      result = result.filter((e) => e.outcome === filterOutcome);
    }

    // Sort
    result.sort((a, b) => {
      const diff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      return sortDirection === "desc" ? diff : -diff;
    });

    return result;
  }, [entries, searchQuery, filterCategory, filterOutcome, sortDirection]);

  // Stats
  const stats = useMemo(() => {
    const total = entries.length;
    const denied = entries.filter((e) => e.outcome === "denied").length;
    const failed = entries.filter((e) => e.outcome === "failure").length;
    const securityEvents = entries.filter(
      (e) => (EVENT_CONFIG[e.eventType]?.category || "") === "Security"
    ).length;
    const uniqueUsers = new Set(entries.map((e) => e.userId)).size;
    return { total, denied, failed, securityEvents, uniqueUsers };
  }, [entries]);

  // CSV export
  function exportCSV() {
    const header = "Timestamp,Event Type,User ID,Outcome,Category\n";
    const rows = filteredEntries
      .map((e) => {
        const config = EVENT_CONFIG[e.eventType];
        return `"${e.timestamp}","${config?.label || e.eventType}","${e.userId}","${e.outcome}","${config?.category || "Other"}"`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0D3B22" }}
          >
            Security Audit Log
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            CJIS 5.4.1.1 — Event Logging &amp; Monitoring | CJIS 5.10 — System Integrity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={filteredEntries.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={loadAuditLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl p-3 bg-card border border-border">
          <p className="text-xl font-bold" style={{ color: "#0D3B22" }}>{stats.total}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Events</p>
        </div>
        <div className="rounded-xl p-3 bg-card border border-border">
          <p className="text-xl font-bold" style={{ color: "#1E3A5F" }}>{stats.uniqueUsers}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Unique Users</p>
        </div>
        <div className="rounded-xl p-3 bg-card border border-border">
          <p className="text-xl font-bold" style={{ color: "#5C3200" }}>{stats.securityEvents}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Security Events</p>
        </div>
        <div className="rounded-xl p-3 bg-card border border-border">
          <p className="text-xl font-bold" style={{ color: "#D97706" }}>{stats.denied}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Access Denied</p>
        </div>
        <div className="rounded-xl p-3 bg-card border border-border">
          <p className="text-xl font-bold" style={{ color: "#DC2626" }}>{stats.failed}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Failures</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user ID or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm focus:border-primary"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterOutcome}
          onChange={(e) => setFilterOutcome(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm focus:border-primary"
        >
          <option value="all">All Outcomes</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
          <option value="denied">Denied</option>
        </select>
        <button
          onClick={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
          title={`Sort ${sortDirection === "desc" ? "oldest first" : "newest first"}`}
        >
          <Clock className="w-4 h-4" />
          {sortDirection === "desc" ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C9A84C" }} />
          <span className="ml-3 text-sm text-muted-foreground">Loading audit logs...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAuditLogs}
            className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {/* Event List */}
      {!loading && !error && (
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">
              Showing {filteredEntries.length} of {entries.length} events
            </p>
            <p className="text-[10px] text-muted-foreground">
              Retention: 1 year minimum (CJIS 5.4.1.1)
            </p>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No audit events match your filters</p>
            </div>
          ) : (
            filteredEntries.map((entry, idx) => {
              const config = EVENT_CONFIG[entry.eventType] || {
                icon: Activity,
                label: entry.eventType,
                category: "Other",
                color: "#666",
              };
              const outcomeStyle = OUTCOME_COLORS[entry.outcome] || OUTCOME_COLORS.success;
              const Icon = config.icon;
              const isExpanded = expandedEntry === idx;
              const ts = new Date(entry.timestamp);

              return (
                <motion.div
                  key={`${entry.timestamp}-${idx}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.01, duration: 0.15 }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/20 transition-all cursor-pointer ${
                    entry.outcome === "denied" || entry.outcome === "failure"
                      ? "bg-red-50/30"
                      : ""
                  }`}
                  onClick={() => setExpandedEntry(isExpanded ? null : idx)}
                >
                  {/* Event icon */}
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${config.color}10` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                  </div>

                  {/* Timestamp */}
                  <div className="w-[140px] shrink-0 hidden sm:block">
                    <p className="text-[11px] font-mono text-muted-foreground">
                      {ts.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                      {ts.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>

                  {/* Event type */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{config.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate sm:hidden">
                      {ts.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Category */}
                  <span className="text-[10px] text-muted-foreground hidden md:inline">
                    {config.category}
                  </span>

                  {/* User ID (truncated) */}
                  <span className="text-[10px] font-mono text-muted-foreground hidden lg:inline w-[80px] truncate">
                    {entry.userId.slice(0, 8)}...
                  </span>

                  {/* Outcome badge */}
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider shrink-0"
                    style={{ background: outcomeStyle.bg, color: outcomeStyle.text }}
                  >
                    {outcomeStyle.label}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* CJIS Compliance Notice */}
      <div
        className="rounded-lg p-4 mt-4"
        style={{ background: "rgba(13,59,34,0.03)", border: "1px solid rgba(13,59,34,0.08)" }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#0D3B22" }} />
          <div className="space-y-1">
            <p className="text-xs font-semibold" style={{ color: "#0D3B22" }}>
              CJIS Audit Log Compliance
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              This audit log is maintained in compliance with FBI CJIS Security Policy v5.9.5,
              Section 5.4.1.1 (Auditable Events) and Section 5.10 (System and Information Integrity).
              All events are immutable, timestamped, and encrypted at rest using AES-256-GCM.
              Audit records are retained for a minimum of one year. Unauthorized access to this
              log is itself an auditable event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
