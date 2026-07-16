"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Provider {
  id: string;
  display_name: string;
  avatar: string | null;
  category: string;
  rating: number;
  review_count: number;
  location_city: string | null;
  location_country: string | null;
  provider_type: string;
  hourly_rate: number | null;
  min_budget: number | null;
  max_budget: number | null;
  services_offered: string[];
  availability_status: string;
  is_verified: boolean;
  is_featured: boolean;
  distance_km?: number;
}

const PROVIDER_TYPES = [
  { value: "", label: "All" },
  { value: "vendor", label: "Vendors" },
  { value: "influencer", label: "Influencers" },
  { value: "organizer", label: "Organizers" },
];

interface CityOption {
  city: string;
  count: number;
}

export default function MarketplaceSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "rating");
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [nearMe, setNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetch("/api/marketplace/cities")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CityOption[]) => setCities(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  function handleNearMe() {
    if (nearMe) {
      setNearMe(false);
      setUserLocation(null);
      setSortBy("rating");
      setPage(1);
      return;
    }
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
        setCityFilter("");
        setSortBy("distance");
        setPage(1);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      }
    );
  }

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (typeFilter) params.set("type", typeFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (cityFilter) params.set("city", cityFilter);
    if (nearMe && userLocation) {
      params.set("lat", userLocation.lat.toString());
      params.set("lng", userLocation.lng.toString());
    }
    params.set("sort_by", sortBy);
    params.set("page", page.toString());
    params.set("page_size", "20");

    try {
      const res = await fetch(`/api/marketplace/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setTotal(data.total || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [query, typeFilter, categoryFilter, cityFilter, sortBy, page, nearMe, userLocation]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProviders();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Provider Type Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {PROVIDER_TYPES.map((pt) => {
          const isActive = typeFilter === pt.value;
          return (
            <button
              key={pt.value}
              onClick={() => { setTypeFilter(pt.value); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-dark text-white shadow-sm"
                  : "bg-white text-neutral-600 border border-neutral-200/60 hover:border-neutral-300 hover:text-neutral-900"
              }`}
            >
              {pt.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search providers, services, categories..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-dark text-white rounded-xl font-medium text-sm hover:bg-[#0d2730] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-sm text-neutral-900">Filters</h3>
              <button
                onClick={() => { setQuery(""); setTypeFilter(""); setCategoryFilter(""); setCityFilter(""); setSortBy("rating"); setNearMe(false); setPage(1); }}
                className="text-[11px] text-neutral-400 hover:text-dark transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Type Filter */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Provider Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
              >
                <option value="">All Types</option>
                <option value="vendor">Vendors</option>
                <option value="influencer">Influencers</option>
                <option value="organizer">Organizers</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Category</label>
              <input
                type="text"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="e.g. DJ, Photography"
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
              />
            </div>

            {/* City Filter */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">City</label>
              <select
                value={cityFilter}
                onChange={(e) => { setCityFilter(e.target.value); setNearMe(false); setPage(1); }}
                disabled={nearMe}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all disabled:opacity-50"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c.city} value={c.city}>{c.city} ({c.count})</option>
                ))}
              </select>
            </div>

            {/* Near Me */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Location</label>
              <button
                onClick={handleNearMe}
                disabled={locationLoading}
                className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                  nearMe
                    ? "bg-dark text-white border-dark"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-lime hover:text-dark"
                } ${locationLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {locationLoading ? "Locating..." : nearMe ? "Near Me (Active)" : "Near Me"}
              </button>
            </div>

            {/* Sort */}
            <div className="mb-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value;
                  setSortBy(val);
                  if (val === "distance" && !userLocation) {
                    handleNearMe();
                  }
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest</option>
                <option value="distance">Nearest</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-neutral-900">{total}</span>{" "}
              {typeFilter ? PROVIDER_TYPES.find(t => t.value === typeFilter)?.label.toLowerCase() || "providers" : "providers"} found
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-neutral-100 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-100 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-neutral-100 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/marketplace/${provider.id}`}
                  className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200/60">
                      {provider.avatar ? (
                        <img src={provider.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-dark transition-colors truncate">
                          {provider.display_name}
                        </h3>
                        {provider.is_verified && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-semibold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Verified
                          </span>
                        )}
                        {provider.is_featured && (
                          <span className="text-amber-500 text-xs" title="Featured">★</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full capitalize">
                          {provider.provider_type}
                        </span>
                        <span className="text-xs text-neutral-500">{provider.category}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-medium text-neutral-900 flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          {provider.rating?.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-neutral-400">({provider.review_count})</span>
                        {provider.location_city && (
                          <span className="text-[11px] text-neutral-400 flex items-center gap-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {provider.location_city}
                          </span>
                        )}
                        {provider.distance_km != null && (
                          <span className="text-[11px] text-neutral-400">
                            {provider.distance_km < 1 ? `${Math.round(provider.distance_km * 1000)}m` : `${provider.distance_km.toFixed(1)}km`}
                          </span>
                        )}
                      </div>
                      {provider.services_offered?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.services_offered.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                          {provider.services_offered.length > 3 && (
                            <span className="text-[11px] text-neutral-400">+{provider.services_offered.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/60 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-neutral-900 font-semibold mb-1">No providers found</p>
              <p className="text-sm text-neutral-400">Try adjusting your filters or search query.</p>
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-neutral-500">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={providers.length < 20}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
