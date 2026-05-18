'use client';
import { RefreshCw } from 'lucide-react';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';

interface Event {
  id: string;
  title: string;
}

export default function EventInsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts - converted to expected formats
  const ticketSalesData = [
    { label: 'Week 1', value: 12 },
    { label: 'Week 2', value: 35 },
    { label: 'Week 3', value: 58 },
    { label: 'Week 4', value: 89 },
  ];

  const revenueData = [
    { label: 'Week 1', value: 120000 },
    { label: 'Week 2', value: 350000 },
    { label: 'Week 3', value: 580000 },
    { label: 'Week 4', value: 890000 },
  ];

  const ticketTypeData = [
    { label: 'General', value: 45 },
    { label: 'VIP', value: 25 },
    { label: 'Early Bird', value: 20 },
    { label: 'Group', value: 10 },
  ];

  const stats = [
    { label: 'Total Tickets Sold', value: '194', change: '+12%', icon: 'ticket' as const },
    { label: 'Total Revenue', value: '₦1.94M', change: '+18%', icon: 'trending-up' as const },
    { label: 'Conversion Rate', value: '24.5%', change: '+3.2%', icon: 'target' as const },
    { label: 'Avg. Ticket Price', value: '₦10,000', change: '+5%', icon: 'chart' as const },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-4xl animate-spin"><RefreshCw className="h-4 w-4 inline-block" /></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon name="arrow-left" className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{event?.title || 'Event'} Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analytics and performance metrics
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
              <Icon name={stat.icon} className="w-5 h-5 text-primary-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-success-600">{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Sales Over Time</h3>
          <LineChart data={ticketSalesData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Week</h3>
          <BarChart data={revenueData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Type Distribution</h3>
          <PieChart data={ticketTypeData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { source: 'Direct', visitors: 1234, percentage: 45 },
              { source: 'Social Media', visitors: 892, percentage: 32 },
              { source: 'Email', visitors: 456, percentage: 16 },
              { source: 'Referral', visitors: 189, percentage: 7 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.source}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.visitors} visitors
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendee Demographics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Attendee Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Age Groups</h4>
            <div className="space-y-2">
              {[
                { range: '18-24', percentage: 25 },
                { range: '25-34', percentage: 45 },
                { range: '35-44', percentage: 20 },
                { range: '45+', percentage: 10 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.range}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Gender</h4>
            <div className="space-y-2">
              {[
                { gender: 'Male', percentage: 52 },
                { gender: 'Female', percentage: 46 },
                { gender: 'Other', percentage: 2 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.gender}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Top Cities</h4>
            <div className="space-y-2">
              {[
                { city: 'Lagos', percentage: 45 },
                { city: 'Abuja', percentage: 25 },
                { city: 'Accra', percentage: 18 },
                { city: 'Nairobi', percentage: 12 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.city}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
