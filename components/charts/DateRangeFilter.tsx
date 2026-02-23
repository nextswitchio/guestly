"use client";
import React from "react";

export type RangeKey = "7d" | "14d" | "30d" | "all";

interface DateRangeFilterProps {
  value: RangeKey;
  onChange: (range: RangeKey) => void;
}

const ranges: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "14d", label: "14 days" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All time" },
];

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
      {ranges.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${value === key
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
            }`}
        >
          {label}
        </button>
      ))}
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
