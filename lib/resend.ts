import { Resend } from "resend";

/**
 * --- RESEND TRANSACTIONAL EMAIL CLIENT ---
 * 
 * Purpose: Centralized orchestration for audit notifications and lead confirmations.
 * Security: Keys are accessed via process.env and never exposed to the client bundle.
 */

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL: RESEND_API_KEY is missing in production.");
}

export const resend = new Resend(resendApiKey);
