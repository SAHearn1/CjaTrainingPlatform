// projectId is safe to commit — used only to construct the Supabase URL.
// publicAnonKey is loaded from VITE_SUPABASE_ANON_KEY (Vercel env var / .env.local).
// See .env.example for setup instructions. GAP-05 fix, issue #108.

export const projectId = "rchiljcopergqtozylik"

export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string