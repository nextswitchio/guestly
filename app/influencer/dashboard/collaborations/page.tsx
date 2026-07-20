"use client";
import React, { useState, useEffect } from "react";
import { Handshake, Check, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function InfluencerCollaborationsPage() {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/influencers/collaborations", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCollabs(d.collaborations || d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "accept" | "decline") => {
    await fetch(`/api/influencers/collaborations/${id}/${action}`, {
      method: "POST", credentials: "include",
    });
    setCollabs((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Collaborations</h1>
      {collabs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Handshake className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No collaborations yet</p>
          <p className="text-sm mt-1">Invitations from event organizers will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collabs.map((c) => (
            <div key={c.id} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{c.event_title || c.event?.title || "Event Collaboration"}</h3>
                <Badge variant={c.status === "pending" ? "warning" : c.status === "accepted" ? "success" : "error"}>
                  {c.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {c.organizer_name && `By ${c.organizer_name}`}
                {c.compensation && ` · ${c.compensation}`}
              </p>
              {c.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAction(c.id, "accept")}>
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction(c.id, "decline")}>
                    <X className="w-4 h-4 mr-1" /> Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
