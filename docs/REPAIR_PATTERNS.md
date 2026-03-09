# Repair Patterns — CjaTrainingPlatform

Reusable fix patterns discovered during development. Promoted patterns are also added to [SAHearn1/rwfw-agent-governance/memory/fix-patterns.yml](https://github.com/SAHearn1/rwfw-agent-governance/blob/main/memory/fix-patterns.yml).

## Active Patterns

### KV Encrypted Read/Write Wrapper

**When:** Adding a new data type that needs CJIS encryption at rest.

**Pattern:**
```ts
// Write (server — encryption.tsx)
await encryptedSet(kv.set, `user:${userId}:mydata`, payload);

// Read
const data = await encryptedGet<MyType>(kv.get, `user:${userId}:mydata`);
if (!data) { /* handle not-yet-created */ }
```

**Rules:**
- All PII goes through `encryptedSet`/`encryptedGet`
- Non-PII (e.g., `platform:video_registry`) can use raw `kv.set`/`kv.get`
- Key prefixes must match exactly between write and read paths
- New KV keys should be documented in `ARCHITECTURE_MAP.md`

---

### Seeded Deterministic Shuffle

**When:** Need randomized order that is consistent per user (e.g., assessment questions).

**Pattern (Assessment.tsx):**
```ts
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rng = seededRng(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Seed derived from user identity + content identity
const seed = (userId chars XOR hash) XOR (moduleId * 31) XOR (typeMultiplier);
const shuffled = useMemo(() => shuffleWithSeed(items, seed >>> 0), [items, userId, moduleId, type]);
```

**Rule:** After shuffling, all index-based references (scoring, review display) must use `shuffled[i]`, not `original[i]`.

---

### Time-on-Page Tracking with Visibility API

**When:** Need to track active reading time on a page, pausing when tab is hidden.

**Pattern (ModuleDetail.tsx):**
```ts
const sessionStartRef = useRef<number>(Date.now());

const flushTimeSpent = useCallback(() => {
  const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
  sessionStartRef.current = Date.now();
  if (elapsed > 0) {
    // persist elapsed seconds
  }
}, [deps]);

useEffect(() => {
  sessionStartRef.current = Date.now();
  const interval = setInterval(flushTimeSpent, 60_000); // flush every minute
  const handleVisibility = () => {
    if (document.hidden) { flushTimeSpent(); }
    else { sessionStartRef.current = Date.now(); } // reset on return
  };
  document.addEventListener("visibilitychange", handleVisibility);
  return () => {
    clearInterval(interval);
    document.removeEventListener("visibilitychange", handleVisibility);
    flushTimeSpent(); // flush on unmount
  };
}, [contentId]); // re-run when content changes
```

---

### Auth Event Timeout Guard (Reset Password)

**When:** Waiting for a Supabase auth event (e.g., PASSWORD_RECOVERY) that may never arrive if the link is invalid.

**Pattern (ResetPassword.tsx):**
```ts
const TOKEN_TIMEOUT_MS = 12000;
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  timeoutRef.current = setTimeout(() => setTokenExpired(true), TOKEN_TIMEOUT_MS);

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsValidToken(true);
    }
  });

  return () => {
    subscription.unsubscribe();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, []);
```

---

### Rate-Limit / Lockout Detection on Auth Errors

**When:** Supabase returns an error that indicates the user is temporarily locked out.

**Pattern (Landing.tsx):**
```ts
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  if (msg.includes("too many") || msg.includes("rate limit") ||
      msg.includes("locked") || msg.includes("over_request_rate_limit")) {
    setError("Too many attempts. Please wait a few minutes before trying again.");
  } else {
    setError("Invalid email or password.");
  }
}
```

---

### Public Certificate Verification Enrichment

**When:** A public-facing page needs display data (name, role) but only a cert ID is available.

**Pattern:** At cert generation time (server), write display fields into the public KV record alongside the lookup key:
```ts
// At generate time — enrich public record with display data
const profile = await encryptedGet<{name?:string; role?:string}>(kv.get, `user:${userId}:profile`);
const publicCert = {
  certId,
  issuedAt,
  completedModules,
  learnerName: profile?.name || "Learner",
  role: profile?.role || "learner",
};
await kv.set(`cert:${certId}`, publicCert); // unencrypted — public lookup
```

The public GET endpoint then just reads `cert:{certId}` with no auth required.

---

*Part of: SAHearn1/rwfw-agent-governance ecosystem*
