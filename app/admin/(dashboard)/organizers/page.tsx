"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { getAuthHeaders } from "@/lib/api/client";

interface Organizer {
  id: string;
  display_name?: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  eventsCount?: number;
  eventsAttended?: number;
  totalSpent?: number;
  walletBalance?: number;
  profileCompleteness?: number;
  createdAt?: string;
  lastActivityAt?: string;
  location?: { city?: string; country?: string };
  avatar?: string;
  bio?: string;
  interests?: string[];
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizers, setTotalOrganizers] = useState(0);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        role: "organiser",
        page: currentPage.toString(),
        limit: "20",
      });
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const raw = await res.json();
        let rawItems: any[] = [];
        let pages = 1;

        if (Array.isArray(raw)) {
          rawItems = raw;
        } else if (raw.data) {
          if (Array.isArray(raw.data)) {
            rawItems = raw.data;
          } else if (raw.data.users) {
            rawItems = raw.data.users;
            pages = raw.data.pagination?.totalPages || raw.data.totalPages || 1;
          }
        } else if (raw.users) {
          rawItems = raw.users;
          pages = raw.pagination?.totalPages || raw.totalPages || 1;
        }

        const items: Organizer[] = rawItems.map((u: any) => ({
          id: u.id,
          email: u.email,
          display_name: u.displayName ?? u.display_name ?? "Unnamed",
          role: u.role ?? "organizer",
          is_active: u.status === "active" || u.is_active === true,
          is_verified: u.isVerified === true,
          eventsCount: u.eventsCreated ?? 0,
          eventsAttended: u.eventsAttended ?? 0,
          totalSpent: u.totalSpent ?? 0,
          walletBalance: u.walletBalance ?? 0,
          profileCompleteness: u.profileCompleteness ?? 0,
          createdAt: u.createdAt,
          lastActivityAt: u.lastActivityAt,
          location: u.location ?? undefined,
          avatar: u.avatar,
          bio: u.bio,
          interests: u.interests ?? [],
        }));

        setOrganizers(items);
        setTotalPages(pages);
        setTotalOrganizers(items.length);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const stats = {
    total: totalOrganizers || organizers.length,
    active: organizers.filter((o) => o.is_active).length,
    inactive: organizers.filter((o) => !o.is_active).length,
  };

  const formatDate = (ts?: string | number) =>
    ts ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organizer Management</h1>
        <p className="text-sm text-slate-500">Manage event organizers and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Icon name="users" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Organizers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <Icon name="check-circle" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Icon name="x-circle" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-xs text-slate-500">Inactive</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search organizers by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive"].map((s) => (
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

      {/* Organizers Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-lime border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500">Loading organizers...</p>
          </div>
        ) : organizers.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="calendar" size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-500 mb-1">No organizers found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Organizer</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Events</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Spent</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Verified</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedOrganizer(o);
                      setShowDetails(true);
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {o.avatar ? (
                          <img src={o.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-lime/10 flex items-center justify-center text-sm font-bold text-dark">
                            {(o.display_name || o.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{o.display_name || "Unnamed"}</p>
                          <p className="text-xs text-slate-400">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-600">{o.location?.city || "—"}</p>
                      {o.location?.country && (
                        <p className="text-xs text-slate-400">{o.location.country}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-slate-900">{o.eventsCount || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-slate-900">
                        ₦{(o.totalSpent || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        o.is_verified ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {o.is_verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{formatDate(o.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          o.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {o.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrganizer(o);
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Organizer Details Modal */}
      <Modal
        open={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedOrganizer(null);
        }}
        title="Organizer Details"
        size="lg"
      >
        {selectedOrganizer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
              {selectedOrganizer.avatar ? (
                <img src={selectedOrganizer.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center text-xl font-bold text-dark">
                  {(selectedOrganizer.display_name || selectedOrganizer.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedOrganizer.display_name || "Unnamed"}
                </h3>
                <p className="text-sm text-slate-500">{selectedOrganizer.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    selectedOrganizer.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedOrganizer.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    selectedOrganizer.is_verified ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {selectedOrganizer.is_verified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.location?.city || "Not provided"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Country</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.location?.country || "Not provided"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</label>
                <p className="text-sm text-slate-900 mt-1">{formatDate(selectedOrganizer.createdAt)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last Activity</label>
                <p className="text-sm text-slate-900 mt-1">{formatDate(selectedOrganizer.lastActivityAt)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Events Created</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.eventsCount || 0}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Events Attended</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.eventsAttended || 0}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Spent</label>
                <p className="text-sm text-slate-900 mt-1">₦{(selectedOrganizer.totalSpent || 0).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wallet Balance</label>
                <p className="text-sm text-slate-900 mt-1">₦{(selectedOrganizer.walletBalance || 0).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Profile Completeness</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.profileCompleteness || 0}%</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</label>
                <p className="text-sm text-slate-900 mt-1 capitalize">{selectedOrganizer.role}</p>
              </div>
            </div>

            {selectedOrganizer.bio && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bio</label>
                <p className="text-sm text-slate-900 mt-1 leading-relaxed">{selectedOrganizer.bio}</p>
              </div>
            )}

            {selectedOrganizer.interests && selectedOrganizer.interests.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interests</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedOrganizer.interests.map((interest: string, i: number) => (
                    <span key={i} className="text-xs bg-lime/10 text-dark px-3 py-1 rounded-full font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await fetch(`/api/admin/users/${selectedOrganizer.id}`, {
                    method: "PATCH",
                    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                    body: JSON.stringify({ is_active: !selectedOrganizer.is_active }),
                  });
                  fetchOrganizers();
                  setShowDetails(false);
                }}
              >
                {selectedOrganizer.is_active ? "Suspend Account" : "Activate Account"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
