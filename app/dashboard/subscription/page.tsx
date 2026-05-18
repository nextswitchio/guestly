"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

type Subscription = {
  plan: "1m" | "3m" | "6m" | "12m";
  activatedAt: number;
  expiresAt: number;
} | null;

interface PlanFeature {
  name: string;
  included: boolean;
  tooltip?: string;
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-6">
            <Icon name="arrow-left" className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Unlock powerful features to grow your events and reach more attendees
          </p>
        </div>

        {/* Current Status Banner */}
        {active && (
          <Card className="mb-8 bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200 dark:border-success-800">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-500">
                  <Icon name="check-circle" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-success-900 dark:text-success-100">
                    {currentPlan?.name} Plan Active
                  </h3>
                  <p className="text-sm text-success-700 dark:text-success-300">
                    Expires on {formatDate(sub?.expiresAt)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="download" className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-8 bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800">
            <div className="p-4 flex items-center gap-3">
              <Icon name="alert-circle" className="w-5 h-5 text-danger-600 dark:text-danger-400" />
              <p className="text-sm text-danger-700 dark:text-danger-300">{error}</p>
            </div>
          </Card>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrent = sub?.plan === plan.key && active;
            const isPopular = plan.popular;

            return (
              <Card
                key={plan.key}
                className={`relative overflow-hidden transition-all hover:shadow-xl ${
                  isPopular
                    ? "border-2 border-primary-500 shadow-lg scale-105"
                    : isCurrent
                    ? "border-2 border-success-500"
                    : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-success-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    CURRENT PLAN
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-foreground-muted">/{plan.months}mo</span>
                    </div>
                    <div className="text-sm text-foreground-muted mt-1">
                      ${plan.pricePerMonth.toFixed(2)}/month
                    </div>
                    {plan.savings && (
                      <div className="inline-block mt-2 px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-xs font-semibold rounded-full">
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => activate(plan.key)}
                    disabled={loading}
                    variant={isPopular ? "primary" : "outline"}
                    className="w-full mb-4"
                  >
                    {loading ? (
                      <>
                        <Icon name="loader" className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrent ? (
                      "Extend Plan"
                    ) : (
                      "Get Started"
                    )}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {feature.included ? (
                          <Icon name="check" className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0" />
                        ) : (
                          <Icon name="x" className="w-4 h-4 text-foreground-muted flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-foreground"
                              : "text-foreground-muted line-through"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Comparison Toggle */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
          >
            <Icon name={showComparison ? "chevron-up" : "chevron-down"} className="w-4 h-4 mr-2" />
            {showComparison ? "Hide" : "Show"} Detailed Comparison
          </Button>
        </div>

        {/* Detailed Comparison Table */}
        {showComparison && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-hover">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Features
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.key}
                        className="px-6 py-4 text-center text-sm font-semibold text-foreground"
                      >
                        <div>{plan.name}</div>
                        <div className="text-xs font-normal text-foreground-muted mt-1">
                          ${plan.price}/{plan.months}mo
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {allFeatures.map((feature, idx) => (
                    <tr key={idx} className="hover:bg-surface-hover/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{feature.name}</div>
                        <div className="text-sm text-foreground-muted">{feature.description}</div>
                      </td>
                      {plans.map((plan) => {
                        const planFeature = plan.features.find((f) => f.name === feature.name);
                        return (
                          <td key={plan.key} className="px-6 py-4 text-center">
                            {planFeature?.included ? (
                              <Icon name="check-circle" className="w-6 h-6 text-success-600 dark:text-success-400 mx-auto" />
                            ) : (
                              <Icon name="x-circle" className="w-6 h-6 text-foreground-muted mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="help-circle" className="w-5 h-5 text-primary-500" />
                Can I change plans?
              </h3>
              <p className="text-sm text-foreground-muted">
                Yes! You can upgrade or extend your plan at any time. The new plan will be activated immediately.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="help-circle" className="w-5 h-5 text-primary-500" />
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-foreground-muted">
                We accept all major credit cards, debit cards, and mobile money payments.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="help-circle" className="w-5 h-5 text-primary-500" />
                Is there a free trial?
              </h3>
              <p className="text-sm text-foreground-muted">
                We offer a 7-day free trial for new organizers. No credit card required to start.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="help-circle" className="w-5 h-5 text-primary-500" />
                Can I cancel anytime?
              </h3>
              <p className="text-sm text-foreground-muted">
                Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.
              </p>
            </Card>
          </div>
        </div>

        {/* Support CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary-500 to-purple-500 text-white">
          <div className="p-8 text-center">
            <Icon name="message-circle" className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs
            </p>
            <Button variant="secondary" size="lg">
              <Icon name="mail" className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
