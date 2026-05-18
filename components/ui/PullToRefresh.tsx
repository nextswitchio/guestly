"use client";

import React from 'react';
import { usePullToRefresh, type PullToRefreshOptions } from '@/lib/hooks/usePullToRefresh';

interface PullToRefreshProps extends Omit<PullToRefreshOptions, 'onRefresh'> {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
}

/**
 * PullToRefresh component that wraps content and provides pull-to-refresh functionality
 * Shows a visual indicator when pulling and handles the refresh animation
 */
export function PullToRefresh({
  onRefresh,
  children,
  className = '',
  ...options
}: PullToRefreshProps) {
  const { state, attachListeners, getDisplayText } = usePullToRefresh({
    onRefresh,
    ...options
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const cleanup = attachListeners(containerRef.current);
    return cleanup;
  }, [attachListeners]);

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-white border-b border-neutral-200 transition-all duration-300 ease-out ${
          state.isPulling || state.isRefreshing
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          height: `${Math.max(state.pullDistance, state.isRefreshing ? 60 : 0)}px`,
          transform: `translateY(${state.isPulling && !state.isRefreshing ? 0 : '-100%'})`
        }}
      >
        <div className="flex items-center gap-3 py-4">
          {/* Loading spinner or arrow icon */}
          <div className="relative">
            {state.isRefreshing ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-lime/20 border-t-lime" />
            ) : (
              <svg
                className={`w-5 h-5 text-lime transition-transform duration-200 ${
                  state.canRefresh ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
          
          {/* Status text */}
          <span className="text-sm font-medium text-neutral-500">
            {getDisplayText()}
          </span>
        </div>
      </div>

      {/* Content container */}
      <div
        ref={containerRef}
        className="relative"
        style={{
          paddingTop: state.isPulling || state.isRefreshing ? `${Math.max(state.pullDistance, state.isRefreshing ? 60 : 0)}px` : 0,
          transition: state.isPulling ? 'none' : 'padding-top 300ms ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default PullToRefresh;
