"use client";
import React from "react";
import EventCard from "@/components/events/EventCard";
import CategoryFilter from "@/components/events/CategoryFilter";
import SearchBar from "@/components/events/SearchBar";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  city: string;
  image: string;
};

export default function ExplorePage() {
  const [items, setItems] = React.useState<ApiEvent[]>([]);
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  async function load(p = page, cat = category) {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    params.set("page", String(p));
    params.set("pageSize", "6");
    const res = await fetch(`/api/events?${params.toString()}`);
    const data = await res.json();
    if (res.ok) {
      setItems(data.data as ApiEvent[]);
      setPageCount(data.pageCount as number);
      setPage(p);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch() {
    load(1);
  }

  function onCategoryChange(cat: string) {
    setCategory(cat);
    load(1, cat);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
          Explore Events
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Find your next experience — filter by category or search by name
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter value={category} onChange={onCategoryChange} />
        <div className="w-full sm:max-w-sm">
          <SearchBar value={q} onChange={setQ} onSearch={onSearch} />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-neutral-200"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex justify-center py-12">
          <EmptyState
            title="No events found"
            description="Try adjusting your search or filters."
          />
        </div>
      ) : (
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
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={(p) => load(p)}
          />
        </div>
      )}
    </div>
  );
}
