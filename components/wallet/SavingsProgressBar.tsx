import React from "react";

function TargetIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default function SavingsProgressBar({ goal, progress }: { goal: number; progress: number }) {
  const pct = goal > 0 ? Math.min(100, Math.round((progress / goal) * 100)) : 0;
  const remaining = Math.max(0, goal - progress);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <TargetIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Event Savings</p>
            <p className="text-xs text-neutral-400">Goal: ${goal.toFixed(2)}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-primary-600">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-3 rounded-full bg-linear-to-r from-primary-500 to-primary-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          Saved <span className="font-semibold text-neutral-900">${progress.toFixed(2)}</span>
        </span>
        {remaining > 0 ? (
          <span className="text-neutral-500">
            <span className="font-semibold text-neutral-900">${remaining.toFixed(2)}</span> to go
          </span>
        ) : (
          <span className="font-semibold text-success-600">Goal reached!</span>
        )}
      </div>
    </div>
  );
}

