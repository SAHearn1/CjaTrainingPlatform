# Architecture Map — CjaTrainingPlatform

> Fields populated from package.json (Phase A read). Full deep read deferred to Phase C completion.

## System Overview

RootWork Trauma-Informed Investigation Training Platform — a CJIS-compliant LMS for child abuse investigation professionals. React 18 + Vite SPA with Supabase backend.

## Layer Diagram

```
[Investigation Professional / Trainee]
              ↓
[React 18 SPA + Vite]     src/ directory
  ├─ UI: Radix UI + MUI + Tailwind CSS v4
  ├─ State: TODO — requires Phase C deep read
  └─ Routing: react-router v7
              ↓
[Supabase]                Database + Auth + Storage
  ├─ Auth: Supabase Auth
  ├─ Database: PostgreSQL via Supabase
  └─ RLS: Row-level security policies
              ↓
[Observability]
  ├─ Error tracking: Sentry
  └─ Product analytics: PostHog
```

## Key Boundaries

| Boundary | Technology | Notes |
|----------|-----------|-------|
| Auth enforcement | Supabase Auth | TODO — verify RLS configuration |
| Data persistence | Supabase PostgreSQL | TODO — verify schema |
| PDF generation | jspdf | Client-side PDF export |
| Drag and drop | react-dnd | TODO — verify use case |
| Charts | recharts | TODO — verify use case |

## CJIS Compliance Note

This platform handles sensitive professional training data. Architecture details should not be exposed in public-facing documentation. This doc is in a private repo.

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
