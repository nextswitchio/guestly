"use client";

import { useEffect, useState } from "react";
import { MessageSquareReply, RefreshCw, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type EventReview = {
  id: string;
  rating: number;
  comment?: string;
  response?: string;
  created_at: string;
  event_title?: string;
  user_name?: string;
};

type VendorReview = {
  id: string;
  rating: number;
  comment?: string;
  response?: string;
  created_at: string;
  vendor_name?: string;
  event_title?: string;
};

export default function OrganizerReviewsPage() {
  const [eventReviews, setEventReviews] = useState<EventReview[]>([]);
  const [vendorReviews, setVendorReviews] = useState<VendorReview[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    setLoading(true);
    try {
      const [eventRes, vendorRes] = await Promise.all([
        fetch("/api/events/reviews"),
        fetch("/api/organizer/vendor-reviews"),
      ]);
      if (eventRes.ok) {
        const data = await eventRes.json();
        setEventReviews(data.reviews || []);
      }
      if (vendorRes.ok) {
        const data = await vendorRes.json();
        setVendorReviews(data.reviews || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  async function respond(reviewId: string) {
    const response = responses[reviewId]?.trim();
    if (!response) return;

    setSaving(reviewId);
    try {
      const res = await fetch(`/api/events/reviews/${reviewId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
      if (res.ok) {
        setResponses((current) => ({ ...current, [reviewId]: "" }));
        await loadReviews();
      }
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><RefreshCw className="h-8 w-8 animate-spin text-neutral-300" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Reviews</h1>
        <p className="mt-1 text-sm text-neutral-500">Respond to event feedback and track vendor reviews you have given</p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Event Reviews</h2>
          <p className="text-sm text-neutral-500">Feedback attendees left on your events</p>
        </div>

        {eventReviews.length === 0 ? (
          <Card className="p-10 text-center">
            <Star className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
            <p className="font-semibold text-neutral-900">No event reviews yet</p>
            <p className="mt-1 text-sm text-neutral-500">Attendee reviews will appear here.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {eventReviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-amber-400" : "text-neutral-200"}`} />
                      ))}
                    </div>
                    <h3 className="mt-2 font-semibold text-neutral-900">{review.event_title || "Event review"}</h3>
                    <p className="text-xs text-neutral-400">
                      {review.user_name || "Attendee"} • {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {review.comment && <p className="mt-4 text-sm leading-6 text-neutral-600">{review.comment}</p>}

                {review.response ? (
                  <div className="mt-4 rounded-xl border border-lime/20 bg-lime/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-900">Your response</p>
                    <p className="mt-1 text-sm text-neutral-700">{review.response}</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={responses[review.id] || ""}
                      onChange={(event) => setResponses((current) => ({ ...current, [review.id]: event.target.value }))}
                      rows={3}
                      placeholder="Write a response"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/30"
                    />
                    <Button onClick={() => respond(review.id)} disabled={!responses[review.id]?.trim() || saving === review.id}>
                      <MessageSquareReply className="mr-2 h-4 w-4" />
                      {saving === review.id ? "Saving..." : "Respond"}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Vendor Reviews Given</h2>
          <p className="text-sm text-neutral-500">Ratings you have given to vendors</p>
        </div>

        {vendorReviews.length === 0 ? (
          <Card className="p-8 text-center text-sm text-neutral-500">Vendor reviews you submit will appear here.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vendorReviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-amber-400" : "text-neutral-200"}`} />
                  ))}
                </div>
                <h3 className="mt-2 font-semibold text-neutral-900">{review.vendor_name || "Vendor"}</h3>
                <p className="text-xs text-neutral-400">{review.event_title || "Event"} • {new Date(review.created_at).toLocaleDateString()}</p>
                {review.comment && <p className="mt-3 text-sm leading-6 text-neutral-600">{review.comment}</p>}
                {review.response && (
                  <div className="mt-3 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600">
                    <span className="font-semibold text-neutral-900">Vendor response: </span>{review.response}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
