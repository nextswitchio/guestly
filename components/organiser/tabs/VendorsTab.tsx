"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Vendor = {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  portfolio: string[];
  rateCard: string;
  contactEmail: string;
  contactPhone: string;
  status: "pending" | "approved" | "rejected";
};

type Invite = {
  vendorUserId: string;
  profileId: string;
  category: string;
  status: "invited" | "accepted" | "declined";
  invitedAt: number;
};

export default function VendorsTab({ eventId }: { eventId: string }) {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [invites, setInvites] = React.useState<Invite[]>([]);
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function loadVendors() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    const res = await fetch(`/api/vendors?${params.toString()}`);
    const data = await res.json();
    if (res.ok) setVendors(data.data as Vendor[]);
  }
  async function loadInvites() {
    const res = await fetch(`/api/events/${eventId}/vendors`);
    const data = await res.json();
    if (res.ok) setInvites(data.data as Invite[]);
  }

  React.useEffect(() => {
    void loadVendors();
    void loadInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => void loadVendors(), 300);
    return () => clearTimeout(t);
  }, [q, category]);

  async function invite(vendorUserId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorUserId }),
      });
      if (res.ok) {
        await loadInvites();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <Input
                placeholder="Search vendors by name or description"
                value={q}
                onChange={(e) => setQ(e.currentTarget.value)}
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.currentTarget.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 sm:w-60"
            >
              <option value="">All categories</option>
              {["Security", "Sound", "Catering", "Decoration", "Logistics", "Photography"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {vendors.map((v) => {
            const already = invites.find((i) => i.vendorUserId === v.userId);
            return (
              <Card key={v.id}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-700">
                    {v.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">{v.name}</div>
                        <div className="text-xs text-neutral-500">{v.category}</div>
                      </div>
                      <Button
                        disabled={!!already || loading}
                        onClick={() => invite(v.userId)}
                        size="sm"
                      >
                        {already ? already.status === "invited" ? "Invited" : already.status : "Invite"}
                      </Button>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{v.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
                      {v.portfolio.slice(0, 2).map((p, i) => (
                        <a key={i} href={p} target="_blank" className="underline hover:text-neutral-700">
                          Portfolio {i + 1}
                        </a>
                      ))}
                      <a href={v.rateCard} target="_blank" className="underline hover:text-neutral-700">
                        Rate card
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {vendors.length === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
              No vendors match your filters.
            </div>
          )}
        </div>
      </div>

      <div>
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Invited Vendors</h3>
          <div className="flex flex-col gap-3">
            {invites.length === 0 && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center text-xs text-neutral-500">
                You haven’t invited any vendors yet.
              </div>
            )}
            {invites.map((i) => {
              const v = vendors.find((v) => v.userId === i.vendorUserId);
              return (
                <div key={`${i.vendorUserId}-${i.profileId}`} className="flex items-start justify-between rounded-lg border border-neutral-200 bg-white p-3">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{v?.name || i.vendorUserId}</div>
                    <div className="text-xs text-neutral-500">{i.category}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${i.status === "invited" ? "bg-warning-50 text-warning-700" : i.status === "accepted" ? "bg-success-50 text-success-700" : "bg-red-50 text-red-700"}`}>
                    {i.status}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

