"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { DollarSign, RefreshCw, Edit3, Save, X, Users, TrendingUp, Eye } from "lucide-react";

interface PricingConfig {
  id: string;
  user_type: string;
  price: number;
  currency: string;
  duration_days: number;
  description: string | null;
  features: string[];
  is_active: boolean;
}

export default function MarketplacePricingPage() {
  const { addToast } = useToast();
  const [pricing, setPricing] = useState<PricingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingConfig>>({});
  const [stats, setStats] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [pricingRes, statsRes] = await Promise.all([
        fetch("/api/admin/marketplace-pricing"),
        fetch("/api/admin/marketplace-pricing/stats").then((r) => (r.ok ? r.json() : null)),
      ]);
      if (pricingRes.ok) {
        const data = await pricingRes.json();
        setPricing(data.data || []);
      }
      if (statsRes?.data) setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/marketplace-pricing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        addToast("Pricing updated", { type: "success" });
        setEditing(null);
        fetchData();
      } else {
        addToast("Failed to update pricing", { type: "error" });
      }
    } catch {
      addToast("Failed to update pricing", { type: "error" });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/marketplace-pricing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-gray-300" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Marketplace Listing Pricing</h1>
          <p className="text-gray-500 mt-1">Manage pricing for influencer and organizer marketplace visibility</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
                <DollarSign className="h-5 w-5 text-lime" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-dark">₦{(stats.total_revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>
                <p className="text-xl font-bold text-dark">{stats.total_payments || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Eye className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Listings</p>
                <p className="text-xl font-bold text-dark">{stats.active_listings || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {pricing.map((p) => (
          <Card key={p.id} className="p-6">
            {editing === p.id ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dark capitalize">{p.user_type} Listing</h3>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(p.id)}><Save className="w-3.5 h-3.5 mr-1" />Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="w-3.5 h-3.5 mr-1" />Cancel</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Price</label>
                    <input
                      type="number"
                      value={editForm.price ?? p.price}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Duration (days)</label>
                    <input
                      type="number"
                      value={editForm.duration_days ?? p.duration_days}
                      onChange={(e) => setEditForm({ ...editForm, duration_days: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Description</label>
                  <textarea
                    value={editForm.description ?? p.description ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.user_type === "influencer" ? "bg-purple-50" : "bg-lime/10"}`}>
                    {p.user_type === "influencer" ? <TrendingUp className="h-6 w-6 text-purple-500" /> : <Users className="h-6 w-6 text-lime" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark capitalize">{p.user_type} Marketplace Listing</h3>
                    <p className="text-sm text-gray-500">{p.description || "No description"}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-lg font-bold text-dark">₦{p.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">/ {p.duration_days} days</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${p.is_active ? "text-lime" : "text-gray-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-lime" : "bg-gray-300"}`} />
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(p.id, p.is_active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.is_active ? "bg-lime" : "bg-gray-200"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${p.is_active ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <button
                    onClick={() => { setEditing(p.id); setEditForm({ price: p.price, duration_days: p.duration_days, description: p.description }); }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
