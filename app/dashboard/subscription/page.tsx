"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

type Subscription = {
  plan: "1m" | "3m" | "6m" | "12m";
  activatedAt: number;
  expiresAt: number;
} | null;

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  key: NonNullable<Subscription>["plan"];
  name: string;
  months: number;
  price: number;
  pricePerMonth: number;
  savings?: string;
  popular?: boolean;
  features: PlanFeature[];
}

const plans: Plan[] = [
  {
    key: "1m",
    name: "Starter",
    months: 1,
    price: 9,
    pricePerMonth: 9,
    features: [
      { name: "Unlimited Events", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Marketing Tools", included: false },
      { name: "Priority Support", included: false },
      { name: "Advanced Analytics", included: false },
    ],
  },
  {
    key: "3m",
    name: "Growth",
    months: 3,
    price: 25,
    pricePerMonth: 8.33,
    savings: "Save 7%",
    features: [
      { name: "Unlimited Events", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Marketing Tools", included: true },
      { name: "Priority Support", included: false },
      { name: "Advanced Analytics", included: false },
    ],
  },
  {
    key: "6m",
    name: "Professional",
    months: 6,
    price: 45,
    pricePerMonth: 7.50,
    savings: "Save 17%",
    popular: true,
    features: [
      { name: "Unlimited Events", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Marketing Tools", included: true },
      { name: "Priority Support", included: true },
      { name: "Advanced Analytics", included: false },
    ],
  },
  {
    key: "12m",
    name: "Enterprise",
    months: 12,
    price: 80,
    pricePerMonth: 6.67,
    savings: "Save 26%",
    features: [
      { name: "Unlimited Events", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Marketing Tools", included: true },
      { name: "Priority Support", included: true },
      { name: "Advanced Analytics", included: true },
    ],
  },
];

const allFeatures = [
  { name: "Unlimited Events", description: "Create and manage unlimited events" },
  { name: "Basic Analytics", description: "Track ticket sales and attendance" },
  { name: "Email Support", description: "Get help via email within 24 hours" },
  { name: "Marketing Tools", description: "Promo codes, referrals, and campaigns" },
  { name: "Priority Support", description: "Get priority email and chat support" },
  { name: "Advanced Analytics", description: "Deep insights and custom reports" },
];

export default function OrganiserSubscriptionPage() {
  const [sub, setSub] = useState<Subscription>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  async function load() {
    const res = await fetch("/api/organiser/subscription");
    const data = await res.json();
    if (data?.ok) setSub(data.subscription as Subscription);
  }

  useEffect(() => {
    void load();
  }, []);

  async function activate(plan: NonNullable<Subscription>["plan"]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/organiser/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to activate");
      setSub(data.subscription as Subscription);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(ts?: number) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const active = sub && sub.expiresAt > Date.now();
  const currentPlan = plans.find((p) => p.key === sub?.plan);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-4">
          <Icon name="arrow-left" size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
          Unlock powerful features to grow your events and reach more attendees
        </p>
      </div>

      {/* Current Status Banner */}
      {active && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
              <Icon name="check-circle" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                {currentPlan?.name} Plan Active
              </h3>
              <p className="text-sm text-green-700">
                Expires on {formatDate(sub?.expiresAt)}
              </p>
            </div>
          </div>
          <button className="rounded-xl border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors">
            Download Invoice
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
          <Icon name="alert-circle" size={20} className="text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = sub?.plan === plan.key && active;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-6 transition-all ${
                isPopular
                  ? "border-2 border-lime shadow-lg"
                  : isCurrent
                  ? "border-2 border-green-500"
                  : "border border-neutral-200 bg-white"
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-lime text-dark text-xs font-bold px-3 py-1 rounded-bl-xl">
                  MOST POPULAR
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  CURRENT PLAN
                </div>
              )}

              <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-neutral-900">${plan.price}</span>
                  <span className="text-neutral-500">/{plan.months}mo</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  ${plan.pricePerMonth.toFixed(2)}/month
                </div>
                {plan.savings && (
                  <div className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                    {plan.savings}
                  </div>
                )}
              </div>

              <button
                onClick={() => activate(plan.key)}
                disabled={loading}
                className={`w-full mb-4 rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  isPopular
                    ? "bg-lime text-dark hover:bg-lime-hover"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                } disabled:opacity-50`}
              >
                {loading ? "Processing..." : isCurrent ? "Extend Plan" : "Get Started"}
              </button>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {feature.included ? (
                      <Icon name="check" size={16} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <Icon name="x" size={16} className="text-neutral-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-neutral-900"
                          : "text-neutral-400 line-through"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Icon name={showComparison ? "chevron-up" : "chevron-down"} size={16} />
          {showComparison ? "Hide" : "Show"} Detailed Comparison
        </button>
      </div>

      {/* Detailed Comparison Table */}
      {showComparison && (
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.key}
                      className="px-6 py-4 text-center text-sm font-semibold text-neutral-900"
                    >
                      <div>{plan.name}</div>
                      <div className="text-xs font-normal text-neutral-500 mt-1">
                        ${plan.price}/{plan.months}mo
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {allFeatures.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">{feature.name}</div>
                      <div className="text-sm text-neutral-500">{feature.description}</div>
                    </td>
                    {plans.map((plan) => {
                      const planFeature = plan.features.find((f) => f.name === feature.name);
                      return (
                        <td key={plan.key} className="px-6 py-4 text-center">
                          {planFeature?.included ? (
                            <Icon name="check-circle" size={24} className="text-green-600 mx-auto" />
                          ) : (
                            <Icon name="x-circle" size={24} className="text-neutral-300 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-center text-neutral-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { q: "Can I change plans?", a: "Yes! You can upgrade or extend your plan at any time. The new plan will be activated immediately." },
            { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and mobile money payments." },
            { q: "Is there a free trial?", a: "We offer a 7-day free trial for new organizers. No credit card required to start." },
            { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period." },
          ].map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <Icon name="help-circle" size={18} className="text-lime" />
                {faq.q}
              </h3>
              <p className="text-sm text-neutral-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <div className="rounded-2xl bg-lime p-8 text-center">
        <Icon name="message-circle" size={48} className="text-dark/60 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-dark mb-2">Need Help Choosing?</h3>
        <p className="text-dark/70 mb-6 max-w-2xl mx-auto">
          Our team is here to help you find the perfect plan for your needs
        </p>
        <button className="rounded-xl bg-dark px-6 py-3 text-sm font-bold text-white hover:bg-dark/90 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
