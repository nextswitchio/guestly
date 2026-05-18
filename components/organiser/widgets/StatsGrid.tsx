"use client";
import React from "react";
import Card from "@/components/ui/Card";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  up?: boolean | null;
  icon: React.ReactNode;
  bg: string;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} padding="md" className="flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start justify-between">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color} transition-transform duration-300 hover:scale-110`}>
              {s.icon}
            </span>
            {s.up !== null && s.up !== undefined && (
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-success-600" : "text-danger-600"}`}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
                {s.change}
              </span>
            )}
            {(s.up === null || s.up === undefined) && s.change && (
              <span className="text-xs text-[var(--foreground-muted)]">{s.change}</span>
            )}
          </div>
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-[var(--foreground)]">{s.value}</p>
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{s.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
