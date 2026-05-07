import { pricingData, Platform, PricingPlan } from "./pricingData";

/**
 * --- INTERFACES & TYPES ---
 */

export type UsageLevel = "low" | "medium" | "high" | "enterprise";

export interface AuditInput {
  selectedTool: string; // Platform name or ID
  selectedPlan: string; // Plan name
  budget: number;
  teamSize: number;
  requiredFeatures: string[];
  usageLevel: UsageLevel;
}

export interface SavingsResult {
  monthly: number;
  yearly: number;
  percentage: number;
}

export interface PlanFitResult {
  score: number; // 0-100
  status: "underpowered" | "appropriate" | "overpaying";
  reasoning: string[];
}

export interface AlternativeRecommendation {
  tool: string;
  plan: string;
  estimatedSavings: number;
  valueScore: number;
  reason: string;
}

export interface CheaperSameVendor {
  recommendedPlan: string;
  monthlySavings: number;
  yearlySavings: number;
  reason: string;
}

export interface AuditResult {
  currentTool: string;
  currentPlan: string;
  fitScore: number;
  fitResult: PlanFitResult;
  cheaperSameVendor?: CheaperSameVendor;
  alternatives: AlternativeRecommendation[];
  savings: SavingsResult;
  finalRecommendation: string;
  confidenceScore: number;
  analysisDate: string;
}

/**
 * --- UTILITY HELPERS ---
 */

/**
 * Normalizes pricing values that might be numbers or strings (e.g., "Usage-based", "100-200")
 */
export const normalizePricing = (price: number | string): number => {
  if (typeof price === "number") return price;
  if (price.toLowerCase().includes("usage") || price.toLowerCase().includes("custom")) return 0;
  
  // Handle ranges like "100-200" by taking the lower bound
  const match = price.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const getPlatform = (toolNameOrId: string): Platform | undefined => {
  return pricingData.find(
    (p) => p.id.toLowerCase() === toolNameOrId.toLowerCase() || p.name.toLowerCase() === toolNameOrId.toLowerCase()
  );
};

const getPlan = (platform: Platform, planName: string): PricingPlan | undefined => {
  return platform.pricingPlans.find((p) => p.planName.toLowerCase() === planName.toLowerCase());
};

/**
 * --- SCORING LAYER ---
 */

/**
 * Compares required features against available plan features.
 * Returns a score from 0-1 and a list of missing features.
 */
export const compareFeatureCoverage = (required: string[], available: string[]) => {
  if (required.length === 0) return { score: 1, missing: [] };
  
  const matched = required.filter((req) =>
    available.some((feat) => feat.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(feat.toLowerCase()))
  );
  
  return {
    score: matched.length / required.length,
    missing: required.filter((req) => !matched.includes(req)),
  };
};

/**
 * Calculates a value score based on price-to-feature ratio and category positioning.
 */
export const calculateValueScore = (plan: PricingPlan, coverageScore: number): number => {
  const price = normalizePricing(plan.monthlyPrice);
  const baseValue = coverageScore * 100;
  
  // Efficiency: High features for low price increases score
  if (price === 0) return coverageScore > 0.5 ? 95 : 50;
  
  const priceEfficiency = Math.max(0, 1 - price / 500); // Penalty for very high prices
  const score = (baseValue * 0.7) + (priceEfficiency * 30);
  
  return Math.round(Math.min(100, score));
};

/**
 * --- CORE AUDIT LOGIC ---
 */

/**
 * Determines how well a plan fits the user's needs.
 */
export const getPlanFit = (input: AuditInput, plan: PricingPlan, platform: Platform): PlanFitResult => {
  const reasoning: string[] = [];
  let score = 100;
  
  const price = normalizePricing(plan.monthlyPrice) * input.teamSize;
  const coverage = compareFeatureCoverage(input.requiredFeatures, plan.features);
  
  // 1. Feature Check
  if (coverage.score < 1) {
    score -= (1 - coverage.score) * 50;
    reasoning.push(`Missing ${coverage.missing.length} required features: ${coverage.missing.join(", ")}.`);
  } else {
    reasoning.push("All required features are covered by this plan.");
  }
  
  // 2. Budget Check
  if (input.budget > 0 && price > input.budget) {
    const overBudget = price - input.budget;
    const penalty = Math.min(40, (overBudget / input.budget) * 20);
    score -= penalty;
    reasoning.push(`Total cost ($${price}) is above your target budget ($${input.budget}).`);
  } else if (input.budget <= 0 && price > 0) {
    score -= 50;
    reasoning.push(`Total cost ($${price}) is above your zero or negative budget.`);
  }
  
  // 3. Usage Check
  if (input.usageLevel === "high" && plan.planName.toLowerCase().includes("free")) {
    score -= 30;
    reasoning.push("High usage needs are unlikely to be met by a Free plan.");
  }
  
  // Status determination
  let status: PlanFitResult["status"] = "appropriate";
  if (coverage.score < 0.6) status = "underpowered";
  else if (price > input.budget * 1.5 && coverage.score === 1) status = "overpaying";
  
  return {
    score: Math.max(0, Math.round(score)),
    status,
    reasoning,
  };
};

/**
 * Checks for cheaper plans within the same platform.
 */
export const findCheaperSameVendorPlan = (input: AuditInput, platform: Platform, currentPlan: PricingPlan): CheaperSameVendor | undefined => {
  const currentPrice = normalizePricing(currentPlan.monthlyPrice);
  
  // Look for plans with lower price that still cover at least 90% of features or current coverage
  const cheaperPlans = platform.pricingPlans
    .filter((p) => normalizePricing(p.monthlyPrice) < currentPrice)
    .sort((a, b) => normalizePricing(a.monthlyPrice) - normalizePricing(b.monthlyPrice));
    
  for (const plan of cheaperPlans) {
    const coverage = compareFeatureCoverage(input.requiredFeatures, plan.features);
    if (coverage.score >= 0.9) {
      const savings = (currentPrice - normalizePricing(plan.monthlyPrice)) * input.teamSize;
      return {
        recommendedPlan: plan.planName,
        monthlySavings: savings,
        yearlySavings: savings * 12,
        reason: `The ${plan.planName} plan covers your core needs at a significantly lower cost.`,
      };
    }
  }
  
  return undefined;
};

/**
 * Finds alternative platforms in the same category.
 */
export const findAlternativeTools = (input: AuditInput, currentPlatform: Platform, currentPlan: PricingPlan): AlternativeRecommendation[] => {
  const alternatives: AlternativeRecommendation[] = [];
  const currentPrice = normalizePricing(currentPlan.monthlyPrice);
  
  // Filter platforms in same category or similar (e.g. Chatbot vs LLM)
  const competitors = pricingData.filter((p) => 
    p.id !== currentPlatform.id && 
    (p.category === currentPlatform.category || p.category.includes("Chatbot") || p.category.includes("LLM"))
  );
  
  for (const platform of competitors) {
    for (const plan of platform.pricingPlans) {
      const price = normalizePricing(plan.monthlyPrice);
      const coverage = compareFeatureCoverage(input.requiredFeatures, plan.features);
      
      // If price is lower and coverage is decent
      if (price < currentPrice && coverage.score >= 0.7) {
        const valueScore = calculateValueScore(plan, coverage.score);
        alternatives.push({
          tool: platform.name,
          plan: plan.planName,
          estimatedSavings: (currentPrice - price) * input.teamSize,
          valueScore,
          reason: `Switching to ${platform.name} ${plan.planName} offers similar capabilities with a value score of ${valueScore}/100.`,
        });
      }
    }
  }
  
  return alternatives.sort((a, b) => b.valueScore - a.valueScore).slice(0, 2);
};

/**
 * Calculates total savings metrics.
 */
export const calculateSavings = (currentPrice: number, recommendedPrice: number, teamSize: number): SavingsResult => {
  const monthly = (currentPrice - recommendedPrice) * teamSize;
  return {
    monthly,
    yearly: monthly * 12,
    percentage: currentPrice > 0 ? Math.round((monthly / (currentPrice * teamSize)) * 100) : 0,
  };
};

/**
 * --- REPORT GENERATOR ---
 */

/**
 * Generates a full audit report based on input and current market data.
 */
export const generateAuditReport = (input: AuditInput): AuditResult | string => {
  const platform = getPlatform(input.selectedTool);
  if (!platform) return "Platform not found.";
  
  const plan = getPlan(platform, input.selectedPlan);
  if (!plan) return "Plan not found.";
  
  const fitResult = getPlanFit(input, plan, platform);
  const cheaperSameVendor = findCheaperSameVendorPlan(input, platform, plan);
  const alternatives = findAlternativeTools(input, platform, plan);
  
  // Determine final recommendation
  let finalRec = "Your current plan is well-optimized for your needs.";
  let confidence = 90;
  let recommendedMonthlyPrice = normalizePricing(plan.monthlyPrice);
  
  if (cheaperSameVendor) {
    finalRec = `Downgrade to ${platform.name} ${cheaperSameVendor.recommendedPlan} to save $${cheaperSameVendor.monthlySavings}/mo.`;
    recommendedMonthlyPrice = normalizePricing(platform.pricingPlans.find(p => p.planName === cheaperSameVendor.recommendedPlan)?.monthlyPrice || 0);
  } else if (alternatives.length > 0 && alternatives[0].valueScore > 80) {
    finalRec = `Consider switching to ${alternatives[0].tool} ${alternatives[0].plan} for better value.`;
    const altPlatform = getPlatform(alternatives[0].tool);
    const altPlan = altPlatform ? getPlan(altPlatform, alternatives[0].plan) : null;
    recommendedMonthlyPrice = altPlan ? normalizePricing(altPlan.monthlyPrice) : recommendedMonthlyPrice;
  } else if (fitResult.status === "underpowered") {
    finalRec = `Upgrade your plan or add missing features to meet requirements.`;
    confidence = 85;
  }
  
  const currentTotal = normalizePricing(plan.monthlyPrice) * input.teamSize;
  const savings = calculateSavings(normalizePricing(plan.monthlyPrice), recommendedMonthlyPrice, input.teamSize);
  
  return {
    currentTool: platform.name,
    currentPlan: plan.planName,
    fitScore: fitResult.score,
    fitResult,
    cheaperSameVendor,
    alternatives,
    savings,
    finalRecommendation: finalRec,
    confidenceScore: confidence,
    analysisDate: new Date().toISOString(),
  };
};
