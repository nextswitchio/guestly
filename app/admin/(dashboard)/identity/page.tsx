"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ExternalLink,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type VerificationStatus = "pending" | "under_review" | "verified" | "rejected";
type VerificationRole = "organiser" | "vendor" | "affiliate";

type Verification = {
  id: string;
  userId: string;
  role: VerificationRole;
  docType: string;
  docNumber: string;
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: string;
  nationality?: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  status: VerificationStatus;
  rejectionReason?: string;
  submittedAt?: number;
  reviewedAt?: number;
};

const statusOptions: VerificationStatus[] = ["pending", "under_review", "verified", "rejected"];
const roleOptions: VerificationRole[] = ["organiser", "vendor", "affiliate"];

function statusClass(status: VerificationStatus) {
  if (status === "verified") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "under_review") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

function formatDate(value?: number) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDocType(docType: string) {
  return docType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminIdentityPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<VerificationRole | "">("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const total = verifications.length;
    const pending = verifications.filter((v) => v.status === "pending" || v.status === "under_review").length;
    const verified = verifications.filter((v) => v.status === "verified").length;
    const rejected = verifications.filter((v) => v.status === "rejected").length;
    return { total, pending, verified, rejected };
  }, [verifications]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return verifications.filter((v) => {
      if (roleFilter && v.role !== roleFilter) return false;
      if (statusFilter && v.status !== statusFilter) return false;
      if (q) {
        const fullName = `${v.legalFirstName} ${v.legalLastName}`.toLowerCase();
        return (
          fullName.includes(q) ||
          v.docNumber.toLowerCase().includes(q) ||
          v.nationality?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [verifications, search, roleFilter, statusFilter]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/identity/review${params.size ? `?${params}` : ""}`, { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to load verification requests.");
      }
      const data = await res.json();
      setVerifications(data.verifications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load verification requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [roleFilter, statusFilter]);

  async function review(documentId: string, nextStatus: "verified" | "rejected") {
    const rejectionReason = rejectionReasons[documentId]?.trim();
    if (nextStatus === "rejected" && !rejectionReason) {
      setError("Add a rejection reason before rejecting a request.");
      return;
    }
    setSavingId(documentId);
    setError("");
    try {
      const res = await fetch("/api/identity/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, status: nextStatus, rejectionReason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to update request.");
      }
      setRejectionReasons((prev) => ({ ...prev, [documentId]: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update request.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Identity Verification</h1>
          <p className="text-sm text-slate-500">
            Review organizers, vendors, and affiliates before they unlock protected workflows.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total requests</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
              <p className="text-xs text-slate-500">Needs review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
              <p className="text-xs text-slate-500">Verified</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-neutral-200 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, document number, or nationality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "" | VerificationRole)}
              className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
            >
              <option value="">All roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | VerificationStatus)}
              className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h2 className="text-lg font-semibold text-slate-900">No verification requests</h2>
            <p className="mt-1 text-sm text-slate-500">Try a different role or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Document
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Nationality
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Docs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {item.legalFirstName} {item.legalLastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 capitalize">
                      {item.role}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {formatDocType(item.docType)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.docNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {item.nationality || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass(item.status)}`}>
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[
                          ["Front", item.documentFrontUrl],
                          ["Back", item.documentBackUrl],
                          ["Selfie", item.selfieUrl],
                        ].map(([label, href]) =>
                          href ? (
                            <a
                              key={label}
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-neutral-50"
                            >
                              {label}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : null,
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "verified" || item.status === "rejected" ? (
                        <span className="text-xs text-slate-400">
                          {item.status === "verified" ? "Approved" : "Rejected"}
                          {item.reviewedAt ? ` ${formatDate(item.reviewedAt)}` : ""}
                        </span>
                      ) : (
                        <div className="space-y-2">
                          {item.rejectionReason && (
                            <div className="rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                              {item.rejectionReason}
                            </div>
                          )}
                          <textarea
                            value={rejectionReasons[item.id] || ""}
                            onChange={(e) =>
                              setRejectionReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            placeholder="Rejection reason…"
                            rows={2}
                            className="w-full resize-none rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => review(item.id, "verified")}
                              disabled={savingId === item.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => review(item.id, "rejected")}
                              disabled={savingId === item.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
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
