# AES-256-GCM Key Rotation Plan — GAP-18 / Issue #125

> CJIS 5.10.1.2 requires that encryption keys be rotated on a defined schedule.
> This document describes the current encryption architecture and the rotation
> procedure to be implemented before general availability.

---

## Current Architecture

All sensitive KV values are encrypted by `supabase/functions/make-server-39a35780/encryption.tsx`.

### Key derivation

```
PBKDF2(SUPABASE_SERVICE_ROLE_KEY, salt, 100_000 iterations, SHA-256) → 32-byte AES-256 key
```

- **Source secret**: `SUPABASE_SERVICE_ROLE_KEY` (Supabase project secret, set as Deno env var)
- **Algorithm**: PBKDF2 with 100,000 iterations, SHA-256, 32-byte output
- **Per-record salt**: 16 random bytes prepended to each ciphertext (uniqueness per write)
- **Cipher**: AES-256-GCM — provides authenticated encryption (integrity + confidentiality)
- **IV**: 12 random bytes, prepended to ciphertext after salt

### What is encrypted

| KV key pattern | Content |
|---|---|
| `user:{id}:profile` | Name, email, role, agency, state |
| `user:{id}:progress:{moduleId}` | Completion status, scores |
| `user:{id}:simulation:{moduleId}:{ts}` | Simulation responses |
| `user:{id}:license` | License status, expiry |
| `audit:{id}:{ts}` | Audit log entries (HMAC-signed) |

### What is NOT encrypted (plaintext KV)

| KV key pattern | Reason |
|---|---|
| `ratelimit:*` | Transient; no PII |
| `platform:settings` | Non-sensitive config |
| `cert:*` | Public certificate records |
| `audit_idx:*` | Index only (userId + eventType, no PII fields) |
| `video:*` | Public registry |

---

## Current Gap

The encryption key is derived directly from `SUPABASE_SERVICE_ROLE_KEY`. This creates two problems:

1. **No versioned key identifier** — ciphertext records do not store which key version was used, so re-encryption after rotation is not possible without decrypting all records with the old key.
2. **Rotation requires service restart** — because the key is derived at call time from the current env var, rotating the service role key requires decrypting all records before the old key is invalidated.

---

## Rotation Procedure (Target Design)

### Phase 1: Add key versioning (pre-GA)

1. Prepend a 1-byte **key version** identifier to every ciphertext (before the salt).
2. Maintain a `KEY_VERSIONS` map in the edge function: `{ [version]: derivedKey }`.
3. Decryption reads the version byte and selects the correct key.
4. New writes always use the latest version.

### Phase 2: Introduce a dedicated encryption secret (pre-GA)

Replace the PBKDF2 derivation from `SUPABASE_SERVICE_ROLE_KEY` with a dedicated secret:

```
VITE_ENCRYPTION_SECRET=<random 32-byte hex>   # set in Vercel + Supabase secrets
```

This decouples the encryption key from the service role key (principle of least privilege).

### Phase 3: Key rotation runbook

When a key rotation event is required (scheduled or incident-driven):

1. **Add new key version** in `KEY_VERSIONS` map (do NOT remove the old version yet).
2. **Deploy** the updated edge function — new writes use the new version, old reads still work.
3. **Re-encrypt all records**:
   - Run the migration script: `scripts/reencrypt_kv.ts` (to be written).
   - Script iterates all `user:*` keys, decrypts with old key version, re-encrypts with new version.
   - Script is idempotent (checks version byte before processing).
4. **Remove old key version** from `KEY_VERSIONS` after all records are migrated.
5. **Audit log** the rotation event: `security:key_rotation`.

### Rotation schedule (CJIS 5.10.1.2 recommendation)

| Trigger | Action |
|---|---|
| Annual (scheduled) | Full rotation per Phase 3 |
| Key compromise suspected | Immediate rotation per Phase 3 |
| Service role key rotation (Supabase) | Phase 3 if using derived key |
| Personnel change (admin offboarding) | Evaluate need for rotation |

---

## Implementation Status

| Item | Status |
|---|---|
| Per-record salt + IV (unique ciphertext per write) | ✅ Done |
| AES-256-GCM authenticated encryption | ✅ Done |
| 100k PBKDF2 iterations | ✅ Done |
| Key version byte in ciphertext | ⬜ Not started (pre-GA) |
| Dedicated encryption secret | ⬜ Not started (pre-GA) |
| Re-encryption migration script | ⬜ Not started (pre-GA) |
| Rotation runbook automation | ⬜ Not started |

---

## References

- CJIS Security Policy v5.9.5, Section 5.10.1.2 — Encryption at Rest
- NIST SP 800-57 Part 1 — Key Management Recommendations
- `supabase/functions/make-server-39a35780/encryption.tsx` — current implementation
