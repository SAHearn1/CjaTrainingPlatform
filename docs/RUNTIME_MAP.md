# Runtime Map — CjaTrainingPlatform

> Populated from package.json Phase A read. Verify against source before relying on.

## Entrypoints

| Entrypoint | Type | Description |
|-----------|------|-------------|
| `src/` | Vite app | Main React application |

## Environment Variables

| Variable | Required | Purpose |
|----------|---------|----------|
| VITE_SUPABASE_URL | Yes | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Yes | Supabase anon key |
| VITE_SENTRY_DSN | TODO | Sentry error tracking |
| VITE_POSTHOG_KEY | TODO | PostHog analytics |

> Full env var list: TODO — requires reading .env.example in Phase C

## Local Dev Commands

```bash
pnpm dev           # Start Vite dev server
pnpm build         # Production build
pnpm preview       # Preview production build
pnpm typecheck     # TypeScript check (tsc --noEmit)
pnpm lint          # ESLint
pnpm test          # Vitest run
pnpm test:watch    # Vitest watch mode
pnpm test:coverage # Vitest coverage
```

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
