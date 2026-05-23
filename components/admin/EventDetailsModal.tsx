"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";

interface EventDetailsModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailsModal({ eventId, isOpen, onClose }: EventDetailsModalProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId || !isOpen) return;
    setLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setEvent(data.data ?? data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [eventId, isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose} title="Event Details" size="lg">
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-lime border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !event ? (
        <div className="text-center py-16 text-slate-500">Event not found</div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Event Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-500">Title:</span>
                    <div className="font-medium">{event.title}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Category:</span>
                    <Badge variant="primary">{event.category ?? event.category_name}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Date:</span>
                    <div>{new Date(event.date ?? event.start_date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Type:</span>
                    <div>{event.eventType ?? event.event_type ?? "Physical"}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Location</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-500">City:</span>
                    <div>{event.city}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Country:</span>
                    <div>{event.country}</div>
                  </div>
                  {event.venue && (
                    <div>
                      <span className="text-sm text-slate-500">Venue:</span>
                      <div>{event.venue}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {event.description && (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Description</h3>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <p className="text-slate-900 whitespace-pre-wrap">{event.description}</p>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Link href={`/events/${slugify(event.title)}`} target="_blank">
              <Button variant="primary">View Event Page</Button>
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
