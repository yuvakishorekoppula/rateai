import { AuditResult } from "./auditEngine";

/**
 * --- TYPES & INTERFACES ---
 * Strictly typed interfaces ensuring consistent data flow between 
 * the frontend, API route, and AI providers.
 */

/** The core input payload representing the full state of a user's AI audit */
export interface AISummaryRequest {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  results: AuditResult[];
}

/** The standard response returned by the summary engine */
export interface AISummaryResponse {
  summary: string;
  status: "Optimized" | "Needs Improvement" | "Critical";
  provider?: "openai" | "anthropic" | "fallback";
  timestamp: string;
}

/**
 * --- PROMPT CONSTRUCTION ---
 * Deterministic grounding logic. We transform structured JSON data into 
 * a stringified breakdown to ensure the AI has clear "ground truth" 
 * and doesn't hallucinate pricing.
 */
export function generateAuditSummaryPrompt(data: AISummaryRequest): string {
  const { totalMonthlySavings, totalAnnualSavings, results } = data;

  const toolDetails = results
    .map(
      (r) =>
        `- Tool: ${r.currentTool} | Current: ${r.currentPlan} | Recommended: ${r.finalRecommendation} | Savings: $${r.savings.monthly}/mo | Reasoning: ${r.fitResult.reasoning.join("; ")}`
    )
    .join("\n");

  return `
Analyze the following AI Pricing Audit results and generate a professional 100-word executive summary.

AUDIT DATA (GROUND TRUTH):
- Total Monthly Savings: $${totalMonthlySavings}
- Total Annual Savings: $${totalAnnualSavings}
- Detailed Breakdown:
${toolDetails}

STRICT CONSTRAINTS:
1. DETERMINISTIC: Base all claims EXCLUSIVELY on the provided data above. Do NOT hallucinate external pricing.
2. CONCISE: Approximately 100 words.
3. STRUCTURE:
   - Identify specific overspending in the current stack.
   - Summarize recommended transitions.
   - State total savings metrics.
   - Explain core optimization areas (e.g., seat efficiency).
4. TONE: Professional, data-driven, objective. No hype.
5. INVESTOR-READY: High-stakes, senior consultant quality.

SUMMARY:
`.trim();
}

/**
 * --- RESILIENT ENGINE ---
 * Main entry point for summary generation.
 * Features:
 * - Priority-based provider selection (Anthropic > OpenAI)
 * - Mandatory Fallback for total API failures
 * - Timeout protection via AbortController
 */
export async function generateAISummary(data: AISummaryRequest): Promise<AISummaryResponse> {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const timestamp = new Date().toISOString();
  
  // FALLBACK LOGIC: Guaranteed user-facing response regardless of network state
  const FALLBACK_MESSAGE = "You're overspending on some tools. Consider optimizing your plans.";

  // EMPTY AUDIT HANDLING: Prevents unnecessary API costs
  if (!data.results || data.results.length === 0) {
    return { 
      summary: "No audit data available for analysis.", 
      provider: "fallback",
      timestamp 
    };
  }

  const prompt = generateAuditSummaryPrompt(data);
  const timeoutMs = 8000; // 8 second timeout to protect Next.js execution limits

  try {
    // PROVIDER PRIORITIZATION: Easily extensible for future providers (e.g., Google Gemini)
    // DETERMINE STATUS
    let status: AISummaryResponse["status"] = "Optimized";
    if (data.totalMonthlySavings > 1000) status = "Critical";
    else if (data.totalMonthlySavings > 100) status = "Needs Improvement";

    if (ANTHROPIC_KEY) {
      const summary = await callAnthropic(ANTHROPIC_KEY, prompt, timeoutMs);
      return { summary, status, provider: "anthropic", timestamp };
    } else if (OPENAI_KEY) {
      const summary = await callOpenAI(OPENAI_KEY, prompt, timeoutMs);
      return { summary, status, provider: "openai", timestamp };
    }

    throw new Error("No AI providers configured");
  } catch (error) {
    // API FAILURE HANDLING: Logs error for analytics/debugging but returns friendly fallback
    console.error("AI Summary Engine Error:", error);
    
    // Fallback status logic
    let status: AISummaryResponse["status"] = "Optimized";
    if (data.totalMonthlySavings > 1000) status = "Critical";
    else if (data.totalMonthlySavings > 100) status = "Needs Improvement";

    return { 
      summary: FALLBACK_MESSAGE, 
      status,
      provider: "fallback", 
      timestamp 
    };
  }
}

/**
 * --- PROVIDER IMPLEMENTATIONS ---
 * Encapsulated logic for specific AI APIs. 
 * Designed for future streaming support and caching integration.
 */

async function callOpenAI(apiKey: string, prompt: string, timeout: number): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, 
        max_tokens: 250,
      }),
    });

    clearTimeout(id);
    if (!response.ok) throw new Error(`OpenAI Error: ${response.status}`);

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("Malformed OpenAI response");
    return content.trim();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function callAnthropic(apiKey: string, prompt: string, timeout: number): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.3,
      }),
    });

    clearTimeout(id);
    if (!response.ok) throw new Error(`Anthropic Error: ${response.status}`);

    const result = await response.json();
    const content = result.content?.[0]?.text;

    if (!content) throw new Error("Malformed Anthropic response");
    return content.trim();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
