import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
import Stripe from "npm:stripe@17.7.0";
import {
  encryptedSet,
  encryptedGet,
  encryptedGetByPrefix,
  encryptedGetByPrefixWithKeys,
} from "./encryption.tsx";

const app = new Hono();

app.use("*", logger(console.log));

// CORS: static allowlist — only the production Vercel deployment and local dev origins.
// Reflecting arbitrary origins would allow any website to make credentialed requests.
const ALLOWED_ORIGINS = [
  "https://rootwork-training-platform.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
];

app.use(
  "/*",
  cors({
    origin: ALLOWED_ORIGINS,
    allowHeaders: ["Content-Type", "Authorization", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ── CJIS 5.10.4: Security Headers Middleware ──
app.use("*", async (c, next) => {
  await next();
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
});

// ── CJIS 5.4.1.1: Audit Logging Utility ──
async function auditLog(
  eventType: string,
  userId: string,
  outcome: "success" | "failure" | "denied",
  details?: string,
  c?: any,
) {
  try {
    const ts = Date.now();
    const entry: Record<string, unknown> = {
      id: crypto.randomUUID(),
      timestamp: new Date(ts).toISOString(),
      eventType,
      userId,
      outcome,
      details: details || "",
      ipAddress: c?.req?.header("x-forwarded-for") || c?.req?.header("cf-connecting-ip") || "unknown",
      userAgent: c?.req?.header("user-agent")?.slice(0, 120) || "unknown",
    };
    // CJIS 5.4.1.1: Compute HMAC-SHA256 integrity fingerprint for tamper detection
    const entryWithoutIntegrity = { ...entry, integrity: undefined };
    const msgBytes = new TextEncoder().encode(JSON.stringify(entryWithoutIntegrity));
    const keyBytes = new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
    const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sigBytes = await crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
    entry.integrity = btoa(String.fromCharCode(...new Uint8Array(sigBytes)));
    // Store audit log with encryption
    await encryptedSet(kv.set, `audit:${userId}:${ts}`, entry);
    // Also store in global audit prefix for admin queries
    await kv.set(`audit_idx:${ts}`, { userId, eventType, outcome, timestamp: entry.timestamp });
  } catch (e) {
    console.log("Audit log write error (non-blocking):", e);
  }
}

// ---------- Auth helpers ----------

// CJIS 5.4: Roles with administrative privileges.
const ADMIN_ROLES: string[] = ["admin", "superadmin"];

function supabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    // Required for Deno edge function environments — prevents auth subsystem from
    // attempting localStorage/cookie access which fails silently and breaks getUser().
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } },
  );
}

async function getUserId(c: any): Promise<string | null> {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  // Decode JWT payload directly — avoids a redundant auth.getUser() network round-trip
  // that fails in some Deno edge-function environments. JWT uses base64url (RFC 4648 §5):
  // replace url-safe chars and restore standard base64 padding before decoding.
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, "=");
    const payload = JSON.parse(atob(padded));
    const userId = payload.sub as string | undefined;
    if (!userId) return null;
    return userId;
  } catch (e) {
    console.error("getUserId JWT decode error:", e);
    return null;
  }
}

// ── CJIS 5.4: Role-based access control helper ──
// Reads user:{userId}:profile from KV and returns the stored role.
// Defaults to "learner" when no profile exists or role is unset.
async function getUserRole(userId: string): Promise<string> {
  const profile = await encryptedGet<{ role?: string }>(kv.get, `user:${userId}:profile`);
  return profile?.role || "learner";
}

// ---------- Health ----------

app.get("/make-server-39a35780/health", (c) => {
  return c.json({ status: "ok" });
});

// CJIS 5.10.1: KV-backed rate limiter — persists across Deno isolate restarts.
// In-memory Maps reset on every cold start so they cannot enforce limits reliably.
async function checkRateLimit(ip: string, maxRequests = 10, windowMs = 15 * 60 * 1000): Promise<boolean> {
  const windowStart = Math.floor(Date.now() / windowMs);
  const key = `ratelimit:${ip}:${windowStart}`;
  try {
    const current = await kv.get(key) as { count: number } | null;
    const count = (current?.count ?? 0) + 1;
    await kv.set(key, { count, expiresAt: Date.now() + windowMs * 2 });
    return count <= maxRequests;
  } catch {
    // On KV error, allow the request (fail open to preserve availability)
    return true;
  }
}

// ---------- Auth: Sign Up ----------

app.post("/make-server-39a35780/signup", async (c) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
  if (!(await checkRateLimit(ip))) return c.json({ error: "Too many requests. Please try again later." }, 429);
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({ error: "Missing email, password, or name" }, 400);
    }
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });
    if (error) {
      console.error("Signup error:", error.message);
      return c.json({ error: `Signup failed: ${error.message}` }, 400);
    }
    // Audit: successful signup
    await auditLog("auth:signup", data.user.id, "success", `New user created: ${email}`, c);
    return c.json({ user: { id: data.user.id, email: data.user.email } });
  } catch (e) {
    console.error("Signup exception:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Profile ----------

app.get("/make-server-39a35780/profile", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: profile fetch" }, 401);
  try {
    const profile = await encryptedGet(kv.get, `user:${userId}:profile`);
    await auditLog("data:profile_read", userId, "success", "Profile fetched", c);
    return c.json({ profile: profile || null });
  } catch (e) {
    console.error("Profile get error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-39a35780/profile", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: profile update" }, 401);
  try {
    const body = await c.req.json();
    const existing = await encryptedGet<any>(kv.get, `user:${userId}:profile`);
    // Strip server-controlled fields. userId and joinedAt are always server-assigned.
    // role may be self-set only to a learner-tier professional role; admin/superadmin
    // assignment is reserved for PUT /admin/users/:id/role.
    const SELF_REGISTERABLE_ROLES = [
      "learner", "law_enforcement", "cpi", "prosecutor", "judge",
      "medical", "school", "victim_advocate", "forensic_interviewer", "mandated_reporter",
    ];
    const { role: rawRole, userId: _uid, joinedAt: _joinedAt, ...safeBody } = body;
    const allowedRole = rawRole && SELF_REGISTERABLE_ROLES.includes(rawRole) ? rawRole : undefined;
    const profile = {
      ...(existing || {}),
      ...safeBody,
      ...(allowedRole !== undefined ? { role: allowedRole } : {}),
      userId,
      updatedAt: new Date().toISOString(),
    };
    if (!existing) {
      profile.joinedAt = new Date().toISOString();
    }
    await encryptedSet(kv.set, `user:${userId}:profile`, profile);
    await auditLog("data:profile_update", userId, "success", "Profile updated", c);
    return c.json({ profile });
  } catch (e) {
    console.error("Profile update error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- License Gate ----------
// CJIS / Business rule: only users with an active license may write training data.
// Admin/superadmin are platform operators and bypass this requirement.
// When platform licensingEnabled setting is false, all users bypass the license check.
async function requireLicense(userId: string, userRole: string): Promise<boolean> {
  if (ADMIN_ROLES.includes(userRole)) return true;
  // If licensing is disabled platform-wide, all users may access training data
  const platformSettings = await kv.get("platform:settings") as any;
  if (!platformSettings?.licensingEnabled) return true;
  const license = await encryptedGet<any>(kv.get, `user:${userId}:license`);
  if (!license) return false;
  if (license.status !== "active") return false;
  if (license.expiresAt && new Date(license.expiresAt) < new Date()) return false;
  return true;
}

// ---------- Progress ----------

app.get("/make-server-39a35780/progress", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: progress fetch" }, 401);
  try {
    const results = await encryptedGetByPrefix(kv.getByPrefix, `user:${userId}:progress:`);
    return c.json({ progress: results || [] });
  } catch (e) {
    console.error("Progress fetch error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-39a35780/progress/:moduleId", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: progress update" }, 401);
  const userRole = await getUserRole(userId);
  if (!(await requireLicense(userId, userRole))) {
    return c.json({ error: "License required to save progress" }, 402);
  }
  const moduleId = c.req.param("moduleId");
  try {
    const body = await c.req.json();
    const key = `user:${userId}:progress:${moduleId}`;
    // CJIS 5.10.1.2: progress data is encrypted at rest — use encryptedGet/encryptedSet
    const existing = await encryptedGet<any>(kv.get, key);
    const progress = {
      moduleId: Number(moduleId),
      preAssessmentScore: null,
      postAssessmentScore: null,
      sectionsCompleted: [],
      scenariosCompleted: [],
      timeSpent: 0,
      status: "not_started",
      completedDate: null,
      ...(existing || {}),
      ...body,
      updatedAt: new Date().toISOString(),
    };
    await encryptedSet(kv.set, key, progress);
    return c.json({ progress });
  } catch (e) {
    console.error("Progress update error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Vignettes Watched ----------

app.get("/make-server-39a35780/vignettes", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: vignettes fetch" }, 401);
  try {
    const data = await kv.get(`user:${userId}:vignettes`);
    return c.json({ watched: data?.watched || [] });
  } catch (e) {
    console.error("Vignettes fetch error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-39a35780/vignettes", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: vignettes update" }, 401);
  try {
    const body = await c.req.json();
    await kv.set(`user:${userId}:vignettes`, { watched: body.watched || [] });
    return c.json({ success: true });
  } catch (e) {
    console.error("Vignettes update error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Simulations ----------

app.post("/make-server-39a35780/simulations", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: simulation save" }, 401);
  const simUserRole = await getUserRole(userId);
  if (!(await requireLicense(userId, simUserRole))) {
    return c.json({ error: "License required to save simulation results" }, 402);
  }
  try {
    const body = await c.req.json();
    const ts = Date.now();
    const key = `user:${userId}:simulation:${body.moduleId}:${ts}`;
    const record = {
      ...body,
      userId,
      completedAt: new Date().toISOString(),
    };
    await encryptedSet(kv.set, key, record);
    return c.json({ simulation: record });
  } catch (e) {
    console.error("Simulation save error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-39a35780/simulations", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: simulations fetch" }, 401);
  try {
    const results = await encryptedGetByPrefix(kv.getByPrefix, `user:${userId}:simulation:`);
    return c.json({ simulations: results || [] });
  } catch (e) {
    console.error("Simulations fetch error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Certificates ----------

// POST /certificates/generate — idempotent: returns existing cert or creates a new one
app.post("/make-server-39a35780/certificates/generate", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  const certUserRole = await getUserRole(userId);
  if (!(await requireLicense(userId, certUserRole))) {
    return c.json({ error: "License required to generate certificates" }, 402);
  }
  try {
    // Return existing certificate if already issued (idempotent)
    const existing = await kv.get(`user:${userId}:certificate`);
    if (existing) {
      return c.json({ certificate: existing });
    }

    // Verify at least one module is completed
    const progressResults = await encryptedGetByPrefix(kv.getByPrefix, `user:${userId}:progress:`);
    interface ProgressRecord { status: string; }
    const completedModules = (progressResults as ProgressRecord[] || []).filter((p) => p.status === "completed");
    if (completedModules.length === 0) {
      return c.json({ error: "No completed modules found" }, 400);
    }

    // Generate deterministic cert ID: RW-{year}-{8-char hex}
    const year = new Date().getFullYear();
    const uuid = crypto.randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase();
    const certId = `RW-${year}-${uuid}`;

    // Read profile to embed learnerName and role in public cert record (for CertificateVerify.tsx)
    const certProfile = await encryptedGet<{ name?: string; role?: string }>(kv.get, `user:${userId}:profile`);

    const certificate = {
      certId,
      userId,
      issuedAt: new Date().toISOString(),
      completedModules: completedModules.length,
    };

    // Persist by user (for GET /certificates) and by certId (for public verification)
    await kv.set(`user:${userId}:certificate`, certificate);
    await kv.set(`cert:${certId}`, {
      certId,
      userId,
      issuedAt: certificate.issuedAt,
      learnerName: certProfile?.name || "",
      role: certProfile?.role || "learner",
    });

    await auditLog("certificate_generate", userId, "success", `certId=${certId}`, c);
    return c.json({ certificate });
  } catch (e) {
    await auditLog("certificate_generate", userId, "failure", String(e), c);
    console.error("Certificate generate error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /certificates — fetch the current user's certificates
app.get("/make-server-39a35780/certificates", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  try {
    const certificate = await kv.get(`user:${userId}:certificate`);
    return c.json({ certificates: certificate ? [certificate] : [] });
  } catch (e) {
    console.error("Certificates fetch error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /certificates/:certId — public verification endpoint
app.get("/make-server-39a35780/certificates/:certId", async (c) => {
  const certId = c.req.param("certId");
  try {
    const certRef = await kv.get(`cert:${certId}`);
    if (!certRef) return c.json({ error: "Certificate not found" }, 404);
    return c.json({ certificate: certRef });
  } catch (e) {
    console.error("Certificate lookup error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Stripe / Licensing ----------

const LICENSE_PLANS = [
  {
    id: "org_seat",
    name: "Organizational Seat License",
    description: "Per-seat annual license for a defined number of users within one organization",
    unitLabel: "seat",
    priceRange: "$150–$250/seat/year",
    defaultPrice: 20000, // $200.00 in cents
    minSeats: 1,
    maxSeats: 500,
    allowQuantity: true,
  },
  {
    id: "department",
    name: "Department / Agency License",
    description: "Flat annual fee for unlimited users within a single agency or court",
    unitLabel: "agency",
    priceRange: "$3,500–$8,500/year",
    defaultPrice: 500000, // $5,000.00 in cents
    allowQuantity: false,
  },
  {
    id: "judicial_circuit",
    name: "Judicial Circuit License",
    description: "Covers all professionals within a defined Georgia judicial circuit",
    unitLabel: "circuit",
    priceRange: "$8,000–$15,000/year",
    defaultPrice: 1200000, // $12,000.00 in cents
    allowQuantity: false,
  },
  {
    id: "statewide",
    name: "Statewide Agency License",
    description: "Single contract covering all regional offices of a state agency (DFCS, etc.)",
    unitLabel: "agency",
    priceRange: "$25,000–$60,000/year",
    defaultPrice: 4000000, // $40,000.00 in cents
    allowQuantity: false,
  },
];

function getStripe() {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

app.get("/make-server-39a35780/licensing/plans", (c) => {
  return c.json({ plans: LICENSE_PLANS });
});

app.get("/make-server-39a35780/licensing/status", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: license status" }, 401);
  try {
    const license = await encryptedGet(kv.get, `user:${userId}:license`);
    return c.json({ license: license || null });
  } catch (e) {
    console.error("License status error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-39a35780/licensing/checkout", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: checkout" }, 401);
  try {
    const { planId, quantity, orgName, successUrl, cancelUrl } = await c.req.json();
    const plan = LICENSE_PLANS.find((p) => p.id === planId);
    if (!plan) return c.json({ error: "Invalid plan selected" }, 400);

    const stripe = getStripe();
    const qty = plan.allowQuantity ? Math.max(1, Math.min(quantity || 1, plan.maxSeats || 500)) : 1;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.defaultPrice,
          },
          quantity: qty,
        },
      ],
      metadata: {
        userId,
        planId: plan.id,
        planName: plan.name,
        quantity: String(qty),
        orgName: orgName || "",
      },
      success_url: successUrl || "https://example.com/licensing/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "https://example.com/licensing?canceled=true",
    });

    return c.json({ sessionId: session.id, url: session.url });
  } catch (e) {
    console.error("Checkout session error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/make-server-39a35780/licensing/confirm", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: confirm" }, 401);
  try {
    const { sessionId } = await c.req.json();
    if (!sessionId) return c.json({ error: "Missing sessionId" }, 400);

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return c.json({ error: "Payment not completed" }, 400);
    }

    const meta = session.metadata || {};
    if (meta.userId !== userId) {
      return c.json({ error: "Session does not belong to this user" }, 403);
    }

    const plan = LICENSE_PLANS.find((p) => p.id === meta.planId);
    const license = {
      planId: meta.planId,
      planName: meta.planName || plan?.name,
      quantity: Number(meta.quantity) || 1,
      orgName: meta.orgName || "",
      amountPaid: session.amount_total,
      currency: session.currency,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent,
      status: "active",
      purchasedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    await encryptedSet(kv.set, `user:${userId}:license`, license);
    // Also store in an org-level key for admin lookups
    await encryptedSet(kv.set, `license:${session.id}`, { ...license, userId });

    return c.json({ license });
  } catch (e) {
    console.error("License confirm error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Stripe Webhook ----------
// Canonical license activation — fires even if the user closes the browser
// before /licensing/confirm is polled. Signature-verified by Stripe.

app.post("/make-server-39a35780/licensing/webhook", async (c) => {
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) return c.json({ error: "Webhook secret not configured" }, 500);

  const signature = c.req.header("stripe-signature");
  if (!signature) return c.json({ error: "Missing stripe-signature header" }, 400);

  const rawBody = await c.req.text();
  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    console.log("Webhook signature verification failed:", e);
    return c.json({ error: "Webhook signature invalid" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status !== "paid") return c.json({ received: true });

    const meta = session.metadata || {};
    const userId = meta.userId;
    if (!userId) return c.json({ received: true });

    // Idempotency: skip if already activated
    const existing = await encryptedGet(kv.get, "license:" + session.id);
    if (existing) return c.json({ received: true });

    const plan = LICENSE_PLANS.find((p) => p.id === meta.planId);
    const license = {
      planId: meta.planId,
      planName: meta.planName || plan?.name,
      quantity: Number(meta.quantity) || 1,
      orgName: meta.orgName || "",
      amountPaid: session.amount_total,
      currency: session.currency,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent,
      status: "active",
      purchasedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      activatedVia: "webhook",
    };

    await encryptedSet(kv.set, "user:" + userId + ":license", license);
    await encryptedSet(kv.set, "license:" + session.id, { ...license, userId });
    await auditLog("payment:license_activated", userId, "success",
      "planId=" + meta.planId + " via webhook sessionId=" + session.id);
    console.log("License activated via webhook for user:", userId);
  }

  return c.json({ received: true });
});

// ---------- Platform Settings ----------

const PLATFORM_SETTINGS_KEY = "platform:settings";

// GET /platform/settings — public, no auth required
app.get("/make-server-39a35780/platform/settings", async (c) => {
  try {
    const settings = await kv.get(PLATFORM_SETTINGS_KEY) as any;
    return c.json({ licensingEnabled: settings?.licensingEnabled ?? false });
  } catch (_e) {
    return c.json({ licensingEnabled: false });
  }
});

// PUT /platform/settings — superadmin only
app.put("/make-server-39a35780/platform/settings", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  const role = await getUserRole(userId);
  if (role !== "superadmin") {
    await auditLog("security:permission_denied", userId, "denied", "Attempted platform settings change without superadmin", c);
    return c.json({ error: "Forbidden: superadmin only" }, 403);
  }
  try {
    const body = await c.req.json();
    const existing = (await kv.get(PLATFORM_SETTINGS_KEY) as any) || {};
    const updated = {
      ...existing,
      ...(typeof body.licensingEnabled === "boolean" ? { licensingEnabled: body.licensingEnabled } : {}),
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };
    await kv.set(PLATFORM_SETTINGS_KEY, updated);
    await auditLog("admin:platform_settings_update", userId, "success",
      `licensingEnabled=${updated.licensingEnabled}`, c);
    return c.json({ settings: updated });
  } catch (e) {
    console.error("Platform settings update error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Video Registry ----------
// Public read so the platform can resolve video URLs without auth.
// Write is admin-only with audit logging.

const VIDEO_REGISTRY_KEY = "platform:video_registry";

app.get("/make-server-39a35780/videos", async (c) => {
  try {
    const registry = await kv.get(VIDEO_REGISTRY_KEY) ?? {};
    return c.json(registry);
  } catch (e) {
    console.error("Video registry fetch error:", e);
    return c.json({});
  }
});

// Bulk import endpoint — admin/superadmin only.
// Accepts { entries: Record<string, { url: string; status: string }> }
app.post("/make-server-39a35780/admin/videos/bulk", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  const role = await getUserRole(userId);
  if (!ADMIN_ROLES.includes(role)) return c.json({ error: "Forbidden" }, 403);
  try {
    const { entries } = await c.req.json();
    if (!entries || typeof entries !== "object") return c.json({ error: "entries object required" }, 400);
    const registry: Record<string, any> = await kv.get(VIDEO_REGISTRY_KEY) ?? {};
    const now = new Date().toISOString();
    for (const [videoId, data] of Object.entries(entries) as [string, any][]) {
      registry[videoId] = { ...registry[videoId], ...data, updatedAt: now, updatedBy: "system" };
    }
    await kv.set(VIDEO_REGISTRY_KEY, registry);
    return c.json({ ok: true, updated: Object.keys(entries).length });
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-39a35780/admin/videos", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  try {
    const requesterRole = await getUserRole(userId);
    if (!ADMIN_ROLES.includes(requesterRole)) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const registry = await kv.get(VIDEO_REGISTRY_KEY) ?? {};
    return c.json(registry);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-39a35780/admin/videos/:videoId", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  try {
    const requesterRole = await getUserRole(userId);
    if (!ADMIN_ROLES.includes(requesterRole)) {
      await auditLog("security:permission_denied", userId, "denied", "Attempted video registry write without permission", c);
      return c.json({ error: "Forbidden" }, 403);
    }
    const videoId = c.req.param("videoId");
    const { url, status } = await c.req.json();
    const registry: Record<string, any> = await kv.get(VIDEO_REGISTRY_KEY) ?? {};
    const prev = registry[videoId] ?? {};
    registry[videoId] = {
      ...prev,
      ...(url !== undefined ? { url } : {}),
      ...(status !== undefined ? { status } : {}),
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };
    await kv.set(VIDEO_REGISTRY_KEY, registry);
    await auditLog("admin:video_registry_update", userId, "success", `Updated video ${videoId}: status=${registry[videoId].status}`, c);
    return c.json({ ok: true, entry: registry[videoId] });
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Admin Stats (aggregate all users) ----------

app.get("/make-server-39a35780/admin/stats", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: admin stats" }, 401);
  try {
    // CJIS 5.4: Enforce least-privilege — only admin/superadmin may view stats
    const requesterRole = await getUserRole(userId);
    if (!ADMIN_ROLES.includes(requesterRole)) {
      await auditLog("security:permission_denied", userId, "denied", "Attempted admin stats access without permission", c);
      return c.json({ error: "Forbidden: insufficient privileges for admin stats" }, 403);
    }

    // Audit: admin dashboard access
    await auditLog("admin:dashboard_access", userId, "success", "Admin stats requested", c);
    // Get all user records with keys; decrypt values (profiles and progress are encrypted)
    const allEntries = await encryptedGetByPrefixWithKeys(kv.getByPrefixWithKeys, "user:");

    // Separate profile records (user:{userId}:profile) from progress records (user:{userId}:progress:{moduleId})
    const profileEntries = allEntries.filter(({ key }) => key.endsWith(":profile"));
    const progressEntries = allEntries.filter(({ key }) => key.includes(":progress:"));

    const userProfiles = profileEntries
      .map(({ value }) => value)
      .filter((p: any) => p?.userId && p?.role);
    const totalLearners = userProfiles.length;

    // Build a map from userId -> list of progress records
    const progressByUser: Record<string, any[]> = {};
    progressEntries.forEach(({ key, value }: { key: string; value: any }) => {
      // Key format: user:{userId}:progress:{moduleId} — must have at least 4 segments
      const parts = key.split(":");
      if (parts.length < 4) return;
      const uid = parts[1];
      if (!uid) return;
      if (!progressByUser[uid]) progressByUser[uid] = [];
      progressByUser[uid].push(value);
    });

    const allProgress = progressEntries.map(({ value }) => value).filter((p: any) => p?.moduleId !== undefined && p?.status);

    const completedCount = allProgress.filter((p: any) => p.status === "completed").length;
    const activeLearners = Object.values(progressByUser).filter((progs) =>
      progs.some((p: any) => p.status === "in_progress")
    ).length;

    // Score distribution
    const scores = allProgress
      .filter((p: any) => p.postAssessmentScore !== null && p.postAssessmentScore !== undefined)
      .map((p: any) => p.postAssessmentScore);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

    const completionRate = totalLearners > 0 ? Math.round((completedCount / (totalLearners * 7)) * 100) : 0;

    // Module completion breakdown
    const moduleCompletion = [1, 2, 3, 4, 5, 6, 7].map((mod) => {
      const modProgress = allProgress.filter((p: any) => p.moduleId === mod);
      return {
        module: `Module ${mod}`,
        completed: modProgress.filter((p: any) => p.status === "completed").length,
        inProgress: modProgress.filter((p: any) => p.status === "in_progress").length,
        notStarted: Math.max(0, totalLearners - modProgress.length),
      };
    });

    // Score distribution buckets
    const scoreDistribution = [
      { range: "90-100%", count: scores.filter((s: number) => s >= 90).length },
      { range: "80-89%", count: scores.filter((s: number) => s >= 80 && s < 90).length },
      { range: "70-79%", count: scores.filter((s: number) => s >= 70 && s < 80).length },
      { range: "60-69%", count: scores.filter((s: number) => s >= 60 && s < 70).length },
      { range: "Below 60%", count: scores.filter((s: number) => s < 60).length },
    ];

    // Role breakdown with actual completion rates (keyed by userId from progressByUser map)
    const roleStats: Record<string, { learners: number; completedModules: number; totalModules: number }> = {};
    userProfiles.forEach((p: any) => {
      const role = p.role;
      if (!roleStats[role]) roleStats[role] = { learners: 0, completedModules: 0, totalModules: 0 };
      roleStats[role].learners += 1;
      const userProgress = progressByUser[p.userId] || [];
      roleStats[role].totalModules += userProgress.length;
      roleStats[role].completedModules += userProgress.filter((pr: any) => pr.status === "completed").length;
    });
    const roleBreakdown = Object.entries(roleStats).map(([role, data]) => ({
      name: role,
      learners: data.learners,
      completion: data.totalModules > 0 ? Math.round((data.completedModules / data.totalModules) * 100) : 0,
    }));

    return c.json({
      stats: {
        totalLearners,
        activeLearners,
        completionRate,
        avgScore,
        moduleCompletion,
        scoreDistribution,
        roleBreakdown,
      },
    });
  } catch (e) {
    console.error("Admin stats error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Admin: User Management ----------

app.get("/make-server-39a35780/admin/users", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: admin users list" }, 401);
  try {
    // CJIS 5.4: Enforce least-privilege — only admin/superadmin may manage users
    const requesterRole = await getUserRole(userId);
    if (!ADMIN_ROLES.includes(requesterRole)) {
      await auditLog("security:permission_denied", userId, "denied", "Attempted admin users list without permission", c);
      return c.json({ error: "Forbidden: insufficient privileges for user management" }, 403);
    }

    await auditLog("admin:user_view", userId, "success", "Admin user list requested", c);

    // Fetch and decrypt all user-prefixed records; separate profiles from progress by key structure
    const allData = await encryptedGetByPrefixWithKeys(kv.getByPrefixWithKeys, "user:");
    const profileEntries = allData.filter(({ key }) => key.endsWith(":profile"));
    const progressEntries = allData.filter(({ key }) => key.includes(":progress:"));

    const profiles = profileEntries
      .map(({ value }) => value as any)
      .filter((p: any) => p?.userId && p?.role);

    // Build userId → progress[] map using key structure (progress values have no userId field)
    const progressByUserId: Record<string, any[]> = {};
    progressEntries.forEach(({ key, value }) => {
      const uid = key.split(":")[1];
      if (uid) {
        if (!progressByUserId[uid]) progressByUserId[uid] = [];
        progressByUserId[uid].push(value);
      }
    });

    const users = profiles.map((p: any) => {
      const userProgress = progressByUserId[p.userId] || [];
      const completedModules = userProgress.filter((d: any) => d?.status === "completed").length;
      const inProgressModules = userProgress.filter((d: any) => d?.status === "in_progress").length;
      return {
        userId: p.userId,
        name: p.name || "Unknown",
        email: p.email || "",
        role: p.role || "learner",
        agency: p.agency || "",
        state: p.state || "",
        joinedAt: p.joinedAt || p.createdAt || null,
        updatedAt: p.updatedAt || null,
        completedModules,
        inProgressModules,
      };
    });

    return c.json({ users });
  } catch (e) {
    console.error("Admin users list error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-39a35780/admin/users/:targetUserId/role", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: role change" }, 401);
  const targetUserId = c.req.param("targetUserId");
  try {
    // CJIS 5.4: Enforce least-privilege — check basic admin access first, then tier rules
    const requesterRole = await getUserRole(userId);

    if (!ADMIN_ROLES.includes(requesterRole)) {
      await auditLog("security:permission_denied", userId, "denied", "Attempted role change without admin privileges", c);
      return c.json({ error: "Forbidden: insufficient privileges for role management" }, 403);
    }

    // Only superadmin can promote to admin/superadmin
    // admin can assign up to supervisor but not admin or superadmin
    const validRoles = [
      "law_enforcement", "cpi", "prosecutor", "judge", "medical",
      "school", "advocate", "forensic", "mandated_reporter",
      "supervisor", "admin", "superadmin",
    ];

    const { newRole } = await c.req.json();
    if (!newRole || !validRoles.includes(newRole)) {
      return c.json({ error: `Invalid role: ${newRole}` }, 400);
    }

    const elevatedRoles = ADMIN_ROLES;
    if (elevatedRoles.includes(newRole) && requesterRole !== "superadmin") {
      await auditLog("security:permission_denied", userId, "denied", `Attempted to assign ${newRole} without superadmin privileges`, c);
      return c.json({ error: "Only superadmin can assign admin/superadmin roles" }, 403);
    }

    // Prevent self-demotion from superadmin (safety)
    if (userId === targetUserId && requesterRole === "superadmin" && newRole !== "superadmin") {
      return c.json({ error: "Cannot demote your own superadmin role. Another superadmin must do this." }, 400);
    }

    // Update the target user's profile
    const targetProfile = await encryptedGet<any>(kv.get, `user:${targetUserId}:profile`);
    if (!targetProfile) {
      return c.json({ error: "Target user not found" }, 404);
    }

    const previousRole = targetProfile.role || "learner";
    const updatedProfile = {
      ...targetProfile,
      role: newRole,
      updatedAt: new Date().toISOString(),
      roleChangedBy: userId,
      roleChangedAt: new Date().toISOString(),
      previousRole,
    };

    await encryptedSet(kv.set, `user:${targetUserId}:profile`, updatedProfile);
    await auditLog(
      "security:role_change",
      userId,
      "success",
      `Changed user ${targetUserId} role from ${previousRole} to ${newRole}`,
      c
    );

    return c.json({ profile: updatedProfile });
  } catch (e) {
    console.error("Role change error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Admin: Audit Logs ----------

app.get("/make-server-39a35780/admin/audit", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized: audit log access" }, 401);
  try {
    // CJIS 5.4: Only superadmin can view audit logs
    const requesterRole = await getUserRole(userId);
    if (requesterRole !== "superadmin") {
      await auditLog("security:permission_denied", userId, "denied", "Attempted audit log access without superadmin", c);
      return c.json({ error: "Forbidden: only superadmin can access audit logs" }, 403);
    }

    await auditLog("admin:audit_view", userId, "success", "Audit log viewed", c);

    // Cursor-based pagination: ?limit=50&cursor=<base64-encoded-timestamp>
    const limitParam = Number(c.req.query("limit") ?? 50);
    const limit = Math.min(Math.max(1, limitParam), 200);
    const cursorParam = c.req.query("cursor");
    const cursorTs = cursorParam
      ? Number(atob(cursorParam))
      : Number.MAX_SAFE_INTEGER;

    // audit_idx entries are lightweight unencrypted records: { userId, eventType, outcome, timestamp }
    const allEntries = await kv.getByPrefix("audit_idx:");
    const sorted = (allEntries || [])
      .filter((e: any) => e?.timestamp)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply cursor filter (entries strictly before cursorTs)
    const afterCursor = sorted.filter(
      (e: any) => new Date(e.timestamp).getTime() < cursorTs
    );
    const page = afterCursor.slice(0, limit);
    const nextEntry = afterCursor[limit];
    const nextCursor = nextEntry
      ? btoa(String(new Date(nextEntry.timestamp).getTime()))
      : null;

    return c.json({ entries: page, nextCursor, total: sorted.length });
  } catch (e) {
    console.error("Audit log fetch error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ---------- Rooty Chatbot (Gemini LLM) ----------

const ROOTY_SYSTEM_PROMPT = `You are Rooty, a warm, knowledgeable, and professional AI assistant for the RootWork Framework™ Trauma-Informed Investigation Training Platform. You ONLY answer questions about this platform, its content, and closely related topics. If a user asks about something unrelated, politely redirect them.

VOICE & TONE:
- Warm but professional. You care deeply about child welfare.
- Concise: aim for 2-5 sentences unless the user asks for detail.
- Use specific section names, statute citations, and module numbers when relevant.
- Never invent statistics or legal details not listed below.

PLATFORM OVERVIEW:
- 9 professional roles: Law Enforcement, Child Protective Investigator (CPI), Prosecutor, Judge, Medical Professional, School Personnel, Victim Advocate, Forensic Interviewer, Mandated Reporter.
- 7 training modules (~28 hours total). Modules 1-6 are core investigator modules. Module 7 is a bonus Mandated Reporter Essentials module.
- Pedagogical framework: RootWork 5Rs (Root → Regulate → Reflect → Restore → Reconnect) — a sequential cycle that structures every module.
- Cognitive model: TRACE (Trigger → Response → Appraisal → Choice → Effect) — maps the professional's internal cognitive pathway during encounters.
- Features: role-based customized paths, scenario-based branching simulations, video vignettes, pre/post assessments with citations, CE credit certificates, admin analytics dashboard.
- 4 license tiers: Individual ($150-250/seat), Team/Department ($3,500-8,500), Judicial Circuit ($8,000-15,000), Statewide ($25,000-60,000).
- 4 design principles: Cognitive Load Awareness, Role-Differentiated Paths, Scaffolded Complexity, Reflective Practice.

IMPORTANT RULES:
- You are NOT a lawyer. Always recommend consulting local statutes and agency counsel for legal advice.
- Never minimize the seriousness of child abuse or reporting obligations.
- If someone describes a situation that sounds like it involves actual child abuse, remind them that if they are a mandated reporter, they should call 1-855-GACHILD (in Georgia) or their state's child abuse hotline immediately.
- You may discuss the platform's pedagogy, structure, pricing, and content in detail.
- You may explain the 5Rs, TRACE, mandated reporting law, and module content.
- Do NOT make up information about features that don't exist on the platform.`;

app.post("/make-server-39a35780/rooty/chat", async (c) => {
  const userId = await getUserId(c);
  if (!userId) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { messages } = await c.req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: "Missing or invalid messages array" }, 400);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.log("GEMINI_API_KEY not configured — falling back");
      return c.json({ error: "Gemini API key not configured" }, 500);
    }

    // Build Gemini API request
    const geminiMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const body = {
      system_instruction: {
        parts: [{ text: ROOTY_SYSTEM_PROMPT }],
      },
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 600,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    };

    // API key passed via header (not URL query param) to prevent key leakage in access logs
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Gemini API error:", resp.status, errText);
      return c.json({ error: "Upstream AI service error" }, 502);
    }

    const data = await resp.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I wasn't able to generate a response. Could you try rephrasing your question?";

    return c.json({ reply });
  } catch (e) {
    console.error("Rooty chat error:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});


Deno.serve(app.fetch);