"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StreamEmbed from "./StreamEmbed";
import ChatPanel from "./ChatPanel";
import PollPanel from "./PollPanel";
import { Event } from "@/lib/events";
import Button from "@/components/ui/Button";

// ── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

// ── Sidebar tab type ─────────────────────────────────────────────────────────

type SideTab = "chat" | "polls";

// ── Component ────────────────────────────────────────────────────────────────

interface VirtualLobbyClientProps {
  event: Event;
}

export default function VirtualLobbyClient({ event }: VirtualLobbyClientProps) {
  const router = useRouter();
  const [user, setUser] = React.useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<SideTab>("chat");
  const [mobileSideOpen, setMobileSideOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const role = data.role;
          const randomId = Math.random().toString(36).substr(2, 9);
          setUser({
            id: randomId,
            name: role === "organiser" ? "Organiser" : `Guest-${randomId.slice(0, 4)}`,
          });
        } else {
          router.push("/login");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
          <p className="text-sm text-neutral-500">Joining lobby…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/events/${event.id}`}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="h-5 w-px bg-neutral-200" />

          <h1 className="max-w-xs truncate text-sm font-semibold text-neutral-900 sm:max-w-md sm:text-base">
            {event.title}
          </h1>

          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold tracking-wide text-red-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile chat toggle */}
          <button
            className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:bg-neutral-50 lg:hidden"
            onClick={() => setMobileSideOpen(!mobileSideOpen)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>

          <span className="hidden text-xs text-neutral-400 sm:block">
            {user.name}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/events/${event.id}`)}
            className="gap-1.5 text-xs"
          >
            <LogOutIcon />
            <span className="hidden sm:inline">Leave</span>
          </Button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Main: Stream + About ────────────────────────────────────────── */}
        <main className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-5xl space-y-5">
            <StreamEmbed title={event.title} />

            {/* About card */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold text-neutral-900">About this event</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{event.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-neutral-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <CalendarIcon />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <MapPinIcon />
                  <span>{event.city} · Virtual</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Side panel: Chat / Polls ────────────────────────────────────── */}
        {/* Desktop */}
        <aside className="hidden w-85 shrink-0 flex-col border-l border-neutral-200 bg-white lg:flex">
          {/* Tabs */}
          <div className="flex border-b border-neutral-100">
            {(["chat", "polls"] as SideTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 border-b-2 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${activeTab === tab
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-neutral-400 hover:text-neutral-600"
                  }`}
              >
                {tab === "chat" ? "Chat" : "Polls"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" ? (
              <ChatPanel eventId={event.id} userId={user.id} userName={user.name} />
            ) : (
              <PollPanel eventId={event.id} userId={user.id} />
            )}
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileSideOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setMobileSideOpen(false)}
            />
            <aside className="fixed inset-y-0 right-0 z-40 flex w-[85vw] max-w-sm flex-col bg-white shadow-2xl lg:hidden">
              {/* Tabs */}
              <div className="flex border-b border-neutral-100">
                {(["chat", "polls"] as SideTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 border-b-2 py-3 text-xs font-semibold uppercase tracking-wider transition ${activeTab === tab
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-neutral-400 hover:text-neutral-600"
                      }`}
                  >
                    {tab === "chat" ? "Chat" : "Polls"}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                {activeTab === "chat" ? (
                  <ChatPanel eventId={event.id} userId={user.id} userName={user.name} />
                ) : (
                  <PollPanel eventId={event.id} userId={user.id} />
                )}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
