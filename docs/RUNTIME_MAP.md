# Runtime Map — CjaTrainingPlatform

## Entrypoints

| Entrypoint | Type | Description |
|-----------|------|-------------|
| `src/main.tsx` | Vite app | React root — calls initMonitoring(), renders App |
| `supabase/functions/make-server-39a35780/index.ts` | Deno Edge Function | Hono.js REST API (all backend endpoints) |

## Environment Variables

### Client-side (committed — safe, protected by Supabase RLS)
These are NOT in `.env`. They live in `utils/supabase/info.tsx`:
```ts
export const projectId = "<supabase-project-id>"
export const publicAnonKey = "<supabase-anon-key>"
```

### Client-side (`.env` / Vercel env vars)
| Variable | Required | Purpose |
|----------|---------|----------|
| `VITE_SENTRY_DSN` | Optional | Sentry error tracking DSN |
| `VITE_POSTHOG_KEY` | Optional | PostHog analytics API key |

### Server-side (Supabase Edge Function secrets — never in repo)
| Variable | Required | Purpose |
|----------|---------|----------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Admin API key + AES-256-GCM master key |
| `STRIPE_SECRET_KEY` | Yes | Stripe payment processing |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signature verification |
| `GEMINI_API_KEY` | Yes | Google Gemini 2.0 Flash (Rooty chatbot) |

## Local Dev Commands

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

Note: The following scripts are configured in package.json: `lint`, `lint:strict`, `typecheck`, `test`, `test:watch`, `test:coverage`.

## Deployment

- **Frontend**: Vercel (auto-deploy from main branch)
- **Backend**: Supabase Edge Functions (deploy via `supabase functions deploy make-server-39a35780 --no-verify-jwt`)
- **Database**: Supabase PostgreSQL (managed, no migrations needed for KV pattern)

Note: gateway JWT verification must remain disabled for this function deployment. The function decodes the user JWT payload locally and loads RBAC state from the KV-backed profile.

## Key API Routes (server)

All routes prefixed `/make-server-39a35780/`:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /signup | Public | Create user + initial profile |
| GET | /profile | JWT | Fetch profile |
| PUT | /profile | JWT | Update profile |
| GET | /progress | JWT | All module progress |
| PUT | /progress/:moduleId | JWT | Update module progress |
| GET | /vignettes | JWT | Watched vignette list |
| PUT | /vignettes | JWT | Update watched list |
| POST | /simulations | JWT | Save simulation result |
| POST | /certificates/generate | JWT | Generate/retrieve cert |
| GET | /certificates/:certId | Public | Public cert verification |
| GET | /licensing/plans | Public | License plan catalog |
| POST | /licensing/checkout | JWT | Create Stripe session |
| POST | /licensing/webhook | Stripe sig | Handle Stripe events |
| GET | /videos | Public | Video registry |
| PUT | /admin/videos/:id | Admin JWT | Update video entry |
| POST | /admin/videos/bulk | Admin JWT | Bulk video update |
| GET | /admin/stats | Admin JWT | Platform analytics |
| GET | /admin/users | Admin JWT | User list |
| PUT | /admin/users/:id/role | Admin JWT | Change user role |
| GET | /admin/audit | Superadmin JWT | Audit log |
| GET | /platform/settings | Public | Platform feature flags (licensingEnabled) |
| PUT | /platform/settings | Superadmin JWT | Update platform feature flags |
| POST | /rooty/chat | Any JWT | Gemini chatbot |

---

## Issue Backlog Execution Guide

All open issues are in `SAHearn1/CjaTrainingPlatform`. Issues are organized into 3 sprints. Execute in order within each sprint — later issues in a sprint may depend on earlier ones.

### Sprint 1 — Critical Security Fixes (issues #104–#119)

Execute before any production user onboarding. All are independent unless noted.

| Issue | Title | Notes |
|-------|-------|-------|
| #104 | GAP-01: Fix cert KV record missing learnerName/role | Edge function + test |
| #105 | GAP-02: Encrypt license data in KV | `encryptedSet` in 2 handlers |
| #106 | GAP-03: Restrict CORS to allowed origins | Edge function config |
| #107 | GAP-04: Audit log integrity hash (HMAC-SHA256) | Can share PR with #119 |
| #108 | GAP-05: Rotate anon key out of committed file | Env var refactor |
| #109 | GAP-06: Authenticate /rooty/chat endpoint | One-line `getUserId(c)` add |
| #110 | GAP-07: Fix /admin/audit to read full encrypted records | Edge function |
| #111 | GAP-08: Compute + store AuditLogEntry.integrity field | Depends on #107 |
| #112 | GAP-09: Fix CSP connect-src for PostHog + Sentry | `vercel.json` only |
| #113 | GAP-10: Fix KV client factory — reuse client per request | `kv_store.tsx` |
| #114 | GAP-11: Enable source maps for Sentry | `vite.config.ts` |
| #115 | GAP-12: Sanitize /signup error response | Edge function |
| #116 | GAP-13: Use encryptedGet in requireLicense() | Edge function |
| #117 | Resolve pnpm.overrides / npm mismatch | `package.json` |
| #118 | GAP-15: Hide Licensing nav item from non-superadmin | `Layout.tsx` + `security.ts` + test update |
| #119 | GAP-16: crypto.randomUUID() in audit IDs | Can share PR with #107 |

**Deployment note:** Any edge function change requires redeployment:
```bash
supabase functions deploy make-server-39a35780 --project-ref rchiljcopergqtozylik --no-verify-jwt
```

### Sprint 2 — Quality Gates (issues #120–#124, #131–#134, #136)

Execute after Sprint 1. Lint batches must be merged in order (1 → 2 → 3).

| Issue | Title | Notes |
|-------|-------|-------|
| #120 | Lint Batch 1: jsx-a11y | Merge before #121 |
| #121 | Lint Batch 2: react-hooks | Merge before #122 |
| #122 | Lint Batch 3: general correctness + CI gate | Removes `continue-on-error`; merge last |
| #123 | RBAC integration tests for edge function | Independent |
| #124 | Component tests for LicenseGate/RequireSuperAdmin | Independent |
| #131 | Signup role selection step | Pre-launch blocker |
| #132 | Post-login onboarding modal | After #131 (needs profile.role) |
| #133 | Module access indicator on modules list | After #131 |
| #134 | Save-draft before session timeout | Independent |
| #136 | In-app password change flow (CJIS 5.6.2.1) | Independent |

### Sprint 3 — Architecture Hardening (issues #125–#130, #135)

Execute after Sprint 2 gate passes. Some are documentation-only (no code change required).

| Issue | Title | Notes |
|-------|-------|-------|
| #125 | Encryption key rotation plan (GAP-18) | Documentation/design — no code yet |
| #126 | Document MODULE_ACCESS server-side decision | Documentation only |
| #127 | Supervisor tier API endpoints | New feature — needs design decision on team scoping |
| #128 | Rate limiter extension + fail-open doc | Edge function |
| #129 | Replace figma:asset/ imports | Requires real brand assets |
| #130 | Privacy Policy, ToS, Security, Accessibility pages | Legal review required before deploy |
| #135 | Server-side PDF certificates (v1.1) | Deferred milestone |

### PR Rules

- All PRs must: pass `npm run lint` (after Sprint 2 Batch 3), pass `npm run typecheck`, pass `npm run test`
- Edge function changes require redeployment (see command above)
- CJIS-touching changes (auth, encryption, audit, RBAC) must be noted in commit message and `docs/INCIDENTS.md`

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
