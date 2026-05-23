"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-slate-100 text-slate-600",
};

const VENDOR_CATEGORIES = [
  "Security", "Sound", "Catering", "Decoration", "Logistics", "Photography",
];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage.toString(), limit: "20" });
      if (searchQuery) params.set("search", searchQuery);
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/vendors?${params}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data?.vendors || data.vendors || [];
        setVendors(list);
        setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const stats = {
    total: vendors.length,
    approved: vendors.filter((v) => v.status === "approved").length,
    pending: vendors.filter((v) => v.status === "pending").length,
    rejected: vendors.filter((v) => v.status === "rejected").length,
  };

  const formatCurrency = (amount?: number) =>
    amount != null ? `₦${amount.toLocaleString()}` : "₦0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vendor Management</h1>
        <p className="text-sm text-slate-500">
          Manage platform vendors, service providers, and their subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Icon name="package" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Vendors</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <Icon name="check-circle" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <Icon name="clock" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Icon name="x-circle" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search vendors by name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Categories</option>
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {["all", "approved", "pending", "rejected"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "primary" : "ghost"}
                size="sm"
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Vendors Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-lime border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="package" size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-500 mb-1">No vendors found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Vendor</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Subscription</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Events</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedVendor(v);
                      setShowDetails(true);
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-lime/10 flex items-center justify-center text-sm font-bold text-dark">
                          {(v.name || v.businessName || "V").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{v.name || v.businessName || "Unnamed"}</p>
                          <p className="text-xs text-slate-400">{v.contactEmail || v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">{v.category || "—"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-600">{v.contactPhone || v.phone || "—"}</p>
                    </td>
                    <td className="py-3 px-4">
                      {v.subscription?.plan ? (
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {v.subscription.plan.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-slate-900">{v.eventCount || v.completedEvents || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Icon name="star" size={12} className="text-yellow-500" />
                        <span className="text-sm text-slate-600">{v.rating || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[v.status] || "bg-slate-100 text-slate-600"}`}>
                        {v.status ? v.status.charAt(0).toUpperCase() + v.status.slice(1) : "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVendor(v);
                          setShowDetails(true);
                        }}
                      >
                        <Icon name="more-horizontal" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
            <p className="text-sm text-slate-500">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Vendor Details Modal */}
      <Modal open={showDetails} onClose={() => { setShowDetails(false); setSelectedVendor(null); }} title="Vendor Details" size="lg">
        {selectedVendor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
              <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center text-xl font-bold text-dark">
                {(selectedVendor.name || selectedVendor.businessName || "V").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedVendor.name || selectedVendor.businessName}</h3>
                <p className="text-sm text-slate-500">{selectedVendor.contactEmail || selectedVendor.email}</p>
                <p className="text-xs text-slate-400">{selectedVendor.category} &middot; {selectedVendor.city || "N/A"}</p>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[selectedVendor.status]}`}>
                  {selectedVendor.status?.charAt(0).toUpperCase() + selectedVendor.status?.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</label>
                <p className="text-sm text-slate-900 mt-1">{selectedVendor.contactPhone || selectedVendor.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
                <p className="text-sm text-slate-900 mt-1">{selectedVendor.city || "Not provided"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Subscription Plan</label>
                <p className="text-sm text-slate-900 mt-1">
                  {selectedVendor.subscription?.plan
                    ? `${selectedVendor.subscription.plan.toUpperCase()} (expires ${selectedVendor.subscription.expiresAt ? new Date(selectedVendor.subscription.expiresAt).toLocaleDateString() : "N/A"})`
                    : "Free Plan"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rating</label>
                <p className="text-sm text-slate-900 mt-1">{selectedVendor.rating ? `${selectedVendor.rating} / 5` : "No reviews yet"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Events</label>
                <p className="text-sm text-slate-900 mt-1">{selectedVendor.completedEvents || selectedVendor.eventCount || 0}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</label>
                <p className="text-sm text-slate-900 mt-1">{formatCurrency(selectedVendor.totalRevenue)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
                <p className="text-sm text-slate-900 mt-1">{selectedVendor.description || "No description"}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              {selectedVendor.status === "pending" && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                    await fetch(`/api/admin/vendors/${selectedVendor.id}/approve`, { method: "POST" });
                    fetchVendors();
                    setShowDetails(false);
                  }}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={async () => {
                    await fetch(`/api/admin/vendors/${selectedVendor.id}/reject`, { method: "POST" });
                    fetchVendors();
                    setShowDetails(false);
                  }}>
                    Reject
                  </Button>
                </>
              )}
              {selectedVendor.status === "approved" && (
                <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={async () => {
                  await fetch(`/api/admin/vendors/${selectedVendor.id}/suspend`, { method: "POST" });
                  fetchVendors();
                  setShowDetails(false);
                }}>
                  Suspend
                </Button>
              )}
              {selectedVendor.status === "suspended" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                  await fetch(`/api/admin/vendors/${selectedVendor.id}/activate`, { method: "POST" });
                  fetchVendors();
                  setShowDetails(false);
                }}>
                  Reactivate
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
