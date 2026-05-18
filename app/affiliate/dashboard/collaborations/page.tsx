'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Check, X, MessageCircle, ExternalLink, Copy, Check as CheckIcon, RefreshCw } from 'lucide-react';

interface Collaboration {
  id: string;
  organizerId: string;
  organizerName: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  status: 'invited' | 'accepted' | 'declined' | 'active' | 'completed';
  compensationType: 'free-tickets' | 'fixed-payment' | 'commission' | 'hybrid';
  compensationAmount?: number;
  commissionRate?: number;
  freeTicketCount?: number;
  deliverables: string[];
  trackingCode: string;
  promoCode?: string;
  invitedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  metrics?: { reach: number; clicks: number; conversions: number; revenue: number };
  message?: string;
}

type FilterStatus = 'all' | 'invited' | 'accepted' | 'active' | 'completed' | 'declined';

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const res = await fetch('/api/affiliates/collaborations');
      if (res.ok) {
        const data = await res.json();
        setCollaborations(data.collaborations || []);
      }
    } catch (error) {
      console.error('Failed to fetch collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (collabId: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch(`/api/influencers/collaborations/${collabId}/${action}`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchCollaborations();
      }
    } catch (error) {
      console.error(`Failed to ${action} collaboration:`, error);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = filter === 'all' ? collaborations : collaborations.filter(c => c.status === filter);
  const pendingCount = collaborations.filter(c => c.status === 'invited').length;

  const filters: { id: FilterStatus; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'invited', label: 'Pending', count: pendingCount },
    { id: 'accepted', label: 'Accepted' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'declined', label: 'Declined' },
  ];

  const statusStyles: Record<string, string> = {
    invited: 'bg-amber-100 text-amber-700',
    accepted: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-neutral-100 text-neutral-700',
    declined: 'bg-red-100 text-red-700',
  };

  const compLabels: Record<string, string> = {
    'free-tickets': 'Free Tickets',
    'fixed-payment': 'Fixed Payment',
    'commission': 'Commission',
    'hybrid': 'Hybrid',
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
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Collaborations</h1>
          <p className="text-neutral-500 mt-1">Manage invitations from event organizers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === f.id ? 'bg-lime text-dark' : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${filter === f.id ? 'bg-dark/20' : 'bg-neutral-200'}`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Collaboration List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {filter === 'all' ? 'No collaborations yet' : `No ${filter} collaborations`}
          </h3>
          <p className="text-neutral-500 mb-4">
            {filter === 'all' || filter === 'invited'
              ? 'Organizers will send you collaboration invitations here'
              : 'No collaborations match this filter'}
          </p>
          <Link href="/affiliate/dashboard/events" className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors">
            Browse Events <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((collab) => (
            <div key={collab.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{collab.eventName}</h3>
                  <p className="text-sm text-neutral-500">by {collab.organizerName} • {new Date(collab.eventDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-lg ${statusStyles[collab.status]}`}>
                  {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                </span>
              </div>

              {/* Compensation */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm">
                  <span className="text-neutral-500">Type:</span>{' '}
                  <span className="font-medium text-neutral-900">{compLabels[collab.compensationType]}</span>
                </div>
                {collab.commissionRate && (
                  <div className="px-3 py-2 bg-lime/10 rounded-lg text-sm">
                    <span className="text-neutral-500">Commission:</span>{' '}
                    <span className="font-medium text-lime">{collab.commissionRate}%</span>
                  </div>
                )}
                {collab.compensationAmount && (
                  <div className="px-3 py-2 bg-green-100 rounded-lg text-sm">
                    <span className="text-neutral-500">Payment:</span>{' '}
                    <span className="font-medium text-green-700">₦{collab.compensationAmount.toLocaleString()}</span>
                  </div>
                )}
                {collab.freeTicketCount && (
                  <div className="px-3 py-2 bg-blue-100 rounded-lg text-sm">
                    <span className="text-neutral-500">Tickets:</span>{' '}
                    <span className="font-medium text-blue-700">{collab.freeTicketCount} free</span>
                  </div>
                )}
              </div>

              {/* Organizer Message */}
              {collab.message && (
                <div className="mb-4 p-4 bg-neutral-50 rounded-xl">
                  <p className="text-sm text-neutral-700">{collab.message}</p>
                </div>
              )}

              {/* Deliverables */}
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-900 mb-2">Deliverables</p>
                <div className="flex flex-wrap gap-2">
                  {collab.deliverables.map((d, i) => (
                    <span key={i} className="px-2 py-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tracking Code (for accepted/active) */}
              {(collab.status === 'accepted' || collab.status === 'active' || collab.status === 'completed') && (
                <div className="mb-4 p-4 bg-lime/5 border border-lime/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Your Tracking Code</p>
                      <code className="text-sm font-mono text-lime">{collab.trackingCode}</code>
                      {collab.promoCode && (
                        <p className="text-sm text-neutral-500 mt-1">Promo Code: <span className="font-mono font-medium text-neutral-900">{collab.promoCode}</span></p>
                      )}
                    </div>
                    <button
                      onClick={() => copyCode(collab.trackingCode)}
                      className="flex items-center gap-2 rounded-xl bg-lime px-3 py-2 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors"
                    >
                      {copiedCode === collab.trackingCode ? <CheckIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedCode === collab.trackingCode ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Metrics (for active/completed) */}
              {collab.metrics && (collab.status === 'active' || collab.status === 'completed') && (
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Clicks', value: collab.metrics.clicks.toLocaleString() },
                    { label: 'Conversions', value: collab.metrics.conversions.toLocaleString() },
                    { label: 'Revenue', value: `₦${collab.metrics.revenue.toLocaleString()}` },
                    { label: 'Reach', value: collab.metrics.reach.toLocaleString() },
                  ].map((m) => (
                    <div key={m.label} className="p-3 bg-neutral-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-neutral-900">{m.value}</p>
                      <p className="text-xs text-neutral-500">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {collab.status === 'invited' && (
                  <>
                    <button
                      onClick={() => handleResponse(collab.id, 'accept')}
                      className="flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors"
                    >
                      <Check className="h-4 w-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleResponse(collab.id, 'decline')}
                      className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <X className="h-4 w-4" /> Decline
                    </button>
                    <button
                      onClick={() => setShowMessage(collab.id)}
                      className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> Message
                    </button>
                  </>
                )}
                {(collab.status === 'active' || collab.status === 'accepted') && (
                  <button className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <MessageCircle className="h-4 w-4" /> Message Organizer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
