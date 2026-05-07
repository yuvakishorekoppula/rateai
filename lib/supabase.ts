import { createClient } from "@supabase/supabase-js";

/**
 * --- SUPABASE SERVER-SIDE CLIENT ---
 * 
 * Scalability & Security:
 * 1. Uses the SERVICE_ROLE_KEY to bypass Row Level Security (RLS) for backend orchestration.
 * 2. Strict guard clauses prevent runtime crashes if environment variables are missing.
 * 3. Designed exclusively for Server Components, API Routes, and Server Actions.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // In a production environment, we throw to ensure data integrity
  if (process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL: Supabase environment variables are missing.");
  } else {
    console.warn("Supabase environment variables are missing in development.");
  }
}

export const supabase = createClient(
  supabaseUrl || "", 
  supabaseServiceKey || ""
);
