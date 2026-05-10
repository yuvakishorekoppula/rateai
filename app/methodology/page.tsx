import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology - RateAI",
};

export default function MethodologyPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full mb-6 text-purple-600 dark:text-purple-400">
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">Algorithm</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Methodology</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            How does RateAI evaluate your stack? We utilize a multi-layered evaluation framework that calculates ROI based on seats, feature requirements, and real-time competitor pricing models.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <h3 className="font-bold mb-2">1. Feature Matching</h3>
              <p className="text-sm text-zinc-500">We align your required features with the exact tier that provides them, preventing over-provisioning.</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <h3 className="font-bold mb-2">2. Competitor Benchmarking</h3>
              <p className="text-sm text-zinc-500">We analyze equivalent platforms to calculate opportunity cost and alternate vendor savings.</p>
            </div>
          </div>
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
