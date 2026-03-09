# Debug Playbook — CjaTrainingPlatform

Quick reference for common failure patterns.

| Symptom | Check First | Common Root Cause |
|---------|-------------|-------------------|
| API call returns 401 | `AuthContext` → `accessToken` | JWT expired or not passed in Authorization header |
| API call returns 403 | User role in KV profile | RBAC check failed — role insufficient for endpoint |
| API call returns 500 | Edge Function logs (Supabase dashboard) | Encryption error, missing secret, or unhandled exception |
| Supabase client error | `utils/supabase/info.tsx` | Wrong `projectId` or `publicAnonKey` |
| KV read returns null | Key prefix typo | Write used different prefix than read; check exact key pattern |
| Auth token invalid | `supabase.auth.getSession()` | Token expired; refresh may have failed in AuthContext |
| Vite build fails | TypeScript errors | Run `npm run build` and read tsc error output |
| Component crash on load | Undefined data | Missing null guard on KV response (data may not exist yet for new user) |
| Sentry not capturing | `VITE_SENTRY_DSN` env var | Missing or wrong DSN in Vercel env vars |
| PostHog not tracking | `VITE_POSTHOG_KEY` env var | Missing or wrong key in Vercel env vars |
| Rooty returns 500 | `GEMINI_API_KEY` edge function secret | Key missing or quota exceeded |
| Stripe checkout fails | `STRIPE_SECRET_KEY` edge function secret | Key missing, wrong mode (test vs live), or Stripe error |
| Stripe webhook ignored | Webhook signature | `STRIPE_SECRET_KEY` mismatch or wrong webhook endpoint URL |
| Reset password link expires immediately | No PASSWORD_RECOVERY event | Token already used; Supabase link is single-use |
| PDF generation fails | `window.print()` or jspdf | Certificate not yet generated; certId missing from KV |
| Video vignette not playing | `platform:video_registry` KV key | Registry not seeded; run admin bulk seed or check AdminVideos |

## Environment Variable Reference

| Variable | Location | Used By |
|----------|----------|---------|
| `projectId` | `utils/supabase/info.tsx` | Supabase client (committed, safe) |
| `publicAnonKey` | `utils/supabase/info.tsx` | Supabase client (committed, safe) |
| `VITE_SENTRY_DSN` | Vercel env vars | Frontend Sentry init |
| `VITE_POSTHOG_KEY` | Vercel env vars | Frontend PostHog init |
| `SUPABASE_URL` | Supabase edge function secret | Edge function → Supabase admin client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase edge function secret | Edge function admin SDK + AES-256-GCM master key |
| `STRIPE_SECRET_KEY` | Supabase edge function secret | Stripe checkout + webhook verification |
| `GEMINI_API_KEY` | Supabase edge function secret | Rooty chatbot (Gemini 2.0 Flash) |

---

*See also: [RWFW Agent Debug Runbook](./AGENT_DEBUG_RUNBOOK.md)*
