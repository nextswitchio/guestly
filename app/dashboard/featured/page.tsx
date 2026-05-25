"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import CheckoutModal from "@/components/featured/CheckoutModal";
import { useToast } from "@/components/ui/ToastProvider";
import { formatCurrency } from "@/lib/utils";

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
  payment_reference?: string | null;
  rejection_reason?: string | null;
  event?: { title: string } | null;
};

function durationHours(start: string, end: string) {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / 3600000));
}

export default function FeaturedPlacementRequestPage() {
  const { addToast } = useToast();
  const [events, setEvents] = React.useState<EventOption[]>([]);
  const [requests, setRequests] = React.useState<FeaturedRequest[]>([]);
  const [feePerHour, setFeePerHour] = React.useState(5000);
  const [currency, setCurrency] = React.useState("NGN");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showCheckout, setShowCheckout] = React.useState(false);
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
      addToast("Unable to load featured placement details.", { type: "error" });
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

  async function doSubmit(paymentMethod?: string, mobileProvider?: string, phoneNumber?: string) {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const body: Record<string, unknown> = {
        eventId: form.eventId,
        coverageType: form.coverageType,
        country: form.country,
        city: form.coverageType === "city" ? form.city : undefined,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        notes: form.notes || undefined,
        paymentMethod: paymentMethod || "wallet",
      };
      if (paymentMethod === "mobile_money" && mobileProvider && phoneNumber) {
        body.mobileProvider = mobileProvider;
        body.phoneNumber = phoneNumber;
      }

      const res = await fetch("/api/featured/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const resData = await res.json();
      if (!resData.success) throw new Error(resData.error || "Unable to submit request.");
      const requestId = resData.data?.id;
      addToast("Featured request submitted successfully!", { type: "success" });
      if (resData.payment_url) {
        window.location.href = resData.payment_url;
        return;
      }
      window.location.href = `/dashboard/featured/success?id=${requestId}`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to submit request.";
      setError(msg);
      addToast(msg, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setShowCheckout(true);
  }

  async function handleCheckoutSubmit(method: string, mobileProvider?: string, phoneNumber?: string) {
    if (method === "wallet") {
      try {
        const balRes = await fetch("/api/wallet/balance");
        const { balance } = await balRes.json();
        if (balance == null || balance < totalFee) {
          const msg = "Insufficient wallet balance. Please add funds first.";
          setError(msg);
          addToast(msg, { type: "warning" });
          return;
        }
        await doSubmit("wallet");
      } catch {
        const msg = "Failed to verify wallet balance.";
        setError(msg);
        addToast(msg, { type: "error" });
      }
      return;
    }
    await doSubmit(method, mobileProvider, phoneNumber);
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

                <Button type="submit" loading={submitting} disabled={!form.eventId || hours <= 0}>
                  Pay & Submit
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

              <div className="mt-5 rounded-xl border border-lime/20 bg-lime/5 p-4">
                <h3 className="text-sm font-semibold text-neutral-900">Coverage includes</h3>
                <ul className="mt-3 space-y-2 text-xs text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                    Featured placement on event discovery pages (city/country level)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                    Promotional posts across TikTok, Instagram, X, Facebook, LinkedIn, Twitch, and YouTube
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                    Dedicated featured blog post on the Guestly platform
                  </li>
                </ul>
              </div>
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
                  <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-500">Receipt</th>
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
                    <td className="px-4 py-3 text-right">
                      {request.payment_reference ? (
                        <Link
                          href={`/dashboard/featured/receipt/${request.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Receipt
                        </Link>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && <p className="py-8 text-center text-sm text-neutral-500">No featured placement requests yet.</p>}
          </div>
        </Card>
      </div>

      <CheckoutModal
        open={showCheckout}
        onClose={() => { setShowCheckout(false); setError(""); }}
        fee={totalFee}
        hours={hours}
        currency={currency}
        rate={feePerHour}
        onSubmit={handleCheckoutSubmit}
        submitting={submitting}
      />
    </ProtectedRoute>
  );
}
