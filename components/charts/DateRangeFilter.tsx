"use client";
import React from "react";
import { useTimeRangeTransition } from "@/lib/hooks/useDataTransition";

export type RangeKey = "7d" | "14d" | "30d" | "all";

interface DateRangeFilterProps {
  value: RangeKey;
  onChange: (range: RangeKey) => void | Promise<void>;
  loading?: boolean;
}

const ranges: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "14d", label: "14 days" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All time" },
];

export default function DateRangeFilter({ value, onChange, loading = false }: DateRangeFilterProps) {
  const { isChanging, pendingRange, changeTimeRange } = useTimeRangeTransition();

  const handleRangeChange = (range: RangeKey) => {
    changeTimeRange(range as string, onChange as (range: string) => void | Promise<void>);
  };

  const isDisabled = loading || isChanging;

  return (
    <div className="relative">
      <div className={`flex gap-1 rounded-xl bg-[var(--surface-hover)] p-1.5 border border-[var(--surface-border)] transition-all duration-200 ${
        isDisabled ? 'opacity-70' : 'opacity-100'
      }`}>
        {ranges.map(({ key, label }) => {
          const isActive = value === key;
          const isPending = pendingRange === key;
          
          return (
            <button
              key={key}
              onClick={() => handleRangeChange(key)}
              disabled={isDisabled}
              className={`relative rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-primary-500)] text-white shadow-md shadow-[var(--color-primary-500)]/20 scale-105"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-card)]"
              } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                isPending ? 'animate-pulse' : ''
              }`}
            >
              {/* Loading indicator for pending range */}
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                </div>
              )}
              
              {/* Label with fade effect during transition */}
              <span className={`transition-opacity duration-150 ${isPending ? 'opacity-0' : 'opacity-100'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Global loading indicator */}
      {(loading || isChanging) && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] bg-[var(--surface-card)] px-3 py-1 rounded-full border border-[var(--surface-border)] shadow-sm">
            <div className="h-3 w-3 animate-spin rounded-full border border-[var(--color-primary-500)] border-t-transparent" />
            <span>Updating data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Convert a RangeKey into ISO from/to strings */
export function rangeToParams(range: RangeKey): { from?: string; to?: string } {
  if (range === "all") return {};
  const days = parseInt(range);
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}
