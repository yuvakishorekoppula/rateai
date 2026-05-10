"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

/**
 * --- LEAD CAPTURE SCHEMA ---
 * Enforces data hygiene and improves conversion through clear validation feedback.
 */
const leadSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job title is required"),
  website_url: z.string().optional(), // Honeypot trap (must remain empty)
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  /** The specific monthly savings identified in the audit */
  savings: number;
  /** Optional callback after successful submission */
  onSuccess?: () => void;
  /** Full context from the audit results to attach to the lead */
  auditContext?: {
    totalAnnualSavings: number;
    results: any[];
  };
}

/**
 * --- COMPONENT: LEAD CAPTURE FORM ---
 * A premium, SaaS-grade conversion component with integrated 
 * loading states, success transitions, and spam protection.
 */
export default function LeadCaptureForm({ savings, onSuccess, auditContext }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          totalMonthlySavings: savings,
          ...auditContext,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed. Please try again.");
      }

      setIsSuccess(true);
      reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * --- SUCCESS VIEW ---
   */
  if (isSuccess) {
    return (
      <div className="p-8 text-center bg-zinc-900 rounded-3xl space-y-4 border border-green-500/30 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white">Audit Report Secured!</h3>
        <p className="text-zinc-400 font-medium">
          Your tailored AI optimization roadmap has been sent to your inbox.
        </p>
      </div>
    );
  }

  /**
   * --- FORM VIEW ---
   */
  return (
    <div className="p-8 md:p-10 bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
      <div className="relative z-10 space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white tracking-tight">Unlock Your Report.</h3>
          <p className="text-zinc-400 font-medium leading-relaxed">
            Get the full detailed breakdown and implementation strategy delivered to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Honeypot trap - invisible to users */}
          <input type="text" {...register("website_url")} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Work Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@company.com"
              className={`w-full px-5 py-4 rounded-2xl bg-zinc-800 border ${errors.email ? "border-red-500" : "border-zinc-700"} text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600 font-medium`}
            />
            {errors.email && <p className="text-red-500 text-[10px] font-black uppercase pl-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Company</label>
              <input
                {...register("company")}
                type="text"
                placeholder="Organization"
                className={`w-full px-5 py-4 rounded-2xl bg-zinc-800 border ${errors.company ? "border-red-500" : "border-zinc-700"} text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600 font-medium`}
              />
              {errors.company && <p className="text-red-500 text-[10px] font-black uppercase pl-1">{errors.company.message}</p>}
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Role</label>
              <input
                {...register("role")}
                type="text"
                placeholder="Title"
                className={`w-full px-5 py-4 rounded-2xl bg-zinc-800 border ${errors.role ? "border-red-500" : "border-zinc-700"} text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600 font-medium`}
              />
              {errors.role && <p className="text-red-500 text-[10px] font-black uppercase pl-1">{errors.role.message}</p>}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-white text-zinc-900 font-black rounded-2xl hover:bg-zinc-100 transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            {isSubmitting ? "Processing..." : "Get Audit Report →"}
          </button>
        </form>
      </div>
    </div>
  );
}
