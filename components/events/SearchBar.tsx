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
  placeholder = "Search events, cities, categories…",
}: Props) {
  const [isFocused, setIsFocused] = React.useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onSearch?.();
  }

  return (
    <div className="relative flex w-full items-center">
      {/* Search icon */}
      <svg
        className={`pointer-events-none absolute left-4 h-4 w-4 transition-colors duration-[var(--duration-fast)] ${
          isFocused ? "text-primary-500" : "text-[var(--foreground-muted)]"
        }`}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`h-12 w-full rounded-2xl border bg-[var(--surface-card)] pl-11 pr-24 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] focus:outline-none ${
          isFocused
            ? "border-primary-300 shadow-[var(--shadow-focus)] scale-[1.02]"
            : "border-[var(--surface-border)] shadow-[var(--elevation-1)] hover:border-primary-200 hover:shadow-[var(--elevation-2)]"
        }`}
      />

      <button
        onClick={onSearch}
        className="absolute right-2 h-8 rounded-xl bg-primary-600 px-4 text-xs font-medium text-white transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-primary-700 hover:scale-105 active:scale-95 shadow-[var(--elevation-1)] hover:shadow-[var(--elevation-2)]"
      >
        Search
      </button>
    </div>
  );
}