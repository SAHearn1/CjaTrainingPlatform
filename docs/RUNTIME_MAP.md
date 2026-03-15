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

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
