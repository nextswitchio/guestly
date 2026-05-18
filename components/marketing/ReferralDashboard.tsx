'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import ReferralLinkGenerator from './ReferralLinkGenerator';
import ReferralStats from './ReferralStats';
import type { ReferralStats as Stats } from '@/lib/marketing';

interface ReferralDashboardProps {
  userId: string;
}

export default function ReferralDashboard({ userId }: ReferralDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/referrals/stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="loader" className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Share events with friends and earn rewards for every ticket they purchase
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</p>
            <Icon name="users" className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
            <Icon name="check-circle" className="w-5 h-5 text-success-500" />
          </div>
          <p className="text-2xl font-bold">{stats?.totalConversions || 0}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
            <Icon name="dollar-sign" className="w-5 h-5 text-success-500" />
          </div>
          <p className="text-2xl font-bold text-green-500">
            ${stats?.totalEarned.toFixed(2) || '0.00'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <Icon name="clock" className="w-5 h-5 text-warning-500" />
          </div>
          <p className="text-2xl font-bold text-warning-500">
            ${stats?.pendingRewards.toFixed(2) || '0.00'}
          </p>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
        <h3 className="text-lg font-semibold mb-4">How Referrals Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Share Your Link</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate a unique referral link for any event and share it with friends
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Friends Purchase</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When they buy tickets using your link, you earn a commission
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Get Rewarded</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rewards are credited to your wallet automatically
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        defaultTabId="overview"
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            content: (
              <div className="space-y-6">
                <ReferralLinkGenerator userId={userId} />
                {stats && <ReferralStats stats={stats} />}
              </div>
            ),
          },
          {
            id: 'events',
            label: 'My Events',
            content: (
              <div className="space-y-4">
                {stats?.topEvents && stats.topEvents.length > 0 ? (
                  stats.topEvents.map((event) => (
                    <Card key={event.eventId} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Event #{event.eventId}</h4>
                          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{event.conversions} conversions</span>
                            <span className="text-green-500 font-medium">
                              ${event.earned.toFixed(2)} earned
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <Icon name="calendar" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No referrals yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start sharing events to earn rewards
                    </p>
                  </Card>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
