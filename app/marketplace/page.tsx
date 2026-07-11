"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { name: "DJ", icon: "🎵" },
  { name: "MC / Host", icon: "🎤" },
  { name: "Photography", icon: "📸" },
  { name: "Catering", icon: "🍽️" },
  { name: "Decoration", icon: "🎀" },
  { name: "Sound & Lighting", icon: "🔊" },
  { name: "Event Planning", icon: "📋" },
  { name: "Security", icon: "🛡️" },
  { name: "Logistics", icon: "🚛" },
  { name: "Influencer", icon: "⭐" },
];

interface Provider {
  id: string;
  display_name: string;
  avatar: string | null;
  category: string;
  rating: number;
  review_count: number;
  location_city: string | null;
  provider_type: string;
  hourly_rate: number | null;
  portfolio: string[];
}

export default function MarketplaceHome() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featured, setFeatured] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  async function fetchFeatured() {
    try {
      const res = await fetch("/api/marketplace/featured?limit=8");
      if (res.ok) {
        const data = await res.json();
        setFeatured(data.providers || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Find the Perfect Service Provider
        </h1>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Search for DJs, MCs, photographers, caterers, event planners, and influencers for your next event.
        </p>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for services, providers, or categories..."
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/marketplace/search?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-neutral-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Providers */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Featured Providers</h2>
          <Link href="/marketplace/search" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 animate-pulse">
                <div className="h-40 bg-neutral-100 rounded-lg mb-4" />
                <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((provider) => (
              <Link
                key={provider.id}
                href={`/marketplace/${provider.id}`}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  {provider.avatar ? (
                    <img src={provider.avatar} alt={provider.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {provider.display_name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">{provider.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm font-medium">{provider.rating?.toFixed(1)}</span>
                    <span className="text-xs text-neutral-400">({provider.review_count} reviews)</span>
                  </div>
                  {provider.location_city && (
                    <p className="text-xs text-neutral-400 mt-2">📍 {provider.location_city}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
            <p className="text-neutral-500">No featured providers yet. Be the first to list!</p>
          </div>
        )}
      </div>
    </div>
  );
}
