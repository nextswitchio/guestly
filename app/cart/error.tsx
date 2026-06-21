"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cart error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="mb-4 rounded-full bg-red-50 p-4 dark:bg-red-900/20">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
        Cart Error
      </h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">
        Could not load cart.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold text-slate-900 transition-all hover:bg-lime-hover"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
