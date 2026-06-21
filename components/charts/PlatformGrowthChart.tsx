"use client";
import React from "react";
import { LineChart } from "./index";

interface GrowthDataPoint {
  label: string;
  events: number;
  users: number;
  revenue: number;
  timestamp: number;
}

interface PlatformGrowthChartProps {
  data: GrowthDataPoint[];
  metric: 'events' | 'users' | 'revenue';
  period: 'day' | 'week' | 'month' | 'year';
  loading?: boolean;
}

export default function PlatformGrowthChart({ 
  data, 
  metric, 
  period,
  loading = false 
}: PlatformGrowthChartProps) {
  const formatValue = (value: number): string => {
    if (metric === 'revenue') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
      return `$${value.toLocaleString()}`;
    }
    
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const getMetricColor = (): string => {
    switch (metric) {
      case 'events': return '#4392F1';
      case 'users': return '#10B981';
      case 'revenue': return '#8B5CF6';
      default: return '#4392F1';
    }
  };

  const getMetricLabel = (): string => {
    switch (metric) {
      case 'events': return 'Events';
      case 'users': return 'New Users';
      case 'revenue': return 'Revenue';
      default: return 'Metric';
    }
  };

  const chartData = data.map(point => ({
    label: point.label,
    value: point[metric],
  }));

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-[var(--foreground-muted)]">Loading chart...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center text-[var(--foreground-muted)]">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Data will appear as activity occurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[var(--foreground)]">{getMetricLabel()} Growth</h4>
        <div className="text-xs text-[var(--foreground-muted)]">
          Total: {formatValue(data.reduce((sum, point) => sum + point[metric], 0))}
        </div>
      </div>
      <div className="h-64">
        <LineChart 
          data={chartData}
          color={getMetricColor()}
          formatValue={formatValue}
        />
      </div>
    </div>
  );
}