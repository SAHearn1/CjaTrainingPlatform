# AGENTS.md — CjaTrainingPlatform
**RootWork Trauma-Informed Investigation Training Platform**
**Governance Hub:** [SAHearn1/rwfw-agent-governance](https://github.com/SAHearn1/rwfw-agent-governance)

---

## Repo Context

This is a CJIS-compliant LMS for child abuse investigation professionals. It handles sensitive professional training data. All agent operations must respect this compliance context.

## Operating Rules

All agents working in this repo must follow the [RWFW AGENTS.md standard](https://github.com/SAHearn1/rwfw-agent-governance/blob/main/AGENTS.md).

Key rules for this repo:
1. **Read before acting.** Never modify source code you have not read.
2. **Identify the first failing boundary** before proposing any fix.
3. **Smallest viable fix only.** Do not refactor, add features, or touch adjacent code.
4. **Verify before complete.** Run `pnpm lint`, `pnpm typecheck`, `pnpm test` before marking done.
5. **CJIS sensitivity.** Do not expose architecture details in public-facing docs.
6. **Governance-only scope.** Write only to `/docs/`, `/.github/`, `/AGENTS.md`, `/repo.intelligence.yml`, root markdown.

## Stack Quick Reference

- Framework: React 18 + Vite + TypeScript
- UI: Tailwind CSS v4 + Radix UI + MUI
- Database: Supabase
- Monitoring: Sentry + PostHog
- Testing: Vitest + Testing Library
- Package manager: pnpm

## Common Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
pnpm test         # Vitest run
pnpm test:watch   # Vitest watch
```

---

*Governed by: [SAHearn1/rwfw-agent-governance](https://github.com/SAHearn1/rwfw-agent-governance)*
