"use client";
import React from "react";
import Card from "./Card";

interface AnalyticsSkeletonProps {
  className?: string;
}

/**
 * Skeleton loader for analytics widgets with shimmer animation
 */
export function AnalyticsSkeleton({ className = "" }: AnalyticsSkeletonProps) {
  return (
    <Card padding="lg" className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-100 rounded w-32 shimmer"></div>
            <div className="h-3 bg-neutral-100 rounded w-24 shimmer"></div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-8 bg-neutral-100 rounded w-20 shimmer"></div>
            <div className="h-3 bg-neutral-100 rounded w-16 shimmer"></div>
          </div>
        </div>
        
        {/* Chart area */}
        <div className="h-48 bg-neutral-100 rounded-2xl shimmer relative overflow-hidden">
          {/* Animated bars for bar chart skeleton */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-neutral-200 rounded-t"
                style={{
                  height: `${20 + Math.random() * 60}%`,
                  width: '12%',
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Skeleton for chart components
 */
export function ChartSkeleton({ 
  height = 200, 
  type = "bar",
  className = "" 
}: { 
  height?: number; 
  type?: "bar" | "line" | "pie";
  className?: string;
}) {
  return (
    <div 
      className={`bg-neutral-100 rounded-2xl shimmer relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {type === "bar" && (
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-neutral-200 rounded-t animate-pulse"
              style={{
                height: `${30 + Math.random() * 50}%`,
                width: '12%',
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      )}
      
      {type === "line" && (
        <div className="absolute inset-4">
          <svg className="w-full h-full opacity-30">
            <path
              d="M 0 80 Q 25 60 50 70 T 100 50 T 150 60 T 200 40"
              stroke="neutral-200"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>
      )}
      
      {type === "pie" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-8 border-neutral-200 border-t-lime animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton for metric cards
 */
export function MetricSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card padding="md" className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-neutral-100 rounded w-24 shimmer"></div>
        <div className="h-8 bg-neutral-100 rounded w-16 shimmer"></div>
        <div className="h-3 bg-neutral-100 rounded w-20 shimmer"></div>
      </div>
    </Card>
  );
}

/**
 * Skeleton for dashboard grid
 */
export function DashboardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsSkeleton />
        <AnalyticsSkeleton />
      </div>
      
      {/* Full width chart */}
      <AnalyticsSkeleton />
    </div>
  );
}