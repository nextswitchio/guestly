"use client";
import React from "react";
import { useEffect } from "react";
import EventCard from "@/components/events/EventCard";
import CategoryFilter from "@/components/events/CategoryFilter";
import CommunityFilter from "@/components/events/CommunityFilter";
import SearchBar from "@/components/events/SearchBar";
import TimeFilter, { TimeFilterValue } from "@/components/events/TimeFilter";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import PullToRefresh from "@/components/ui/PullToRefresh";
import Icon from "@/components/ui/Icon";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/hooks/useScrollAnimation";

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  city: string;
  image: string;
};

type SortOption = "date" | "popularity" | "price" | "name";

export default function ExplorePage() {
  // Set page title for accessibility
  useEffect(() => {
    document.title = "Explore Events — Guestly";
  }, []);

  const [items, setItems] = React.useState<ApiEvent[]>([]);
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [community, setCommunity] = React.useState<string | undefined>(undefined);
  const [communityType, setCommunityType] = React.useState<string | undefined>(undefined);
  const [timeFilter, setTimeFilter] = React.useState<TimeFilterValue>("all");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [sortBy, setSortBy] = React.useState<SortOption>("date");
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: filtersRef, isVisible: filtersVisible } = useScrollAnimation();
  const { ref: gridRef, visibleItems } = useStaggeredAnimation(items?.length || 0);

  async function load(p = page, cat = category, sort = sortBy, query = q, comm = community, commType = communityType, timeF = timeFilter, start = startDate, end = endDate) {
    setIsTransitioning(true);
    setLoading(true);
    
    // Add a small delay for smooth transition effect
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (cat) params.set("category", cat);
    if (comm) params.set("community", comm);
    if (commType) params.set("communityType", commType);
    if (start) params.set("startDate", start.toISOString());
    if (end) params.set("endDate", end.toISOString());
    if (sort !== "date") params.set("sort", sort);
    params.set("page", String(p));
    params.set("pageSize", "9"); // Increased for better grid layout
    
    try {
      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      // Handle both data.data and data.events response formats
      const events = (data?.data ?? data?.events ?? []) as ApiEvent[];
      setItems(events);
      setPageCount(data?.pageCount ?? data?.page_count ?? 1);
      setPage(p);
    } catch (error) {
      console.error("Failed to load events:", error);
      setItems([]);
    } finally {
      setLoading(false);
      setIsTransitioning(false);
    }
  }

  // Pull to refresh handler
  const handleRefresh = React.useCallback(async () => {
    await load(1, category, sortBy, q, community, communityType, timeFilter, startDate, endDate);
  }, [category, sortBy, q, community, communityType, timeFilter, startDate, endDate]);

  React.useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch() {
    load(1, category, sortBy, q, community, communityType, timeFilter, startDate, endDate);
  }

  function onCategoryChange(cat: string) {
    setCategory(cat);
    load(1, cat, sortBy, q, community, communityType, timeFilter, startDate, endDate);
  }

  function onCommunityChange(comm: string | undefined) {
    setCommunity(comm);
    load(1, category, sortBy, q, comm, communityType, timeFilter, startDate, endDate);
  }

  function onCommunityTypeChange(commType: string | undefined) {
    setCommunityType(commType);
    load(1, category, sortBy, q, community, commType, timeFilter, startDate, endDate);
  }

  function onTimeFilterChange(value: TimeFilterValue, start?: Date | null, end?: Date | null) {
    setTimeFilter(value);
    setStartDate(start || null);
    setEndDate(end || null);
    load(1, category, sortBy, q, community, communityType, value, start || null, end || null);
  }

  function onSortChange(sort: SortOption) {
    setSortBy(sort);
    load(page, category, sort, q, community, communityType, timeFilter, startDate, endDate);
  }

  function onClearFilters() {
    setQ("");
    setCategory("");
    setCommunity(undefined);
    setCommunityType(undefined);
    setTimeFilter("all");
    setStartDate(null);
    setEndDate(null);
    setSortBy("date");
    load(1, "", "date", "", undefined, undefined, "all", null, null);
  }

  const hasActiveFilters = q || category || community || communityType || timeFilter !== "all" || sortBy !== "date";

  return (
    <PullToRefresh 
      onRefresh={handleRefresh}
      disabled={loading}
      className="min-h-screen"
    >
      {/* Hero section - full width dark background that extends under nav */}
      <div className="bg-[#001c24] -mt-[200px] pt-[200px] font-aeonik">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-20">
            <div
              ref={headerRef}
              className={`text-center transition-all duration-700 ease-[var(--ease-out)] ${
                headerVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                  </span>
                  Explore
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.06] tracking-tight text-white">
                  Discover Amazing Events
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-white/60 max-w-xl mx-auto">
                  Find your next unforgettable experience — from intimate gatherings to grand celebrations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and events section */}
      <div className="bg-[#f8fafc]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Filters section with animation */}
        <div
          ref={filtersRef}
          className={`transition-all duration-700 delay-200 ease-[var(--ease-out)] ${
            filtersVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6">
            {/* Top bar with results count, filters toggle, and sort */}
            <div className="bg-white rounded-2xl border border-slate-100 px-6 py-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results count */}
                <div className={`transition-all duration-[var(--duration-normal)] ${
                  isTransitioning ? "opacity-50" : "opacity-100"
                }`}>
                  {!loading && (
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-slate-900">
                        {items.length === 0 
                          ? "No events found" 
                          : `${items.length} event${items.length === 1 ? "" : "s"}`
                        }
                      </p>
                      {hasActiveFilters && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {q && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime/10 text-dark rounded-lg text-xs font-medium">
                              <Icon name="search" size={12} />
                              <span>"{q.length > 20 ? q.slice(0, 20) + "..." : q}"</span>
                            </span>
                          )}
                          {category && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime/10 text-dark rounded-lg text-xs font-medium">
                              <Icon name="target" size={12} />
                              <span>{category}</span>
                            </span>
                          )}
                          {timeFilter !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime/10 text-dark rounded-lg text-xs font-medium">
                              <Icon name="calendar" size={12} />
                              <span>
                                {timeFilter === "custom" 
                                  ? "Custom dates"
                                  : timeFilter.replace("-", " ")
                                }
                              </span>
                            </span>
                          )}
                          {(community || communityType) && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime/10 text-dark rounded-lg text-xs font-medium">
                              <Icon name="users" size={12} />
                              <span>{community || communityType}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Controls: Filters toggle + Sort dropdown + Loading */}
                <div className="flex items-center gap-3">
                  {(loading || isTransitioning) && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-lime border-t-lime" />
                      <span className="hidden sm:inline">Loading...</span>
                    </div>
                  )}
                  
                  {/* Filters toggle button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      showFilters
                        ? "bg-lime text-dark"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {hasActiveFilters && (
                      <span className="h-5 w-5 rounded-full bg-dark/10 text-[10px] font-bold flex items-center justify-center">
                        {[category, community, communityType, timeFilter !== "all" ? "1" : null].filter(Boolean).length}
                      </span>
                    )}
                  </button>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm text-slate-500 hidden sm:inline">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => onSortChange(e.target.value as SortOption)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 transition-all duration-[var(--duration-fast)] hover:border-lime focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 cursor-pointer"
                    >
                      <option value="date">Date</option>
                      <option value="popularity">Popularity</option>
                      <option value="price">Price</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible filter panel */}
            {showFilters && (
              <div className="bg-[#001c24] rounded-2xl p-6 animate-[slideDown_var(--duration-normal)_var(--ease-out)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Filters</h2>
                  <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                      <button
                        onClick={() => { onClearFilters(); }}
                        className="text-sm font-medium text-lime hover:text-lime/80 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-lg hover:bg-[#0a3038] transition-colors"
                    >
                      <svg className="w-5 h-5 text-[#6aacb4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Search */}
                  <div className="rounded-2xl shadow-sm">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Icon name="search" size={16} className="text-[#6aacb4]" />
                      <span>Search</span>
                    </h3>
                    <SearchBar value={q} onChange={setQ} onSearch={onSearch} isDark={true} />
                  </div>

                  {/* Category */}
                  <div className="rounded-2xl shadow-sm">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Icon name="target" size={16} className="text-[#6aacb4]" />
                      <span>Category</span>
                      {category && (
                        <span className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-lime text-dark text-xs font-bold">
                          1
                        </span>
                      )}
                    </h3>
                    <CategoryFilter value={category} onChange={onCategoryChange} isDark={true} />
                  </div>

                  {/* Time filter */}
                  <div className="rounded-2xl shadow-sm">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Icon name="calendar" size={16} className="text-[#6aacb4]" />
                      <span>When</span>
                      {timeFilter !== "all" && (
                        <span className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-lime text-dark text-xs font-bold">
                          1
                        </span>
                      )}
                    </h3>
                    <TimeFilter
                      value={timeFilter}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={onTimeFilterChange}
                      isDark={true}
                    />
                  </div>

                  {/* Community filter */}
                  <div className="rounded-2xl shadow-sm">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Icon name="users" size={16} className="text-[#6aacb4]" />
                      <span>Community</span>
                      {(community || communityType) && (
                        <span className="ml-auto h-5 w-5 flex items-center justify-center rounded-full bg-lime text-dark text-xs font-bold">
                          {[community, communityType].filter(Boolean).length}
                        </span>
                      )}
                    </h3>
                    <CommunityFilter
                      selectedCommunity={community}
                      selectedCommunityType={communityType}
                      onCommunityChange={onCommunityChange}
                      onCommunityTypeChange={onCommunityTypeChange}
                      isDark={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Events grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl bg-slate-100 border border-slate-100 shadow-sm"
                    style={{
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex justify-center py-12">
                <EmptyState
                  icon="search"
                  title={
                    q 
                      ? `No events found for "${q}"` 
                      : category 
                      ? `No ${category.toLowerCase()} events found`
                      : "No events available"
                  }
                  description="Try adjusting your search or filters to find events."
                  action={hasActiveFilters ? {
                    label: "Clear filters",
                    onClick: onClearFilters
                  } : {
                    label: "Browse all events",
                    href: "/"
                  }}
                />
              </div>
            ) : (
              <div
                ref={gridRef}
className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
              >
                {items.map((event, index) => (
                  <div
                    key={event.id}
                    className={`transition-all duration-700 ease-[var(--ease-out)] ${
                      visibleItems[index]
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-8 scale-95"
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <EventCard
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      date={event.date}
                      city={event.city}
                      category={event.category}
                      image={event.image}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && !loading && (
              <div className="flex justify-center pt-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-sm">
                  <Pagination
                    page={page}
                    pageCount={pageCount}
                    onPageChange={(p) => load(p, category, sortBy, q, community, communityType, timeFilter, startDate, endDate)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </PullToRefresh>
  );
}