"use client";

import React from "react";
import { AuditResult } from "@/lib/auditEngine";
import LeadCaptureForm from "./LeadCaptureForm";

interface ResultsProps {
  /** The list of individual tool audit results from the engine */
  results: AuditResult[];
  /** Whether the audit is currently being calculated */
  isLoading?: boolean;
}

/**
 * --- COMPONENT ARCHITECTURE ---
 * The Results component is designed as a high-performance modular dashboard.
 * It follows a strategic top-down information hierarchy:
 * 
 * 1. SUMMARY HEADER (Hero): High-impact aggregate savings or "Optimized" status.
 * 2. STRATEGIC CTAs: Conditional components based on savings volume (Credex for high, Lead Capture for low).
 * 3. GRANULAR DATA (Breakdown): Detailed tool-by-tool analysis with badges and fit reasoning.
 * 4. PERSISTENT ENGAGEMENT: Bottom lead capture for long-term user retention.
 */
const Results: React.FC<ResultsProps> = ({ results, isLoading = false }) => {
  
  /**
   * --- LOADING STATE (SKELETONS) ---
   * Uses semantic HTML and ARIA attributes for accessibility.
   * Skeleton loaders match the final layout to prevent layout shift.
   */
  if (isLoading) {
    return (
      <div 
        className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-pulse" 
        aria-busy="true" 
        aria-live="polite"
      >
        <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  /**
   * --- EMPTY STATE ---
   * Graceful fallback when no data has been submitted.
   */
  if (!results || results.length === 0) {
    return (
      <section 
        className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
        aria-labelledby="empty-state-title"
      >
        <div className="mx-auto w-24 h-24 bg-zinc-100 dark:bg-zinc-800 text-zinc-300 flex items-center justify-center rounded-full mb-8 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 id="empty-state-title" className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          No audit results available.
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mx-auto leading-relaxed font-medium">
          Please complete the pricing audit form to generate your custom AI optimization report and discover potential savings.
        </p>
        <button 
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/40 outline-none"
          aria-label="Navigate back to audit form"
        >
          Go to Form
        </button>
      </section>
    );
  }

  /**
   * --- SAVINGS CALCULATIONS ---
   * Aggregates individual tool results into a total stack perspective.
   */
  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.savings.monthly, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  
  // OPTIMAL CASE DETECTION: If savings are < $100/mo, we consider the stack "Optimized".
  const isOptimized = totalMonthlySavings < 100;

  /**
   * --- CTA DECISION LOGIC ---
   * Strategy: Match high-value leads with Credex services, and low-value leads with stack monitoring.
   */
  const renderCredexCTA = () => {
    if (totalMonthlySavings < 500) return null;

    return (
      <section 
        className="mb-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-2xl relative overflow-hidden group border border-blue-400/20"
        aria-labelledby="cta-title"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Optimization Opportunity Detected
            </div>
            <h3 id="cta-title" className="text-2xl md:text-3xl font-extrabold leading-tight">
              You’re overspending by over <span className="text-yellow-300" aria-label={`$${totalMonthlySavings} per month`}>${totalMonthlySavings.toLocaleString()}/month</span>.
            </h3>
            <p className="text-blue-50 text-lg max-w-xl font-medium">
              Credex can help reinvest these recovered savings into smarter AI infrastructure, proprietary model training, and operational efficiency.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button className="px-8 py-4 bg-white text-blue-700 font-extrabold rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-95 focus:ring-4 focus:ring-white/50 outline-none">
              Talk to Credex
            </button>
            <button className="px-8 py-4 bg-blue-500/30 text-white font-extrabold border border-white/20 rounded-2xl hover:bg-blue-500/40 transition-all active:scale-95 focus:ring-4 focus:ring-blue-500/50 outline-none">
              Optimize My Stack
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderOptimalStackMessage = () => {
    if (!isOptimized) return null;

    return (
      <section 
        className="mb-12 p-10 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center space-y-6"
        aria-labelledby="optimized-title"
      >
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center rounded-full mb-4 shadow-sm" aria-hidden="true">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 id="optimized-title" className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Your AI stack is already well optimized.
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Our audit shows that your current tool choices and plan selections are highly efficient for your specific use cases. No manufacturing fake savings here—just honest, data-driven transparency.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <LeadCaptureForm 
            savings={totalMonthlySavings}
            auditContext={{ 
              totalAnnualSavings, 
              results 
            }} 
          />
        </div>
      </section>
    );
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-1000">
      {/* HERO SECTION - Semantic Header */}
      <header className="text-center space-y-6 py-16 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" aria-hidden="true" />
        
        <p className="text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px]">
          Comprehensive AI Audit Results
        </p>
        
        {!isOptimized ? (
          <div className="space-y-4">
            <h1 className="text-zinc-900 dark:text-zinc-100 text-3xl font-medium tracking-tight">You could save up to</h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16">
              <div className="flex flex-col group">
                <span className="text-7xl md:text-9xl font-black text-blue-600 tracking-tighter transition-transform group-hover:scale-105 duration-500 cursor-default">
                  ${totalMonthlySavings.toLocaleString()}
                </span>
                <div className="flex items-center justify-center gap-2 text-green-500 font-black text-sm uppercase tracking-tighter" aria-label="Positive reduction trend">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span>Potential Reduction</span>
                </div>
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-2">Per Month</span>
              </div>
              <div className="h-px md:h-24 w-24 md:w-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-5xl md:text-7xl font-black text-zinc-800 dark:text-zinc-200 tracking-tighter">
                  ${totalAnnualSavings.toLocaleString()}
                </span>
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-2">Per Year</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10">
            <h1 className="text-7xl md:text-9xl font-black text-green-500 tracking-tighter mb-4 animate-in zoom-in duration-700 uppercase">Optimized</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-2xl font-medium leading-relaxed max-w-2xl mx-auto">Your current stack efficiency is at peak performance.</p>
          </div>
        )}
      </header>

      {/* STRATEGIC SECTIONS */}
      {renderCredexCTA()}
      {renderOptimalStackMessage()}

      {/* TOOL BREAKDOWN SECTION - Detailed Article List */}
      <section className="space-y-8" aria-labelledby="breakdown-title">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <h2 id="breakdown-title" className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-4 tracking-tight">
            Tool Breakdown
            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-200 dark:border-zinc-700 shadow-inner">
              {results.length} Tools Analyzed
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {results.map((result, idx) => {
            const hasHighSavings = result.savings.monthly > 100;
            const isToolOptimized = result.savings.monthly === 0;

            return (
              <article
                key={`${result.currentTool}-${idx}`}
                className="group p-10 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-500 ease-out flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-3xl font-black text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">
                        {result.currentTool}
                      </h3>
                      {hasHighSavings && (
                        <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-tighter ring-1 ring-red-200" aria-label="High impact savings potential">
                          High Impact
                        </span>
                      )}
                      {isToolOptimized && (
                        <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-tighter ring-1 ring-green-200" aria-label="Tool is already optimized">
                          Already Optimized
                        </span>
                      )}
                      {!isToolOptimized && !hasHighSavings && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter ring-1 ring-blue-200" aria-label="Optimization recommended">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                      Current: <span className="text-zinc-800 dark:text-zinc-100">{result.currentPlan}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      {result.confidenceScore}% Confidence
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-10">
                  <section className={`p-6 rounded-3xl border transition-all duration-300 ${
                    result.savings.monthly > 0 
                      ? "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20" 
                      : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800"
                  }`} aria-label="Monthly savings breakdown">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Monthly Savings</p>
                    <p className={`text-4xl font-black ${
                      result.savings.monthly > 0 ? "text-green-600 dark:text-green-400" : "text-zinc-400"
                    }`}>
                      {result.savings.monthly > 0 ? `+$${result.savings.monthly.toLocaleString()}` : "$0"}
                    </p>
                  </section>
                  <section className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800" aria-label="Annual savings breakdown">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Annual Savings</p>
                    <p className={`text-4xl font-black ${
                      result.savings.yearly > 0 ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-400"
                    }`}>
                      {result.savings.yearly > 0 ? `+$${result.savings.yearly.toLocaleString()}` : "$0"}
                    </p>
                  </section>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-6 bg-blue-50/30 dark:bg-blue-900/5 rounded-3xl border border-blue-100/50 dark:border-blue-900/20 shadow-sm group/rec transition-all hover:bg-blue-50/50">
                    <div className={`mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${
                      isToolOptimized ? "bg-green-500" : "bg-blue-500"
                    }`} aria-hidden="true" />
                    <div>
                      <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest block mb-2">Final Recommendation</span>
                      <p className="text-zinc-800 dark:text-zinc-200 font-bold text-lg leading-relaxed">
                        {result.finalRecommendation}
                      </p>
                    </div>
                  </div>
                  
                  {result.fitResult.reasoning.length > 0 && (
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl text-sm italic font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-8 border-zinc-200 dark:border-zinc-700 shadow-sm">
                      <span className="not-italic font-black text-zinc-400 uppercase text-[10px] tracking-widest block mb-3">Audit Reasoning</span>
                      "{result.fitResult.reasoning[0]}"
                    </div>
                  )}
                </div>
                
                <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <span>Audit Path:</span>
                    <span className="text-zinc-700 dark:text-zinc-100 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-inner">
                      {result.savings.monthly > 0 ? "Cost Efficiency" : "Strategic Alignment"}
                    </span>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline transition-all focus:ring-2 focus:ring-blue-500 outline-none rounded-lg p-1.5" aria-label={`View detailed report for ${result.currentTool}`}>
                    View Detail →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* FINAL ENGAGEMENT SECTION */}
      {!isOptimized && (
        <section 
          className="mt-16 p-12 bg-zinc-900 dark:bg-black rounded-[3rem] text-center space-y-8 shadow-2xl relative overflow-hidden border border-white/5"
          aria-labelledby="footer-cta-title"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-40 -mt-40 transition-transform group-hover:scale-110 duration-1000" aria-hidden="true" />
          <div className="space-y-3 relative z-10">
            <h3 id="footer-cta-title" className="text-3xl font-black text-white tracking-tight">Stay Optimized.</h3>
            <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed font-medium">
              The AI landscape changes weekly. We'll monitor your stack and alert you when better pricing or models become available.
            </p>
          </div>
          <div className="max-w-2xl mx-auto relative z-10">
            <LeadCaptureForm 
              savings={totalMonthlySavings}
              auditContext={{ 
                totalAnnualSavings, 
                results 
              }} 
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default Results;
