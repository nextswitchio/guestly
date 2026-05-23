"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

type EventOption = {
  id: string;
  title: string;
  country: string;
  city: string;
  date: string;
  category: string;
};

type FeaturedRequest = {
  id: string;
  coverage_type: "city" | "country";
  country: string;
  city?: string | null;
  start_date: string;
  end_date: string;
  duration_hours: number;
  fee_per_hour: number;
  total_fee: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "expired";
  payment_status: "pending" | "charged" | "paid" | "waived";
  rejection_reason?: string | null;
  event?: { title: string } | null;
};

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function durationHours(start: string, end: string) {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / 3600000));
}

export default function FeaturedPlacementRequestPage() {
  const [events, setEvents] = React.useState<EventOption[]>([]);
  const [requests, setRequests] = React.useState<FeaturedRequest[]>([]);
  const [feePerHour, setFeePerHour] = React.useState(5000);
  const [currency, setCurrency] = React.useState("NGN");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [form, setForm] = React.useState({
    eventId: "",
    coverageType: "city" as "city" | "country",
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const selectedEvent = events.find((event) => event.id === form.eventId);
  const hours = durationHours(form.startDate, form.endDate);
  const totalFee = hours * feePerHour;

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [eventsRes, settingsRes, requestsRes] = await Promise.all([
        fetch("/api/events/my?pageSize=100", { cache: "no-store" }),
        fetch("/api/featured/settings", { cache: "no-store" }),
        fetch("/api/featured/requests", { cache: "no-store" }),
      ]);
      const [eventsData, settingsData, requestsData] = await Promise.all([
        eventsRes.json(),
        settingsRes.json(),
        requestsRes.json(),
      ]);
      const nextEvents = eventsData.events || eventsData.data || [];
      setEvents(nextEvents);
      setFeePerHour(Number(settingsData.fee_per_hour || 5000));
      setCurrency(settingsData.currency || "NGN");
      setRequests(requestsData.data || []);
      if (nextEvents.length && !form.eventId) {
        const first = nextEvents[0];
        setForm((prev) => ({
          ...prev,
          eventId: first.id,
          country: first.country || "",
          city: first.city || "",
        }));
      }
    } catch {
      setError("Unable to load featured placement details.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectEvent(eventId: string) {
    const event = events.find((item) => item.id === eventId);
    setForm({
      ...form,
      eventId,
      country: event?.country || "",
      city: event?.city || "",
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/featured/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: form.eventId,
          coverageType: form.coverageType,
          country: form.country,
          city: form.coverageType === "city" ? form.city : undefined,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          notes: form.notes || undefined,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error?.detail || data.error?.message || "Unable to submit request.");
      setSuccess("Featured placement request submitted for admin review.");
      setForm((prev) => ({ ...prev, notes: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  const statusBadge = (status: FeaturedRequest["status"]) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
      cancelled: "neutral",
      expired: "neutral",
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Featured Placement</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Request location-based featured exposure for your event. Your charge is calculated before submission.
          </p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

        {loading ? (
          <Card className="p-6 text-sm text-neutral-500">Loading featured placement options...</Card>
        ) : events.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="Create an event first"
            description="Featured placement requests are attached to your published events and coverage location."
            action={{ label: "Create Event", href: "/dashboard/events/new" }}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <Card className="p-6">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Event</label>
                  <select
                    value={form.eventId}
                    onChange={(event) => selectEvent(event.target.value)}
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                    required
                  >
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {event.city}, {event.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">Coverage</label>
                    <select
                      value={form.coverageType}
                      onChange={(event) => setForm({ ...form, coverageType: event.target.value as "city" | "country" })}
                      className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                    >
                      <option value="city">City</option>
                      <option value="country">Country</option>
                    </select>
                  </div>
                  <Input
                    label="Country"
                    value={form.country}
                    onChange={(event) => setForm({ ...form, country: event.target.value })}
                    required
                  />
                  {form.coverageType === "city" && (
                    <Input
                      label="City"
                      value={form.city}
                      onChange={(event) => setForm({ ...form, city: event.target.value })}
                      required
                    />
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Start"
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                    required
                  />
                  <Input
                    label="End"
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(event) => setForm({ ...form, notes: event.target.value })}
                    className="min-h-24 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                    placeholder="Optional placement goals or campaign context"
                  />
                </div>

                <Button type="submit" disabled={submitting || !form.eventId || hours <= 0}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Transparent Fee</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Rate</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(feePerHour, currency)} / hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Duration</span>
                  <span className="font-semibold text-neutral-900">{hours} hour{hours === 1 ? "" : "s"}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold text-neutral-900">Estimated charge</span>
                    <span className="font-bold text-neutral-900">{formatCurrency(totalFee, currency)}</span>
                  </div>
                </div>
              </div>
              {selectedEvent && (
                <div className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  <p className="font-medium text-neutral-900">{selectedEvent.title}</p>
                  <p>{selectedEvent.city}, {selectedEvent.country}</p>
                  <p>{selectedEvent.category}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">Request History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-500">Event</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-500">Coverage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-500">Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900">{request.event?.title || "Event"}</p>
                      {request.rejection_reason && <p className="text-xs text-red-600">{request.rejection_reason}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {request.coverage_type === "city" ? `${request.city}, ${request.country}` : request.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900">
                      {formatCurrency(request.total_fee, request.currency)}
                      <p className="text-xs text-neutral-500">{request.duration_hours} hours</p>
                    </td>
                    <td className="px-4 py-3">{statusBadge(request.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && <p className="py-8 text-center text-sm text-neutral-500">No featured placement requests yet.</p>}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
