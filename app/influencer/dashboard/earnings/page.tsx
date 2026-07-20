"use client";
import React, { useState, useEffect } from "react";
import { DollarSign, Clock, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function InfluencerEarningsPage() {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/wallet/", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/influencers/collaborations", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([wallet, collabs]) => {
        const list = collabs.collaborations || collabs || [];
        const completed = list.filter((c: any) => c.status === "completed" || c.status === "accepted");
        setEarnings({ wallet, totalCollabs: list.length, activeCollabs: completed.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <Wallet className="w-5 h-5 text-lime mb-2" />
          <div className="text-2xl font-bold">
            ₦{(earnings?.wallet?.balance || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Wallet Balance</div>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <TrendingUp className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-2xl font-bold">{earnings?.totalCollabs || 0}</div>
          <div className="text-sm text-gray-500">Total Collaborations</div>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <Clock className="w-5 h-5 text-amber-500 mb-2" />
          <div className="text-2xl font-bold">{earnings?.activeCollabs || 0}</div>
          <div className="text-sm text-gray-500">Active Collaborations</div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
        <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Detailed earnings and payout history coming soon.</p>
        <Button className="mt-4" onClick={() => window.location.href = "/organizer/dashboard/wallet"}>
          Go to Wallet
        </Button>
      </div>
    </div>
  );
}
