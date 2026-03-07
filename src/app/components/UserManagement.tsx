/**
 * UserManagement — Admin/Superadmin role assignment UI
 *
 * CJIS 5.4 Access Control: Implements least-privilege role promotion
 * with tiered authorization (admin can assign up to supervisor,
 * only superadmin can assign admin/superadmin).
 */
import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Clock,
  BookOpen,
  RefreshCw,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { RequireRole } from "./SecurityBadge";
import * as api from "./api";
import { getAccessTier } from "./security";
import { ROLE_LABELS } from "./data";

interface ManagedUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  agency: string;
  state: string;
  joinedAt: string | null;
  updatedAt: string | null;
  completedModules: number;
  inProgressModules: number;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  learner: { bg: "rgba(13,59,34,0.06)", text: "#0D3B22", border: "rgba(13,59,34,0.15)" },
  supervisor: { bg: "rgba(30,58,95,0.06)", text: "#1E3A5F", border: "rgba(30,58,95,0.15)" },
  admin: { bg: "rgba(8,42,25,0.08)", text: "#082A19", border: "rgba(8,42,25,0.2)" },
  superadmin: { bg: "rgba(92,50,0,0.06)", text: "#5C3200", border: "rgba(92,50,0,0.2)" },
};

// Roles grouped by tier for the dropdown
const ROLE_GROUPS = [
  {
    tier: "Learner Roles",
    roles: ["law_enforcement", "cpi", "prosecutor", "judge", "medical", "school", "advocate", "forensic", "mandated_reporter"],
  },
  { tier: "Elevated Roles", roles: ["supervisor"] },
  { tier: "Administrative Roles (Superadmin Only)", roles: ["admin", "superadmin"] },
];

export function UserManagement() {
  return (
    <RequireRole permission="admin:users">
      <UserManagementInner />
    </RequireRole>
  );
}

function UserManagementInner() {
  const { accessToken, profile } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [roleChangeSuccess, setRoleChangeSuccess] = useState<string | null>(null);
  const [roleChangeError, setRoleChangeError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    userId: string;
    userName: string;
    currentRole: string;
    newRole: string;
  } | null>(null);

  const myRole = profile?.role || "learner";
  const isSuperAdmin = myRole === "superadmin";

  useEffect(() => {
    loadUsers();
  }, [accessToken]);

  async function loadUsers() {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUsers(accessToken);
      setUsers(data.users || []);
    } catch (e: any) {
      console.error("Failed to load users:", e);
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    if (!accessToken) return;
    setChangingRole(userId);
    setRoleChangeError(null);
    setRoleChangeSuccess(null);
    try {
      await api.updateUserRole(accessToken, userId, newRole);
      setRoleChangeSuccess(`Role updated to ${ROLE_LABELS[newRole] || newRole}`);
      // Refresh user list
      await loadUsers();
      setTimeout(() => setRoleChangeSuccess(null), 3000);
    } catch (e: any) {
      console.error("Role change failed:", e);
      setRoleChangeError(e.message || "Role change failed");
      setTimeout(() => setRoleChangeError(null), 5000);
    } finally {
      setChangingRole(null);
      setConfirmDialog(null);
    }
  }

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ROLE_LABELS[u.role] || u.role).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      filterTier === "all" || getAccessTier(u.role) === filterTier;

    return matchesSearch && matchesTier;
  });

  // Stats
  const totalUsers = users.length;
  const tierCounts = {
    learner: users.filter((u) => getAccessTier(u.role) === "learner").length,
    supervisor: users.filter((u) => getAccessTier(u.role) === "supervisor").length,
    admin: users.filter((u) => getAccessTier(u.role) === "admin").length,
    superadmin: users.filter((u) => getAccessTier(u.role) === "superadmin").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0D3B22" }}
          >
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            CJIS 5.4 Access Control — Role-based privilege assignment
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["learner", "supervisor", "admin", "superadmin"] as const).map((tier) => {
          const colors = TIER_COLORS[tier];
          return (
            <button
              key={tier}
              onClick={() => setFilterTier(filterTier === tier ? "all" : tier)}
              className={`rounded-xl p-4 text-left transition-all border ${
                filterTier === tier ? "ring-2 ring-primary/30" : ""
              }`}
              style={{
                background: colors.bg,
                borderColor: colors.border,
              }}
            >
              <p className="text-2xl font-bold" style={{ color: colors.text }}>
                {tierCounts[tier]}
              </p>
              <p className="text-xs capitalize mt-0.5" style={{ color: colors.text, opacity: 0.7 }}>
                {tier === "superadmin" ? "Super Admins" : `${tier}s`}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, agency, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Tiers ({totalUsers})</option>
            <option value="learner">Learners ({tierCounts.learner})</option>
            <option value="supervisor">Supervisors ({tierCounts.supervisor})</option>
            <option value="admin">Admins ({tierCounts.admin})</option>
            <option value="superadmin">Super Admins ({tierCounts.superadmin})</option>
          </select>
        </div>
      </div>

      {/* Status messages */}
      <AnimatePresence>
        {roleChangeSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(13,59,34,0.08)", color: "#0D3B22" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {roleChangeSuccess}
          </motion.div>
        )}
        {roleChangeError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
            style={{ background: "rgba(220,38,38,0.06)", color: "#DC2626" }}
          >
            <XCircle className="w-4 h-4" />
            {roleChangeError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C9A84C" }} />
          <span className="ml-3 text-sm text-muted-foreground">Loading users...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {/* User List */}
      {!loading && !error && (
        <div className="space-y-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No users match your search criteria</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const tier = getAccessTier(user.role);
              const colors = TIER_COLORS[tier];
              const isExpanded = expandedUser === user.userId;
              const isChanging = changingRole === user.userId;

              return (
                <motion.div
                  key={user.userId}
                  layout
                  className="rounded-xl border bg-card overflow-hidden"
                  style={{ borderColor: isExpanded ? colors.border : undefined }}
                >
                  {/* User row */}
                  <button
                    onClick={() => setExpandedUser(isExpanded ? null : user.userId)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: colors.bg }}
                    >
                      <User className="w-5 h-5" style={{ color: colors.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      {user.agency && (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {user.agency}
                        </span>
                      )}
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0"
                      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                    >
                      {tier}
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {user.completedModules}/7
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Expanded detail panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-border">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                            {/* Info cards */}
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                Current Role
                              </p>
                              <p className="text-sm font-medium">
                                {ROLE_LABELS[user.role] || user.role}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                Agency / Organization
                              </p>
                              <p className="text-sm">{user.agency || "Not specified"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                State
                              </p>
                              <p className="text-sm">{user.state || "Not specified"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                Joined
                              </p>
                              <p className="text-sm flex items-center gap-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                {user.joinedAt
                                  ? new Date(user.joinedAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>

                          {/* Progress summary */}
                          <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full" style={{ background: "#0D3B22" }} />
                              <span>{user.completedModules} completed</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full" style={{ background: "#1C4D36" }} />
                              <span>{user.inProgressModules} in progress</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full bg-muted" />
                              <span>{Math.max(0, 7 - user.completedModules - user.inProgressModules)} not started</span>
                            </div>
                          </div>

                          {/* Role Change Section */}
                          <div
                            className="mt-4 rounded-lg p-4"
                            style={{ background: "rgba(8,42,25,0.04)", border: "1px solid rgba(8,42,25,0.12)" }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Shield className="w-4 h-4" style={{ color: "#C9A84C" }} />
                              <p className="text-xs font-semibold" style={{ color: "#8B7325" }}>
                                Change Role Assignment
                              </p>
                              <span className="text-[9px] text-muted-foreground ml-auto">
                                CJIS 5.4 — Least Privilege
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <select
                                id={`role-select-${user.userId}`}
                                defaultValue={user.role}
                                className="flex-1 px-3 py-2 rounded-lg bg-input-background border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                                disabled={isChanging}
                              >
                                {ROLE_GROUPS.map((group) => (
                                  <optgroup key={group.tier} label={group.tier}>
                                    {group.roles.map((role) => {
                                      // Disable admin/superadmin for non-superadmin users
                                      const isElevated = role === "admin" || role === "superadmin";
                                      const disabled = isElevated && !isSuperAdmin;
                                      return (
                                        <option key={role} value={role} disabled={disabled}>
                                          {ROLE_LABELS[role] || role}
                                          {disabled ? " (requires superadmin)" : ""}
                                        </option>
                                      );
                                    })}
                                  </optgroup>
                                ))}
                              </select>
                              <button
                                onClick={() => {
                                  const select = document.getElementById(
                                    `role-select-${user.userId}`
                                  ) as HTMLSelectElement;
                                  const newRole = select?.value;
                                  if (newRole && newRole !== user.role) {
                                    setConfirmDialog({
                                      userId: user.userId,
                                      userName: user.name,
                                      currentRole: user.role,
                                      newRole,
                                    });
                                  }
                                }}
                                disabled={isChanging}
                                className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                              >
                                {isChanging ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Apply Role
                                  </>
                                )}
                              </button>
                            </div>

                            {!isSuperAdmin && (
                              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                You can assign roles up to Supervisor. Admin/Superadmin requires superadmin privileges.
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4"
            onClick={() => setConfirmDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(8,42,25,0.08)" }}
                >
                  <Shield className="w-6 h-6" style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <h3 className="font-semibold">Confirm Role Change</h3>
                  <p className="text-xs text-muted-foreground">CJIS 5.4 — Access Control Audit</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground mb-1">User</p>
                  <p className="text-sm font-medium">{confirmDialog.userName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">From</p>
                    <p className="text-sm font-medium">
                      {ROLE_LABELS[confirmDialog.currentRole] || confirmDialog.currentRole}
                    </p>
                  </div>
                  <span className="text-muted-foreground">&rarr;</span>
                  <div className="flex-1 rounded-lg p-3" style={{ background: "rgba(8,42,25,0.06)" }}>
                    <p className="text-xs text-muted-foreground mb-1">To</p>
                    <p className="text-sm font-semibold" style={{ color: "#0D3B22" }}>
                      {ROLE_LABELS[confirmDialog.newRole] || confirmDialog.newRole}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                This action will be recorded in the CJIS audit log. The user's permissions
                will be updated immediately upon confirmation.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleRoleChange(confirmDialog.userId, confirmDialog.newRole)
                  }
                  disabled={changingRole === confirmDialog.userId}
                  className="flex-1 py-2.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {changingRole === confirmDialog.userId ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Change"
                  )}
                </button>
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-5 py-2.5 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
