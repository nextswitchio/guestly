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

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (typeFilter) params.set("type", typeFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (cityFilter) params.set("city", cityFilter);
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
  }, [query, typeFilter, categoryFilter, cityFilter, sortBy, page]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProviders();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search providers..."
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

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
            <h3 className="font-semibold text-neutral-900 mb-4">Filters</h3>

            {/* Type Filter */}
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Provider Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                <option value="vendor">Vendors</option>
                <option value="influencer">Influencers</option>
                <option value="organizer">Organizers</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Category</label>
              <input
                type="text"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="e.g. DJ, Photography"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              />
            </div>

            {/* City Filter */}
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-700 mb-2 block">City</label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="e.g. Lagos, Nairobi"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              />
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button
              onClick={() => { setQuery(""); setTypeFilter(""); setCategoryFilter(""); setCityFilter(""); setSortBy("rating"); setPage(1); }}
              className="w-full text-sm text-neutral-500 hover:text-neutral-700"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500">{total} providers found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full" />
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
                  className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {provider.avatar ? (
                        <img src={provider.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                          {provider.display_name}
                        </h3>
                        {provider.is_verified && (
                          <span className="text-blue-500 text-xs" title="Verified">✓</span>
                        )}
                        {provider.is_featured && (
                          <span className="text-yellow-500 text-xs" title="Featured">★</span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">{provider.category}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm">★ {provider.rating?.toFixed(1)}</span>
                        <span className="text-xs text-neutral-400">({provider.review_count})</span>
                        {provider.location_city && (
                          <span className="text-xs text-neutral-400">📍 {provider.location_city}</span>
                        )}
                      </div>
                      {provider.services_offered?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.services_offered.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                          {provider.services_offered.length > 3 && (
                            <span className="text-xs text-neutral-400">+{provider.services_offered.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
              <p className="text-neutral-500 mb-2">No providers found matching your criteria.</p>
              <p className="text-sm text-neutral-400">Try adjusting your filters or search query.</p>
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-neutral-600">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={providers.length < 20}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-sm disabled:opacity-50"
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
