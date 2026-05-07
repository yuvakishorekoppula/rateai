import { NextRequest, NextResponse } from "next/server";
import { generateAISummary, AISummaryRequest, AISummaryResponse } from "@/lib/aiSummary";

/**
 * --- API ROUTE ARCHITECTURE ---
 * Purpose: Securely orchestrates AI summary generation.
 * 
 * Scalability features:
 * 1. INPUT VALIDATION: Prevents malformed payloads from wasting API tokens.
 * 2. ERROR BOUNDARY: Catches logic errors and returns structured JSON responses.
 * 3. ANALYTICS READY: Response includes provider and timestamp for tracking.
 */

export async function POST(req: NextRequest) {
  try {
    // Parse the payload securely
    const body: AISummaryRequest = await req.json();

    /**
     * --- INPUT VALIDATION ---
     * Mandatory check for the results array.
     * Prevents empty or malformed requests from reaching AI providers.
     */
    if (!body.results || !Array.isArray(body.results)) {
      return NextResponse.json(
        { error: "Invalid request body: 'results' array is required." },
        { status: 400 }
      );
    }

    /**
     * --- EXECUTION ---
     * Calls the resilient server-side engine.
     * This abstracts away specific provider logic (OpenAI/Anthropic).
     */
    const summaryData: AISummaryResponse = await generateAISummary(body);

    // Return the summary along with metadata for frontend analytics/logging
    return NextResponse.json(summaryData);

  } catch (error: any) {
    /**
     * --- GLOBAL ERROR HANDLING ---
     * Ensures the API never returns a non-JSON error.
     * Vital for production stability and client-side error parsing.
     */
    console.error("Critical API Error [/api/summary]:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to process AI summary request.",
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
