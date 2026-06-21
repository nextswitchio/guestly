"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function AdminVendorSubscriptionsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [newPlan, setNewPlan] = useState<"1m" | "3m" | "6m" | "12m">("1m");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vendors");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data 
          : data.data?.vendors ? data.data.vendors 
          : data.vendors ? data.vendors 
          : data.data ? (Array.isArray(data.data) ? data.data : [])
          : [];
        setVendors(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (vendor: any) => {
    setSelectedVendor(vendor);
    setNewPlan(vendor.subscription?.plan || "1m");
    setIsUpdateOpen(true);
  };

  const handleSaveSubscription = async () => {
    if (!selectedVendor) return;
    try {
      const res = await fetch(`/api/admin/users/${selectedVendor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: { plan: newPlan } }),
        credentials: 'include',
      });
      if (res.ok) {
        await fetchVendors();
        setIsUpdateOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vendor Subscription Management</h1>
        <p className="text-sm text-slate-500">
          Manage vendor subscription plans and payments
        </p>
      </div>

      <Card className="p-6">
        {vendors.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="package" size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-500">No vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Vendor Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Current Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Expires At</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{v.name}</td>
                    <td className="py-3 px-4 text-slate-500">{v.category}</td>
                    <td className="py-3 px-4 text-slate-900">
                      {v.subscription?.plan ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {v.subscription.plan.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-900">
                      {v.subscription?.expiresAt ? (
                        new Date(v.subscription.expiresAt).toLocaleDateString()
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {v.status === "approved" ? "Active" : v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateSubscription(v)}>
                        <Icon name="credit-card" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title={`Update Subscription for ${selectedVendor?.name ?? ""}`}
      >
        <p className="text-sm text-slate-500 mb-4">
          Select a new subscription plan for this vendor. The vendor will be charged accordingly.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-900 mb-2">Plan</label>
          <select
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value as "1m" | "3m" | "6m" | "12m")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime"
          >
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
            <option value="6m">6 Months</option>
            <option value="12m">12 Months</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSubscription}>Update &amp; Process Payment</Button>
        </div>
      </Modal>
    </div>
  );
}
