"use server";

import { supabase } from "./supabase";
import { AuditResult } from "./auditEngine";

/**
 * --- PUBLIC AUDIT TYPES ---
 * Data structures for storing and retrieving shareable audit sessions.
 */
export interface PublicAuditRecord {
  id: string;
  created_at: string;
  total_monthly_savings: number;
  total_annual_savings: number;
  results: AuditResult[];
  company?: string;
  is_public: boolean;
}

export interface SaveAuditPayload {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  results: AuditResult[];
  company?: string;
}

/**
 * --- SAVE AUDIT ---
 * Persists an audit result to Supabase and returns the unique shareable ID.
 * Called after the audit engine completes processing.
 */
export async function savePublicAudit(payload: SaveAuditPayload): Promise<string | null> {
  const { totalMonthlySavings, totalAnnualSavings, results, company } = payload;

  const { data, error } = await supabase
    .from("public_audits")
    .insert([
      {
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        results: results,
        company: company || null,
        is_public: true,
      }
    ])
    .select("id")
    .single();

  if (error) {
    console.error("[PUBLIC AUDIT] Failed to save audit:", error.message);
    return null;
  }

  return data?.id ?? null;
}

/**
 * --- FETCH PUBLIC AUDIT LOGIC ---
 * Retrieves a shareable audit from the Supabase database using its unique UUID.
 * 
 * Supabase Querying Flow:
 * 1. UUID Validation: We aggressively validate the input format using regex to prevent 
 *    sending malformed strings to Postgres, which would trigger a 500 error syntax exception.
 * 2. Secure Query: We explicitly enforce `is_public=true` as a secondary safety check in the WHERE clause.
 * 3. Error Handling: Differentiates between 'PGRST116' (No rows returned = valid 404) 
 *    and actual database timeout/connection failures (Throws a true 500).
 */
export async function getPublicAudit(id: string): Promise<PublicAuditRecord | null> {
  // 1. Invalid IDs Validation
  // Validate UUID format before querying database to avoid PostgREST syntax errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
    return null;
  }

  const { data, error } = await supabase
    .from("public_audits")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error) {
    // 2. Missing Audits (Supabase returns PGRST116 when .single() finds no rows)
    if (error.code === "PGRST116") {
      return null;
    }
    
    // 4. Database Failures
    console.error("[PUBLIC AUDIT] Database Fetch failed:", error.message);
    throw new Error("Failed to communicate with database while retrieving audit.");
  }

  return data ?? null;
}
