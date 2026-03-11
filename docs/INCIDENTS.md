# Incident Log — CjaTrainingPlatform

This file tracks incidents in this repository.

## Active Incidents

_None_

## Resolved Incidents

### 2026-03-11 — Stale supabase/functions/server/ directory (latent mis-deploy risk)

**What happened:** A stale copy of the edge function at `supabase/functions/server/` was discovered alongside the current function at `supabase/functions/make-server-39a35780/`. The stale copy contained the exact `supabaseAdmin()` bug from the 2026-03-09 incident (missing `persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false`). Six documentation files (README, ARCHITECTURE_MAP, RUNTIME_MAP, INTEGRATION_POINTS, AGENT_DEBUG_RUNBOOK, postgres-migration) still referenced `server` as the deploy target — meaning `supabase functions deploy server` would have deployed the broken function.

**Root cause:** When the fixed `make-server-39a35780/` function was created during the 2026-03-09 incident response, the stale `server/` directory was not removed. Documentation was not updated to reflect the rename.

**Resolution:**
- Deleted `supabase/functions/server/` (3 files) via `git rm -r`
- Updated all 6 documentation files to reference `make-server-39a35780`
- Fixed a secondary doc error in RUNTIME_MAP.md that falsely stated no lint/test scripts exist

**Issue:** #88

## Resolved Incidents

### 2026-03-09 — JWT 401 on all authenticated endpoints + CSP blocking Vercel Live

**What happened:** All authenticated API calls (`/profile`, `/progress`, `/vignettes`) returned 401 immediately after sign-in. The edge function's `getUserId` was silently returning null on every call. Additionally, the browser console showed a CSP violation blocking `https://vercel.live/_next-live/feedback/feedback.js`.

**Root causes:**
1. `supabaseAdmin()` was missing server-side Supabase client options (`persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false`). In Deno, omitting these causes the client's auth subsystem to initialize incorrectly, which makes `auth.getUser(jwt)` fail silently.
2. `getUserId` swallowed the `getUser` error without logging it, making the failure invisible in production logs.
3. `admin.createUser` was missing `email_confirm: true`, leaving new users in an unconfirmed state.
4. `vercel.json` CSP had `script-src 'self'` which blocked `https://vercel.live`.

**Resolution:**
- Added `{ auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }` to `supabaseAdmin()` in the edge function.
- Added error logging to `getUserId` (`console.log` of `error.message` + `error.status`).
- Added `email_confirm: true` to `admin.createUser`.
- Added `https://vercel.live` to `script-src` in `vercel.json`.

**Pattern:** See `REPAIR_PATTERNS.md` → "Supabase Admin Client Server-Side Configuration".

---

### 2026-03-08 — Git rebase conflict on .gitignore

**What happened:** `git push` to `origin/main` was rejected because the remote had a commit (CLAUDE.md with security credential patterns in `.gitignore`) that wasn't in the local branch. After `git pull --rebase`, a merge conflict arose in `.gitignore` — the remote had added security credential exclusions (`*.pem`, `*.key`, `.env.production`, etc.) while local had added AI tool directories (`.claude/`, `.windsurf/`, etc.).

**Resolution:** Manually merged both sides into a single clean `.gitignore`, staged with `git add .gitignore`, ran `git rebase --continue`. Push succeeded.

**Pattern:** See `REPAIR_PATTERNS.md` — additive `.gitignore` conflicts should always merge both sides.

---

### 2026-03-08 — Stale AdminDashboard "sample data" warning

**What happened:** The Learners tab in `AdminDashboard.tsx` displayed a yellow banner reading "Sample data displayed — connect to live API" even though the table was already wired to `api.getAdminUsers()` returning live data.

**Resolution:** Removed the stale warning `div`. No functional change required.

**Root cause:** Component was scaffolded with placeholder UI before the API integration was complete. The placeholder was never removed.

---

### 2026-03-08 — cert:{certId} KV record missing display fields

**What happened:** `CertificateVerify.tsx` (public verification page) called `GET /certificates/:certId` expecting `learnerName` and `role` in the response. The server returned only `{ certId, userId, issuedAt }`.

**Resolution:** Updated `/certificates/generate` handler to read the user's encrypted profile at generation time and embed `learnerName` and `role` into the public `cert:{certId}` KV record.

**Pattern:** See `REPAIR_PATTERNS.md` → "Public Certificate Verification Enrichment".

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
