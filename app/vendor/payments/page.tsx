"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Banknote, Plus, Receipt, CheckCircle, Clock, AlertCircle, RefreshCw, Wallet } from "lucide-react";

export default function VendorPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const [payRes, invRes] = await Promise.all([
        fetch("/api/vendor/payments"),
        fetch("/api/vendors/invitations"),
      ]);
      if (payRes.ok) {
        const d = await payRes.json();
        if (d.success) {
          const raw = d.data || [];
          const list = Array.isArray(raw) ? raw : raw.payments || [];
          setPayments(list);
          const totalEarnings = list.reduce((s: number, p: any) => s + (p.status === "paid" || p.status === "confirmed" ? p.amount : (p.amount_paid || 0)), 0);
          const paidAmount = list.filter((p: any) => p.status === "paid" || p.status === "confirmed").reduce((s: number, p: any) => s + p.amount, 0);
          const pendingAmount = list.filter((p: any) => p.status === "pending" || p.status === "partial").reduce((s: number, p: any) => s + (p.amount - (p.amount_paid || 0)), 0);
          setStats({ totalEarnings, paidAmount, pendingAmount, totalPayments: list.length, paidPayments: list.filter((p: any) => p.status === "paid" || p.status === "confirmed").length, pendingPayments: list.filter((p: any) => p.status === "pending" || p.status === "partial").length });
        }
      }
      if (invRes.ok) {
        const d = await invRes.json();
        if (d.success) {
          const acc = (d.data || []).filter((i: any) => i.status === "accepted");
          setEvents(acc.map((i: any) => ({ id: i.event?.id || i.eventId, title: i.event?.title || "Event" })));
        }
      }
    } catch (e) { console.error(e); setError("Failed to load payments"); }
    finally { setLoading(false); }
  };

  const handleRequest = async () => {
    if (!selectedEventId || !amount) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/vendor/payments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: selectedEventId, amount: parseFloat(amount), notes }),
      });
      if (res.ok) { setShowForm(false); setSelectedEventId(""); setAmount(""); setNotes(""); fetchData(); }
      else { const e = await res.json().catch(() => ({ error: "Request failed" })); setError(e.error || e.detail || "Request failed"); }
    } catch (e) { console.error(e); setError("Network error"); }
    finally { setSubmitting(false); }
  };

  const handleConfirm = async (paymentId: string) => {
    setConfirmingId(paymentId);
    setError(null);
    try {
      const res = await fetch(`/api/vendor/payments/${paymentId}/confirm`, {
        method: "POST",
      });
      if (res.ok) { fetchData(); }
      else { const e = await res.json().catch(() => ({ error: "Confirmation failed" })); setError(e.error || "Confirmation failed"); }
    } catch (e) { console.error(e); setError("Network error"); }
    finally { setConfirmingId(null); }
  };

  const badge = (status: string) => {
    const s: Record<string, string> = { pending: "bg-warning-50 text-warning-700", partial: "bg-blue-50 text-blue-700", paid: "bg-lime/10 text-dark", confirmed: "bg-lime/10 text-dark", cancelled: "bg-gray-100 text-gray-500" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s[status] || s.pending}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const fmt = (n: number) => `₦${n.toLocaleString()}`;
  const fmtDate = (ts: number | string) => {
    if (!ts) return "—";
    const d = typeof ts === "string" ? new Date(ts) : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-50 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Payments</h1>
          <p className="text-gray-500 mt-1">Track your earnings and payment requests</p>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Request Payment</Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="text-xs font-medium underline hover:no-underline">Retry</button>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-lime/10"><Receipt className="w-5 h-5 text-dark" /></div>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </div>
            <p className="text-3xl font-bold text-dark">{fmt(stats.totalEarnings)}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.totalPayments} request{stats.totalPayments !== 1 ? "s" : ""}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-lime/10"><CheckCircle className="w-5 h-5 text-dark" /></div>
              <p className="text-sm text-gray-500">Received</p>
            </div>
            <p className="text-3xl font-bold text-dark">{fmt(stats.paidAmount)}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.paidPayments} completed</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-warning-50"><Clock className="w-5 h-5 text-warning-600" /></div>
              <p className="text-sm text-gray-500">Outstanding</p>
            </div>
            <p className="text-3xl font-bold text-warning-600">{fmt(stats.pendingAmount)}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.pendingPayments} pending</p>
          </Card>
        </div>
      )}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-dark mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <Banknote className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No payment requests yet</p>
            <Button onClick={() => setShowForm(true)}>Create Your First Request</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((p: any) => {
              const balance = p.amount - (p.amount_paid || 0);
              const needsConfirm = (p.status === "paid" || p.status === "partial") && !p.confirmed_at;
              return (
              <div key={p.id} className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-dark">{p.eventName || "Payment"}</h3>
                    {badge(p.status)}
                  </div>
                  <span className="text-xl font-bold text-dark">{fmt(p.amount)}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-400">Requested: <span className="text-gray-600">{fmtDate(p.created_at || p.createdAt)}</span></span>
                  {p.paid_at && <span className="text-gray-400">Paid: <span className="text-gray-600">{fmtDate(p.paid_at)}</span></span>}
                  {p.confirmed_at && <span className="text-gray-400">Confirmed: <span className="text-gray-600">{fmtDate(p.confirmed_at)}</span></span>}
                  {p.payment_method && <span className="text-gray-400">Method: <span className="text-gray-600 capitalize">{p.payment_method.replace("_", " ")}</span></span>}
                  {p.transaction_reference && <span className="text-gray-400">Ref: <span className="text-gray-600 font-mono text-xs">{p.transaction_reference}</span></span>}
                </div>
                {/* Partial payment progress bar */}
                {(p.amount_paid || 0) > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Paid: {fmt(p.amount_paid || 0)}</span>
                      <span>Balance: {fmt(balance)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-lime rounded-full transition-all" style={{ width: `${Math.min(100, ((p.amount_paid || 0) / p.amount) * 100)}%` }} />
                    </div>
                  </div>
                )}
                {p.notes && <p className="text-sm text-gray-500 mt-2">{p.notes}</p>}
                {/* Confirm Receipt button */}
                {needsConfirm && (
                  <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                    <Wallet className="w-4 h-4 text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-700 flex-1">Payment received but not yet confirmed. Confirm to complete the transaction.</p>
                    <Button size="sm" loading={confirmingId === p.id} onClick={() => handleConfirm(p.id)}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />Confirm Receipt
                    </Button>
                  </div>
                )}
                {/* Transactions breakdown */}
                {p.transactions && p.transactions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Transaction History</p>
                    <div className="space-y-2">
                      {p.transactions.map((txn: any) => (
                        <div key={txn.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle className="w-3.5 h-3.5 text-lime shrink-0" />
                            <span className="text-gray-700 font-medium">{fmt(txn.amount)}</span>
                            {txn.payment_method && <span className="text-gray-400 text-xs capitalize">{txn.payment_method.replace("_", " ")}</span>}
                            {txn.transaction_reference && <span className="text-gray-400 font-mono text-[10px]">#{txn.transaction_reference.slice(0, 8)}</span>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-400">{fmtDate(txn.created_at || txn.createdAt)}</span>
                            {txn.confirmed_at && <CheckCircle className="w-3 h-3 text-lime" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 mx-4">
            <h3 className="text-lg font-semibold text-dark mb-4">Request Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Event</label>
                <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime">
                  <option value="">Select event</option>
                  {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>
              <Input label="Amount (₦)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-dark focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>Cancel</Button>
                <Button onClick={handleRequest} loading={submitting} disabled={!selectedEventId || !amount}>Submit</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
