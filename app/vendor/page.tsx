"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

type Profile = {
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
} | null;

type Invitation = {
  eventId: string;
  vendorUserId: string;
  profileId: string;
  category: string;
  status: "invited" | "accepted" | "declined";
  invitedAt: number;
};

export default function VendorDashboard() {
  const [profile, setProfile] = React.useState<Profile>(null);
  const [invites, setInvites] = React.useState<Invitation[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    try {
      const p = await fetch("/api/vendor/profile").then((r) => r.json());
      if (p?.ok) setProfile(p.profile as Profile);
      const i = await fetch("/api/vendor/invitations").then((r) => r.json());
      if (i?.ok) setInvites(i.data as Invitation[]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { void load(); }, []);

  async function setStatus(eventId: string, status: Invitation["status"]) {
    await fetch("/api/vendor/invitations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, status }),
    });
    await load();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Vendor Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your profile and event invitations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-900">Profile</div>
              {!profile ? (
                <div className="mt-1 text-xs text-neutral-500">No profile yet. Complete onboarding to get discovered.</div>
              ) : (
                <>
                  <div className="mt-1 text-sm text-neutral-900">{profile.name}</div>
                  <div className="text-xs text-neutral-500">{profile.category} · {profile.contactEmail}</div>
                  <p className="mt-2 text-sm text-neutral-700">{profile.description}</p>
                </>
              )}
            </div>
            <Link href="/vendor/onboarding">
              <Button size="sm" variant="outline">{profile ? "Edit Profile" : "Complete Onboarding"}</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold text-neutral-900">Status</div>
          <div className="mt-1 text-xs text-neutral-600">
            {profile ? <>Profile <span className="font-medium">{profile.status}</span></> : "Onboarding incomplete"}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-neutral-900">Event Invitations</div>
          <Button size="sm" variant="outline" onClick={() => void load()}>Refresh</Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-xl bg-neutral-100" />
            <div className="h-16 animate-pulse rounded-xl bg-neutral-100" />
          </div>
        ) : invites.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center text-xs text-neutral-500">
            No invitations yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((i) => (
              <div key={`${i.eventId}-${i.invitedAt}`} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3">
                <div>
                  <div className="text-sm font-medium text-neutral-900">Event {i.eventId}</div>
                  <div className="text-xs text-neutral-500">{i.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${i.status === "invited" ? "bg-warning-50 text-warning-700" : i.status === "accepted" ? "bg-success-50 text-success-700" : "bg-red-50 text-red-700"}`}>{i.status}</span>
                  {i.status !== "accepted" && <Button size="sm" onClick={() => setStatus(i.eventId, "accepted")}>Accept</Button>}
                  {i.status !== "declined" && <Button size="sm" variant="outline" onClick={() => setStatus(i.eventId, "declined")}>Decline</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
