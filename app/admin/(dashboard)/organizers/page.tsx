"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface Organizer {
  id: string;
  display_name?: string;
  email: string;
  is_active: boolean;
  eventsCount?: number;
  totalRevenue?: number;
  createdAt?: number;
  lastActivityAt?: number;
  phone?: string;
  city?: string;
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrganizers(data.data?.users || []);
        setTotalPages(data.data?.pagination?.totalPages || 1);
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
    total: organizers.length,
    active: organizers.filter((o) => o.is_active).length,
    inactive: organizers.filter((o) => !o.is_active).length,
  };

  const formatDate = (ts?: number) =>
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
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Events</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Revenue</th>
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
                        <div className="w-9 h-9 rounded-full bg-lime/10 flex items-center justify-center text-sm font-bold text-dark">
                          {(o.display_name || o.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{o.display_name || "Unnamed"}</p>
                          <p className="text-xs text-slate-400">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-slate-600">{o.phone || "—"}</p>
                      <p className="text-xs text-slate-400">{o.city || "—"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-slate-900">{o.eventsCount || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-slate-900">
                        ₦{((o as any).totalRevenue || 0).toLocaleString()}
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
              <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center text-xl font-bold text-dark">
                {(selectedOrganizer.display_name || selectedOrganizer.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedOrganizer.display_name || "Unnamed"}
                </h3>
                <p className="text-sm text-slate-500">{selectedOrganizer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
                <p className="text-sm text-slate-900 mt-1">{selectedOrganizer.city || "Not provided"}</p>
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
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</label>
                <p className="text-sm text-slate-900 mt-1">₦{((selectedOrganizer as any).totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await fetch(`/api/admin/users/${selectedOrganizer.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ is_active: !selectedOrganizer.is_active }),
                  });
                  fetchOrganizers();
                  setShowDetails(false);
                }}
              >
                {selectedOrganizer.is_active ? "Suspend" : "Activate"}
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
