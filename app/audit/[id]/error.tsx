"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Audit Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-red-200 dark:border-red-900/30 text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-200 dark:border-red-900/50">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">Audit Unavailable</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium leading-relaxed">
          We encountered an error retrieving this report. The link may be broken, or our servers are temporarily busy analyzing massive datasets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg focus:ring-4 outline-none focus:ring-zinc-500/20"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-extrabold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:ring-4 outline-none focus:ring-zinc-500/20"
          >
            Run New Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
