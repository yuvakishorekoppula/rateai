import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - RateAI",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col">
      <nav aria-label="Main Navigation" className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" aria-label="RateAI Home" className="flex items-center gap-2 group cursor-pointer transition-transform active:scale-95 focus:ring-4 focus:ring-blue-500/30 rounded-lg outline-none">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-md group-hover:shadow-blue-500/50 transition-all">
              R
            </div>
            <span className="text-xl font-black tracking-tighter uppercase group-hover:text-blue-600 transition-colors">
              RateAI
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500">
            <Link 
              href="/" 
              className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-all active:scale-95 shadow-lg focus:ring-4 focus:ring-zinc-500/30 outline-none"
            >
              Run Audit
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-40 pb-24 px-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
          <p className="font-medium">Last updated: May 2026</p>
          <p className="mt-6">
            By using the RateAI platform, you agree to these terms. RateAI provides estimated savings and 
            optimizations based on publicly available and aggregated pricing data. 
          </p>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-8 mb-4">1. Information Accuracy</h2>
          <p>
            While we strive for extreme accuracy, software pricing changes rapidly. RateAI's results 
            should be used as directional guidance for procurement conversations, not guaranteed quotes.
          </p>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-8 mb-4">2. Liability</h2>
          <p>
            RateAI is provided "as is". We are not responsible for any financial losses or contract 
            disputes arising from your use of our audit recommendations.
          </p>
        </div>
      </main>

      <footer role="contentinfo" className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-white dark:bg-black mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">
            &copy; {new Date().getFullYear()} RateAI | A Credex Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}
