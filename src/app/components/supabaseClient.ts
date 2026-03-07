import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Singleton — import this instead of calling createClient() directly
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
