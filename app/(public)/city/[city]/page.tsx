import React from "react";
import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import { filterEvents, Event } from "@/lib/events";
import EmptyState from "@/components/ui/EmptyState";

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  const items = filterEvents({ city: cityName as Event["city"] }).data;

  return (
    <div className="container py-8">
      <div className="mb-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-600">Home</Link>
          <span>/</span>
          <span className="text-neutral-600">{cityName}</span>
        </nav>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Events in {cityName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {items.length} event{items.length !== 1 ? "s" : ""} happening in {cityName}
          </p>
        </div>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex justify-center py-12">
          <EmptyState
            title="No events yet"
            description={`There are no events listed in ${cityName} right now.`}
            actionText="Explore all events"
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
    </div>
  );
}
