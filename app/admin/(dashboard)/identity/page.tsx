"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, ExternalLink, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

const statusOptions: Array<"" | VerificationStatus> = ["", "pending", "under_review", "verified", "rejected"];
const roleOptions: Array<"" | VerificationRole> = ["", "organiser", "vendor", "affiliate"];

function statusClass(status: VerificationStatus) {
  if (status === "verified") return "bg-green-100 text-green-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  if (status === "under_review") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
}

function formatDate(value?: number) {
  return value ? new Date(value).toLocaleDateString() : "Not available";
}

export default function AdminIdentityPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [role, setRole] = useState<"" | VerificationRole>("");
  const [status, setStatus] = useState<"" | VerificationStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const pendingCount = useMemo(
    () => verifications.filter((item) => item.status === "pending" || item.status === "under_review").length,
    [verifications],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (role) params.set("role", role);
      if (status) params.set("status", status);
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
  }, [role, status]);

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
          <p className="text-sm text-slate-500">Review organizers, vendors, and affiliates before they unlock protected workflows.</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Requests in view</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{verifications.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Needs review</p>
          <p className="mt-1 text-3xl font-bold text-amber-700">{pendingCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Verified in view</p>
          <p className="mt-1 text-3xl font-bold text-green-700">{verifications.filter((item) => item.status === "verified").length}</p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as "" | VerificationRole)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20">
              {roleOptions.map((option) => (
                <option key={option || "all"} value={option}>{option ? option : "All roles"}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "" | VerificationStatus)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20">
              {statusOptions.map((option) => (
                <option key={option || "all"} value={option}>{option ? option.replace("_", " ") : "All statuses"}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      ) : verifications.length === 0 ? (
        <Card className="p-12 text-center">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900">No verification requests</h2>
          <p className="mt-1 text-sm text-slate-500">Try a different role or status filter.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {verifications.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{item.legalFirstName} {item.legalLastName}</h2>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">{item.role}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${statusClass(item.status)}`}>{item.status.replace("_", " ")}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p><span className="font-medium text-slate-900">Document:</span> {item.docType.replace("_", " ")}</p>
                    <p><span className="font-medium text-slate-900">Number:</span> {item.docNumber}</p>
                    <p><span className="font-medium text-slate-900">Nationality:</span> {item.nationality || "Not provided"}</p>
                    <p><span className="font-medium text-slate-900">Submitted:</span> {formatDate(item.submittedAt)}</p>
                  </div>
                  {item.rejectionReason && (
                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {item.rejectionReason}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      ["Front", item.documentFrontUrl],
                      ["Back", item.documentBackUrl],
                      ["Selfie", item.selfieUrl],
                    ].map(([label, href]) => href ? (
                      <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        {label} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null)}
                  </div>
                </div>
                <div className="w-full shrink-0 space-y-3 lg:w-80">
                  <textarea
                    value={rejectionReasons[item.id] || ""}
                    onChange={(e) => setRejectionReasons((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Reason if rejected"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="success" onClick={() => review(item.id, "verified")} disabled={savingId === item.id || item.status === "verified"}>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="danger" onClick={() => review(item.id, "rejected")} disabled={savingId === item.id || item.status === "rejected"}>
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
