"use client";
import React from "react";
import Card from "./Card";
import Icon from "./Icon";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon, 
  variant = 'blue',
  loading = false 
}: MetricCardProps) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-success-50 text-success-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-danger-50 text-danger-600',
  };

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getChangeColor = (changeValue?: number): string => {
    if (changeValue === undefined) return 'text-[var(--foreground-muted)]';
    if (changeValue > 0) return 'text-success-600';
    if (changeValue < 0) return 'text-danger-600';
    return 'text-[var(--foreground-muted)]';
  };

  const getChangeIcon = (changeValue?: number): string => {
    if (changeValue === undefined) return '';
    if (changeValue > 0) return '↗';
    if (changeValue < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-8 bg-gray-200 rounded"></div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[variant]}`}>
          <Icon name={icon as any} size={24} />
        </div>
        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Live</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[var(--foreground)] mb-2">{formatValue(value)}</p>
        {(change !== undefined || changeLabel) && (
          <p className={`text-xs font-medium flex items-center gap-1 ${getChangeColor(change)}`}>
            {change !== undefined && (
              <>
                <span className="text-sm">{getChangeIcon(change)}</span>
                <span>{Math.abs(change)}%</span>
              </>
            )}
            {changeLabel && <span>{changeLabel}</span>}
          </p>
        )}
      </div>
    </Card>
  );
}