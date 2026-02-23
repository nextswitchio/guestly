"use client";
import React from "react";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search events, cities, categories\u2026",
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onSearch?.();
  }

  return (
    <div className="relative flex w-full items-center">
      {/* Search icon */}
      <svg
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-neutral-200 bg-white pl-10 pr-24 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400"
      />

      <button
        onClick={onSearch}
        className="absolute right-1.5 h-8 rounded-full bg-primary-600 px-5 text-xs font-medium text-white transition-colors hover:bg-primary-700 active:scale-[.97]"
      >
        Search
      </button>
    </div>
  );
}

