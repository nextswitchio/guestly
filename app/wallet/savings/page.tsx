"use client";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import SavingsProgressBar from "@/components/wallet/SavingsProgressBar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const increments = [10, 25, 50, 100];

export default function WalletSavings() {
  const [goal, setGoal] = React.useState(300);
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [selectedIncrement, setSelectedIncrement] = React.useState(25);

  React.useEffect(() => {
    async function load() {
      try {
        const s = await fetch("/api/savings").then((r) => r.json());
        setGoal(s.goal || 300);
        setProgress(s.progress || 0);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function updateGoal(next: number) {
    setGoal(next);
    await fetch("/api/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: next }),
    });
  }

  async function addSavings() {
    if (adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/savings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedIncrement }),
      });
      if (res.ok) setProgress((p) => p + selectedIncrement);
    } catch {
      /* ignore */
    } finally {
      setAdding(false);
    }
  }

  const goalReached = goal > 0 && progress >= goal;

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/wallet" className="hover:text-neutral-600">Wallet</Link>
          <span>/</span>
          <span className="text-neutral-600">Event Savings</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Event Savings</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Set a goal and save up for your next event experience
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: Progress + Add */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {loading ? (
              <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
            ) : (
              <SavingsProgressBar goal={goal} progress={progress} />
            )}

            {/* Add savings */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-neutral-900">Add to Savings</h2>

              {/* Increment picker */}
              <div className="mb-4 grid grid-cols-4 gap-2">
                {increments.map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setSelectedIncrement(inc)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold tabular-nums transition ${selectedIncrement === inc
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-neutral-100 bg-white text-neutral-700 hover:border-neutral-200"
                      }`}
                  >
                    ${inc}
                  </button>
                ))}
              </div>

              <Button onClick={addSavings} disabled={adding} className="w-full" size="lg">
                {adding ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving…
                  </span>
                ) : (
                  `Save $${selectedIncrement.toFixed(2)}`
                )}
              </Button>

              {goalReached && (
                <div className="mt-4 rounded-xl bg-success-50 px-4 py-3 text-center text-xs font-medium text-success-700">
                  🎉 You&apos;ve reached your goal! Time to grab those tickets.
                </div>
              )}
            </div>
          </div>

          {/* Right: Goal settings */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-neutral-900">Savings Goal</h2>
              <Input
                label="Target Amount ($)"
                type="number"
                min={1}
                value={goal}
                onChange={(e) => updateGoal(Number(e.currentTarget.value))}
              />
              <p className="mt-2 text-xs text-neutral-400">
                Set how much you want to save for your next event
              </p>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
              <h3 className="text-sm font-semibold text-primary-900">Savings Tips</h3>
              <ul className="mt-2 space-y-2 text-xs leading-relaxed text-primary-700">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-primary-500">•</span>
                  Save a small amount weekly — it adds up fast!
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-primary-500">•</span>
                  Set your goal to match VIP ticket prices for the best experience
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-primary-500">•</span>
                  Use saved funds at checkout for instant ticket purchase
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
