# Integration Points — CjaTrainingPlatform

> Populated from package.json Phase A read.

## External Services

| Service | Purpose | Auth Method | Failure Impact |
|---------|---------|------------|----------------|
| Supabase | Database + Auth + Storage | Anon key + RLS | Full app failure |
| Sentry | Error tracking | DSN | Silent — errors not captured |
| PostHog | Product analytics | API key | Silent — events not tracked |

## Webhooks

| Provider | Endpoint | Events |
|---------|---------|--------|
| TODO | TODO | TODO |

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
