"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CreditCard, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ListingPricing {
  id: string;
  user_type: string;
  price: number;
  currency: string;
  duration_days: number;
  description: string | null;
  features: string[];
}

interface ListingStatus {
  has_listing: boolean;
  is_marketplace_visible: boolean;
  has_active_payment: boolean;
  payment_expires_at: string | null;
  pricing: ListingPricing | null;
  listing_id: string | null;
}

interface Props {
  userType: "influencer" | "organizer";
}

export default function MarketplaceVisibilityToggle({ userType }: Props) {
  const [status, setStatus] = useState<ListingStatus | null>(null);
  const [pricing, setPricing] = useState<ListingPricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const [statusRes, pricingRes] = await Promise.all([
        fetch("/api/marketplace/profile/status"),
        fetch("/api/marketplace/pricing"),
      ]);
      if (statusRes.ok) setStatus(await statusRes.json());
      if (pricingRes.ok) {
        const plans = await pricingRes.json();
        const plan = Array.isArray(plans) ? plans.find((p: ListingPricing) => p.user_type === userType) : null;
        setPricing(plan || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, [userType]);

  const handleToggle = async () => {
    if (!status) return;
    setToggling(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/profile/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: !status.is_marketplace_visible }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || data.error || "Failed to toggle visibility");
      } else {
        setStatus((prev) => prev ? { ...prev, is_marketplace_visible: data.is_marketplace_visible } : prev);
      }
    } catch {
      setError("Failed to toggle visibility");
    } finally {
      setToggling(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/profile/activate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || data.error || "Failed to activate listing");
      } else {
        await fetchStatus();
      }
    } catch {
      setError("Failed to activate listing");
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  const isActive = status?.has_active_payment && status?.is_marketplace_visible;
  const daysLeft = status?.payment_expires_at
    ? Math.max(0, Math.ceil((new Date(status.payment_expires_at).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-dark">Marketplace Visibility</h2>
          <p className="text-sm text-gray-500 mt-1">
            Control whether your profile appears in the marketplace search results
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {status?.is_marketplace_visible ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
                <Eye className="h-5 w-5 text-lime" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <EyeOff className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-semibold text-dark">
                {status?.is_marketplace_visible ? "Visible on Marketplace" : "Hidden from Marketplace"}
              </p>
              <p className="text-sm text-gray-500">
                {status?.is_marketplace_visible
                  ? "Users can discover your profile in marketplace search"
                  : "Your profile is not shown in marketplace search results"}
              </p>
            </div>
          </div>

          {status?.has_active_payment ? (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                status.is_marketplace_visible ? "bg-lime" : "bg-gray-200"
              } ${toggling ? "opacity-50" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  status.is_marketplace_visible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          ) : (
            <button
              onClick={handleActivate}
              disabled={activating}
              className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {activating ? "Activating..." : "Activate Listing"}
            </button>
          )}
        </div>

        {status?.has_active_payment && status?.payment_expires_at && (
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {daysLeft > 0 ? (
                <>Listing active — <span className="font-semibold text-dark">{daysLeft} day{daysLeft !== 1 ? "s" : ""}</span> remaining</>
              ) : (
                <span className="text-red-600 font-semibold">Listing expired</span>
              )}
            </span>
          </div>
        )}
      </div>

      {pricing && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Listing Plan</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-dark">
              {pricing.currency === "NGN" ? "₦" : pricing.currency}
              {pricing.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/ {pricing.duration_days} days</span>
          </div>
          {pricing.description && (
            <p className="text-sm text-gray-500 mb-4">{pricing.description}</p>
          )}
          {pricing.features.length > 0 && (
            <div className="space-y-2">
              {pricing.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-lime shrink-0" />
                  <span>{feature.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
