# Incident Log — CjaTrainingPlatform

This file tracks incidents in this repository.

## Active Incidents

_None_

## Resolved Incidents

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
