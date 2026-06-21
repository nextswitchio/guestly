"use client";
import React from "react";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  isDark?: boolean;
};

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search events, cities, categories…",
  isDark = false,
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
          isDark
            ? isFocused 
              ? "text-lime" 
              : "text-[#6aacb4]"
            : isFocused 
            ? "text-primary-500" 
            : "text-[var(--foreground-muted)]"
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
        className={`h-12 w-full rounded-2xl border pl-11 pr-24 text-sm transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] focus:outline-none ${
          isDark
            ? `bg-[#001c24] border-[#1e6470] text-white placeholder:text-[#6aacb4] ${
                isFocused
                  ? "border-lime shadow-[0_0_0_3px_rgba(199,253,2,0.1)] scale-[1.02]"
                  : "shadow-sm hover:border-[#3d8993]"
              }`
            : `bg-[var(--surface-card)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] ${
                isFocused
                  ? "border-primary-300 shadow-[var(--shadow-focus)] scale-[1.02]"
                  : "border-[var(--surface-border)] shadow-[var(--elevation-1)] hover:border-primary-200 hover:shadow-[var(--elevation-2)]"
              }`
        }`}
      />

      <button
        onClick={onSearch}
        className={`absolute right-2 h-8 rounded-xl px-4 text-xs font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:scale-105 active:scale-95 shadow-sm ${
          isDark
            ? "bg-lime text-dark hover:bg-lime/90"
            : "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-[var(--elevation-2)]"
        }`}
      >
        Search
      </button>
    </div>
  );
}