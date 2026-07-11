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
    <div>
      {/* Hero */}
      <section className="bg-[#001c24] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(199,253,2,0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/10 text-lime text-xs font-semibold tracking-wide mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              MARKETPLACE
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Find the Perfect{" "}
              <span className="text-lime">Service Provider</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 mb-8 max-w-xl mx-auto leading-relaxed">
              Search for DJs, MCs, photographers, caterers, event planners, and influencers for your next event.
            </p>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for services, providers, or categories..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-lime/30 focus:border-lime/40 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-hover transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Categories */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900">Browse by Category</h2>
            <Link href="/marketplace/search" className="text-sm text-neutral-500 hover:text-dark font-medium transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/marketplace/search?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-sm font-medium text-neutral-700 group-hover:text-dark transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Providers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900">Featured Providers</h2>
            <Link href="/marketplace/search" className="text-sm text-neutral-500 hover:text-dark font-medium transition-colors">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-neutral-100 rounded-xl mb-4" />
                  <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/marketplace/${provider.id}`}
                  className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center overflow-hidden">
                    {provider.avatar ? (
                      <img src={provider.avatar} alt={provider.display_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-dark transition-colors truncate">
                      {provider.display_name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{provider.category}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-xs font-semibold text-neutral-900">{provider.rating?.toFixed(1)}</span>
                      <span className="text-[11px] text-neutral-400">({provider.review_count})</span>
                    </div>
                    {provider.location_city && (
                      <p className="text-[11px] text-neutral-400 mt-1.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {provider.location_city}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/60 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-neutral-900 font-semibold mb-1">No featured providers yet</p>
              <p className="text-sm text-neutral-400">Be the first to list your services!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
