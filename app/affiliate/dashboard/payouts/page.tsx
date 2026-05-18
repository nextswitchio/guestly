'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wallet, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Plus, RefreshCw } from 'lucide-react';

interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  minPayout: number;
  paymentMethod: string;
  paymentDetails: Record<string, string>;
}

export default function PayoutsPage() {
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, payoutsRes] = await Promise.all([
        fetch('/api/affiliates/dashboard'),
        fetch('/api/affiliates/payouts'),
      ]);

      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary({
          totalEarnings: data.affiliate?.totalEarnings || 0,
          pendingEarnings: data.affiliate?.pendingEarnings || 0,
          paidEarnings: data.affiliate?.paidEarnings || 0,
          minPayout: 50,
          paymentMethod: data.affiliate?.paymentMethod || 'bank',
          paymentDetails: data.affiliate?.paymentDetails || {},
        });
      }

      if (payoutsRes.ok) {
        const data = await payoutsRes.json();
        setPayouts(data.payouts || []);
      }
    } catch (error) {
      console.error('Failed to fetch payout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!summary) return;
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount < summary.minPayout) {
      alert(`Minimum payout amount is ₦${summary.minPayout}`);
      return;
    }
    if (amount > summary.pendingEarnings) {
      alert('Amount exceeds available balance');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/affiliates/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        setShowRequestModal(false);
        setRequestAmount('');
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to request payout');
      }
    } catch (error) {
      alert('Failed to request payout');
    } finally {
      setProcessing(false);
    }
  };

  const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    pending: { icon: <Clock className="h-4 w-4" />, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
    approved: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Approved' },
    processing: { icon: <AlertCircle className="h-4 w-4" />, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Processing' },
    completed: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
    rejected: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-600', bg: 'bg-red-100', label: 'Rejected' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Payouts</h1>
          <p className="text-neutral-500 mt-1">Manage your earnings and withdrawal requests</p>
        </div>
      </div>

      {/* Earnings Overview */}
      {summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-neutral-500">Total Earnings</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">₦{summary.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-neutral-500 mt-1">Lifetime earnings</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-neutral-500">Available</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-lime/10">
                  <Wallet className="h-5 w-5 text-lime" />
                </div>
              </div>
              <p className="text-2xl font-bold text-lime">₦{summary.pendingEarnings.toLocaleString()}</p>
              <p className="text-xs text-neutral-500 mt-1">Ready for payout</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-neutral-500">Paid Out</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">₦{summary.paidEarnings.toLocaleString()}</p>
              <p className="text-xs text-neutral-500 mt-1">Total withdrawn</p>
            </div>
          </div>

          {/* Request Payout CTA */}
          {summary.pendingEarnings >= summary.minPayout && (
            <div className="rounded-2xl bg-lime p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-dark">Ready for Payout</h3>
                  <p className="text-sm text-dark/70">You have ₦{summary.pendingEarnings.toLocaleString()} available for withdrawal</p>
                </div>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-sm font-semibold text-lime hover:bg-dark/90 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Request Payout
                </button>
              </div>
            </div>
          )}

          {summary.pendingEarnings < summary.minPayout && summary.pendingEarnings > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-800">You need at least ₦{summary.minPayout} to request a payout. You currently have ₦{summary.pendingEarnings.toLocaleString()}.</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payout History */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payout History</h3>
        {payouts.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No payout requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => {
              const status = statusConfig[payout.status];
              return (
                <div key={payout.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.bg}`}>
                      <span className={status.color}>{status.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">₦{payout.amount.toLocaleString()}</p>
                      <p className="text-xs text-neutral-500">{new Date(payout.requestedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    {payout.notes && (
                      <span className="text-xs text-neutral-500" title={payout.notes}>
                        <AlertCircle className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showRequestModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Request Payout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder={`Min ₦${summary.minPayout}`}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-500">Payment Method</p>
                <p className="text-sm font-medium text-neutral-900 capitalize">{summary.paymentMethod}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRequestPayout}
                  disabled={processing}
                  className="flex-1 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => { setShowRequestModal(false); setRequestAmount(''); }}
                  className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
