"use client";
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';

type PerformanceSummary = {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  averageTicketsPerEvent: number;
  averageRevenuePerEvent: number;
  topPerformingCategory: string;
  topPerformingCity: string;
};

export default function EventPerformanceSummary() {
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events/performance?page=1&pageSize=1');
      const result = await response.json();
      
      if (result.success) {
        setSummary(result.data.summary);
      } else {
        setError(result.error?.message || 'Failed to fetch summary');
      }
    } catch (err) {
      setError('Failed to fetch summary');
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-neutral-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-neutral-200 rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !summary) {
    return (
      <Card className="p-6">
        <div className="text-center text-danger-600">
          <Icon name="alert-circle" size={24} className="mx-auto mb-2" />
          <p className="text-sm">{error || 'Failed to load summary'}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <Icon name="calendar" size={24} />
          </div>
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">
            Total
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Total Events</h3>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {summary.totalEvents.toLocaleString()}
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            Across all categories
          </p>
        </div>
      </Card>

      {/* Total Revenue */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-xl bg-success-50 text-success-600">
            <Icon name="trending-up" size={24} />
          </div>
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">
            Revenue
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Total Revenue</h3>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            {formatCurrency(summary.averageRevenuePerEvent)} avg per event
          </p>
        </div>
      </Card>

      {/* Total Tickets Sold */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Icon name="ticket" size={24} />
          </div>
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">
            Tickets
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Tickets Sold</h3>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {summary.totalTicketsSold.toLocaleString()}
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            {Math.round(summary.averageTicketsPerEvent)} avg per event
          </p>
        </div>
      </Card>

      {/* Top Performing Category */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <Icon name="award" size={24} />
          </div>
          <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">
            Top
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Top Category</h3>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {summary.topPerformingCategory}
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mt-2">
            Best performing by revenue
          </p>
        </div>
      </Card>

      {/* Top Performing City - Full Width */}
      <Card className="p-6 md:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <Icon name="map-pin" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Top Performing City
              </h3>
              <p className="text-3xl font-bold text-[var(--foreground)] mt-1">
                {summary.topPerformingCity}
              </p>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">
                Highest total revenue across all events
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--foreground-muted)]">Performance Metrics</div>
            <div className="text-lg font-semibold text-[var(--foreground)] mt-1">
              {formatCurrency(summary.averageRevenuePerEvent)}
            </div>
            <div className="text-xs text-[var(--foreground-muted)]">
              Average revenue per event
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}