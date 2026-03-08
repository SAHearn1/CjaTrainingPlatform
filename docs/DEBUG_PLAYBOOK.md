# Debug Playbook — CjaTrainingPlatform

Quick reference for common failure patterns.

| Symptom | Check First | Common Root Cause |
|---------|-------------|-------------------|
| Supabase 403 | RLS policies | Row-level security blocking query |
| Auth token invalid | Supabase session | Token expired or refresh failed |
| Vite build fails | `pnpm typecheck` | TypeScript regression |
| Component crash | Props undefined | Missing null guard on Supabase response |
| Sentry not capturing | SENTRY_DSN env | Missing or wrong DSN in .env |
| PostHog not tracking | POSTHOG_KEY env | Missing or wrong key |
| PDF generation fails | jspdf version | Check jspdf API compatibility |

---

*See also: [RWFW Debug Playbook](https://github.com/SAHearn1/rwfw-agent-governance/blob/main/docs/DEBUG_PLAYBOOK.md)*
