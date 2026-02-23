"use client";
import React from "react";
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

export default function SearchPage() {
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
                <option value="">All cities</option>
                {cities.filter(Boolean).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
                className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 sm:col-span-2"
              >
                <option value="">All categories</option>
                {categories.filter(Boolean).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-neutral-200"
                />
              ))}
            </div>
          ) : searched && items.length === 0 ? (
            <div className="flex justify-center py-12">
              <EmptyState
                title="No results"
                description={`We couldn&apos;t find any events matching "${q}".`}
              />
            </div>
          ) : items.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-neutral-500">
                {items.length} result{items.length !== 1 ? "s" : ""} {q ? <>for &ldquo;{q}&rdquo;</> : null}
                {city ? <> · {city}</> : null}
                {category ? <> · {category}</> : null}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((e) => (
                  <EventCard
                    key={e.id}
                    id={e.id}
                    title={e.title}
                    description={e.description}
                    date={e.date}
                    city={e.city}
                    category={e.category}
                    image={e.image}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center py-12">
              <p className="text-sm text-neutral-400">
                Type a query above and press Search to get started.
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
