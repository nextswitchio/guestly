'use client';
import { Link, RefreshCw } from 'lucide-react';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Tabs from '@/components/ui/Tabs';
import Input from '@/components/ui/Input';
import AffiliatePerformance from './AffiliatePerformance';
import type { Affiliate } from '@/lib/marketing';

interface AffiliateDashboardProps {
  userId: string;
}

export default function AffiliateDashboard({ userId }: AffiliateDashboardProps) {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliateData();
  }, [userId]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/affiliates/dashboard');
      if (response.ok) {
        const data = await response.json();
        setAffiliate(data.affiliate);
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    if (!affiliate || affiliate.pendingEarnings < 50) {
      alert('Minimum payout amount is $50');
      return;
    }

    if (!confirm(`Request payout of $${affiliate.pendingEarnings.toFixed(2)}?`)) return;

    try {
      const response = await fetch(`/api/affiliates/${affiliate.id}/payout`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Payout request submitted successfully');
        fetchAffiliateData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to request payout');
      }
    } catch (error) {
      console.error('Failed to request payout:', error);
      alert('Failed to request payout');
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime"></div>
        </div>
    );
  }

  if (!affiliate) {
    return (
      <Card className="p-12 text-center">
        <Icon name="user-x" className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Not an Affiliate</h3>
        <p className="text-neutral-500 mb-4">
          Register as an affiliate to start earning commissions
        </p>
        <Button href="/affiliate/register">Register Now</Button>
      </Card>
    );
  }

  const getStatusColor = (status: Affiliate['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-50';
      case 'pending':
        return 'text-amber-500 bg-amber-50';
      case 'suspended':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-neutral-500 bg-neutral-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
          <p className="text-neutral-500 mt-1">
            Track your performance and earnings
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(affiliate.status)}`}>
          {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
        </span>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-500">Total Earnings</p>
            <Icon name="dollar-sign" className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">
            ${affiliate.totalEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Lifetime earnings</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-500">Pending</p>
            <Icon name="clock" className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-500">
            ${affiliate.pendingEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Available for payout</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-500">Paid Out</p>
            <Icon name="check-circle" className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-500">
            ${affiliate.paidEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Total paid</p>
        </Card>
      </div>

      {/* Payout Action */}
      {affiliate.status === 'approved' && affiliate.pendingEarnings >= 50 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="dollar-sign" className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-semibold">Ready for Payout</p>
                <p className="text-sm text-neutral-500">
                  You have ${affiliate.pendingEarnings.toFixed(2)} available
                </p>
              </div>
            </div>
            <Button onClick={requestPayout}>Request Payout</Button>
          </div>
        </Card>
      )}

      {/* Pending Approval */}
      {affiliate.status === 'pending' && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <Icon name="clock" className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-semibold">Application Under Review</p>
              <p className="text-sm text-neutral-500">
                Your affiliate application is being reviewed. You'll be notified once approved.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', content: (
            <div className="space-y-6">
              <AffiliatePerformance affiliateId={affiliate.id} />

              {/* Commission Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Commission Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Commission Rate</span>
                    <span className="font-bold text-lime">{affiliate.commissionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Cookie Duration</span>
                    <span className="font-medium">{affiliate.cookieDuration} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Active Links</span>
                    <span className="font-medium">{affiliate.links.length}</span>
                  </div>
                </div>
              </Card>
            </div>
          )},
          { id: 'links', label: 'Affiliate Links', content: (
            <div className="space-y-4">
              {affiliate.links.length === 0 ? (
                <Card className="p-12 text-center">
                  <span className="text-6xl mb-4 block"><Link className="h-4 w-4 inline-block" /></span>
                  <h3 className="text-xl font-semibold mb-2">No affiliate links yet</h3>
                  <p className="text-neutral-500">
                    Generate affiliate links for events to start earning
                  </p>
                </Card>
              ) : (
                affiliate.links.map((link) => (
                  <Card key={link.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Event #{link.eventId}</h4>
                      <code className="text-sm bg-neutral-100 px-2 py-1 rounded">
                        {link.code}
                      </code>
                    </div>
                    <Input value={link.url} readOnly className="font-mono text-sm mb-2" />
                    <div className="flex gap-4 text-sm text-neutral-500">
                      <span>{link.clicks} clicks</span>
                      <span>{link.conversions} conversions</span>
                      <span className="text-green-500 font-medium">
                        ${(link as any).earned?.toFixed(2) || '0.00'} earned
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )},
          { id: 'payouts', label: 'Payout History', content: (
            <Card className="p-12 text-center">
              <Icon name="credit-card" className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No payout history</h3>
              <p className="text-neutral-500">
                Your payout requests will appear here
              </p>
            </Card>
          )}
        ]}
      />
    </div>
  );
}
