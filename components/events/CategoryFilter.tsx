"use client";
import React from "react";

const categories = [
  { value: "", label: "All" },
  { value: "Music", label: "🎵 Music" },
  { value: "Tech", label: "💻 Tech" },
  { value: "Art", label: "🎨 Art" },
  { value: "Food", label: "🍔 Food" },
];

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function CategoryFilter({ value = "", onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const active = value === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange?.(cat.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${active
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

