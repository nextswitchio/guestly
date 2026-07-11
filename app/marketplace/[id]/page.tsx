"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Provider {
  id: string;
  user_id: string;
  display_name: string;
  avatar: string | null;
  bio: string | null;
  category: string;
  subcategories: string[];
  location_city: string | null;
  location_country: string | null;
  rating: number;
  review_count: number;
  completed_jobs: number;
  hourly_rate: number | null;
  min_budget: number | null;
  max_budget: number | null;
  pricing_model: string | null;
  portfolio: string[];
  services_offered: string[];
  availability_status: string;
  is_verified: boolean;
  phone_masked: string | null;
  social_links: Record<string, string>;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reviewer_name: string | null;
  reviewer_avatar: string | null;
  event_title: string | null;
  created_at: string;
}

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const [provRes, revRes] = await Promise.all([
        fetch(`/api/marketplace/providers/${id}`),
        fetch(`/api/marketplace/providers/${id}/reviews`),
      ]);
      if (provRes.ok) setProvider(await provRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleContact() {
    setContacting(true);
    try {
      const res = await fetch("/api/marketplace/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: provider?.user_id }),
      });
      if (res.ok) {
        const conv = await res.json();
        router.push(`/marketplace/messages/${conv.id}`);
      }
    } catch {
      // silent
    } finally {
      setContacting(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/marketplace/providers/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText || undefined }),
      });
      if (res.ok) {
        setReviewText("");
        setReviewRating(5);
        fetchData();
      }
    } catch {
      // silent
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-100 rounded w-1/3" />
          <div className="h-64 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Provider not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
            {provider.avatar ? (
              <img src={provider.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-neutral-900">{provider.display_name}</h1>
              {provider.is_verified && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Verified</span>
              )}
            </div>
            <p className="text-neutral-500 mb-2">{provider.category}</p>
            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
              <span>★ {provider.rating?.toFixed(1)} ({provider.review_count} reviews)</span>
              <span>{provider.completed_jobs} completed jobs</span>
              {provider.location_city && <span>📍 {provider.location_city}, {provider.location_country}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${provider.availability_status === "available" ? "bg-green-100 text-green-700" : provider.availability_status === "busy" ? "bg-yellow-100 text-yellow-700" : "bg-neutral-100 text-neutral-500"}`}>
                {provider.availability_status === "available" ? "Available" : provider.availability_status === "busy" ? "Busy" : "Unavailable"}
              </span>
              {provider.hourly_rate && (
                <span className="text-sm font-medium text-neutral-700">From ${provider.hourly_rate}/hr</span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={handleContact}
              disabled={contacting || provider.availability_status === "unavailable"}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {contacting ? "Starting Chat..." : "Contact"}
            </button>
          </div>
        </div>
      </div>

      {/* Bio & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-3">About</h2>
          <p className="text-neutral-600 text-sm leading-relaxed">{provider.bio || "No bio provided."}</p>
          {provider.services_offered?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Services</h3>
              <div className="flex flex-wrap gap-2">
                {provider.services_offered.map((s, i) => (
                  <span key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-3">Details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-400">Category</dt>
              <dd className="text-neutral-700">{provider.category}</dd>
            </div>
            {provider.pricing_model && (
              <div>
                <dt className="text-neutral-400">Pricing Model</dt>
                <dd className="text-neutral-700 capitalize">{provider.pricing_model}</dd>
              </div>
            )}
            {provider.min_budget && (
              <div>
                <dt className="text-neutral-400">Budget Range</dt>
                <dd className="text-neutral-700">${provider.min_budget} - ${provider.max_budget || "Negotiable"}</dd>
              </div>
            )}
            {provider.phone_masked && (
              <div>
                <dt className="text-neutral-400">Phone</dt>
                <dd className="text-neutral-700">{provider.phone_masked}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Portfolio */}
      {provider.portfolio?.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {provider.portfolio.map((url, i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-semibold text-neutral-900 mb-4">Reviews</h2>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className={`text-xl ${star <= reviewRating ? "text-yellow-500" : "text-neutral-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-100 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm">
                    {review.reviewer_name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{review.reviewer_name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xs">{"★".repeat(review.rating)}</span>
                      <span className="text-xs text-neutral-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-neutral-600 ml-11">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 text-center py-4">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
