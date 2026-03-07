# KV → PostgreSQL Migration Guide
**Issue #26** — Migrate data storage from Deno KV store to Supabase PostgreSQL tables

## Overview

The platform currently uses Deno KV (a lightweight key-value store) in the edge function for all user data persistence. This migration replaces KV with Supabase PostgreSQL tables, enabling:

- Proper relational data modeling (foreign keys, constraints)
- SQL-based analytics queries
- Row-Level Security (RLS) enforced by Supabase
- Full-text search, aggregations, joins
- Compatibility with Supabase's built-in Auth + Data APIs
- CJIS-aligned audit trail with structured queries

## Migration Steps

### 1. Apply the database schema

```bash
supabase db push --project-ref rchiljcopergqtozylik
```

Or copy `supabase/migrations/20260306000001_initial_schema.sql` into the Supabase Dashboard SQL Editor and run it.

### 2. Update the edge function

The edge function (`supabase/functions/server/index.tsx`) currently uses a `kv` object. Replace KV operations with Supabase client queries:

**Before (KV):**
```ts
const profile = await encryptedGet(kv.get, `user:${userId}:profile`);
await encryptedSet(kv.set, `user:${userId}:profile`, updatedProfile);
```

**After (PostgreSQL):**
```ts
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

await supabase
  .from('user_profiles')
  .upsert({ user_id: userId, ...updatedProfile }, { onConflict: 'user_id' });
```

### 3. Key mapping

| KV Key Pattern | PostgreSQL Table | Primary Key |
|---|---|---|
| `user:{uid}:profile` | `user_profiles` | `user_id` |
| `user:{uid}:progress:{moduleId}` | `user_module_progress` | `(user_id, module_id)` |
| `user:{uid}:simulation:{scenarioId}` | `user_simulations` | `(user_id, scenario_id)` |
| `user:{uid}:certificate` | `certificates` | `user_id` |
| `cert:{certId}` | `certificates` | `cert_id` |
| `user:{uid}:license` | `licenses` | `user_id` |
| `license:{stripeSessionId}` | `licenses` | `stripe_session_id` |
| `user:{uid}:vignettes` | `watched_vignettes` | `user_id` |
| `audit:{uid}:{ts}` | `audit_logs` | `id` (uuid) |
| `user:{uid}:` (admin scan) | JOIN across tables | n/a |

### 4. Remove encryption wrapper

The `encryptedSet`/`encryptedGet` wrappers were added for AES-256 encryption at rest at the application layer because KV doesn't have native encryption. Supabase PostgreSQL on the Pro plan has **Transparent Data Encryption (TDE)** at the storage level.

After migration:
- Remove the `encryptedSet`, `encryptedGet`, `encryptedGetByPrefix` helper functions
- Remove the `ENCRYPTION_KEY` environment variable
- All data is protected by Supabase's built-in TDE + Row Level Security

### 5. Admin stats query

Replace the `getByPrefix("user:")` full-scan with a proper SQL aggregate:

```sql
SELECT
  COUNT(DISTINCT up.user_id) AS total_learners,
  COUNT(DISTINCT CASE WHEN ump.status = 'completed' THEN up.user_id END) AS completed_users,
  AVG(ump.post_assessment_score) FILTER (WHERE ump.post_assessment_score IS NOT NULL) AS avg_score,
  up.role,
  COUNT(DISTINCT up.user_id) AS role_count
FROM user_profiles up
LEFT JOIN user_module_progress ump ON up.user_id = ump.user_id
GROUP BY up.role;
```

### 6. Environment variables after migration

**Remove:**
- `ENCRYPTION_KEY` (no longer needed — Supabase TDE handles encryption at rest)

**Keep:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (edge function uses service role for RLS bypass on admin endpoints)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY` (Rooty chatbot)
- `ALLOWED_ORIGINS`

## Data Migration (Existing KV Data)

If there is production data in KV that needs to be migrated to PostgreSQL:

```ts
// One-time migration script — run once, then delete
import { createClient } from "@supabase/supabase-js";

const kv = await Deno.openKv();
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Iterate all user profiles
for await (const entry of kv.list({ prefix: ["user"] })) {
  const key = entry.key.join(":");
  if (key.match(/^user:[^:]+:profile$/)) {
    const userId = key.split(":")[1];
    const profile = entry.value;
    await supabase.from("user_profiles").upsert({
      user_id: userId,
      name: profile.name,
      role: profile.role,
      email: profile.email,
      selected_state: profile.selectedState,
    });
  }
  // ... similar for progress, certificates, licenses
}
```

## Testing

After migration, run:
```bash
npm test           # unit tests (security + data)
npm run build      # ensure no TS errors
```

For integration testing, verify:
- [ ] Sign up / sign in flow writes to `user_profiles`
- [ ] Module progress saves to `user_module_progress`
- [ ] Certificate generation writes to `certificates`
- [ ] Admin dashboard loads data from SQL aggregates
- [ ] Audit log entries write to `audit_logs`
- [ ] Stripe webhook updates `licenses`
