"use client";
import React, { Suspense } from "react";
import SearchBar from "@/components/events/SearchBar";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import Icon from '@/components/ui/Icon';
import { useRouter, useSearchParams } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  city: string;
  image: string;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = React.useState("");
  const [city, setCity] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [items, setItems] = React.useState<ApiEvent[]>([]);
  const [searched, setSearched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const cities = ["", "Lagos", "Abuja", "Accra", "Nairobi"];
  const categories = ["", "Music", "Tech", "Art", "Food"];

  React.useEffect(() => {
    const initQ = searchParams.get("q") || "";
    const initCity = searchParams.get("city") || "";
    const initCategory = searchParams.get("category") || "";
    setQ(initQ);
    setCity(initCity);
    setCategory(initCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = React.useCallback(async () => {
    const hasQuery = q.trim().length > 0 || city || category;
    if (!hasQuery) {
      setItems([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    const res = await fetch(`/api/events?${params.toString()}`);
    const data = await res.json();
    if (res.ok) setItems(data.data as ApiEvent[]);
    setSearched(true);
    setLoading(false);
  }, [q, city, category]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    const qs = params.toString();
    const current = searchParams.toString();
    if (current !== qs) {
      router.replace(qs ? `/search?${qs}` : "/search");
    }
  }, [q, city, category, router, searchParams]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      void search();
    }, 350);
    return () => clearTimeout(t);
  }, [q, city, category, search]);

  return (
    <div className="flex min-h-screen flex-col public-light">
      <TopNav />
      <main className="flex-1">
        {/* Hero section */}
        <div className="bg-[#001c24] -mt-[200px] pt-[200px] font-aeonik">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-16 md:py-20 text-center">
              <div className="max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                  </span>
                  Search
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.06] tracking-tight text-white">
                  Search Events
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-white/60 max-w-xl mx-auto">
                  Find events by name, city or category
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mx-auto max-w-3xl">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <SearchBar value={q} onChange={setQ} onSearch={search} />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.currentTarget.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 transition-all hover:border-primary-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 sm:w-44"
                    >
                      <option value="">All Cities</option>
                      {cities.map((c) => c && <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.currentTarget.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 transition-all hover:border-primary-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 sm:w-52"
                    >
                      <option value="">All Categories</option>
                      {categories.map((c) => c && <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="mt-12 mx-auto max-w-3xl">
          {searched && (
            <div className="mb-4 text-sm text-slate-500">
              {items.length} result{items.length === 1 ? "" : "s"}
              {q ? <> · &ldquo;{q}&rdquo;</> : null}
              {city ? <> · {city}</> : null}
              {category ? <> · {category}</> : null}
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100 border border-slate-100" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((ev) => (
                <EventCard
                  key={ev.id}
                  id={ev.id}
                  title={ev.title}
                  date={ev.date}
                  category={ev.category}
                  city={ev.city}
                  image={ev.image}
                  description={ev.description}
                />
              ))}
            </div>
          ) : searched ? (
            <div className="flex justify-center py-12">
              <EmptyState
                icon="search"
                title="No events found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={{
                  label: "Clear filters",
                  onClick: () => {
                    setQ("");
                    setCity("");
                    setCategory("");
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Icon name="search" className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-slate-900">
                Start typing to search for events
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Search by name, city, or category
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchContent />
    </Suspense>
  );
}
