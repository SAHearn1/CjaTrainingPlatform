# Agent Debug Runbook — CjaTrainingPlatform

This runbook extends the [RWFW ecosystem runbook](https://github.com/SAHearn1/rwfw-agent-governance/blob/main/docs/AGENT_DEBUG_RUNBOOK.md).

## Stack-Specific Debugging

### Supabase Issues
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Verify RLS policies are not blocking the expected query
- Check Supabase dashboard for active connections and query logs

### Vite Build Issues
- Run `pnpm typecheck` first — TypeScript errors surface as build errors
- Check `vite.config.ts` for plugin incompatibilities
- Clear `.vite` cache if build behaves unexpectedly

### Authentication Issues
- Supabase Auth — check token expiry and refresh logic
- Verify RLS policies match expected role claims

### Test Failures
- Run `pnpm test` for full suite
- Run `pnpm test:coverage` for coverage report
- Vitest uses jsdom — verify DOM-dependent tests have proper setup

## Escalation

See [RWFW ecosystem runbook](https://github.com/SAHearn1/rwfw-agent-governance/blob/main/docs/AGENT_DEBUG_RUNBOOK.md) for escalation criteria.

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
