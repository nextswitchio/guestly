'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, MousePointerClick, DollarSign, RefreshCw, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/affiliate/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch affiliate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Affiliate Dashboard
            </h1>
            <p className="text-lg text-slate-500 mt-1">
              Track your referrals and earnings
            </p>
          </div>
        </div>

        {stats && (
          <div className="mb-8 p-4 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Your Referral Link</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-200 truncate">
                {stats.referralLink}
              </code>
              <Button variant="outline" onClick={copyLink} className="shrink-0">
                {copied ? (
                  <><CheckCircle className="w-4 h-4 mr-1.5" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-1.5" /> Copy</>
                )}
              </Button>
            </div>
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <MousePointerClick className="w-5 h-5" />
                  <p className="text-sm text-slate-500">Clicks</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalClicks.toLocaleString()}</p>
              </Card>
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 text-purple-600 mb-2">
                  <Users className="w-5 h-5" />
                  <p className="text-sm text-slate-500">Signups</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalSignups.toLocaleString()}</p>
              </Card>
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 text-green-600 mb-2">
                  <BarChart3 className="w-5 h-5" />
                  <p className="text-sm text-slate-500">Conversions</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalConversions.toLocaleString()}</p>
              </Card>
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <p className="text-sm text-slate-500">Total Earned</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">₦{stats.totalCommission.toLocaleString()}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 mb-1">Pending Commission</p>
                <p className="text-xl font-bold text-yellow-600">₦{stats.pendingCommission.toLocaleString()}</p>
              </Card>
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 mb-1">Paid Out</p>
                <p className="text-xl font-bold text-green-600">₦{stats.paidCommission.toLocaleString()}</p>
              </Card>
              <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 mb-1">Referral Code</p>
                <p className="text-xl font-bold text-slate-900 font-mono">{stats.referralCode}</p>
              </Card>
            </div>
          </>
        )}

        <Card className="p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Share & Earn</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Share your referral link with friends and earn commission on every ticket they purchase.
          </p>
          <Button href="/explore">
            <ExternalLink className="w-4 h-4 mr-2" />
            Find Events to Share
          </Button>
        </Card>
      </div>
    </div>
  );
}
