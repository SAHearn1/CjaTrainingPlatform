# CLAUDE.md — CjaTrainingPlatform

> Agent briefing document. Read this before touching any code.
> Governance hub: `SAHearn1/rwfw-agent-governance`

## Repo Identity

- **Purpose:** Criminal Justice AI Training Platform — CJIS-compliant learning environment
- **Tier:** 1 (production-critical)
- **Criticality:** HIGH — handles sensitive criminal justice data

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL + Row-Level Security (RLS) |
| Monitoring | Sentry |
| Deployment | Vercel |

## Before You Write Any Code

1. Read `repo.intelligence.yml` — authoritative stack profile
2. Read `docs/ARCHITECTURE_MAP.md` — component/service map
3. Read `docs/RUNTIME_MAP.md` — env vars, ports, scripts
4. Check `docs/INCIDENTS.md` — known active issues

## Critical Rules for This Repo

- **CJIS compliance is non-negotiable.** Do not add data logging, analytics, or external calls without explicit human approval.
- **RLS is the security boundary.** Every Supabase table has row-level security. Never bypass it. Never set `.from().select()` without understanding which policy applies.
- **Sentry is active.** All unhandled errors are captured. Do not swallow errors silently.
- **Auth state must be verified before any data access.** Check `supabase.auth.getSession()` before reads/writes.
- **No `git add .`** — stage specific files only.

## Dev Workflow

```bash
npm install
npm run dev          # Vite dev server — http://localhost:5173
npm run lint
npm run type-check
npm run build
```

## Required Env Vars

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SENTRY_DSN
```

## Debugging

See `docs/AGENT_DEBUG_RUNBOOK.md` for the 6-phase debug protocol.  
See `docs/DEBUG_PLAYBOOK.md` for Supabase/Sentry failure tables.

## Governance

All agents operating here must follow `AGENTS.md` (8 rules).  
Incidents logged to `docs/INCIDENTS.md`. Fix recipes in `docs/REPAIR_PATTERNS.md`.
