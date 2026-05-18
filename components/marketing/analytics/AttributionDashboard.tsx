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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <span className="text-6xl mb-4 block"><BarChart3 className="h-4 w-4 inline-block" /></span>
        <p className="text-gray-600">No attribution data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attribution Analytics</h2>
          <p className="text-gray-600 mt-1">Track marketing performance across all channels</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <select
            value={attributionModel}
            onChange={(e) => setAttributionModel(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <p className="text-sm text-gray-600">Total Conversions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{(data.totalConversions || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <span className="text-2xl"><CheckCircle className="h-4 w-4 inline-block" /></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${(data.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <span className="text-2xl"><Banknote className="h-4 w-4 inline-block" /></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${(data.totalCost || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <span className="text-2xl"><CreditCard className="h-4 w-4 inline-block" /></span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall ROI</p>
              <p className={`text-3xl font-bold mt-1 ${(data.overallROI || 0) >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {(data.overallROI || 0).toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${(data.overallROI || 0) >= 0 ? 'bg-success-100' : 'bg-danger-100'}`}>
              <span className="text-2xl">{(data.overallROI || 0) >= 0 ? 'TrendingUp' : 'TrendingDown'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Channel Performance Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
        <ChannelPerformanceChart channels={data.channels || []} />
      </Card>

      {/* ROI Calculator and Funnel side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI by Channel</h3>
          <ROICalculator channels={data.channels || []} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <FunnelVisualization stages={data.funnel || []} />
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
