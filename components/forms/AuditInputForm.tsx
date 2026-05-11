"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pricingData } from "@/lib/pricingData";
import { auditFormSchema, AuditFormValues } from "@/lib/auditSchema";

/**
 * --- DYNAMIC OPTIONS ---
 */
const FEATURE_OPTIONS = [
  "API access",
  "Memory",
  "Team collaboration",
  "Unlimited completions",
  "Enterprise support",
  "SSO / SAML",
  "Custom deployments",
  "Fine-tuning",
  "DALL-E / Image generation",
  "Web browsing",
];

const USE_CASE_OPTIONS = [
  "Solo Developer",
  "Startup Team",
  "Enterprise Department",
  "Content Creation",
  "Coding Assistant",
  "AI Chatbot Implementation",
];

const USAGE_LEVEL_OPTIONS = [
  { value: "low", label: "Low (Occasional use)" },
  { value: "medium", label: "Medium (Daily work)" },
  { value: "high", label: "High (Heavy integration)" },
  { value: "enterprise", label: "Enterprise (Scale deployment)" },
];

/**
 * --- COMPONENT ---
 */
interface AuditInputFormProps {
  onSubmit?: (data: AuditFormValues) => void | Promise<void>;
}

export default function AuditInputForm({ onSubmit: externalOnSubmit }: AuditInputFormProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      tools: [
        {
          toolName: "",
          selectedPlan: "",
          monthlySpend: 0,
          seats: 1,
          usageLevel: "medium",
        },
      ],
      budget: 0,
      useCase: "",
      requiredFeatures: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  const watchedTools = watch("tools");

  /**
   * --- PERSISTENCE LOGIC ---
   */

  // 1. Restore form state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("rateai-form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed); // Restore values into the form
      } catch (e) {
        console.error("Failed to restore form state from localStorage:", e);
        localStorage.removeItem("rateai-form"); // Clear corrupted data
      }
    }
    setIsRestored(true);
  }, [reset]);

  // 2. Autosave form state to localStorage on every change
  useEffect(() => {
    if (!isRestored) return; // Wait until restoration is attempted
    
    const subscription = watch((value) => {
      localStorage.setItem("rateai-form", JSON.stringify(value));
    });
    
    return () => subscription.unsubscribe();
  }, [watch, isRestored]);

  /**
   * Utility to clear saved data and reset form to defaults
   */
  const clearSavedForm = () => {
    if (confirm("Are you sure you want to clear all saved form data?")) {
      localStorage.removeItem("rateai-form");
      reset({
        tools: [{ toolName: "", selectedPlan: "", monthlySpend: 0, seats: 1, usageLevel: "medium" }],
        budget: 0,
        useCase: "",
        requiredFeatures: [],
      });
    }
  };

  const onSubmit = async (data: AuditFormValues) => {
    setIsSubmitting(true);
    try {
      if (externalOnSubmit) {
        await externalOnSubmit(data);
      } else {
        console.log("--- GENERATED AUDIT PAYLOAD ---");
        console.log(JSON.stringify(data, null, 2));
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Audit payload generated successfully! Check console for results.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent hydration mismatch or layout shift by waiting for restoration
  if (!isRestored) {
    return <div className="max-w-4xl mx-auto p-12 text-center text-zinc-500">Loading form state...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">AI Pricing Audit</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Analyze your current toolchain and discover optimization opportunities.
            </p>
          </div>
          <button
            type="button"
            onClick={clearSavedForm}
            className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-red-500 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-red-200 transition-all uppercase tracking-wider"
          >
            Clear Saved Data
          </button>
        </div>

        {/* Global Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Total Target Budget ($)
            </label>
            <input
              type="number"
              {...register("budget", { valueAsNumber: true })}
              placeholder="e.g. 500"
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Primary Use Case
            </label>
            <select
              {...register("useCase")}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">Select a use case...</option>
              {USE_CASE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.useCase && <p className="text-red-500 text-xs mt-1">{errors.useCase.message}</p>}
          </div>
        </div>

        {/* Tool List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Current Tools</h3>
            <button
              type="button"
              onClick={() => append({ toolName: "", selectedPlan: "", monthlySpend: 0, seats: 1, usageLevel: "medium" })}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              + Add Tool
            </button>
          </div>

          {fields.map((field, index) => {
            const selectedToolName = watchedTools[index]?.toolName;
            const availablePlans = pricingData.find((p) => p.name === selectedToolName)?.pricingPlans || [];

            return (
              <div
                key={field.id}
                className="relative p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-4 bg-zinc-50/30 dark:bg-zinc-900/30"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Remove tool"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Tool Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tool</label>
                    <select
                      {...register(`tools.${index}.toolName`)}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 outline-none focus:border-blue-500"
                    >
                      <option value="">Select tool...</option>
                      {pricingData.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.tools?.[index]?.toolName && (
                      <p className="text-red-500 text-[10px] mt-1">{errors.tools[index]?.toolName?.message}</p>
                    )}
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Plan</label>
                    <select
                      {...register(`tools.${index}.selectedPlan`)}
                      disabled={!selectedToolName}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">Select plan...</option>
                      {availablePlans.map((plan) => (
                        <option key={plan.planName} value={plan.planName}>
                          {plan.planName}
                        </option>
                      ))}
                    </select>
                    {errors.tools?.[index]?.selectedPlan && (
                      <p className="text-red-500 text-[10px] mt-1">{errors.tools[index]?.selectedPlan?.message}</p>
                    )}
                  </div>

                  {/* Monthly Spend */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Spend ($/mo)</label>
                    <input
                      type="number"
                      {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 outline-none focus:border-blue-500"
                    />
                    {errors.tools?.[index]?.monthlySpend && (
                      <p className="text-red-500 text-[10px] mt-1">{errors.tools[index]?.monthlySpend?.message}</p>
                    )}
                  </div>

                  {/* Seats */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Seats</label>
                    <input
                      type="number"
                      {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 outline-none focus:border-blue-500"
                    />
                    {errors.tools?.[index]?.seats && (
                      <p className="text-red-500 text-[10px] mt-1">{errors.tools[index]?.seats?.message}</p>
                    )}
                  </div>

                  {/* Usage Level */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Usage Level</label>
                    <select
                      {...register(`tools.${index}.usageLevel`)}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 outline-none focus:border-blue-500"
                    >
                      {USAGE_LEVEL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.tools?.[index]?.usageLevel && (
                      <p className="text-red-500 text-[10px] mt-1">{errors.tools[index]?.usageLevel?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Required Features */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Required Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURE_OPTIONS.map((feature) => (
              <label
                key={feature}
                className="flex items-center space-x-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <input
                  type="checkbox"
                  value={feature}
                  {...register("requiredFeatures")}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{feature}</span>
              </label>
            ))}
          </div>
          {errors.requiredFeatures && (
            <p className="text-red-500 text-xs mt-1">{errors.requiredFeatures.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl text-lg font-bold text-white transition-all transform active:scale-[0.98] ${
              isSubmitting ? "bg-zinc-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/20"
            }`}
          >
            {isSubmitting ? "Generating Audit..." : "Generate Audit Report"}
          </button>
        </div>
      </div>
    </form>
  );
}
