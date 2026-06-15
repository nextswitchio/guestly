"use client";
import React from "react";
import Card from "@/components/ui/Card";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import { useDataTransition } from "@/lib/hooks/useDataTransition";
import { AnalyticsSkeleton } from "@/components/ui/AnalyticsSkeleton";

interface AnalyticsData {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  chartType: 'bar' | 'line' | 'pie';
  chartData: any[];
  subtitle?: string;
}

interface AnalyticsWidgetProps {
  data: AnalyticsData;
  loading?: boolean;
  className?: string;
  enableTransitions?: boolean;
}

export function AnalyticsWidget({ 
  data, 
  loading = false, 
  className = "",
  enableTransitions = true 
}: AnalyticsWidgetProps) {
  const {
    currentData,
    isTransitioning,
    isLoading,
    progress,
    setOptimisticData
  } = useDataTransition({
    data,
    loading,
    transitionDuration: 400,
    enableOptimisticUpdates: enableTransitions
  });

  // Show skeleton during initial loading
  if (isLoading && !currentData) {
    return <AnalyticsSkeleton className={className} />;
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-[var(--color-success-500)]';
      case 'down': return 'text-[var(--color-danger-500)]';
      default: return 'text-[var(--foreground-muted)]';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const renderChart = () => {
    const commonProps = {
      animated: true,
      gradient: true,
    };

    switch (currentData.chartType) {
      case 'bar':
        return (
          <BarChart 
            data={currentData.chartData} 
            height={200}
            {...commonProps}
          />
        );
      case 'line':
        return (
          <LineChart 
            data={currentData.chartData} 
            height={200}
            color="var(--color-primary-500)"
            showArea={true}
            {...commonProps}
          />
        );
      case 'pie':
        return (
          <div className="flex justify-center">
            <PieChart 
              data={currentData.chartData} 
              size={200}
              {...commonProps}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      variant="elevated" 
      padding="lg" 
      hoverable 
      className={`transition-all duration-300 ${className} ${
        isTransitioning ? 'opacity-90 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Loading overlay for transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-[var(--surface-card)] bg-opacity-50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)]" />
            <span>Updating...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <h3 className={`text-sm font-semibold text-[var(--foreground)] transition-all duration-300 ${
            isTransitioning ? 'opacity-70' : 'opacity-100'
          }`}>
            {currentData.title}
          </h3>
          {currentData.subtitle && (
            <p className={`text-xs text-[var(--foreground-muted)] transition-all duration-300 ${
              isTransitioning ? 'opacity-70' : 'opacity-100'
            }`}>
              {currentData.subtitle}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold text-[var(--foreground)] tabular-nums transition-all duration-300 ${
            isTransitioning ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
          }`}>
            {typeof currentData.value === 'number' ? currentData.value.toLocaleString() : currentData.value}
          </div>
          {currentData.change !== undefined && (
            <div className={`text-xs font-medium flex items-center gap-1 transition-all duration-300 ${
              getTrendColor(currentData.trend)
            } ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}>
              <span className="transition-transform duration-200">
                {getTrendIcon(currentData.trend)}
              </span>
              <span>{Math.abs(currentData.change)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className={`relative transition-all duration-400 ${
        isTransitioning ? 'opacity-70 scale-98' : 'opacity-100 scale-100'
      }`}>
        {renderChart()}
      </div>

      {/* Progress indicator for transitions */}
      {isTransitioning && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--surface-border)] rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-[var(--color-primary-500)] transition-all duration-100 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </Card>
  );
}

// Example usage component for testing
export function AnalyticsShowcase() {
  const [timeRange, setTimeRange] = React.useState('30d');
  const [isChangingRange, setIsChangingRange] = React.useState(false);

  // Simulate data changes when time range changes
  const generateData = (range: string) => {
    const multiplier = range === '7d' ? 0.7 : range === '14d' ? 0.85 : range === '30d' ? 1 : 1.2;
    
    return {
      barData: [
        { label: 'Jan', value: Math.round(1200 * multiplier) },
        { label: 'Feb', value: Math.round(1900 * multiplier) },
        { label: 'Mar', value: Math.round(1500 * multiplier) },
        { label: 'Apr', value: Math.round(2200 * multiplier) },
        { label: 'May', value: Math.round(1800 * multiplier) },
        { label: 'Jun', value: Math.round(2500 * multiplier) },
      ],
      lineData: [
        { label: 'Week 1', value: Math.round(450 * multiplier) },
        { label: 'Week 2', value: Math.round(680 * multiplier) },
        { label: 'Week 3', value: Math.round(520 * multiplier) },
        { label: 'Week 4', value: Math.round(890 * multiplier) },
        { label: 'Week 5', value: Math.round(750 * multiplier) },
      ],
      pieData: [
        { label: 'Online', value: Math.round(65 * multiplier) },
        { label: 'Referral', value: Math.round(25 * multiplier) },
        { label: 'Direct', value: Math.round(10 * multiplier) },
      ]
    };
  };

  const [data, setData] = React.useState(() => generateData('30d'));

  const handleTimeRangeChange = async (newRange: string) => {
    setIsChangingRange(true);
    setTimeRange(newRange);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setData(generateData(newRange));
    setIsChangingRange(false);
  };

  const widgets = [
    {
      title: 'Monthly Revenue',
      subtitle: `Last ${timeRange === '7d' ? '7 days' : timeRange === '14d' ? '14 days' : timeRange === '30d' ? '30 days' : 'all time'}`,
      value: `₦${(2.4 * (timeRange === '7d' ? 0.7 : timeRange === '14d' ? 0.85 : timeRange === '30d' ? 1 : 1.2)).toFixed(1)}M`,
      change: 12.5,
      trend: 'up' as const,
      chartType: 'bar' as const,
      chartData: data.barData,
    },
    {
      title: 'Weekly Attendance',
      subtitle: 'Current period',
      value: Math.round(3295 * (timeRange === '7d' ? 0.7 : timeRange === '14d' ? 0.85 : timeRange === '30d' ? 1 : 1.2)),
      change: -5.2,
      trend: 'down' as const,
      chartType: 'line' as const,
      chartData: data.lineData,
    },
    {
      title: 'Traffic Sources',
      subtitle: 'Distribution',
      value: '100%',
      chartType: 'pie' as const,
      chartData: data.pieData,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex justify-center">
        <div className="flex gap-1 rounded-xl bg-[var(--surface-hover)] p-1.5 border border-[var(--surface-border)]">
          {['7d', '14d', '30d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              disabled={isChangingRange}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                timeRange === range
                  ? "bg-[var(--color-primary-500)] text-white shadow-md shadow-[var(--color-primary-500)]/20 scale-105"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-card)]"
              } ${isChangingRange ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {range === '7d' ? '7 days' : range === '14d' ? '14 days' : range === '30d' ? '30 days' : 'All time'}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <AnalyticsWidget 
            key={index} 
            data={widget} 
            loading={isChangingRange}
            enableTransitions={true}
          />
        ))}
      </div>
    </div>
  );
}