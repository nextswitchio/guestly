import React from "react";

type Txn = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: number;
};

function ArrowUpIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M17 13l-5 5m0 0l-5-5m5 5V6" />
    </svg>
  );
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TransactionItem({ txn }: { txn: Txn }) {
  const isCredit = txn.type === "credit";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 transition hover:bg-neutral-50">
      {/* Icon */}
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCredit
            ? "bg-success-50 text-success-600"
            : "bg-neutral-100 text-neutral-500"
          }`}
      >
        {isCredit ? <ArrowDownIcon /> : <ArrowUpIcon />}
      </span>

      {/* Description & date */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900">{txn.description}</p>
        <p className="text-xs text-neutral-400">{formatDate(txn.createdAt)}</p>
      </div>

      {/* Amount */}
      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${isCredit ? "text-success-600" : "text-neutral-900"
          }`}
      >
        {isCredit ? "+" : "-"}${txn.amount.toFixed(2)}
      </span>
    </div>
  );
}

