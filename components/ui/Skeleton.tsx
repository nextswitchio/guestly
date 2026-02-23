"use client";

import React from "react";

/* ──────────────────────────────────────────────
 *  Base shimmer animation (Tailwind utility)
 *  Relies on globals.css or inline keyframes below.
 * ────────────────────────────────────────────── */

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent";

/* ── SkeletonBox ─────────────────────────────── */
interface SkeletonBoxProps {
  className?: string;
}

export function SkeletonBox({ className = "" }: SkeletonBoxProps) {
  return <div className={`rounded-lg bg-neutral-200 ${shimmer} ${className}`} />;
}

/* ── SkeletonText ────────────────────────────── */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3.5 rounded bg-neutral-200 ${shimmer}`}
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

/* ── SkeletonAvatar ──────────────────────────── */
interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export function SkeletonAvatar({ size = 40, className = "" }: SkeletonAvatarProps) {
  return (
    <div
      className={`shrink-0 rounded-full bg-neutral-200 ${shimmer} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/* ── SkeletonCard ────────────────────────────── */
interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`rounded-xl border border-neutral-100 bg-white p-0 shadow-sm ${className}`}>
      {/* Image placeholder */}
      <SkeletonBox className="h-40 w-full rounded-b-none rounded-t-xl" />
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <SkeletonBox className="h-4 w-3/4" />
        {/* Subtitle */}
        <SkeletonBox className="h-3 w-1/2" />
        {/* Meta row */}
        <div className="mt-1 flex items-center gap-3">
          <SkeletonBox className="h-3 w-16" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/* ── SkeletonTable ───────────────────────────── */
interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, cols = 4, className = "" }: SkeletonTableProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-neutral-100 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 border-b border-neutral-100 bg-neutral-50 p-3">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-neutral-50 p-3 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBox key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── SkeletonPage (full-page placeholder) ───── */
export function SkeletonPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <SkeletonBox className="h-8 w-48" />
      <SkeletonText lines={2} className="max-w-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
