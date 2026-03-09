# Integration Points — CjaTrainingPlatform

## External Services

| Service | Purpose | Auth Method | Config Location | Failure Impact |
|---------|---------|------------|-----------------|----------------|
| Supabase | PostgreSQL KV store + Auth | Anon key (client) / Service role key (server) | `utils/supabase/info.tsx` (client); edge function secret (server) | Full app failure — no data reads/writes, no auth |
| Stripe | Checkout sessions + subscription licensing | Secret key (server-side only) | Edge function secret `STRIPE_SECRET_KEY` | Licensing/payment flow fails; training still accessible |
| Google Gemini 2.0 Flash | Rooty AI chatbot | API key | Edge function secret `GEMINI_API_KEY` | Rooty chat endpoint returns 500; rest of app unaffected |
| Sentry | Frontend error tracking | DSN | `VITE_SENTRY_DSN` env var (Vercel) | Silent — JS errors not captured; app still functions |
| PostHog | Product analytics | API key | `VITE_POSTHOG_KEY` env var (Vercel) | Silent — user events not tracked; app still functions |

## Webhooks

| Provider | Endpoint | Events Handled | Verification |
|---------|---------|----------------|-------------|
| Stripe | `POST /make-server-39a35780/licensing/webhook` | `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` | Stripe-Signature header verified with `STRIPE_SECRET_KEY` |

## Supabase Configuration

- **Client SDK**: initialized in `utils/supabase/info.tsx` with `projectId` + `publicAnonKey`
- **Auth**: email/password only; email auto-confirm enabled (no email verification gate)
- **RLS**: disabled — all data protection enforced in the Edge Function via JWT validation + RBAC
- **Database**: single KV table `kv_store_39a35780`; no relational schema
- **Edge Function**: deployed as `server` (`supabase/functions/server/index.tsx`)

## Stripe Flow

1. Client calls `POST /licensing/checkout` with JWT → server creates Stripe Checkout Session → returns `sessionUrl`
2. Client redirects to `sessionUrl` (Stripe-hosted page)
3. On payment success, Stripe POSTs to the webhook endpoint
4. Server verifies signature, writes encrypted `license:{sessionId}` record to KV, logs audit event
5. Client lands on `/licensing/success` → polls or confirms via `POST /licensing/confirm`

## Gemini (Rooty Chatbot) Flow

1. Client calls `POST /rooty/chat` with JWT + `{ message, conversationHistory }`
2. Server validates JWT (any authenticated user), calls Gemini 2.0 Flash with system prompt + history
3. Response streamed back as JSON `{ reply: string }`

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
