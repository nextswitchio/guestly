"use client";
import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Subscription = {
  plan: "1m" | "3m" | "6m" | "12m";
  activatedAt: number;
  expiresAt: number;
} | null;

const plans: Array<{ key: NonNullable<Subscription>["plan"]; label: string; months: number; price: string }> = [
  { key: "1m", label: "1 Month", months: 1, price: "$9" },
  { key: "3m", label: "3 Months", months: 3, price: "$25" },
  { key: "6m", label: "6 Months", months: 6, price: "$45" },
  { key: "12m", label: "12 Months", months: 12, price: "$80" },
];

export default function VendorSubscriptionPage() {
  const [sub, setSub] = React.useState<Subscription>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function load() {
    const res = await fetch("/api/vendor/subscription");
    const data = await res.json();
    if (data?.ok) setSub(data.subscription as Subscription);
  }
  React.useEffect(() => { void load(); }, []);

  async function activate(plan: NonNullable<Subscription>["plan"]) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vendor/subscription", {
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

  function format(ts?: number) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  const active = sub && sub.expiresAt > Date.now();

  return (
    <div className="mx-auto max-w-3xl">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
        <Link href="/" className="hover:text-neutral-600">Home</Link>
        <span>/</span>
        <Link href="/vendor" className="hover:text-neutral-600">Vendor</Link>
        <span>/</span>
        <span className="text-neutral-600">Subscription</span>
      </nav>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Vendor Subscription</h1>
            <p className="mt-1 text-sm text-neutral-600">Choose a plan to activate your account.</p>
          </div>
          <Link href="/vendor">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const isCurrent = sub?.plan === p.key && active;
            return (
              <div key={p.key} className={`flex flex-col gap-3 rounded-xl border ${isCurrent ? "border-primary-300 bg-primary-50" : "border-neutral-200 bg-white"} p-4`}>
                <div className="text-sm font-semibold text-neutral-900">{p.label}</div>
                <div className="text-2xl font-bold">{p.price}</div>
                <div className="text-xs text-neutral-500">{p.months} month{p.months > 1 ? "s" : ""}</div>
                <Button disabled={loading} onClick={() => void activate(p.key)}>{isCurrent ? "Extend" : "Activate"}</Button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="text-sm font-semibold text-neutral-900">Current Status</div>
          <div className="mt-1 text-sm text-neutral-600">
            {active ? (
              <>
                Active • Expires <span className="font-medium">{format(sub?.expiresAt)}</span>
              </>
            ) : (
              "Inactive • Choose a plan to activate your account"
            )}
          </div>
          {error && <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        </div>
      </div>
    </div>
  );
}
