"use client";

import React, { useState, useEffect } from "react";
import AuditInputForm from "@/components/forms/AuditInputForm";
import Results from "@/components/Results";
import { generateAuditReport, AuditResult } from "@/lib/auditEngine";
import { savePublicAudit } from "@/lib/publicAudit";
import { generateAISummary } from "@/lib/aiSummary";
import Link from "next/link";

/**
 * --- RATEAI MAIN ORCHESTRATOR ---
 * This is the high-performance landing page that drives the audit flow.
 * State is managed here to transition between:
 * 1. HERO/FORM: Capturing tool stack data.
 * 2. LOADING: Orchestrating the engine and AI summary.
 * 3. RESULTS: Delivering the optimization dashboard.
 */
export default function Home() {
  const [auditResults, setAuditResults] = useState<AuditResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [shareableId, setShareableId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<{ summary: string, status: "Optimized" | "Needs Improvement" | "Critical" } | null>(null);

  // Handles the transition from form submission to results display
  const handleAuditSubmit = async (data: any) => {
    setIsCalculating(true);
    
    // Simulate engine latency for a premium 'analyzing' feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const results: AuditResult[] = [];
      for (const tool of data.tools) {
         const res = generateAuditReport({
           selectedTool: tool.toolName,
           selectedPlan: tool.selectedPlan,
           budget: data.budget,
           teamSize: tool.seats,
           requiredFeatures: data.requiredFeatures,
           usageLevel: tool.usageLevel,
         });
         if (typeof res !== 'string') {
           results.push(res);
         }
      }
      setAuditResults(results);
      
      // Generate AI Summary and Status
      const totalMonthlySavings = results.reduce((acc, r) => acc + r.savings.monthly, 0);
      const totalAnnualSavings = results.reduce((acc, r) => acc + r.savings.yearly, 0);
      
      const aiRes = await generateAISummary({
        totalMonthlySavings,
        totalAnnualSavings,
        results
      });
      setAiSummary({ summary: aiRes.summary, status: aiRes.status });

      // Persist to Supabase and generate a shareable public URL
      const id = await savePublicAudit({
        totalMonthlySavings,
        totalAnnualSavings,
        results,
      });
      if (id) setShareableId(id);
    } catch (error) {
      console.error("Audit Engine Failure:", error);
    } finally {
      setIsCalculating(false);
      // Smooth scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* NAVIGATION - Minimalist & Fixed */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setAuditResults(null)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">R</div>
            <span className="text-xl font-black tracking-tighter uppercase">RateAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-zinc-500">
            <Link href="/pricing-data" className="hover:text-blue-600 transition-colors">Pricing Data</Link>
            <Link href="/methodology" className="hover:text-blue-600 transition-colors">Methodology</Link>
            <Link href="/contact" className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-all active:scale-95 inline-block text-center">
              Talk to Expert
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      {!auditResults ? (
        <main className="pt-32 pb-24">
          {/* HERO SECTION */}
          <section className="max-w-4xl mx-auto px-6 text-center space-y-8 mb-20">
            <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Stop Overpaying for AI Infrastructure
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Audit Your AI Stack. <br />
              <span className="text-zinc-400">Save Thousands.</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
              The world's first AI-powered pricing auditor. We analyze your tools, seats, and usage to find hidden optimizations in seconds.
            </p>
          </section>

          {/* FORM SECTION */}
          <section className="max-w-4xl mx-auto px-4">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-blue-500/5 p-2 md:p-4">
              <AuditInputForm onSubmit={handleAuditSubmit} />
            </div>
          </section>

          {/* TRUST BAR */}
          <section className="mt-32 text-center space-y-8">
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Optimizing Stacks For Teams At</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale contrast-125">
              {['Stripe', 'OpenAI', 'Vercel', 'Notion', 'Linear'].map(company => (
                <span key={company} className="text-2xl font-black tracking-tighter">{company}</span>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="pt-24 pb-12">
          {/* RESULTS DASHBOARD */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* SHAREABLE LINK BANNER */}
            {shareableId && (
              <div className="max-w-6xl mx-auto px-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-xs font-black uppercase tracking-widest">Audit saved! Share your results:</p>
                  </div>
                  <a
                    href={`/audit/${shareableId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline truncate max-w-xs"
                  >
                    /audit/{shareableId}
                  </a>
                </div>
              </div>
            )}
            <Results 
              results={auditResults} 
              isLoading={isCalculating} 
              status={aiSummary?.status}
              aiSummaryNode={aiSummary ? (
                <div className="max-w-4xl mx-auto px-4 mb-8">
                  <div className="bg-blue-50 dark:bg-zinc-900 rounded-3xl p-6 border border-blue-100 dark:border-zinc-800">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">AI Summary</p>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">{aiSummary.summary}</p>
                  </div>
                </div>
              ) : null}
              isPublicPage={!!aiSummary}
            />
            
            {/* RESET BUTTON */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
              <button 
                onClick={() => setAuditResults(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest pl-4"
              >
                ← Run Another Audit
              </button>
            </div>
          </div>
        </main>
      )}

      {/* GLOBAL FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-zinc-900 font-black text-xs">R</div>
            <span className="text-sm font-black tracking-tighter uppercase">RateAI</span>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            &copy; 2026 RateAI | A Credex Initiative
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
            <a href="https://github.com/yuvakishorekoppula/rateai" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
