/**
 * CJIS-Compliant Security Module
 * ─────────────────────────────────
 * Implements front-end security controls aligned with the FBI CJIS Security
 * Policy v5.9.5 and NIST SP 800-53 (Moderate baseline).
 *
 * Key compliance areas:
 *  - CJIS 5.4:  Access Control (RBAC)
 *  - CJIS 5.5:  Policy & Implementation (session mgmt, password policy)
 *  - CJIS 5.6:  Identification & Authentication
 *  - CJIS 5.10: System & Information Integrity (audit logging)
 *  - CJIS 5.10.1.2: Encryption at rest (AES-256, handled server-side)
 */

// ──────────────────────────────────────────────────────────────────────
// ROLE-BASED ACCESS CONTROL (RBAC)  —  CJIS 5.4
// ──────────────────────────────────────────────────────────────────────

/** Platform access tiers aligned to CJIS least-privilege principle */
export type AccessTier =
  | "learner"         // Standard platform user
  | "supervisor"      // Can view team progress
  | "admin"           // Full admin dashboard, user management
  | "superadmin";     // Encryption key management, audit log access

/** Granular permissions */
export type Permission =
  | "modules:read"
  | "modules:write"
  | "assessments:take"
  | "assessments:review"
  | "simulations:run"
  | "simulations:review"
  | "certificates:generate"
  | "certificates:verify"
  | "admin:dashboard"
  | "admin:users"
  | "admin:audit"
  | "admin:export"
  | "licensing:manage"
  | "security:manage"
  | "reports:view"
  | "reports:export";

/** Maps professional roles → access tiers */
export const ROLE_TIER_MAP: Record<string, AccessTier> = {
  law_enforcement: "learner",
  cpi: "learner",
  prosecutor: "learner",
  judge: "learner",
  medical: "learner",
  school: "learner",
  advocate: "learner",
  forensic: "learner",
  mandated_reporter: "learner",
  instructor: "supervisor",
  supervisor: "supervisor",
  admin: "admin",
  superadmin: "superadmin",
};

/** Maps access tiers → permitted actions (cumulative) */
const TIER_PERMISSIONS: Record<AccessTier, Permission[]> = {
  learner: [
    "modules:read",
    "assessments:take",
    "simulations:run",
    "certificates:generate",
  ],
  supervisor: [
    "modules:read",
    "assessments:take",
    "assessments:review",
    "simulations:run",
    "simulations:review",
    "certificates:generate",
    "certificates:verify",
    "reports:view",
  ],
  admin: [
    "modules:read",
    "modules:write",
    "assessments:take",
    "assessments:review",
    "simulations:run",
    "simulations:review",
    "certificates:generate",
    "certificates:verify",
    "admin:dashboard",
    "admin:users",
    "admin:export",
    "licensing:manage",
    "reports:view",
    "reports:export",
  ],
  superadmin: [
    "modules:read",
    "modules:write",
    "assessments:take",
    "assessments:review",
    "simulations:run",
    "simulations:review",
    "certificates:generate",
    "certificates:verify",
    "admin:dashboard",
    "admin:users",
    "admin:audit",
    "admin:export",
    "licensing:manage",
    "security:manage",
    "reports:view",
    "reports:export",
  ],
};

/** Check if a role has a specific permission */
export function hasPermission(role: string, permission: Permission): boolean {
  const tier = ROLE_TIER_MAP[role] || "learner";
  return TIER_PERMISSIONS[tier]?.includes(permission) ?? false;
}

/** Get all permissions for a role */
export function getPermissions(role: string): Permission[] {
  const tier = ROLE_TIER_MAP[role] || "learner";
  return TIER_PERMISSIONS[tier] || [];
}

/** Get access tier for a role */
export function getAccessTier(role: string): AccessTier {
  return ROLE_TIER_MAP[role] || "learner";
}

/** Module access matrix: which roles can access which modules */
export const MODULE_ACCESS: Record<number, string[]> = {
  1: ["law_enforcement", "cpi", "prosecutor", "judge", "medical", "school", "advocate", "forensic", "mandated_reporter", "supervisor", "admin", "superadmin"],
  2: ["law_enforcement", "cpi", "prosecutor", "judge", "medical", "advocate", "forensic", "supervisor", "admin", "superadmin"],
  3: ["law_enforcement", "cpi", "prosecutor", "judge", "medical", "school", "advocate", "forensic", "supervisor", "admin", "superadmin"],
  4: ["law_enforcement", "cpi", "prosecutor", "forensic", "supervisor", "admin", "superadmin"],
  5: ["law_enforcement", "cpi", "prosecutor", "judge", "medical", "advocate", "forensic", "supervisor", "admin", "superadmin"],
  6: ["law_enforcement", "cpi", "prosecutor", "judge", "medical", "school", "advocate", "forensic", "mandated_reporter", "supervisor", "admin", "superadmin"],
  7: ["school", "medical", "mandated_reporter", "advocate", "law_enforcement", "cpi", "prosecutor", "judge", "forensic", "supervisor", "admin", "superadmin"],
};

/** Check if a role can access a specific module */
export function canAccessModule(role: string, moduleId: number): boolean {
  const allowed = MODULE_ACCESS[moduleId];
  if (!allowed) return false;
  return allowed.includes(role);
}

/** Route-level access control */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/dashboard": "modules:read",
  "/modules": "modules:read",
  "/certificates": "certificates:generate",
  "/admin/audit": "admin:audit",
  "/admin/users": "admin:users",
  "/admin": "admin:dashboard",
  "/instructor": "reports:view",
  "/licensing": "modules:read",
  "/security": "security:manage",
};

/** Check if a role can access a route */
export function canAccessRoute(role: string, path: string): boolean {
  // Strip trailing slashes and query params
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";

  // Find the matching route permission
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (cleanPath.startsWith(route)) {
      return hasPermission(role, permission);
    }
  }
  // Default: allow access (public routes)
  return true;
}

// ──────────────────────────────────────────────────────────────────────
// SESSION MANAGEMENT  —  CJIS 5.5.5
// ──────────────────────────────────────────────────────────────────────

/**
 * CJIS 5.5.5 requires:
 * - Maximum session timeout of 30 minutes of inactivity
 * - Session lock after the inactivity period
 * - Re-authentication to unlock
 */
export const CJIS_SESSION_CONFIG = {
  /** Maximum inactivity before session lock (ms) — CJIS 5.5.5 */
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  /** Maximum absolute session duration (ms) — 8-hour shift */
  MAX_SESSION_DURATION_MS: 8 * 60 * 60 * 1000, // 8 hours
  /** Warning before timeout (ms) */
  WARNING_BEFORE_TIMEOUT_MS: 5 * 60 * 1000, // 5 minutes
  /** Activity events that reset the inactivity timer */
  ACTIVITY_EVENTS: ["mousedown", "keydown", "scroll", "touchstart", "mousemove"] as const,
  /** Minimum interval between activity resets (ms) — throttle */
  ACTIVITY_THROTTLE_MS: 30_000, // 30 seconds
};

// ──────────────────────────────────────────────────────────────────────
// PASSWORD POLICY  —  CJIS 5.6.2.1
// ──────────────────────────────────────────────────────────────────────

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "strong" | "very_strong";
}

/**
 * CJIS 5.6.2.1 password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 * - Not a common password
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) errors.push("Minimum 8 characters required");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter required");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter required");
  if (!/[0-9]/.test(password)) errors.push("At least one digit required");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push("At least one special character required");

  // Common password check (abbreviated list)
  const commonPasswords = [
    "password", "12345678", "qwerty123", "abc12345", "password1",
    "letmein1", "welcome1", "admin123", "monkey12", "master12",
  ];
  if (commonPasswords.includes(password.toLowerCase()))
    errors.push("This password is too common");

  let strength: PasswordValidation["strength"] = "weak";
  if (errors.length === 0) {
    if (password.length >= 16) strength = "very_strong";
    else if (password.length >= 12) strength = "strong";
    else strength = "fair";
  }

  return { valid: errors.length === 0, errors, strength };
}

// ──────────────────────────────────────────────────────────────────────
// AUDIT LOG TYPES  —  CJIS 5.4.1.1
// ──────────────────────────────────────────────────────────────────────

export type AuditEventType =
  | "auth:login"
  | "auth:logout"
  | "auth:failed_login"
  | "auth:session_timeout"
  | "auth:session_extended"
  | "auth:password_change"
  | "data:profile_read"
  | "data:profile_update"
  | "data:progress_read"
  | "data:progress_update"
  | "data:assessment_submit"
  | "data:simulation_submit"
  | "data:certificate_generate"
  | "data:export"
  | "admin:dashboard_access"
  | "admin:user_view"
  | "admin:audit_view"
  | "security:encryption_key_rotate"
  | "security:role_change"
  | "security:permission_denied";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  outcome: "success" | "failure" | "denied";
  details?: string;
  /** Fingerprint for tamper detection (SHA-256 of entry content) */
  integrity?: string;
}

// ──────────────────────────────────────────────────────────────────────
// SECURITY HEADERS — CJIS 5.10.4
// ──────────────────────────────────────────────────────────────────────

export const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://*.supabase.co; connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
};

// ──────────────────────────────────────────────────────────────────────
// COMPLIANCE METADATA
// ──────────────────────────────────────────────────────────────────────

export const COMPLIANCE_INFO = {
  framework: "FBI CJIS Security Policy v5.9.5",
  supplementary: [
    "NIST SP 800-53 Rev 5 (Moderate Baseline)",
    "NIST SP 800-171 Rev 2 (CUI Protection)",
    "FERPA (Family Educational Rights and Privacy Act)",
    "HIPAA (Health Insurance Portability and Accountability Act)",
  ],
  encryptionStandard: "AES-256-GCM (FIPS 140-2)",
  keyDerivation: "PBKDF2-SHA256 (100,000 iterations)",
  sessionPolicy: "30-minute inactivity timeout per CJIS 5.5.5",
  auditRetention: "Minimum 1 year per CJIS 5.4.1.1",
  lastReview: "2026-03-06",
  certificationBody: "Community Exceptional Children's Services Centers",
};