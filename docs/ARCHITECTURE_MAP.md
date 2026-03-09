# Architecture Map — CjaTrainingPlatform

## System Overview

RootWork Trauma-Informed Investigation Training Platform — a CJIS-compliant LMS for 9 child abuse investigation professional roles. React 18 SPA with Supabase Edge Function backend. No SSR.

## Layer Diagram

```
[Investigation Professional / Trainee]
              ↓
[React 18 SPA + Vite 6]          src/
  ├─ UI: Radix UI + shadcn/ui + Tailwind CSS v4
  ├─ State: React Context API (AuthContext)
  ├─ Routing: React Router v7 (lazy-loaded routes)
  ├─ Charts: Recharts
  ├─ Animation: Motion (Framer Motion)
  └─ PDF export: jspdf (client-side, print-to-PDF)
              ↓
[Supabase Edge Functions (Deno + Hono.js)]
  └─ supabase/functions/server/index.tsx
     ├─ Auth: Supabase Admin SDK (JWT verification)
     ├─ Data: KV store pattern (single table kv_store_39a35780)
     ├─ Encryption: AES-256-GCM (encryption.tsx)
     └─ Audit: CJIS 5.4.1.1 event logging
              ↓
[Supabase PostgreSQL]
  └─ Single KV table (key/value) — NOT relational schema
     Key prefixes:
       user:{id}:profile         — encrypted UserProfile
       user:{id}:progress:{mod}  — encrypted ModuleProgress
       user:{id}:vignettes       — VignetteWatchList
       user:{id}:simulation:*    — SimulationResult
       user:{id}:certificate     — Certificate (by user)
       cert:{certId}             — Certificate (public lookup)
       audit:{id}:{ts}           — encrypted AuditEntry
       audit_idx:{ts}            — lightweight AuditLog index
       license:{sessionId}       — encrypted License
       platform:video_registry   — VideoRegistry (unencrypted)
              ↓
[External Services]
  ├─ Stripe: Checkout sessions + webhook
  ├─ Google Gemini 2.0 Flash: Rooty chatbot (/rooty/chat)
  ├─ Sentry: Frontend error tracking (VITE_SENTRY_DSN)
  └─ PostHog: Product analytics (VITE_POSTHOG_KEY)
```

## Key Boundaries

| Boundary | Technology | Notes |
|----------|-----------|-------|
| Auth enforcement | Supabase Auth JWT | Verified server-side on every request |
| Data persistence | Supabase KV (single table) | All data encrypted at rest with AES-256-GCM |
| RBAC | Custom roles in KV profile | learner < supervisor < admin < superadmin |
| PDF generation | jspdf + window.print() | Client-side only; server-side PDF deferred to v1.1 |
| Certificate verification | Public GET /certificates/:certId | No auth required |
| Video registry | KV key platform:video_registry | Runtime-configurable, no redeploy needed |

## State Management

All auth/user state in `AuthContext` (`src/app/components/AuthContext.tsx`):
- `user` — Supabase User object
- `profile` — UserProfile (name, email, role, selectedState)
- `accessToken` — JWT for API calls
- `progress` — ModuleProgress[] array
- `watchedVignettes` — string[] of vignette keys

No Redux, Zustand, or other state libraries. No Supabase Realtime subscriptions.

## CJIS Compliance

CJIS Security Policy v5.9.5 controls implemented:
- 5.6.2.1: Password complexity (validatePassword in security.ts)
- 5.10.1.2: AES-256-GCM encryption at rest
- 5.4.1.1: Immutable audit logging with IP + user agent
- 5.5: RBAC with four privilege tiers
- 5.10.4: Security headers (HSTS, X-Frame-Options, CSP, etc.)

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
