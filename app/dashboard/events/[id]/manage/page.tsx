"use client";
import React, { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Tabs from "@/components/ui/Tabs";
import Link from "next/link";
import dynamic from "next/dynamic";

const OverviewTab = dynamic(() => import("@/components/organiser/tabs/OverviewTab"), { ssr: false });
const TicketsTab = dynamic(() => import("@/components/organiser/tabs/TicketsTab"), { ssr: false });
const AttendeesTab = dynamic(() => import("@/components/organiser/tabs/AttendeesTab"), { ssr: false });
const CheckInTab = dynamic(() => import("@/components/organiser/tabs/CheckInTab"), { ssr: false });
const AnalyticsTab = dynamic(() => import("@/components/organiser/tabs/AnalyticsTab"), { ssr: false });
const MerchandiseTab = dynamic(() => import("@/components/organiser/tabs/MerchandiseTab"), { ssr: false });
const CommunityTab = dynamic(() => import("@/components/organiser/tabs/CommunityTab"), { ssr: false });

function TabLoading() {
  return (
    <div className="space-y-3 py-4">
      <div className="h-4 w-48 animate-pulse rounded-lg bg-neutral-100" />
      <div className="h-32 animate-pulse rounded-xl bg-neutral-100" />
      <div className="h-4 w-36 animate-pulse rounded-lg bg-neutral-100" />
    </div>
  );
}

export default function ManageEvent({ params }: { params: { id: string } }) {
  const tabs = [
    { id: "overview", label: "Overview", content: <Suspense fallback={<TabLoading />}><OverviewTab eventId={params.id} /></Suspense> },
    { id: "tickets", label: "Tickets", content: <Suspense fallback={<TabLoading />}><TicketsTab eventId={params.id} /></Suspense> },
    { id: "attendees", label: "Attendees", content: <Suspense fallback={<TabLoading />}><AttendeesTab /></Suspense> },
    { id: "checkin", label: "Check-in", content: <Suspense fallback={<TabLoading />}><CheckInTab /></Suspense> },
    { id: "analytics", label: "Analytics", content: <Suspense fallback={<TabLoading />}><AnalyticsTab eventId={params.id} /></Suspense> },
    { id: "merch", label: "Merchandise", content: <Suspense fallback={<TabLoading />}><MerchandiseTab eventId={params.id} /></Suspense> },
    { id: "community", label: "Community", content: <Suspense fallback={<TabLoading />}><CommunityTab /></Suspense> },
  ];

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/events"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:bg-neutral-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Event Control Center</h1>
            <p className="text-sm text-neutral-500">Manage every aspect of your event</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTabId="overview" />
      </div>
    </ProtectedRoute>
  );
}

