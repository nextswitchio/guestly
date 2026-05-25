"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { getAuthHeaders } from "@/lib/api/client";

interface VendorUser {
  id: string;
  display_name?: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  avatar?: string;
  bio?: string;
  interests: string[];
  location?: { city?: string; country?: string };
  eventsCreated: number;
  eventsAttended: number;
  totalSpent: number;
  walletBalance: number;
  profileCompleteness: number;
  createdAt?: string;
  lastActivityAt?: string;
  // VendorProfile fields (null if no profile)
  vendorName?: string | null;
  vendorCategory?: string | null;
  description?: string | null;
  contactEmail?: string;
  contactPhone?: string | null;
  city?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  completedEvents?: number | null;
  services?: string[] | null;
  pricing?: string | null;
  portfolio?: string[] | null;
  rateCard?: string | null;
  vendorStatus?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: string | null;
  hasProfile: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-slate-100 text-slate-600",
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<VendorUser | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage.toString(), limit: "20" });
      if (searchQuery) params.set("search", searchQuery);
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/vendors?${params}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list: VendorUser[] = Array.isArray(data) ? data : data.data?.vendors || data.vendors || [];
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

  const displayStatus = (v: VendorUser): string => {
    if (!v.hasProfile) return "no_profile";
    return v.vendorStatus || "unknown";
  };

  const stats = {
    total: vendors.length,
    approved: vendors.filter((v) => v.hasProfile && v.vendorStatus === "approved").length,
    pending: vendors.filter((v) => v.hasProfile && v.vendorStatus === "pending").length,
    rejected: vendors.filter((v) => v.hasProfile && v.vendorStatus === "rejected").length,
    noProfile: vendors.filter((v) => !v.hasProfile).length,
  };

  const formatDate = (ts?: string) =>
    ts ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  const visibleName = (v: VendorUser) => v.vendorName || v.display_name || v.email || "Unnamed";

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
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Icon name="package" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total</p>
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
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon name="user-x" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.noProfile}</p>
              <p className="text-xs text-slate-500">No Profile</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search vendors by name or email..."
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
              <option value="Security">Security</option>
              <option value="Sound">Sound</option>
              <option value="Catering">Catering</option>
              <option value="Decoration">Decoration</option>
              <option value="Logistics">Logistics</option>
              <option value="Photography">Photography</option>
            </select>
            {["all", "approved", "pending", "rejected", "no_profile"].map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "primary" : "ghost"}
                size="sm"
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
              >
                {s === "no_profile" ? "No Profile" : s.charAt(0).toUpperCase() + s.slice(1)}
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
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Verified</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => {
                  const status = displayStatus(v);
                  return (
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
                          {v.avatar ? (
                            <img src={v.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-lime/10 flex items-center justify-center text-sm font-bold text-dark">
                              {visibleName(v).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{visibleName(v)}</p>
                            <p className="text-xs text-slate-400">{v.contactEmail || v.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-600">{v.vendorCategory || "—"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-600">{v.contactPhone || "—"}</p>
                      </td>
                      <td className="py-3 px-4">
                        {v.subscriptionPlan ? (
                          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {v.subscriptionPlan.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Free</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold text-slate-900">{v.completedEvents ?? v.eventsCreated ?? 0}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Icon name="star" size={12} className="text-yellow-500" />
                          <span className="text-sm text-slate-600">{v.rating ?? "—"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          v.isVerified ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {v.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {!v.hasProfile ? (
                          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500">
                            No Profile
                          </span>
                        ) : (
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[status] || "bg-slate-100 text-slate-600"}`}>
                            {v.vendorStatus ? v.vendorStatus.charAt(0).toUpperCase() + v.vendorStatus.slice(1) : "Unknown"}
                          </span>
                        )}
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
                  );
                })}
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
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
              {selectedVendor.avatar ? (
                <img src={selectedVendor.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center text-xl font-bold text-dark">
                  {visibleName(selectedVendor).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{visibleName(selectedVendor)}</h3>
                <p className="text-sm text-slate-500">{selectedVendor.contactEmail || selectedVendor.email}</p>
                {selectedVendor.vendorCategory && (
                  <p className="text-xs text-slate-400">{selectedVendor.vendorCategory}</p>
                )}
                <div className="flex gap-2 mt-1">
                  {selectedVendor.hasProfile ? (
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[displayStatus(selectedVendor)] || "bg-slate-100 text-slate-600"}`}>
                      {selectedVendor.vendorStatus ? selectedVendor.vendorStatus.charAt(0).toUpperCase() + selectedVendor.vendorStatus.slice(1) : "Unknown"}
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-500">
                      No Profile
                    </span>
                  )}
                  {selectedVendor.isVerified && (
                    <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor Profile Fields */}
            {selectedVendor.hasProfile && (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Vendor Profile</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Business Name</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.vendorName || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.vendorCategory || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact Email</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.contactEmail || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact Phone</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.contactPhone || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.city || "—"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rating</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.rating ? `${selectedVendor.rating} / 5` : "No reviews"}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Review Count</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.reviewCount ?? 0}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Events</label>
                      <p className="text-sm text-slate-900 mt-1">{selectedVendor.completedEvents ?? 0}</p>
                    </div>
                    {selectedVendor.pricing && (
                      <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pricing</label>
                        <p className="text-sm text-slate-900 mt-1">{selectedVendor.pricing}</p>
                      </div>
                    )}
                    {selectedVendor.rateCard && (
                      <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rate Card</label>
                        <p className="text-sm text-slate-900 mt-1">{selectedVendor.rateCard}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Subscription Plan</label>
                      <p className="text-sm text-slate-900 mt-1">
                        {selectedVendor.subscriptionPlan
                          ? `${selectedVendor.subscriptionPlan.toUpperCase()}${selectedVendor.subscriptionExpiresAt ? ` (expires ${formatDate(selectedVendor.subscriptionExpiresAt)})` : ""}`
                          : "Free Plan"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedVendor.description && (
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
                    <p className="text-sm text-slate-900 mt-1 leading-relaxed">{selectedVendor.description}</p>
                  </div>
                )}

                {selectedVendor.services && selectedVendor.services.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Services Offered</label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedVendor.services.map((s, i) => (
                        <span key={i} className="text-xs bg-lime/10 text-dark px-3 py-1 rounded-full font-medium">
                          {typeof s === "string" ? s : (s as any).name || String(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVendor.portfolio && selectedVendor.portfolio.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Portfolio</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedVendor.portfolio.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-lime hover:underline truncate max-w-[200px]">
                          {url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* User Account Fields */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Account Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Display Name</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.display_name || "—"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Status</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Identity Verified</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.isVerified ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Location</label>
                  <p className="text-sm text-slate-900 mt-1">
                    {[selectedVendor.city || selectedVendor.location?.city, selectedVendor.location?.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</label>
                  <p className="text-sm text-slate-900 mt-1">{formatDate(selectedVendor.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last Activity</label>
                  <p className="text-sm text-slate-900 mt-1">{formatDate(selectedVendor.lastActivityAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Events Created</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.eventsCreated}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Events Attended</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.eventsAttended}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Spent</label>
                  <p className="text-sm text-slate-900 mt-1">{formatCurrency(selectedVendor.totalSpent)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wallet Balance</label>
                  <p className="text-sm text-slate-900 mt-1">{formatCurrency(selectedVendor.walletBalance)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Profile Completeness</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedVendor.profileCompleteness}%</p>
                </div>
              </div>
            </div>

            {selectedVendor.bio && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bio</label>
                <p className="text-sm text-slate-900 mt-1 leading-relaxed">{selectedVendor.bio}</p>
              </div>
            )}

            {selectedVendor.interests && selectedVendor.interests.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interests</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedVendor.interests.map((interest, i) => (
                    <span key={i} className="text-xs bg-lime/10 text-dark px-3 py-1 rounded-full font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              {selectedVendor.hasProfile && selectedVendor.vendorStatus === "pending" && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                    const res = await fetch(`/api/admin/users/${selectedVendor.id}`, {
                      method: "PATCH",
                      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "approved" }),
                    });
                    if (res.ok) {
                      fetchVendors();
                      setShowDetails(false);
                    }
                  }}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={async () => {
                    const res = await fetch(`/api/admin/users/${selectedVendor.id}`, {
                      method: "PATCH",
                      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                      body: JSON.stringify({ status: "rejected" }),
                    });
                    if (res.ok) {
                      fetchVendors();
                      setShowDetails(false);
                    }
                  }}>
                    Reject
                  </Button>
                </>
              )}
              {selectedVendor.hasProfile && selectedVendor.vendorStatus === "approved" && (
                <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={async () => {
                  const res = await fetch(`/api/admin/users/${selectedVendor.id}`, {
                    method: "PATCH",
                    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "suspended" }),
                  });
                  if (res.ok) {
                    fetchVendors();
                    setShowDetails(false);
                  }
                }}>
                  Suspend
                </Button>
              )}
              {selectedVendor.hasProfile && selectedVendor.vendorStatus === "suspended" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                  const res = await fetch(`/api/admin/users/${selectedVendor.id}`, {
                    method: "PATCH",
                    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "approved" }),
                  });
                  if (res.ok) {
                    fetchVendors();
                    setShowDetails(false);
                  }
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
