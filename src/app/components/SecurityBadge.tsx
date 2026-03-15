/**
 * SecurityBadge & RequireRole — Enterprise security UI components
 *
 * SecurityBadge: Displays CJIS compliance status indicator
 * RequireRole: Route/component-level access guard
 * SessionMonitor: CJIS 5.5.5 inactivity timeout enforcement
 * PasswordStrengthMeter: CJIS 5.6.2.1 password policy UI
 */
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import {
  Shield,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  KeyRound,
  FileWarning,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import {
  hasPermission,
  canAccessRoute,
  getAccessTier,
  CJIS_SESSION_CONFIG,
  validatePassword,
  COMPLIANCE_INFO,
  type Permission,
  type PasswordValidation,
} from "./security";

// ──────────────────────────────────────────────────────────────────
// SECURITY BADGE — footer/header compliance indicator
// ──────────────────────────────────────────────────────────────────

export function SecurityBadge({ compact = false }: { compact?: boolean }) {
  const [showDetails, setShowDetails] = useState(false);

  if (compact) {
    return (
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all hover:opacity-90"
        style={{ background: "rgba(13,59,34,0.08)", color: "#0D3B22" }}
        title="CJIS Security Compliance"
      >
        <ShieldCheck className="w-3 h-3" />
        <span className="hidden sm:inline">CJIS Compliant</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border"
        style={{
          background: "rgba(13,59,34,0.06)",
          borderColor: "rgba(13,59,34,0.15)",
          color: "#0D3B22",
        }}
      >
        <ShieldCheck className="w-4 h-4" style={{ color: "#0D3B22" }} />
        <div className="text-left">
          <p className="font-medium text-[11px]">CJIS Security Policy Compliant</p>
          <p className="text-[9px] opacity-60">AES-256 | RBAC | Audit Logging</p>
        </div>
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-0 mb-2 w-80 bg-card rounded-xl border border-border shadow-xl p-4 z-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5" style={{ color: "#0D3B22" }} />
              <h4 className="text-sm font-semibold">Security Compliance</h4>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} />
                <div>
                  <p className="font-medium text-foreground">{COMPLIANCE_INFO.framework}</p>
                  <p>Primary compliance framework</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} />
                <div>
                  <p className="font-medium text-foreground">{COMPLIANCE_INFO.encryptionStandard}</p>
                  <p>Data encrypted at rest and in transit</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <KeyRound className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} />
                <div>
                  <p className="font-medium text-foreground">{COMPLIANCE_INFO.keyDerivation}</p>
                  <p>Cryptographic key derivation</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} />
                <div>
                  <p className="font-medium text-foreground">{COMPLIANCE_INFO.sessionPolicy}</p>
                  <p>Automatic session management</p>
                </div>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-[10px] text-muted-foreground">
                  Supplementary:{" "}
                  {COMPLIANCE_INFO.supplementary.join(" | ")}
                </p>
              </div>
              <p className="text-[10px] opacity-50">
                Last security review: {COMPLIANCE_INFO.lastReview}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// REQUIRE ROLE — route/component-level access guard
// ──────────────────────────────────────────────────────────────────

interface RequireRoleProps {
  /** Permission required to view this content */
  permission?: Permission;
  /** Specific roles allowed (alternative to permission) */
  allowedRoles?: string[];
  /** Minimum access tier */
  minTier?: "learner" | "supervisor" | "admin" | "superadmin";
  /** Content to show when access is denied */
  fallback?: ReactNode;
  children: ReactNode;
}

export function RequireRole({
  permission,
  allowedRoles,
  minTier,
  fallback,
  children,
}: RequireRoleProps) {
  const { profile, user } = useAuth();
  const role = profile?.role || "learner";

  // Check permission
  if (permission && !hasPermission(role, permission)) {
    return <>{fallback || <AccessDenied />}</>;
  }

  // Check allowed roles
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <>{fallback || <AccessDenied />}</>;
  }

  // Check minimum tier
  if (minTier) {
    const tierOrder = ["learner", "supervisor", "admin", "superadmin"];
    const userTier = getAccessTier(role);
    if (tierOrder.indexOf(userTier) < tierOrder.indexOf(minTier)) {
      return <>{fallback || <AccessDenied />}</>;
    }
  }

  return <>{children}</>;
}

/**
 * RequireLicense — redirects unlicensed learners to /licensing.
 * Admin/superadmin bypass this check (they are platform operators, not learners).
 * When platformLicensingEnabled is false, all users bypass the license check.
 */
export function RequireLicense({ children }: { children: ReactNode }) {
  const { licenseActive, platformLicensingEnabled, profile, loading } = useAuth();
  const role = profile?.role || "learner";
  const tier = getAccessTier(role);

  // Still loading — don't flash a redirect
  if (loading) return null;

  // Platform operators bypass license requirement
  if (tier === "admin" || tier === "superadmin") return <>{children}</>;

  // Licensing disabled platform-wide — all users pass through
  if (!platformLicensingEnabled) return <>{children}</>;

  if (!licenseActive) {
    return <Navigate to="/licensing" replace />;
  }

  return <>{children}</>;
}

/**
 * LicenseGate — layout-style version of RequireLicense for use as a React Router
 * layout route. Renders <Outlet /> for child routes when license is active.
 * When platformLicensingEnabled is false, all users pass through without a license check.
 */
export function LicenseGate() {
  const { licenseActive, platformLicensingEnabled, profile, loading } = useAuth();
  const role = profile?.role || "learner";
  const tier = getAccessTier(role);

  if (loading) return null;
  if (tier === "admin" || tier === "superadmin") return <Outlet />;
  if (!platformLicensingEnabled) return <Outlet />;
  if (!licenseActive) return <Navigate to="/licensing" replace />;
  return <Outlet />;
}

/**
 * RequireSuperAdmin — route guard that only allows superadmin users.
 * All other authenticated users are redirected to /dashboard.
 */
export function RequireSuperAdmin() {
  const { profile, loading } = useAuth();
  const role = profile?.role || "learner";

  if (loading) return null;
  if (role !== "superadmin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(220,38,38,0.08)" }}
        >
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
        <p className="text-sm text-muted-foreground mb-1">
          Your current role does not have permission to access this resource.
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Per CJIS Security Policy 5.4 (Access Control), access is restricted to
          authorized personnel based on role assignment and least-privilege principles.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Return to Dashboard
        </button>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SESSION MONITOR — CJIS 5.5.5 inactivity timeout
// ──────────────────────────────────────────────────────────────────

export function SessionMonitor() {
  const { user, signOut, accessToken } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const lastActivityRef = useRef<number>(0);
  const sessionStartRef = useRef<number>(0);
  const warningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastThrottleRef = useRef(0);

  const resetActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastThrottleRef.current < CJIS_SESSION_CONFIG.ACTIVITY_THROTTLE_MS) return;
    lastThrottleRef.current = now;
    lastActivityRef.current = now;
    if (showWarning) setShowWarning(false);
  }, [showWarning]);

  const handleTimeout = useCallback(async () => {
    setShowWarning(false);
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  const handleExtend = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
  }, []);

  useEffect(() => {
    if (!user || !accessToken) return;

    const now = Date.now();
    sessionStartRef.current = now;
    lastActivityRef.current = now;

    // Listen for activity events
    const events = CJIS_SESSION_CONFIG.ACTIVITY_EVENTS;
    events.forEach((event) => window.addEventListener(event, resetActivity, { passive: true }));

    // Check inactivity every 30 seconds
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const inactiveMs = now - lastActivityRef.current;
      const sessionMs = now - sessionStartRef.current;

      // Absolute session limit
      if (sessionMs >= CJIS_SESSION_CONFIG.MAX_SESSION_DURATION_MS) {
        handleTimeout();
        return;
      }

      // Inactivity timeout
      if (inactiveMs >= CJIS_SESSION_CONFIG.INACTIVITY_TIMEOUT_MS) {
        handleTimeout();
        return;
      }

      // Warning before timeout
      const timeUntilTimeout = CJIS_SESSION_CONFIG.INACTIVITY_TIMEOUT_MS - inactiveMs;
      if (timeUntilTimeout <= CJIS_SESSION_CONFIG.WARNING_BEFORE_TIMEOUT_MS && !showWarning) {
        setShowWarning(true);
        setRemainingSeconds(Math.ceil(timeUntilTimeout / 1000));
      }
    }, 30_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetActivity));
      clearInterval(checkInterval);
    };
  }, [user, accessToken, resetActivity, handleTimeout, showWarning]);

  // Countdown timer when warning is shown
  useEffect(() => {
    if (showWarning) {
      warningTimerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (warningTimerRef.current) {
        clearInterval(warningTimerRef.current);
        warningTimerRef.current = null;
      }
    }
    return () => {
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [showWarning, handleTimeout]);

  if (!showWarning) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(234,179,8,0.1)" }}
            >
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Session Timeout Warning</h3>
              <p className="text-xs text-muted-foreground">CJIS 5.5.5 Compliance</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Your session will be automatically locked due to inactivity.
            Per CJIS Security Policy, sessions must time out after 30 minutes
            of inactivity to protect sensitive information.
          </p>

          <div className="text-center mb-4">
            <p className="text-3xl font-mono font-bold" style={{ color: "#C9A84C" }}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">until automatic sign-out</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExtend}
              className="flex-1 py-2.5 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Continue Session
            </button>
            <button
              onClick={handleTimeout}
              className="px-4 py-2.5 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────────────────────────
// PASSWORD STRENGTH METER — CJIS 5.6.2.1
// ──────────────────────────────────────────────────────────────────

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthMeter({
  password,
  showRequirements = true,
}: PasswordStrengthMeterProps) {
  const validation = validatePassword(password);

  const strengthColors: Record<string, string> = {
    weak: "#DC2626",
    fair: "#F59E0B",
    strong: "#16A34A",
    very_strong: "#0D3B22",
  };

  const strengthWidths: Record<string, string> = {
    weak: "25%",
    fair: "50%",
    strong: "75%",
    very_strong: "100%",
  };

  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Digit", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: strengthWidths[validation.strength],
            background: strengthColors[validation.strength],
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p
          className="text-[10px] font-medium"
          style={{ color: strengthColors[validation.strength] }}
        >
          {validation.strength.replace("_", " ").toUpperCase()}
        </p>
        <p className="text-[10px] text-muted-foreground">CJIS 5.6.2.1</p>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-1">
          {requirements.map((req) => (
            <div key={req.label} className="flex items-center gap-1.5 text-[10px]">
              {req.met ? (
                <CheckCircle2 className="w-3 h-3" style={{ color: "#0D3B22" }} />
              ) : (
                <XCircle className="w-3 h-3 text-muted-foreground" />
              )}
              <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// LEGAL FOOTER — Trademark & IP
// ──────────────────────────────────────────────────────────────────

export function LegalFooter({ variant = "full" }: { variant?: "full" | "compact" }) {
  const currentYear = new Date().getFullYear();

  if (variant === "compact") {
    return (
      <div className="text-center py-3 text-[10px] text-muted-foreground space-y-1">
        <p>
          &copy; {currentYear} Community Exceptional Children&rsquo;s Services Centers. All Rights Reserved.
        </p>
        <div className="flex items-center justify-center gap-2">
          <SecurityBadge compact />
        </div>
      </div>
    );
  }

  return (
    <footer
      className="py-8 px-6"
      style={{ background: "#082A19" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top: Brand + Compliance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.15)" }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: "#C9A84C" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#C9A84C", fontFamily: "'Playfair Display', Georgia, serif" }}>
                RootWork Framework&trade;
              </p>
              <p className="text-[10px]" style={{ color: "rgba(242,244,202,0.65)" }}>
                GALS &times; RWFW Co-Branded Training Platform
              </p>
            </div>
          </div>

          {/* Compliance badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(201,168,76,0.08)" }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
              <span className="text-[10px] font-medium" style={{ color: "#C9A84C" }}>CJIS Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(201,168,76,0.08)" }}>
              <Lock className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
              <span className="text-[10px] font-medium" style={{ color: "#C9A84C" }}>AES-256</span>
            </div>
          </div>
        </div>

        {/* Middle: 5Rs + Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6" style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          <p className="text-xs" style={{ color: "#C9A84C" }}>
            Root &middot; Regulate &middot; Reflect &middot; Restore &middot; Reconnect
          </p>
          <div className="flex items-center gap-4 text-[10px]" style={{ color: "rgba(242,244,202,0.65)" }}>
            <a href="/privacy" className="hover:text-gold-leaf transition-colors">Privacy Policy</a>
            <span>&middot;</span>
            <a href="/terms" className="hover:text-gold-leaf transition-colors">Terms of Service</a>
            <span>&middot;</span>
            <a href="/security" className="hover:text-gold-leaf transition-colors">Security</a>
            <span>&middot;</span>
            <a href="/accessibility" className="hover:text-gold-leaf transition-colors">Accessibility</a>
          </div>
        </div>

        {/* Bottom: Legal */}
        <div className="space-y-3 text-center">
          <p className="text-[11px] font-medium" style={{ color: "#C9A84C" }}>
            &copy; {currentYear} Community Exceptional Children&rsquo;s Services Centers.
            All Rights Reserved.
          </p>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="text-[9px] leading-relaxed" style={{ color: "rgba(242,244,202,0.6)" }}>
              The RootWork Framework&trade;, RootWork 5Rs&trade;, TRACE Cognitive Cycle&trade;,
              and all associated logos, trade dress, curriculum content, assessment instruments,
              scenario simulations, and training materials are the exclusive intellectual property
              of Community Exceptional Children&rsquo;s Services Centers and its licensors.
              Unauthorized reproduction, distribution, modification, public display, or commercial
              exploitation of any platform content, in whole or in part, is strictly prohibited
              without prior written consent.
            </p>
            <p className="text-[9px] leading-relaxed" style={{ color: "rgba(242,244,202,0.6)" }}>
              GALS (Growing and Loving Sisters Foundation Inc.) is a registered trademark used
              under license. All third-party trademarks, service marks, trade names, and statutory
              citations referenced herein remain the property of their respective owners and are
              used for identification and educational purposes only. Citation of legal statutes
              (including O.C.G.A., U.S.C., and state-specific codes) does not constitute legal advice.
            </p>
            <p className="text-[9px] leading-relaxed" style={{ color: "rgba(242,244,202,0.6)" }}>
              This platform implements security controls aligned with the FBI Criminal Justice
              Information Services (CJIS) Security Policy v5.9.5, including AES-256-GCM encryption
              at rest, role-based access control (RBAC), PBKDF2-SHA256 key derivation, automated
              session management with 30-minute inactivity timeout, and comprehensive audit logging.
              Compliance with NIST SP 800-53 Rev 5 (Moderate), NIST SP 800-171 Rev 2, FERPA,
              and HIPAA administrative safeguards is maintained where applicable. Security posture
              is subject to periodic review and assessment.
            </p>
            <p className="text-[8px]" style={{ color: "rgba(242,244,202,0.6)" }}>
              Platform Version 2.0.0 | Security Policy Effective Date: March 6, 2026 |
              Built with enterprise-grade infrastructure on Supabase
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}