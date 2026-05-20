"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Vendor Management</h1>
        <p className="text-sm text-[var(--foreground-muted)]">Manage platform vendors and service providers</p>
      </div>

      <Card className="p-6">
        {vendors.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="store" size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
            <p className="text-[var(--foreground-muted)]">No vendors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--surface-border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground-muted)]">Events</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--foreground-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-b border-[var(--surface-border)] hover:bg-[var(--surface-hover)]">
                    <td className="py-3 px-4 font-medium text-[var(--foreground)]">{v.name}</td>
                    <td className="py-3 px-4 text-[var(--foreground-muted)]">{v.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-success-100)] text-[var(--color-success-800)]">{v.status}</span>
                    </td>
                    <td className="py-3 px-4 text-[var(--foreground)]">{v.eventCount || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm"><Icon name="more-horizontal" size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
