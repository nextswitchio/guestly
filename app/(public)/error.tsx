"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-red-50 p-4 dark:bg-red-900/20">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="mb-6 max-w-md text-center text-slate-500 dark:text-slate-400">
          We couldn&apos;t load this page. Please try again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold text-slate-900 transition-all hover:bg-lime-hover"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
