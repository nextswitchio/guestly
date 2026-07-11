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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-100 rounded-xl w-1/3" />
          <div className="h-64 bg-neutral-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <p className="text-neutral-900 font-semibold mb-1">Provider not found</p>
        <p className="text-sm text-neutral-400">This provider may have been removed.</p>
      </div>
    );
  }

  const availabilityColor = provider.availability_status === "available"
    ? "bg-green-50 text-green-700"
    : provider.availability_status === "busy"
    ? "bg-amber-50 text-amber-700"
    : "bg-neutral-100 text-neutral-500";

  const availabilityDot = provider.availability_status === "available"
    ? "bg-green-500"
    : provider.availability_status === "busy"
    ? "bg-amber-500"
    : "bg-neutral-400";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-neutral-200/60">
            {provider.avatar ? (
              <img src={provider.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-neutral-900">{provider.display_name}</h1>
              {provider.is_verified && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mb-3">{provider.category}</p>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600 mb-3">
              <span className="flex items-center gap-1">
                <span className="text-amber-500">★</span>
                <span className="font-medium text-neutral-900">{provider.rating?.toFixed(1)}</span>
                <span className="text-neutral-400">({provider.review_count} reviews)</span>
              </span>
              <span className="text-neutral-300">|</span>
              <span>{provider.completed_jobs} completed jobs</span>
              {provider.location_city && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {provider.location_city}{provider.location_country ? `, ${provider.location_country}` : ""}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${availabilityColor}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${availabilityDot}`} />
                {provider.availability_status === "available" ? "Available" : provider.availability_status === "busy" ? "Busy" : "Unavailable"}
              </span>
              {provider.hourly_rate && (
                <span className="text-sm font-semibold text-dark">From ₦{provider.hourly_rate.toLocaleString()}/hr</span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={handleContact}
              disabled={contacting || provider.availability_status === "unavailable"}
              className="px-6 py-3 bg-lime text-dark rounded-xl font-semibold text-sm hover:bg-lime-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {contacting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  Starting Chat...
                </span>
              ) : "Contact"}
            </button>
          </div>
        </div>
      </div>

      {/* Bio & Services + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6">
          <h2 className="text-sm font-bold text-neutral-900 mb-3 uppercase tracking-wider">About</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">{provider.bio || "No bio provided."}</p>
          {provider.services_offered?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-neutral-900 mb-2 uppercase tracking-wider">Services</h3>
              <div className="flex flex-wrap gap-2">
                {provider.services_offered.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-dark/5 text-dark px-3 py-1.5 rounded-lg">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6">
          <h2 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-neutral-400 text-xs font-medium mb-0.5">Category</dt>
              <dd className="text-neutral-900 font-medium">{provider.category}</dd>
            </div>
            {provider.pricing_model && (
              <div>
                <dt className="text-neutral-400 text-xs font-medium mb-0.5">Pricing Model</dt>
                <dd className="text-neutral-900 font-medium capitalize">{provider.pricing_model}</dd>
              </div>
            )}
            {provider.min_budget && (
              <div>
                <dt className="text-neutral-400 text-xs font-medium mb-0.5">Budget Range</dt>
                <dd className="text-neutral-900 font-medium">₦{provider.min_budget.toLocaleString()} - {provider.max_budget ? `₦${provider.max_budget.toLocaleString()}` : "Negotiable"}</dd>
              </div>
            )}
            {provider.phone_masked && (
              <div>
                <dt className="text-neutral-400 text-xs font-medium mb-0.5">Phone</dt>
                <dd className="text-neutral-900 font-medium font-mono">{provider.phone_masked}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Portfolio */}
      {provider.portfolio?.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6 mb-5">
          <h2 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-wider">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {provider.portfolio.map((url, i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6">
        <h2 className="text-sm font-bold text-neutral-900 mb-5 uppercase tracking-wider">Reviews</h2>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className={`text-xl transition-colors ${star <= reviewRating ? "text-amber-500" : "text-neutral-300 hover:text-amber-300"}`}
              >
                ★
              </button>
            ))}
            <span className="text-xs text-neutral-400 ml-2">{reviewRating}/5</span>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime transition-all mb-3"
            rows={3}
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="px-5 py-2.5 bg-dark text-white rounded-xl text-sm font-medium hover:bg-[#0d2730] transition-colors disabled:opacity-40"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-600">
                    {review.reviewer_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{review.reviewer_name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 text-xs">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                      <span className="text-[11px] text-neutral-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-neutral-600 ml-11 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 text-center py-6">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
