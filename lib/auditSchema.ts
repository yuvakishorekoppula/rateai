import { z } from "zod";

/**
 * --- AUDIT SCHEMA ---
 * Defines the validation rules for the pricing audit input form.
 */

export const usageLevelEnum = z.enum(["low", "medium", "high", "enterprise"]);

export const toolInputSchema = z.object({
  toolName: z.string().min(1, "Tool name is required"),
  selectedPlan: z.string().min(1, "Please select a plan"),
  monthlySpend: z.number().min(0, "Monthly spend must be 0 or greater"),
  seats: z.number().int().min(1, "At least 1 seat is required"),
  usageLevel: usageLevelEnum,
});

export const auditFormSchema = z.object({
  tools: z.array(toolInputSchema).min(1, "At least one tool must be added for audit"),
  budget: z.number().min(0, "Total budget must be 0 or greater"),
  useCase: z.string().min(3, "Use case must be at least 3 characters"),
  requiredFeatures: z.array(z.string()).min(1, "Select at least one required feature"),
});

/**
 * --- TYPES ---
 */

export type UsageLevel = z.infer<typeof usageLevelEnum>;
export type ToolInput = z.infer<typeof toolInputSchema>;
export type AuditFormValues = z.infer<typeof auditFormSchema>;
