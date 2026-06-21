"use client";
import { Briefcase, HeartPulse, Monitor, Music, Palette, Star, Trophy, UtensilsCrossed } from 'lucide-react';
import React from "react";
import { DEFAULT_PLATFORM_CATALOG, PlatformCategory, normalizeCatalog } from '@/lib/platformCatalog';

const iconMap: Record<string, React.ReactNode> = {
  music: <Music className="h-4 w-4" />,
  tech: <Monitor className="h-4 w-4" />,
  art: <Palette className="h-4 w-4" />,
  arts: <Palette className="h-4 w-4" />,
  food: <UtensilsCrossed className="h-4 w-4" />,
  sports: <Trophy className="h-4 w-4" />,
  business: <Briefcase className="h-4 w-4" />,
  health: <HeartPulse className="h-4 w-4" />,
};

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  isDark?: boolean;
};

export default function CategoryFilter({ value = "", onChange, isDark = false }: Props) {
  const [platformCategories, setPlatformCategories] = React.useState<PlatformCategory[]>(DEFAULT_PLATFORM_CATALOG.eventCategories);

  React.useEffect(() => {
    fetch('/api/platform/catalog')
      .then(res => res.json())
      .then(data => setPlatformCategories(normalizeCatalog(data).eventCategories))
      .catch(() => setPlatformCategories(DEFAULT_PLATFORM_CATALOG.eventCategories));
  }, []);

  const categories = [
    { value: "", label: "All", icon: <Star className="h-4 w-4" /> },
    ...platformCategories.filter(category => category.isActive).map(category => ({
      value: category.name,
      label: category.name,
      icon: iconMap[category.slug] || <Briefcase className="h-4 w-4" />,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const active = value === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange?.(cat.value)}
            className={`group relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] ${
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
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 opacity-20 blur-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}
