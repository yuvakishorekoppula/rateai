import { notFound } from "next/navigation";
import { getPublicAudit } from "@/lib/publicAudit";
import Results from "@/components/Results";
import CopyLinkButton from "@/components/CopyLinkButton";
import type { Metadata } from "next";

/**
 * --- DYNAMIC ROUTE PARAMS ---
 */
interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * --- DYNAMIC SEO METADATA ---
 * Generates page-specific metadata for rich social sharing previews
 * on Slack, Twitter, LinkedIn, etc.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getPublicAudit(id);

  if (!audit) {
    return {
      title: "Audit Not Found | RateAI",
      description: "This audit report is unavailable or has been made private.",
    };
  }

  const savings = audit.total_monthly_savings;

  return {
    title: `AI Stack Audit — $${savings.toLocaleString()}/mo savings found | RateAI`,
    description: `This AI pricing audit identified $${savings.toLocaleString()}/month in potential savings across ${audit.results.length} tools.`,
    openGraph: {
      title: `AI Stack Audit: Save $${savings.toLocaleString()}/month`,
      description: `RateAI identified ${audit.results.length} AI tools that can be optimized for maximum cost efficiency.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Save $${savings.toLocaleString()}/month on your AI stack`,
      description: `RateAI detected overspending across ${audit.results.length} tools. See the full breakdown.`,
    },
  };
}

/**
 * --- PUBLIC AUDIT PAGE ---
 * Server component that fetches and renders a shareable audit result.
 * Handles 404, shared audit banner, and the full results dashboard.
 */
export default async function PublicAuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await getPublicAudit(id);

  // Trigger Next.js 404 if audit is missing or private
  if (!audit) {
    notFound();
  }

  const formattedDate = new Date(audit.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* FIXED NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">
              R
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">RateAI</span>
          </a>
          <a
            href="/"
            className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
          >
            Audit My Stack →
          </a>
        </div>
      </nav>

      {/* SHARED AUDIT BANNER */}
      <div className="pt-28 pb-2 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                Shared Audit Report
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                Generated on {formattedDate} · ID:{" "}
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{id}</span>
              </p>
            </div>
          </div>
          {/* Client component for clipboard interaction */}
          <CopyLinkButton id={id} />
        </div>
      </div>

      {/* RESULTS DASHBOARD */}
      <Results results={audit.results} isLoading={false} />

      {/* VIRAL ACQUISITION FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-20 text-center space-y-6 bg-zinc-50 dark:bg-black">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Run Your Own Audit
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto leading-relaxed">
          See how much you could save on your AI tool stack — in under 60 seconds.
        </p>
        <a
          href="/"
          className="inline-block px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20 uppercase text-xs tracking-widest"
        >
          Audit My Stack →
        </a>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pt-8">
          &copy; 2026 RateAI | A Credex Initiative
        </p>
      </footer>
    </div>
  );
}
