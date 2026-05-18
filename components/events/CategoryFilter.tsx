"use client";
import { Briefcase, HeartPulse, Monitor, Music, Palette, Star, Trophy, UtensilsCrossed } from 'lucide-react';
import React from "react";

const categories = [
  { value: "", label: "All", icon: <Star className="h-4 w-4" /> },
  { value: "Music", label: "Music", icon: <Music className="h-4 w-4" /> },
  { value: "Tech", label: "Tech", icon: <Monitor className="h-4 w-4" /> },
  { value: "Art", label: "Art", icon: <Palette className="h-4 w-4" /> },
  { value: "Food", label: "Food", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { value: "Sports", label: "Sports", icon: <Trophy className="h-4 w-4" /> },
  { value: "Business", label: "Business", icon: <Briefcase className="h-4 w-4" /> },
  { value: "Health", label: "Health", icon: <HeartPulse className="h-4 w-4" /> },
];

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  isDark?: boolean;
};

export default function CategoryFilter({ value = "", onChange, isDark = false }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const active = value === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange?.(cat.value)}
            className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] ${
              isDark
                ? active
                  ? "bg-lime text-dark shadow-md scale-105"
                  : "bg-[#1e6470] text-[#d4e8eb] border border-[#3d8993] hover:bg-[#3d8993] hover:text-white hover:scale-105 hover:shadow-sm"
                : active
                ? "bg-primary-600 text-white shadow-[var(--elevation-2)] scale-105"
                : "bg-[var(--surface-card)] text-[var(--foreground)] border border-[var(--surface-border)] hover:bg-[var(--surface-hover)] hover:border-primary-200 hover:scale-105 hover:shadow-[var(--elevation-1)]"
            }`}
            style={{
              transform: active ? "scale(1.05)" : undefined,
            }}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            <span>{cat.label}</span>
            
            {/* Active indicator */}
            {active && !isDark && (
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 opacity-20 blur-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}

