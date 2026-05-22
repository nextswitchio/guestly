"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, Calendar, MapPin } from "lucide-react";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function invitationTimestamp(invitation: any): number {
  const raw = invitation.created_at ?? invitation.createdAt ?? invitation.invitedAt;
  const timestamp = typeof raw === "number" ? raw : new Date(raw).getTime();
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

export default function VendorInvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendors/invitations");
      if (res.ok) { const d = await res.json(); setInvitations(d.data || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const respond = async (invitationId: string, status: "accepted" | "declined") => {
    setResponding(invitationId);
    try {
      await fetch(`/api/vendors/invitations/${invitationId}/respond`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      load();
    } catch (e) { console.error(e); }
    finally { setResponding(null); }
  };

  const pending = invitations.filter((i: any) => i.status === "pending");
  const responded = invitations.filter((i: any) => i.status !== "pending");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">Event Invitations</h1>
        <p className="text-gray-500 mt-1">Manage your event invitations from organisers</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-dark mb-4">Pending Invitations ({pending.length})</h2>
        {pending.length === 0 ? (
          <Card className="p-8 text-center">
            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-dark mb-1">No pending invitations</h3>
            <p className="text-sm text-gray-500">Organisers can invite you to provide services for their events</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((inv: any) => (
              <Card key={inv.id} className="p-0 overflow-hidden flex flex-col">
                {inv.event?.image && (
                  <div className="h-40 overflow-hidden">
                    <img src={inv.event.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-dark">{inv.event?.title || "Event"}</h3>
                    <span className="shrink-0 rounded-full bg-lime/10 px-2.5 py-0.5 text-xs font-semibold text-dark">{inv.category}</span>
                  </div>
                  {inv.event && (
                    <div className="space-y-1.5 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(inv.event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{inv.event.venue}, {inv.event.city}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mb-4">Invited {timeAgo(invitationTimestamp(inv))}</p>
                  <div className="mt-auto flex gap-2">
                    <Button size="sm" className="flex-1" disabled={responding === inv.id} onClick={() => respond(inv.id, "accepted")}>
                      {responding === inv.id ? "..." : "Accept"}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" disabled={responding === inv.id} onClick={() => respond(inv.id, "declined")}>
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {responded.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-dark mb-4">Past Responses ({responded.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responded.map((inv: any) => {
              const ok = inv.status === "accepted";
              return (
                <Card key={inv.id} className="p-5 opacity-75">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${ok ? "bg-lime/10 text-dark" : "bg-red-50 text-red-600"}`}>
                      {ok ? "Accepted" : "Declined"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-dark mb-1">{inv.event?.title || "Event"}</h3>
                  {inv.event && (
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{new Date(inv.event.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{inv.event.city}</div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
