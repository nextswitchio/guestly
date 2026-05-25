"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import { formatCurrency } from "@/lib/utils";

type AffiliateStatus = "pending" | "approved" | "suspended";
type CommissionType = "percentage" | "fixed" | "hybrid";
type AttributionModel = "first_click" | "last_click" | "linear";

interface CommissionSettings {
  commissionEnabled: boolean;
  commissionType: CommissionType;
  commissionRate: number;
  fixedCommissionAmount: number;
  payoutThreshold: number;
  cookieWindowDays: number;
  attributionModel: AttributionModel;
  autoApproveCommissions: boolean;
  recurringCommissions: boolean;
  maxCommissionPerOrder: number;
  notes: string;
}

interface AffiliateUser {
  id: string;
  email: string;
  displayName: string;
  status: AffiliateStatus;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  commissionSettings: CommissionSettings;
  performance: {
    paidOrders: number;
    attributedRevenue: number;
    estimatedCommission: number;
  };
  location?: {
    city?: string;
    country?: string;
  } | null;
}

interface AffiliateStats {
  totalAffiliates: number;
  statusCounts: Record<string, number>;
  commissionEnabled: number;
  averageCommissionRate: number;
  attributedRevenue: number;
  estimatedCommission: number;
}

interface AffiliateListData {
  affiliates: AffiliateUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "suspended", label: "Suspended" },
];

const commissionTypeOptions = [
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed amount" },
  { value: "hybrid", label: "Hybrid" },
];

const attributionOptions = [
  { value: "last_click", label: "Last click" },
  { value: "first_click", label: "First click" },
  { value: "linear", label: "Linear" },
];

async function fetchStats(): Promise<AffiliateStats | null> {
  const response = await fetch("/api/admin/affiliates?stats=true");
  const data = await response.json();
  return data.success ? data.data : null;
}

async function fetchAffiliates({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status: string;
}): Promise<AffiliateListData | null> {
  const params = new URLSearchParams({
    page: String(page),
    limit: "20",
  });

  if (search) params.set("search", search);
  if (status && status !== "all") params.set("status", status);

  const response = await fetch(`/api/admin/affiliates?${params}`);
  const data = await response.json();
  return data.success ? data.data : null;
}

function statusClass(status: AffiliateStatus) {
  switch (status) {
    case "approved":
      return "bg-success-50 text-success-700";
    case "suspended":
      return "bg-danger-50 text-danger-700";
    default:
      return "bg-warning-50 text-warning-700";
  }
}

function toSettingsForm(settings: CommissionSettings): Record<keyof CommissionSettings, string> {
  return {
    commissionEnabled: settings.commissionEnabled ? "true" : "false",
    commissionType: settings.commissionType,
    commissionRate: String(settings.commissionRate ?? 0),
    fixedCommissionAmount: String(settings.fixedCommissionAmount ?? 0),
    payoutThreshold: String(settings.payoutThreshold ?? 0),
    cookieWindowDays: String(settings.cookieWindowDays ?? 0),
    attributionModel: settings.attributionModel,
    autoApproveCommissions: settings.autoApproveCommissions ? "true" : "false",
    recurringCommissions: settings.recurringCommissions ? "true" : "false",
    maxCommissionPerOrder: String(settings.maxCommissionPerOrder ?? 0),
    notes: settings.notes ?? "",
  };
}

function fromSettingsForm(form: Record<keyof CommissionSettings, string>): CommissionSettings {
  return {
    commissionEnabled: form.commissionEnabled === "true",
    commissionType: form.commissionType as CommissionType,
    commissionRate: Number(form.commissionRate || 0),
    fixedCommissionAmount: Number(form.fixedCommissionAmount || 0),
    payoutThreshold: Number(form.payoutThreshold || 0),
    cookieWindowDays: Number(form.cookieWindowDays || 0),
    attributionModel: form.attributionModel as AttributionModel,
    autoApproveCommissions: form.autoApproveCommissions === "true",
    recurringCommissions: form.recurringCommissions === "true",
    maxCommissionPerOrder: Number(form.maxCommissionPerOrder || 0),
    notes: form.notes,
  };
}

export default function AdminAffiliatesPage() {
  const [stats, setStats] = React.useState<AffiliateStats | null>(null);
  const [affiliates, setAffiliates] = React.useState<AffiliateUser[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = React.useState<AffiliateUser | null>(null);
  const [settingsForm, setSettingsForm] = React.useState<Record<keyof CommissionSettings, string> | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<AffiliateStatus>("pending");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const selectedAffiliateIdRef = React.useRef<string | null>(null);

  const applySelectedAffiliate = React.useCallback((affiliate: AffiliateUser | null) => {
    selectedAffiliateIdRef.current = affiliate?.id ?? null;
    setSelectedAffiliate(affiliate);
    setSelectedStatus(affiliate?.status ?? "pending");
    setSettingsForm(affiliate ? toSettingsForm(affiliate.commissionSettings) : null);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    let active = true;

    async function loadData() {
      const [statsData, affiliateData] = await Promise.all([
        fetchStats(),
        fetchAffiliates({
          page: currentPage,
          search: debouncedSearchQuery,
          status: statusFilter,
        }),
      ]);

      if (!active) return;
      if (statsData) setStats(statsData);
      if (affiliateData) {
        setAffiliates(affiliateData.affiliates);
        setTotalPages(affiliateData.pagination.totalPages);
        const currentId = selectedAffiliateIdRef.current;
        const nextAffiliate = affiliateData.affiliates.find((affiliate) => affiliate.id === currentId) ?? affiliateData.affiliates[0] ?? null;
        applySelectedAffiliate(nextAffiliate);
      }
      setLoading(false);
    }

    loadData().catch((loadError) => {
      console.error("Failed to fetch affiliates:", loadError);
      if (active) {
        setError("Could not load affiliates from the database.");
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [applySelectedAffiliate, currentPage, debouncedSearchQuery, statusFilter]);

  async function refreshData() {
    const [statsData, affiliateData] = await Promise.all([
      fetchStats(),
      fetchAffiliates({
        page: currentPage,
        search: debouncedSearchQuery,
        status: statusFilter,
      }),
    ]);

    if (statsData) setStats(statsData);
    if (affiliateData) {
      setAffiliates(affiliateData.affiliates);
      setTotalPages(affiliateData.pagination.totalPages);
      const currentId = selectedAffiliateIdRef.current;
      const nextAffiliate = affiliateData.affiliates.find((affiliate) => affiliate.id === currentId) ?? affiliateData.affiliates[0] ?? null;
      applySelectedAffiliate(nextAffiliate);
    }
  }

  async function saveAffiliateSettings(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedAffiliate || !settingsForm) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/affiliates/${selectedAffiliate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          commissionSettings: fromSettingsForm(settingsForm),
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.detail || data.error?.message || "Failed to save affiliate");
      }
      applySelectedAffiliate(data.data);
      await refreshData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save affiliate settings.");
    } finally {
      setSaving(false);
    }
  }

  function updateSettingsField<K extends keyof CommissionSettings>(field: K, value: string) {
    setSettingsForm((current) => current ? { ...current, [field]: value } : current);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Affiliate Management</h1>
          <p className="text-sm text-slate-500">Manage affiliate users and commission settings</p>
        </div>
        <Button variant="outline" onClick={refreshData}>
          <Icon name="refresh-cw" size={16} />
          Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Affiliates" value={stats.totalAffiliates.toLocaleString()} detail={`${stats.statusCounts.approved ?? 0} approved`} />
          <StatCard title="Commission Enabled" value={stats.commissionEnabled.toLocaleString()} detail="Active commission profiles" />
          <StatCard title="Average Rate" value={`${stats.averageCommissionRate}%`} detail="Across affiliate users" />
          <StatCard title="Attributed Revenue" value={formatCurrency(stats.attributedRevenue)} detail="Paid affiliate orders" />
          <StatCard title="Estimated Commission" value={formatCurrency(stats.estimatedCommission)} detail="From current settings" />
        </div>
      )}

      {error && (
        <Card className="border-danger-100 bg-danger-50 p-4">
          <p className="text-sm font-medium text-danger-700">{error}</p>
        </Card>
      )}

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            placeholder="Search affiliates by name or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            leftIcon={<Icon name="search" size={16} />}
          />
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            options={statusOptions}
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.65fr)]">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Affiliate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Commission</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">Loading affiliates...</td>
                  </tr>
                ) : affiliates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">No affiliate users found in the database.</td>
                  </tr>
                ) : affiliates.map((affiliate) => (
                  <tr
                    key={affiliate.id}
                    className={`cursor-pointer transition-colors hover:bg-neutral-50 ${
                      selectedAffiliate?.id === affiliate.id ? "bg-primary-50/50" : ""
                    }`}
                    onClick={() => applySelectedAffiliate(affiliate)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                          {(affiliate.displayName || affiliate.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{affiliate.displayName}</p>
                          <p className="text-sm text-slate-500">{affiliate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(affiliate.status)}`}>
                        {affiliate.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      <p className="font-medium text-slate-900 capitalize">{affiliate.commissionSettings.commissionType.replace("_", " ")}</p>
                      <p>
                        {affiliate.commissionSettings.commissionRate}% · {formatCurrency(affiliate.commissionSettings.fixedCommissionAmount)} fixed
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right text-sm">
                      <p className="font-semibold text-slate-900">{formatCurrency(affiliate.performance.estimatedCommission)}</p>
                      <p className="text-slate-500">{affiliate.performance.paidOrders} paid orders</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
              <p className="text-sm text-slate-500">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          {selectedAffiliate && settingsForm ? (
            <form onSubmit={saveAffiliateSettings} className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedAffiliate.displayName}</h2>
                <p className="text-sm text-slate-500">{selectedAffiliate.email}</p>
              </div>

              <Select
                label="Affiliate Status"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as AffiliateStatus)}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "suspended", label: "Suspended" },
                ]}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Commission Enabled"
                  value={settingsForm.commissionEnabled}
                  onChange={(event) => updateSettingsField("commissionEnabled", event.target.value)}
                  options={[
                    { value: "true", label: "Enabled" },
                    { value: "false", label: "Disabled" },
                  ]}
                />
                <Select
                  label="Commission Type"
                  value={settingsForm.commissionType}
                  onChange={(event) => updateSettingsField("commissionType", event.target.value)}
                  options={commissionTypeOptions}
                />
                <Input
                  label="Commission Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settingsForm.commissionRate}
                  onChange={(event) => updateSettingsField("commissionRate", event.target.value)}
                />
                <Input
                  label="Fixed Commission (₦)"
                  type="number"
                  min="0"
                  step="100"
                  value={settingsForm.fixedCommissionAmount}
                  onChange={(event) => updateSettingsField("fixedCommissionAmount", event.target.value)}
                />
                <Input
                  label="Payout Threshold (₦)"
                  type="number"
                  min="0"
                  step="500"
                  value={settingsForm.payoutThreshold}
                  onChange={(event) => updateSettingsField("payoutThreshold", event.target.value)}
                />
                <Input
                  label="Cookie Window (days)"
                  type="number"
                  min="0"
                  step="1"
                  value={settingsForm.cookieWindowDays}
                  onChange={(event) => updateSettingsField("cookieWindowDays", event.target.value)}
                />
                <Select
                  label="Attribution Model"
                  value={settingsForm.attributionModel}
                  onChange={(event) => updateSettingsField("attributionModel", event.target.value)}
                  options={attributionOptions}
                />
                <Input
                  label="Max Commission Per Order"
                  type="number"
                  min="0"
                  step="100"
                  value={settingsForm.maxCommissionPerOrder}
                  onChange={(event) => updateSettingsField("maxCommissionPerOrder", event.target.value)}
                />
                <Select
                  label="Auto Approve Commissions"
                  value={settingsForm.autoApproveCommissions}
                  onChange={(event) => updateSettingsField("autoApproveCommissions", event.target.value)}
                  options={[
                    { value: "false", label: "Manual review" },
                    { value: "true", label: "Auto approve" },
                  ]}
                />
                <Select
                  label="Recurring Commissions"
                  value={settingsForm.recurringCommissions}
                  onChange={(event) => updateSettingsField("recurringCommissions", event.target.value)}
                  options={[
                    { value: "false", label: "Disabled" },
                    { value: "true", label: "Enabled" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-neutral-700">Admin Notes</label>
                <textarea
                  value={settingsForm.notes}
                  onChange={(event) => updateSettingsField("notes", event.target.value)}
                  className="min-h-24 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                />
              </div>

              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Attributed revenue</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(selectedAffiliate.performance.attributedRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Current estimate</p>
                    <p className="font-semibold text-slate-900">{formatCurrency(selectedAffiliate.performance.estimatedCommission)}</p>
                  </div>
                </div>
              </div>

              <Button type="submit" fullWidth loading={saving}>
                <Icon name="save" size={16} />
                Save Affiliate Settings
              </Button>
            </form>
          ) : (
            <div className="py-16 text-center">
              <Icon name="users" size={40} className="mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-medium text-slate-900">No affiliate selected</p>
              <p className="mt-1 text-sm text-slate-500">Select an affiliate user to manage commission settings.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </Card>
  );
}
