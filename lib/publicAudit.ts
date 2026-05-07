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
 * --- FETCH AUDIT ---
 * Retrieves a public audit by its unique ID.
 * Returns null if the audit is not found or is private.
 */
export async function getPublicAudit(id: string): Promise<PublicAuditRecord | null> {
  if (!id || typeof id !== "string") return null;

  const { data, error } = await supabase
    .from("public_audits")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error) {
    console.error("[PUBLIC AUDIT] Fetch failed:", error.message);
    return null;
  }

  return data ?? null;
}
