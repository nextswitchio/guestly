import React from "react";
import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { filterEvents } from "@/lib/events";

const cities = [
  { name: "Lagos", emoji: "🇳🇬", color: "from-primary-500 to-primary-700" },
  { name: "Abuja", emoji: "🇳🇬", color: "from-success-500 to-success-700" },
  { name: "Accra", emoji: "🇬🇭", color: "from-warning-500 to-warning-700" },
  { name: "Nairobi", emoji: "🇰🇪", color: "from-primary-400 to-primary-600" },
];

export default async function Home() {
  const featured = filterEvents({ page: 1, pageSize: 6 }).data;
  const cityCards = cities.map((c) => ({
    ...c,
    count: filterEvents({ city: c.name as any }).total,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <TopNav />

      <section className="bg-white">
        <div className="container py-12 sm:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-200">
                🎉 Events across Africa
              </span>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
                Find the moments that shape the culture
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-base">
                From Lagos tech meetups to Nairobi food carnivals, discover what&apos;s on,
                grab tickets in seconds, and save your favourites for later.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/explore"
                  className="inline-flex h-11 items-center rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
                >
                  Explore events
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  Create account
                </Link>
                <span className="text-xs text-neutral-400">
                  No spam. Just great events.
                </span>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-900">
                {featured[0]?.image && (
                  <img
                    src={featured[0].image}
                    alt=""
                    className="h-60 w-full object-cover opacity-60 sm:h-72"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 via-neutral-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary-600/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      Highlight
                    </span>
                    <span className="text-xs text-neutral-300">
                      {new Date(featured[0]?.date || "").toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {featured[0]?.city ? ` · ${featured[0].city}` : ""}
                    </span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                    {featured[0]?.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="line-clamp-2 max-w-[70%] text-xs leading-relaxed text-neutral-300">
                      {featured[0]?.description}
                    </p>
                    {featured[0]?.id && (
                      <Link
                        href={`/events/${featured[0].id}`}
                        className="inline-flex shrink-0 items-center rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm transition hover:bg-white"
                      >
                        View event
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container pb-14">
        <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div className="sm:col-span-2">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Provide services for events?
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Join Guestly as a vendor and get discovered by organisers.
            </p>
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            <a
              href="/vendor/register"
              className="inline-flex h-11 items-center rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Become a Vendor
            </a>
            <a
              href="/vendor/login"
              className="inline-flex h-11 items-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Vendor Sign In
            </a>
          </div>
        </div>
      </section>
      <section className="container py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Browse by City
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              See what&apos;s happening in your city
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cityCards.map((c) => (
            <Link
              key={c.name}
              href={`/city/${c.name}`}
              className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-[11px] text-neutral-500">
                {c.count} event{c.count !== 1 ? "s" : ""}
              </span>
              <span className="absolute right-3 top-3 hidden rounded-full bg-neutral-100 p-1 text-neutral-600 group-hover:inline-flex">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Events ────────────────────────── */}
      <section className="container pb-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Featured Events
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Handpicked experiences you won&apos;t want to miss
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden text-sm font-medium text-primary-600 hover:text-primary-700 sm:inline-flex"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e) => (
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

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/explore"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all events →
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section className="container pb-14">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-xl font-bold sm:text-2xl">
            Ready to host your own event?
          </h2>
          <p className="max-w-md text-sm text-primary-100">
            Create a free organiser account, set up your event page, and start
            selling tickets in minutes.
          </p>
          <Link
            href="/dashboard/events/new"
            className="mt-2 inline-flex h-11 items-center rounded-full bg-white px-8 text-sm font-semibold text-primary-700 shadow transition-colors hover:bg-primary-50"
          >
            Start Organising
          </Link>
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}
