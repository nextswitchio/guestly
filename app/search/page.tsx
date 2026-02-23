"use client";
import React, { Suspense } from "react";
import SearchBar from "@/components/events/SearchBar";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
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
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <TopNav />
      <main className="container flex-1 py-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Search Events
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Find events by name, city or keyword
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <SearchBar value={q} onChange={setQ} onSearch={search} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <select
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                <option value="">All Cities</option>
                {cities.map((c) => c && <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                <option value="">All Categories</option>
                {categories.map((c) => c && <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-10">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-neutral-200" />
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
            <EmptyState
              title="No events found"
              description="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear filters"
              onAction={() => {
                setQ("");
                setCity("");
                setCategory("");
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl">🔍</div>
              <p className="mt-2 text-sm text-neutral-500">
                Start typing to search for events
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <SearchContent />
    </Suspense>
  );
}
