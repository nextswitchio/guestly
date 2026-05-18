"use client";
import React from "react";
import Card from "@/components/ui/Card";
import { useDataTransition } from "@/lib/hooks/useDataTransition";
import { AnalyticsSkeleton } from "@/components/ui/AnalyticsSkeleton";

interface RevenueDataPoint {
  month: string;
  pct: number;
  val: string;
}

interface RevenueWidgetProps {
  data: RevenueDataPoint[];
  total: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  enableTransitions?: boolean;
}

export function RevenueWidget({ 
  data, 
  total, 
  title = "Revenue Overview", 
  subtitle = "Last 6 months",
  loading = false,
  enableTransitions = true
}: RevenueWidgetProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const {
    currentData,
    isTransitioning,
    isLoading,
    progress
  } = useDataTransition({
    data: { data, total, title, subtitle },
    loading,
    transitionDuration: 600,
    enableOptimisticUpdates: enableTransitions
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show skeleton during initial loading
  if (isLoading && !currentData) {
    return <AnalyticsSkeleton className="lg:col-span-2" />;
  }

  return (
    <Card 
      variant="elevated" 
      padding="lg" 
      hoverable 
      className={`lg:col-span-2 transition-all duration-300 ${
        isTransitioning ? 'opacity-90 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Loading overlay for transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-[var(--surface-card)] bg-opacity-50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)]" />
            <span>Updating revenue data...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className={`text-sm font-semibold text-[var(--foreground)] transition-all duration-300 ${
            isTransitioning ? 'opacity-70' : 'opacity-100'
          }`}>
            {currentData.title}
          </h2>
          <p className={`text-xs text-[var(--foreground-muted)] transition-all duration-300 ${
            isTransitioning ? 'opacity-70' : 'opacity-100'
          }`}>
            {currentData.subtitle}
          </p>
        </div>
        <span className={`text-lg font-extrabold tabular-nums text-[var(--foreground)] transition-all duration-300 ${
          isTransitioning ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
        }`}>
          {currentData.total}
        </span>
      </div>
      
      {/* Enhanced gradient bar chart with animations */}
      <div className={`flex items-end gap-3 h-36 px-2 transition-all duration-400 ${
        isTransitioning ? 'opacity-70 scale-98' : 'opacity-100 scale-100'
      }`}>
        {currentData.data.map((d, i) => (
          <div 
            key={d.month} 
            className="flex flex-1 flex-col items-center gap-2"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full flex items-end justify-center" style={{ height: "112px" }}>
              {/* Enhanced gradient bar with smooth animations */}
              <div
                className={`w-full rounded-t-xl transition-all duration-700 ease-out relative overflow-hidden ${
                  hoveredIndex === i ? "scale-105 shadow-lg" : "scale-100"
                }`}
                style={{ 
                  height: mounted ? `${d.pct}%` : '0%',
                  background: i === currentData.data.length - 1
                    ? "linear-gradient(180deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)"
                    : "linear-gradient(180deg, var(--color-primary-200) 0%, var(--color-primary-400) 100%)",
                  transitionDelay: `${i * 100}ms`,
                  boxShadow: hoveredIndex === i 
                    ? "0 8px 25px rgba(67, 146, 241, 0.3), 0 0 0 1px rgba(67, 146, 241, 0.2)" 
                    : "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}
              >
                {/* Shimmer effect on hover */}
                {hoveredIndex === i && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    style={{
                      transform: "translateX(-100%)",
                      animation: "shimmer 1.5s ease-in-out infinite"
                    }}
                  />
                )}

                {/* Glow effect for current month */}
                {i === currentData.data.length - 1 && (
                  <div className="absolute inset-0 rounded-t-xl bg-gradient-to-t from-[var(--color-primary-500)] to-transparent opacity-20 animate-pulse-glow" />
                )}
              </div>
              
              {/* Enhanced tooltip with glass morphism */}
              {hoveredIndex === i && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass-medium text-[var(--foreground)] text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap animate-fade-in shadow-xl border border-[var(--glass-border)]">
                  {d.val}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--glass-border)]" />
                </div>
              )}
            </div>
            <span className={`text-[10px] font-medium transition-all duration-200 ${
              hoveredIndex === i 
                ? "text-[var(--foreground)] font-semibold scale-110" 
                : "text-[var(--foreground-subtle)] scale-100"
            }`}>
              {d.month}
            </span>
          </div>
        ))}
      </div>

      {/* Progress indicator for transitions */}
      {isTransitioning && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--surface-border)] rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-600)] transition-all duration-100 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </Card>
  );
}
