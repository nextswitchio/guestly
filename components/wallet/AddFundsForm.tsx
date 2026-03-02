"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AddFundsForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<"attendee" | "organiser" | "vendor" | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRole(d?.role || null))
      .catch(() => setRole(null));
    fetch("/api/wallet/balance")
      .then((r) => r.json())
      .then((d) => setBalance(typeof d.balance === "number" ? d.balance : 0))
      .catch(() => setBalance(0));
  }, []);

  function setQuick(v: number) {
    setAmount(String(v));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Failed to add funds");
        setLoading(false);
        return;
      }
      const dest = role === "organiser" ? "/dashboard/wallet" : "/wallet";
      router.replace(dest);
    } catch {
      setError("Failed to add funds");
      setLoading(false);
    }
  }

  const backHref = role === "organiser" ? "/dashboard/wallet" : "/wallet";

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <div className="mb-5">
            <h1 className="text-lg font-bold text-neutral-900">Add Funds</h1>
            <p className="mt-1 text-xs text-neutral-500">Top up your wallet balance</p>
          </div>

          <div className="mb-4 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <div className="text-xs text-neutral-500">Current Balance</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
              {balance === null ? "—" : `$${balance.toFixed(2)}`}
            </div>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              label="Amount"
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
              placeholder="e.g. 50"
              error={error || undefined}
            />

            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setQuick(v)}
                  className="rounded-lg border border-neutral-200 bg-white py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                >
                  ${v}
                </button>
              ))}
            </div>

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Processing…" : "Add Funds"}
            </Button>

            <Link
              href={backHref}
              className="text-center text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              Back to Wallet
            </Link>
          </form>
        </Card>
      </div>
    </div>
  );
}
