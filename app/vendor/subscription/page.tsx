"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Crown, Zap, TrendingUp, Star, Shield } from "lucide-react";

type Plan = "free" | "1m" | "3m" | "6m" | "12m";
interface PlanDetails {
  name: string; price: number; duration: string; features: string[]; popular?: boolean; profiles: number;
}

const PLANS: Record<Plan, PlanDetails> = {
  free: { name: "Free", price: 0, duration: "Forever", profiles: 1, features: ["Basic vendor profile", "Receive event invitations", "Contact information display", "1 service profile"] },
  "1m": { name: "Premium Monthly", price: 4999, duration: "1 Month", profiles: 3, features: ["All Free features", "Featured vendor placement", "Priority search ranking", "Advanced analytics dashboard", "3 service profiles", "Lead generation insights"] },
  "3m": { name: "Premium Quarterly", price: 12999, duration: "3 Months", popular: true, profiles: 10, features: ["All Premium Monthly features", "Save 13% vs monthly", "Featured placement guarantee", "Priority customer support", "Quarterly performance reports", "10 service profiles"] },
  "6m": { name: "Premium Semi-Annual", price: 23999, duration: "6 Months", profiles: Infinity, features: ["All Premium Quarterly features", "Save 20% vs monthly", "Extended featured placement", "Dedicated account manager", "Unlimited service profiles"] },
  "12m": { name: "Premium Annual", price: 44999, duration: "12 Months", profiles: Infinity, features: ["All Premium Semi-Annual features", "Save 25% vs monthly", "Year-round featured placement", "Premium badge on profile", "Unlimited service profiles", "Priority event invitations"] },
};

export default function VendorSubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => { fetchSub(); }, []);
  const fetchSub = async () => {
    try {
      const res = await fetch("/api/vendor/subscription");
      if (res.ok) {
        const d = await res.json();
        if (d.subscription) { setCurrentPlan(d.subscription.plan); setExpiresAt(d.subscription.expiresAt); }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const subscribe = async (plan: Plan) => {
    if (plan === "free") return;
    setSubscribing(true); setSelectedPlan(plan);
    try {
      const res = await fetch("/api/vendor/subscription/activate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        const d = await res.json();
        setCurrentPlan(d.subscription.plan); setExpiresAt(d.subscription.expiresAt);
      } else {
        const err = await res.json();
        alert(err.error || "Failed");
      }
    } catch { alert("Error"); }
    finally { setSubscribing(false); setSelectedPlan(null); }
  };

  const isPremium = currentPlan !== "free";
  const daysLeft = expiresAt ? Math.ceil((expiresAt - Date.now()) / 86400000) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-50 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">Vendor Subscription</h1>
        <p className="text-gray-500 mt-1">Upgrade to unlock service profiles, featured placement, and advanced analytics</p>
      </div>

      {isPremium && (
        <Card className="p-5 bg-gradient-to-r from-lime/5 to-lime/10 border border-lime/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Crown className="w-5 h-5 text-lime" />
                <span className="text-lg font-semibold text-dark">Current Plan: {PLANS[currentPlan].name}</span>
                <span className="px-2.5 py-0.5 bg-dark text-white text-xs font-medium rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-500 ml-7">
                {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining` : "Expired"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-dark">₦{(PLANS[currentPlan].price / 100).toLocaleString()}</p>
              <p className="text-sm text-gray-500">{PLANS[currentPlan].duration}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(PLANS) as Plan[]).map((key) => {
          const plan = PLANS[key];
          const isCurrent = key === currentPlan;
          return (
            <Card key={key} className={`relative p-6 ${plan.popular ? "ring-2 ring-lime shadow-lg border-0" : ""} ${isCurrent && !plan.popular ? "border-2 border-dark" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3.5 py-1 bg-lime text-dark text-xs font-bold rounded-full">MOST POPULAR</span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="px-3.5 py-1 bg-dark text-white text-xs font-bold rounded-full">CURRENT</span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl font-bold text-dark mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-dark">₦{(plan.price / 100).toLocaleString()}</span>
                  {key !== "free" && <span className="text-sm text-gray-500">/ {plan.duration.toLowerCase()}</span>}
                </div>
                {key !== "free" && (
                  <p className="text-xs text-gray-400 mt-1">
                    {plan.profiles === Infinity ? "Unlimited" : plan.profiles} service profile{plan.profiles !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "primary" : "outline"}
                fullWidth
                disabled={isCurrent || subscribing}
                loading={subscribing && selectedPlan === key}
                onClick={() => subscribe(key)}
              >
                {isCurrent ? "Current Plan" : key === "free" ? "Free Forever" : "Subscribe Now"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold text-dark mb-6">Why Go Premium?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Star, title: "Featured Placement", desc: "Appear at the top of vendor search results and get 3x more visibility from event organizers." },
            { icon: TrendingUp, title: "Advanced Analytics", desc: "Track profile views, invitation rates, and conversion metrics to optimize your business." },
            { icon: Shield, title: "Priority Support", desc: "Get dedicated support and faster response times to help grow your vendor business." },
          ].map((b, i) => (
            <div key={i}>
              <div className="w-12 h-12 bg-lime/10 rounded-xl flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
