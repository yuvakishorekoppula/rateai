import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { generateAISummary } from "@/lib/aiSummary";
import * as z from "zod";

/**
 * --- VALIDATION SCHEMA ---
 * Strict typing for lead capture to ensure data hygiene.
 */
const leadCaptureSchema = z.object({
  email: z.string().email("Invalid work email address"),
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  totalMonthlySavings: z.number().nonnegative(),
  totalAnnualSavings: z.number().nonnegative(),
  results: z.array(z.any()).optional(),
  shareableId: z.string().uuid().optional(),
  website_url: z.string().optional(), // Honeypot trap
});

/**
 * --- LEADS ORCHESTRATION ROUTE ---
 * Handles the full lifecycle of a lead: Validation -> Sanitization -> Persistence -> AI Analysis -> Delivery.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    
    // 1. STRUCTURAL VALIDATION (Zod)
    const validation = leadCaptureSchema.safeParse(rawBody);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed. Please check your input fields." },
        { status: 400 }
      );
    }

    const { 
      email, 
      name: rawName, 
      company: rawCompany, 
      role: rawRole, 
      results, 
      totalMonthlySavings, 
      totalAnnualSavings, 
      shareableId,
      website_url 
    } = validation.data;

    /**
     * 2. DATA SANITIZATION
     * Cleaning user-provided strings to prevent XSS in downstream services.
     */
    const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '').trim();
    const name = sanitize(rawName);
    const company = sanitize(rawCompany);
    const role = sanitize(rawRole);

    /**
     * 3. ANTI-SPAM PROTECTION (Honeypot Logic)
     * Silent rejection for automated bot submissions.
     */
    if (website_url) {
      console.warn("[SPAM DETECTED] Honeypot triggered. Ignoring submission.");
      return NextResponse.json({ success: true });
    }

    /**
     * 4. DATABASE PERSISTENCE (Supabase Upsert Flow)
     * Deduplicates leads by email to maintain a clean CRM.
     */
    const { error: dbError } = await supabase
      .from("leads")
      .upsert(
        [
          {
            email,
            name,
            company,
            role,
            potential_monthly_savings: totalMonthlySavings,
            potential_annual_savings: totalAnnualSavings,
            audit_payload: results || [],
            updated_at: new Date().toISOString()
          }
        ],
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (dbError) {
      console.error("[RESILIENCE] Database failure logged. Proceeding with user delivery.");
    }

    /**
     * 5. AUTOMATED AI SUMMARY (Engine Orchestration)
     * Tailored executive reporting based on the audited tool stack.
     */
    let aiSummary = "Our team is currently reviewing your AI stack for advanced optimizations.";
    if (results && results.length > 0) {
      try {
        const aiResponse = await generateAISummary({
          totalMonthlySavings,
          totalAnnualSavings,
          results
        });
        aiSummary = aiResponse.summary;
      } catch {
        console.error("[RESILIENCE] AI Engine failure logged.");
      }
    }

    /**
     * 6. TRANSACTIONAL EMAIL (Resend Delivery Flow)
     * High-impact HTML template with personalized metrics and CTA.
     */
    try {
      await resend.emails.send({
        from: "RateAI Audit <onboarding@resend.dev>",
        to: email,
        subject: "Your AI Pricing Audit Results are Ready",
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #2563eb; margin: 0;">RateAI</h1>
              <p style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Premium Pricing Audit</p>
            </div>

            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Audit Summary for ${company}</h2>
            
            <div style="background-color: #f9fafb; padding: 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #f3f4f6;">
              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0; font-style: italic;">
                "${aiSummary}"
              </p>
            </div>

            <div style="display: flex; gap: 12px; margin-bottom: 32px;">
              <div style="flex: 1; background: #eff6ff; padding: 16px; border-radius: 12px; border: 1px solid #dbeafe; text-align: center;">
                <p style="font-size: 10px; font-weight: 800; color: #1d4ed8; text-transform: uppercase; margin: 0 0 4px 0;">Monthly Savings</p>
                <p style="font-size: 24px; font-weight: 800; color: #1e40af; margin: 0;">$${totalMonthlySavings.toLocaleString()}</p>
              </div>
              <div style="flex: 1; background: #f0fdf4; padding: 16px; border-radius: 12px; border: 1px solid #dcfce7; text-align: center;">
                <p style="font-size: 10px; font-weight: 800; color: #15803d; text-transform: uppercase; margin: 0 0 4px 0;">Annual Savings</p>
                <p style="font-size: 24px; font-weight: 800; color: #166534; margin: 0;">$${totalAnnualSavings.toLocaleString()}</p>
              </div>
            </div>

            <div style="margin-top: 32px; text-align: center; display: flex; flex-direction: column; gap: 16px; align-items: center;">
              <a href="https://rateai.vercel.app/audit/${shareableId || ''}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 14px; width: 220px;">
                View Full Detailed Report →
              </a>
              <a href="https://cursor.com" style="display: inline-block; background-color: #f3f4f6; color: #374151; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 14px; width: 220px;">
                Schedule Consult →
              </a>
            </div>

            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">&copy; 2026 RateAI | Premium Pricing Analytics</p>
            </div>
          </div>
        `,
      });
    } catch {
      console.error("[RESILIENCE] Email delivery failure logged.");
    }

    /**
     * 7. SUCCESSFUL RESPONSE
     */
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("[CRITICAL] Global API Failure:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
