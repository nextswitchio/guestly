'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Check, TrendingUp, Users, MousePointerClick, Wallet, Calendar, Package, Bell, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

interface AffiliateStats {
  totalClicks: number;
  totalSignups: number;
  totalConversions: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  referralCode: string;
  referralLink: string;
}

interface Collaboration {
  id: string;
  organizerId: string;
  eventId: string;
  eventName: string;
  status: 'invited' | 'accepted' | 'declined' | 'active' | 'completed';
  compensationType: 'free-tickets' | 'fixed-payment' | 'commission' | 'hybrid';
  compensationAmount?: number;
  commissionRate?: number;
  freeTicketCount?: number;
  deliverables: string[];
  invitedAt: string;
  metrics?: { reach: number; clicks: number; conversions: number; revenue: number };
}

interface PromoMaterial {
  id: string;
  eventId: string;
  eventName: string;
  organizerName: string;
  assets: { type: string; url: string }[];
  copyTemplates: { type: string; content: string; platform?: string }[];
  trackingLink: string;
  promoCode?: string;
}

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [materials, setMaterials] = useState<PromoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleCollaborationAction = async (collabId: string, action: 'accept' | 'decline') => {
    try {
      setActionLoading(collabId);
      const res = await fetch('/api/affiliates/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collaborationId: collabId, action }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error handling collaboration:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, collabRes, materialsRes] = await Promise.all([
        fetch('/api/affiliates/dashboard'),
        fetch('/api/affiliates/collaborations'),
        fetch('/api/affiliates/materials'),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          totalClicks: data.affiliate?.links?.reduce((sum: number, l: any) => sum + (l.clicks || 0), 0) || 0,
          totalSignups: 0,
          totalConversions: data.affiliate?.links?.reduce((sum: number, l: any) => sum + (l.conversions || 0), 0) || 0,
          totalCommission: data.affiliate?.totalEarnings || 0,
          pendingCommission: data.affiliate?.pendingEarnings || 0,
          paidCommission: data.affiliate?.paidEarnings || 0,
          referralCode: data.affiliate?.links?.[0]?.code || 'AFF-001',
          referralLink: data.affiliate?.links?.[0]?.url || '',
        });
      }

      if (collabRes.ok) {
        const data = await collabRes.json();
        setCollaborations(data.collaborations || []);
      }

      if (materialsRes.ok) {
        const data = await materialsRes.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const pendingInvites = collaborations.filter(c => c.status === 'invited').length;
  const activeCollaborations = collaborations.filter(c => c.status === 'active' || c.status === 'accepted').length;

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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back, Affiliate</h1>
        <p className="text-neutral-500 mt-1">Track your performance, manage collaborations, and grow your earnings</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clicks', value: stats?.totalClicks.toLocaleString() || '0', icon: <MousePointerClick className="h-5 w-5" />, bg: 'bg-lime/10', color: 'text-lime' },
          { label: 'Conversions', value: stats?.totalConversions.toLocaleString() || '0', icon: <TrendingUp className="h-5 w-5" />, bg: 'bg-green-100', color: 'text-green-600' },
          { label: 'Total Earned', value: `₦${(stats?.totalCommission || 0).toLocaleString()}`, icon: <Wallet className="h-5 w-5" />, bg: 'bg-blue-100', color: 'text-blue-600' },
          { label: 'Pending', value: `₦${(stats?.pendingCommission || 0).toLocaleString()}`, icon: <Calendar className="h-5 w-5" />, bg: 'bg-amber-100', color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Referral Link & Code */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Referral Link</h3>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-3 bg-neutral-50 rounded-xl text-sm text-neutral-700 border border-neutral-200 truncate">
                {stats.referralLink || 'Generate a link to start earning'}
              </code>
              <button
                onClick={() => copyToClipboard(stats.referralLink, 'link')}
                className="flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors shrink-0"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Affiliate Code</h3>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-3 bg-neutral-50 rounded-xl text-sm text-neutral-700 border border-neutral-200 font-mono text-lg">
                {stats.referralCode}
              </code>
              <button
                onClick={() => copyToClipboard(stats.referralCode, 'code')}
                className="flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors shrink-0"
              >
                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Invitations */}
      {pendingInvites > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-lime/10">
                <Bell className="h-5 w-5 text-lime" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Pending Invitations</h3>
                <p className="text-sm text-neutral-500">{pendingInvites} organizer{pendingInvites > 1 ? 's' : ''} want to collaborate with you</p>
              </div>
            </div>
            <Link href="/affiliate/dashboard/collaborations" className="flex items-center gap-1 text-sm font-medium text-lime hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {collaborations.filter(c => c.status === 'invited').slice(0, 3).map((collab) => (
              <div key={collab.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900">{collab.eventName}</p>
                  <p className="text-sm text-neutral-500 capitalize">{collab.compensationType.replace('-', ' ')}{collab.commissionRate ? ` • ${collab.commissionRate}% commission` : collab.compensationAmount ? ` • ₦${collab.compensationAmount.toLocaleString()}` : collab.freeTicketCount ? ` • ${collab.freeTicketCount} free tickets` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCollaborationAction(collab.id, 'accept')}
                    disabled={actionLoading === collab.id}
                    className="rounded-xl bg-lime px-4 py-2 text-sm font-semibold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50"
                  >
                    {actionLoading === collab.id ? '...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleCollaborationAction(collab.id, 'decline')}
                    disabled={actionLoading === collab.id}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === collab.id ? '...' : 'Decline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Collaborations & Promo Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Collaborations */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Active Collaborations</h3>
                <p className="text-sm text-neutral-500">{activeCollaborations} ongoing partnerships</p>
              </div>
            </div>
            <Link href="/affiliate/dashboard/collaborations" className="flex items-center gap-1 text-sm font-medium text-lime hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {collaborations.filter(c => c.status === 'active' || c.status === 'accepted').length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">No active collaborations yet</p>
              <Link href="/affiliate/dashboard/events" className="text-sm font-medium text-lime hover:underline mt-2 inline-block">Browse events to promote</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {collaborations.filter(c => c.status === 'active' || c.status === 'accepted').slice(0, 3).map((collab) => (
                <div key={collab.id} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-neutral-900">{collab.eventName}</p>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg capitalize">{collab.status}</span>
                  </div>
                  {collab.metrics && (
                    <div className="flex gap-4 text-xs text-neutral-500">
                      <span>{collab.metrics.clicks} clicks</span>
                      <span>{collab.metrics.conversions} conversions</span>
                      <span className="font-medium text-neutral-900">₦{collab.metrics.revenue.toLocaleString()} revenue</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promotional Materials */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Promotional Materials</h3>
                <p className="text-sm text-neutral-500">Media kits, assets & copy templates</p>
              </div>
            </div>
            <Link href="/affiliate/dashboard/materials" className="flex items-center gap-1 text-sm font-medium text-lime hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {materials.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">No promotional materials yet</p>
              <p className="text-xs text-neutral-400 mt-1">Accept a collaboration to access media kits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {materials.slice(0, 3).map((mat) => (
                <div key={mat.id} className="p-4 bg-neutral-50 rounded-xl">
                  <p className="font-medium text-neutral-900">{mat.eventName}</p>
                  <p className="text-sm text-neutral-500">{mat.assets.length} assets • {mat.copyTemplates.length} copy templates{mat.promoCode ? ` • Code: ${mat.promoCode}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-lime p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/affiliate/dashboard/events" className="bg-dark/10 hover:bg-dark/20 rounded-xl p-4 transition-colors">
            <Calendar className="h-5 w-5 text-dark mb-2" />
            <div className="font-medium text-dark">Browse Events</div>
            <div className="text-xs text-dark/70 mt-1">Find events to promote and earn commission</div>
          </Link>
          <Link href="/affiliate/dashboard/collaborations" className="bg-dark/10 hover:bg-dark/20 rounded-xl p-4 transition-colors">
            <Users className="h-5 w-5 text-dark mb-2" />
            <div className="font-medium text-dark">Collaborations</div>
            <div className="text-xs text-dark/70 mt-1">Manage organizer invitations and partnerships</div>
          </Link>
          <Link href="/affiliate/dashboard/payouts" className="bg-dark/10 hover:bg-dark/20 rounded-xl p-4 transition-colors">
            <Wallet className="h-5 w-5 text-dark mb-2" />
            <div className="font-medium text-dark">Request Payout</div>
            <div className="text-xs text-dark/70 mt-1">Withdraw your earned commissions</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
