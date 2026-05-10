import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact an Expert - RateAI",
};

export default function ContactPage() {
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
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Talk to an Expert</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
          <p className="text-xl font-medium leading-relaxed">
            Need help deciphering a complex enterprise agreement? Our procurement engineers can manually review your software contracts to find custom negotiation levers.
          </p>
          <div className="mt-12 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">Email our Engineering Team</h3>
            <p className="mb-6">We typically respond within 24 hours.</p>
            <a 
              href="mailto:expert@rateai.com" 
              className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/50 outline-none"
            >
              expert@rateai.com
            </a>
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
