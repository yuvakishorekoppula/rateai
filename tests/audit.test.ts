import { describe, it, expect, beforeEach } from "vitest";
import {
  generateAuditReport,
  getPlanFit,
  findCheaperSameVendorPlan,
  findAlternativeTools,
  calculateSavings,
  calculateValueScore,
  compareFeatureCoverage,
  normalizePricing,
  AuditInput,
  AuditResult,
} from "../lib/auditEngine";
import { pricingData } from "../lib/pricingData";

/**
 * --- MOCK INPUT DATA ---
 */

const soloDevInput: AuditInput = {
  selectedTool: "ChatGPT",
  selectedPlan: "Plus",
  budget: 25,
  teamSize: 1,
  requiredFeatures: ["GPT-4o", "DALL-E"],
  usageLevel: "medium",
};

const startupTeamInput: AuditInput = {
  selectedTool: "Cursor",
  selectedPlan: "Pro",
  budget: 200,
  teamSize: 10,
  requiredFeatures: ["SAML", "billing"],
  usageLevel: "high",
};

const enterpriseInput: AuditInput = {
  selectedTool: "Claude",
  selectedPlan: "Enterprise",
  budget: 5000,
  teamSize: 50,
  requiredFeatures: ["SSO", "Directory Sync", "support"],
  usageLevel: "enterprise",
};

describe("Audit Engine - Core Logic", () => {
  
  /**
   * 1. Plan Fit Logic
   */
  describe("getPlanFit()", () => {
    it("should return a high score for a perfectly matched plan", () => {
      const platform = pricingData.find((p) => p.id === "chatgpt")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Plus")!;
      const result = getPlanFit(soloDevInput, plan, platform);
      
      expect(result.score).toBeGreaterThan(80);
      expect(result.status).toBe("appropriate");
    });

    it("should detect an underpowered plan if features are missing", () => {
      const platform = pricingData.find((p) => p.id === "chatgpt")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Free")!;
      const input = { ...soloDevInput, requiredFeatures: ["DALL-E", "Voice Mode"] };
      const result = getPlanFit(input, plan, platform);
      
      expect(result.score).toBeLessThan(60);
      expect(result.status).toBe("underpowered");
    });

    it("should detect overpaying status", () => {
      const platform = pricingData.find((p) => p.id === "cursor")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Ultra")!;
      const input = { ...soloDevInput, budget: 10, requiredFeatures: ["priority"] }; 
      const result = getPlanFit(input, plan, platform);
      
      expect(result.status).toBe("overpaying");
    });
  });

  /**
   * 2. Downgrade Detection
   */
  describe("findCheaperSameVendorPlan()", () => {
    it("should recommend ChatGPT Plus for a ChatGPT Pro user with matched needs", () => {
      const platform = pricingData.find((p) => p.id === "chatgpt")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Pro")!;
      const input = { ...soloDevInput, requiredFeatures: ["GPT-4o", "DALL-E"] }; 
      
      const result = findCheaperSameVendorPlan(input, platform, plan);
      
      expect(result).toBeDefined();
      expect(result?.recommendedPlan).toBe("Plus");
    });

    it("should NOT recommend a downgrade if it misses required features", () => {
      const platform = pricingData.find((p) => p.id === "chatgpt")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Plus")!;
      const input = { ...soloDevInput, requiredFeatures: ["Unlimited GPT-4o"] }; // Plus has limits
      
      const result = findCheaperSameVendorPlan(input, platform, plan);
      expect(result).toBeUndefined();
    });
  });

  /**
   * 3. Alternative Tool Recommendations
   */
  describe("findAlternativeTools()", () => {
    it("should recommend Claude Pro as an alternative to ChatGPT Plus", () => {
      const platform = pricingData.find((p) => p.id === "chatgpt")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Plus")!;
      const input = { ...soloDevInput, requiredFeatures: ["Claude 3.5"] }; // Claude Pro has this
      
      const result = findAlternativeTools(input, platform, plan);
      
      expect(result.some(alt => alt.tool === "Claude")).toBe(true);
    });
  });

  /**
   * 4. Savings Calculations
   */
  describe("calculateSavings()", () => {
    it("should correctly calculate monthly and yearly savings", () => {
      const result = calculateSavings(100, 20, 5); // $80 savings/user * 5 users = $400/mo
      expect(result.monthly).toBe(400);
      expect(result.yearly).toBe(4800);
      expect(result.percentage).toBe(80);
    });

    it("should handle zero current price", () => {
      const result = calculateSavings(0, 20, 1);
      expect(result.monthly).toBeLessThan(0);
      expect(result.percentage).toBe(0);
    });
  });

  /**
   * 5. Feature Coverage Matching
   */
  describe("compareFeatureCoverage()", () => {
    it("should match features case-insensitively", () => {
      const result = compareFeatureCoverage(["GPT-4o"], ["Unlimited gpt-4o"]);
      expect(result.score).toBe(1);
    });

    it("should identify missing features", () => {
      const result = compareFeatureCoverage(["API access", "SSO"], ["API access"]);
      expect(result.score).toBe(0.5);
      expect(result.missing).toContain("SSO");
    });
  });

  /**
   * 6. Pricing Normalization
   */
  describe("normalizePricing()", () => {
    it("should parse number correctly", () => {
      expect(normalizePricing(20)).toBe(20);
    });

    it("should parse range correctly by taking lower bound", () => {
      expect(normalizePricing("100-200")).toBe(100);
    });

    it("should return 0 for Usage-based or Custom", () => {
      expect(normalizePricing("Usage-based")).toBe(0);
      expect(normalizePricing("Custom")).toBe(0);
    });
  });

  /**
   * 7. Edge Cases & Defensive Testing
   */
  describe("Edge Cases", () => {
    it("should return error message for unknown tool", () => {
      const result = generateAuditReport({ ...soloDevInput, selectedTool: "FakeTool" });
      expect(typeof result).toBe("string");
      expect(result).toBe("Platform not found.");
    });

    it("should handle empty required features array", () => {
      const result = compareFeatureCoverage([], ["Any feature"]);
      expect(result.score).toBe(1);
      expect(result.missing).toHaveLength(0);
    });

    it("should handle negative budget gracefully", () => {
      const platform = pricingData.find((p) => p.id === "chatgpt")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Plus")!;
      const result = getPlanFit({ ...soloDevInput, budget: -10 }, plan, platform);
      
      expect(result.score).toBeLessThanOrEqual(50);
      expect(result.reasoning.some(r => r.includes("budget"))).toBe(true);
    });

    it("should handle enterprise users correctly", () => {
      const platform = pricingData.find((p) => p.id === "claude")!;
      const plan = platform.pricingPlans.find((p) => p.planName === "Enterprise")!;
      const result = getPlanFit(enterpriseInput, plan, platform);
      
      expect(result.score).toBeGreaterThan(70);
      expect(result.reasoning).toContain("All required features are covered by this plan.");
    });
  });

  /**
   * 8. Final Report Validation
   */
  describe("generateAuditReport()", () => {
    it("should generate a complete structured report", () => {
      const result = generateAuditReport(soloDevInput) as AuditResult;
      
      expect(result).toHaveProperty("fitScore");
      expect(result).toHaveProperty("savings");
      expect(result).toHaveProperty("finalRecommendation");
      expect(result.analysisDate).toBeDefined();
    });

    it("should maintain consistency in confidence scores", () => {
      const result = generateAuditReport(soloDevInput) as AuditResult;
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(result.confidenceScore).toBeLessThanOrEqual(100);
    });
  });
});
