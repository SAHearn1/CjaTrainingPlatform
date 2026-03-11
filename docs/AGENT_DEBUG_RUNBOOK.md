# Agent Debug Runbook — CjaTrainingPlatform

## Stack-Specific Debugging

### Supabase / KV Store Issues

- **Client keys** are NOT in `.env`. They live in `utils/supabase/info.tsx` (`projectId`, `publicAnonKey`).
- **Server keys** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are Supabase edge function secrets — set via `supabase secrets set`.
- All data reads/writes go through `kv_store.tsx` (`kvGet` / `kvSet`). Sensitive fields are wrapped with `encryptedGet` / `encryptedSet` from `encryption.tsx`.
- There are **no Supabase RLS policies** — data security is enforced purely by the Edge Function checking JWTs and RBAC roles.
- If a KV read returns `null`, check that the key prefix matches the write path exactly (e.g., `user:{id}:profile`).

### Auth / JWT Issues

- Auth is Supabase email/password. Auto-confirm is ON — no email verification step.
- JWT is verified in the Edge Function using `supabase.auth.getUser(token)` from the Admin SDK.
- If you get 401s, check that `AuthContext` is passing `accessToken` in the `Authorization: Bearer` header.
- Token refresh happens automatically via Supabase `onAuthStateChange`. If tokens appear expired, check `AuthContext.tsx` refresh logic.
- Password reset: `supabase.auth.resetPasswordForEmail()` sends a link; client-side `ResetPassword.tsx` listens for `PASSWORD_RECOVERY` event. If event doesn't fire within 12s, shows "link expired" state.

### Vite Build Issues

- Run `npm run build` — no separate typecheck script; TypeScript errors surface as build errors.
- No ESLint or Prettier configured. Code style is enforced by convention only.
- Clear `.vite` cache (`rm -rf node_modules/.vite`) if build behaves unexpectedly after config changes.
- Figma asset imports (`figma:asset/*.png`) are resolved by `figmaAssetPlugin` in `vite.config.ts` to a 1×1 transparent PNG.

### Edge Function Issues

- Deploy with: `supabase functions deploy make-server-39a35780`
- Edge function logs: Supabase dashboard → Edge Functions → Logs
- The function uses Hono.js router. All routes prefixed `/make-server-39a35780/`.
- CORS is enabled for all origins in the Hono CORS middleware.
- Encryption failures (wrong key length, corrupt ciphertext) throw and return 500. Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly.

### Stripe Issues

- All Stripe calls are server-side (Edge Function). No Stripe SDK on the client.
- Webhook signature verification requires `STRIPE_SECRET_KEY` and the raw request body.
- For local webhook testing, use Stripe CLI: `stripe listen --forward-to localhost:54321/functions/v1/make-server-39a35780/licensing/webhook`

### Gemini / Rooty Issues

- If Rooty returns 500, check `GEMINI_API_KEY` is set in edge function secrets.
- Model: `gemini-2.0-flash`. System prompt is embedded in the server handler.
- No streaming — full response returned in one JSON payload.

### Local Dev

```bash
npm install          # Install dependencies (no lock file committed)
npm run dev          # Vite dev server at localhost:5173
npm run build        # Production build (TypeScript compiled by Vite)
npm run preview      # Preview production build
```

No test runner or linter configured. No `npm test` or `npm run lint` scripts.

## Escalation

- Supabase: Check [status.supabase.com](https://status.supabase.com) for platform incidents
- Stripe: Check [status.stripe.com](https://status.stripe.com)
- Gemini: Check [Google Cloud Status](https://cloud.google.com/support/docs/dashboard)

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
