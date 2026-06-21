"use client";
import { Calendar, Globe, HandHelping, MapPin, Monitor, Music, Theater, Trophy, UtensilsCrossed } from 'lucide-react';
import React from "react";

interface CategoryDistributionProps {
  categories: Array<{ category: string; count: number }>;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  cityBranding?: {
    primary: string;
    accent: string;
  };
}

// Category icons and colors
function getCategoryIcon(category: string) {
  switch (category) {
    case "Music": return <Music className="h-6 w-6" />;
    case "Entertainment": return <Theater className="h-6 w-6" />;
    case "Art": return <Monitor className="h-6 w-6" />;
    case "Cultural": return <Globe className="h-6 w-6" />;
    case "Faith": return <HandHelping className="h-6 w-6" />;
    case "Food": return <UtensilsCrossed className="h-6 w-6" />;
    case "Sports": return <Trophy className="h-6 w-6" />;
    case "Tech": return <Monitor className="h-6 w-6" />;
    default: return <MapPin className="h-6 w-6" />;
  }
}

const categoryConfig: Record<string, { color: string; bgColor: string }> = {
  Tech: { color: "text-primary-600", bgColor: "bg-primary-50" },
  Music: { color: "text-purple-600", bgColor: "bg-purple-50" },
  Entertainment: { color: "text-pink-600", bgColor: "bg-pink-50" },
  Art: { color: "text-orange-600", bgColor: "bg-orange-50" },
  Cultural: { color: "text-amber-600", bgColor: "bg-amber-50" },
  Faith: { color: "text-indigo-600", bgColor: "bg-indigo-50" },
  Food: { color: "text-red-600", bgColor: "bg-red-50" },
  Sports: { color: "text-green-600", bgColor: "bg-green-50" },
};

export default function CategoryDistribution({
  categories,
  selectedCategory,
  onCategorySelect,
  cityBranding,
}: CategoryDistributionProps) {
  const totalEvents = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-neutral-900">Event Categories</h2>
        <p className="text-sm text-neutral-600">
          Explore events by category • {totalEvents} total events
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {/* All Events Card */}
        <button
          onClick={() => onCategorySelect(null)}
          className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
            selectedCategory === null
              ? `border-primary-500 bg-primary-50 shadow-md`
              : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-2xl"><Calendar className="h-4 w-4 inline-block" /></span>
            {selectedCategory === null && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="mb-1 text-sm font-semibold text-neutral-900">All Events</div>
          <div className="text-2xl font-bold text-neutral-900">{totalEvents}</div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-full bg-gradient-to-r from-primary-500 to-primary-600"></div>
          </div>
        </button>

        {/* Category Cards */}
        {categories.map((cat) => {
          const config = categoryConfig[cat.category] || {
            color: "text-neutral-600",
            bgColor: "bg-neutral-50",
          };
          const percentage = Math.round((cat.count / totalEvents) * 100);

          return (
            <button
              key={cat.category}
              onClick={() => onCategorySelect(cat.category)}
              className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                selectedCategory === cat.category
                  ? `border-primary-500 ${config.bgColor} shadow-md`
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xl">{getCategoryIcon(cat.category)}</span>
                {selectedCategory === cat.category && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mb-1 text-sm font-semibold text-neutral-900">
                {cat.category}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-neutral-900">{cat.count}</div>
                <div className="text-xs text-neutral-500">{percentage}%</div>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className={`h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2">
          <span className="text-sm text-primary-700">
            Showing <strong>{selectedCategory}</strong> events
          </span>
          <button
            onClick={() => onCategorySelect(null)}
            className="ml-auto text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
