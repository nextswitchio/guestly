"use client";

import { useEffect, useState } from "react";
import { MessageSquareReply, RefreshCw, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Review = {
  id: string;
  rating: number;
  comment?: string;
  response?: string;
  responded_at?: string;
  created_at: string;
  event_title?: string;
  user_name?: string;
};

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/reviews");
      const data = await res.json();
      if (res.ok) setReviews(data.reviews || []);
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
      const res = await fetch(`/api/vendor/reviews/${reviewId}/response`, {
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
    return <div className="flex justify-center py-16"><RefreshCw className="h-8 w-8 animate-spin text-gray-300" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">Reviews</h1>
        <p className="mt-1 text-gray-500">See organizer feedback and respond from one place</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-dark">No reviews yet</h2>
          <p className="mt-1 text-sm text-gray-500">Reviews from organizers will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <h2 className="mt-2 font-semibold text-dark">{review.event_title || "Event review"}</h2>
                  <p className="text-xs text-gray-400">
                    {review.user_name || "Organizer"} • {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {review.comment && <p className="mt-4 text-sm leading-6 text-gray-600">{review.comment}</p>}

              {review.response ? (
                <div className="mt-4 rounded-xl border border-lime/20 bg-lime/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-dark">Your response</p>
                  <p className="mt-1 text-sm text-gray-700">{review.response}</p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={responses[review.id] || ""}
                    onChange={(event) => setResponses((current) => ({ ...current, [review.id]: event.target.value }))}
                    rows={3}
                    placeholder="Write a response"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-dark focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/30"
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
    </div>
  );
}
