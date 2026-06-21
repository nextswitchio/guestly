'use client';
import { Banknote, BarChart3, CheckCircle, CreditCard, Info, TrendingDown, TrendingUp } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import ChannelPerformanceChart from './ChannelPerformanceChart';
import ROICalculator from './ROICalculator';
import FunnelVisualization from './FunnelVisualization';
import DateRangeSelector from './DateRangeSelector';

interface AttributionData {
  totalConversions: number;
  totalRevenue: number;
  totalCost: number;
  overallROI: number;
  channels: ChannelPerformance[];
  funnel: FunnelStage[];
  attributionModel: 'first-touch' | 'last-touch' | 'multi-touch';
}

interface ChannelPerformance {
  channel: string;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
  cac: number;
}

interface FunnelStage {
  stage: string;
  users: number;
  dropoffRate: number;
}

interface DateRange {
  start: string;
  end: string;
}

export default function AttributionDashboard({ organizerId }: { organizerId: string }) {
  const [data, setData] = useState<AttributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [attributionModel, setAttributionModel] = useState<'first-touch' | 'last-touch' | 'multi-touch'>('last-touch');

  useEffect(() => {
    fetchAttributionData();
  }, [dateRange, attributionModel]);

  const fetchAttributionData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        organizerId,
        startDate: dateRange.start,
        endDate: dateRange.end,
        model: attributionModel,
      });
      const response = await fetch(`/api/analytics/attribution?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch attribution data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-lime border-t-lime"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <span className="text-6xl mb-4 block"><BarChart3 className="h-4 w-4 inline-block" /></span>
        <p className="text-neutral-500">No attribution data available</p>
      </Card>
    );
  }

  const safeData = {
    channels: data.channels || [],
    funnel: data.funnel || [],
    totalConversions: data.totalConversions || 0,
    totalRevenue: data.totalRevenue || 0,
    totalCost: data.totalCost || 0,
    overallROI: data.overallROI || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Attribution Analytics</h2>
          <p className="text-neutral-500 mt-1">Track marketing performance across all channels</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <select
            value={attributionModel}
            onChange={(e) => setAttributionModel(e.target.value as any)}
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-lime focus:border-transparent"
          >
            <option value="first-touch">First Touch</option>
            <option value="last-touch">Last Touch</option>
            <option value="multi-touch">Multi Touch</option>
          </select>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Conversions</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{safeData.totalConversions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-lime-100 rounded-lg">
              <span className="text-2xl"><CheckCircle className="h-4 w-4 inline-block" /></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Revenue</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">${safeData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl"><Banknote className="h-4 w-4 inline-block" /></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Total Cost</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">${safeData.totalCost.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <span className="text-2xl"><CreditCard className="h-4 w-4 inline-block" /></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Overall ROI</p>
              <p className={`text-3xl font-bold mt-1 ${safeData.overallROI >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {safeData.overallROI.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${safeData.overallROI >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-2xl">{safeData.overallROI >= 0 ? 'TrendingUp' : 'TrendingDown'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Channel Performance Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Channel Performance</h3>
        <ChannelPerformanceChart channels={safeData.channels} />
      </Card>

      {/* ROI Calculator and Funnel side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">ROI by Channel</h3>
          <ROICalculator channels={safeData.channels} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Conversion Funnel</h3>
          <FunnelVisualization stages={safeData.funnel} />
        </Card>
      </div>

      {/* Attribution model explanation */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl"><Info className="h-4 w-4 inline-block" /></span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Attribution Model: {attributionModel.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h4>
            <p className="text-sm text-blue-800">
              {attributionModel === 'first-touch' && 'Credits 100% of the conversion to the first marketing touchpoint.'}
              {attributionModel === 'last-touch' && 'Credits 100% of the conversion to the last marketing touchpoint before purchase.'}
              {attributionModel === 'multi-touch' && 'Distributes credit across all marketing touchpoints in the customer journey.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
