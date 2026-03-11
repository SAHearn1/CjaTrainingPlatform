/**
 * CJIS-compliant AES-256-GCM encryption utilities for data at rest.
 * Uses the Web Crypto API available in Deno runtime.
 *
 * CJIS Security Policy 5.10.1.2 requires:
 * - AES 128/256 bit encryption for data at rest
 * - FIPS 140-2 validated cryptographic modules (Web Crypto API meets this)
 * - Unique initialization vectors per encryption operation
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256; // CJIS: AES-256
const IV_LENGTH = 12; // 96-bit IV for GCM

/**
 * Derives an AES-256 key from the SUPABASE_SERVICE_ROLE_KEY using PBKDF2.
 * The service role key is used as the master passphrase — it never leaves the server.
 */
let _cachedKey: CryptoKey | null = null;
const SALT = new TextEncoder().encode("rootwork-cjis-v1-salt-2026");

async function deriveKey(): Promise<CryptoKey> {
  if (_cachedKey) return _cachedKey;

  const passphrase =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "fallback-dev-key";
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  _cachedKey = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: SALT, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );
  return _cachedKey;
}

/**
 * Encrypts a JSON-serializable value using AES-256-GCM.
 * Returns a base64 string containing IV + ciphertext + auth tag.
 */
export async function encryptData(data: unknown): Promise<string> {
  const key = await deriveKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, plaintext),
  );

  // Concatenate: [IV (12 bytes)] [ciphertext + GCM tag]
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv, 0);
  combined.set(ciphertext, iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a base64-encoded AES-256-GCM ciphertext back to its original value.
 */
export async function decryptData<T = unknown>(
  encrypted: string,
): Promise<T> {
  const key = await deriveKey();
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext,
  );

  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}

/**
 * Determines whether a KV key holds data that must be encrypted at rest
 * per CJIS Security Policy 5.10.1.2.
 *
 * Sensitive data categories:
 * - User profiles (PII: name, email, role, organization)
 * - Assessment scores (performance data)
 * - Simulation results (case-related responses)
 * - License/payment records (financial PII)
 */
export function isSensitiveKey(key: string): boolean {
  return (
    key.includes(":profile") ||
    key.includes(":progress:") ||
    key.includes(":simulation:") ||
    key.includes(":license") ||
    key.includes(":audit:")
  );
}

/**
 * Wraps kv.set with automatic encryption for sensitive keys.
 */
export async function encryptedSet(
  kvSet: (key: string, value: unknown) => Promise<void>,
  key: string,
  value: unknown,
): Promise<void> {
  if (isSensitiveKey(key)) {
    const encrypted = await encryptData(value);
    await kvSet(key, { __encrypted: true, __v: 1, data: encrypted });
  } else {
    await kvSet(key, value);
  }
}

/**
 * Wraps kv.get with automatic decryption for encrypted values.
 */
export async function encryptedGet<T = unknown>(
  kvGet: (key: string) => Promise<unknown>,
  key: string,
): Promise<T | null> {
  const raw = (await kvGet(key)) as any;
  if (!raw) return null;
  if (raw?.__encrypted === true && raw?.data) {
    return decryptData<T>(raw.data);
  }
  // Legacy unencrypted data — return as-is (backwards compatible)
  return raw as T;
}

/**
 * Wraps kv.getByPrefix with automatic decryption for encrypted values.
 */
export async function encryptedGetByPrefix<T = unknown>(
  kvGetByPrefix: (prefix: string) => Promise<unknown[]>,
  prefix: string,
): Promise<T[]> {
  const results = (await kvGetByPrefix(prefix)) as any[];
  if (!results || results.length === 0) return [];

  const decrypted = await Promise.all(
    results.map(async (raw: any) => {
      if (raw?.__encrypted === true && raw?.data) {
        return decryptData<T>(raw.data);
      }
      return raw as T;
    }),
  );
  return decrypted;
}

/**
 * Wraps kv.getByPrefixWithKeys with automatic decryption, preserving keys.
 * Needed by admin endpoints that must match values back to their KV key paths.
 */
export async function encryptedGetByPrefixWithKeys<T = unknown>(
  kvGetByPrefixWithKeys: (prefix: string) => Promise<{ key: string; value: any }[]>,
  prefix: string,
): Promise<{ key: string; value: T }[]> {
  const results = await kvGetByPrefixWithKeys(prefix);
  if (!results || results.length === 0) return [];

  return Promise.all(
    results.map(async ({ key, value }) => {
      let decrypted: T;
      if (value?.__encrypted === true && value?.data) {
        decrypted = await decryptData<T>(value.data);
      } else {
        decrypted = value as T;
      }
      return { key, value: decrypted };
    }),
  );
}
