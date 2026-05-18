"use client";

import { useRef, useEffect, useCallback, useState } from 'react';

export interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Distance to trigger refresh (default: 80px)
  resistance?: number; // Pull resistance factor (default: 2.5)
  snapBackDuration?: number; // Animation duration for snap back (default: 300ms)
  disabled?: boolean;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
}

export interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
}

/**
 * Hook for implementing pull-to-refresh functionality on mobile
 * Works by detecting downward swipes at the top of scrollable content
 */
export function usePullToRefresh(options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    snapBackDuration = 300,
    disabled = false,
    refreshingText = "Refreshing...",
    pullText = "Pull to refresh",
    releaseText = "Release to refresh"
  } = options;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false
  });

  const touchState = useRef({
    startY: 0,
    startTime: 0,
    isAtTop: false,
    isDragging: false
  });

  const containerRef = useRef<HTMLElement>(null);

  // Check if element is scrolled to top
  const isScrolledToTop = useCallback((element: HTMLElement): boolean => {
    return element.scrollTop <= 0;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || e.touches.length !== 1) return;

    const container = containerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    const isAtTop = isScrolledToTop(container);

    touchState.current = {
      startY: touch.clientY,
      startTime: Date.now(),
      isAtTop,
      isDragging: false
    };
  }, [disabled, isScrolledToTop]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || state.isRefreshing) return;

    const container = containerRef.current;
    if (!container || !touchState.current.isAtTop) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchState.current.startY;

    // Only handle downward pulls when at top
    if (deltaY <= 0) {
      if (state.isPulling) {
        setState(prev => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
          canRefresh: false
        }));
      }
      return;
    }

    // Start pulling
    if (!touchState.current.isDragging) {
      touchState.current.isDragging = true;
    }

    // Calculate pull distance with resistance
    const pullDistance = Math.min(deltaY / resistance, threshold * 1.5);
    const canRefresh = pullDistance >= threshold;

    setState(prev => ({
      ...prev,
      isPulling: true,
      pullDistance,
      canRefresh
    }));

    // Prevent default scrolling when pulling
    if (deltaY > 10) {
      e.preventDefault();
    }
  }, [disabled, state.isRefreshing, state.isPulling, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !state.isPulling) return;

    if (state.canRefresh && !state.isRefreshing) {
      // Trigger refresh
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: threshold
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh error:', error);
      } finally {
        // Snap back after refresh
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isPulling: false,
            isRefreshing: false,
            pullDistance: 0,
            canRefresh: false
          }));
        }, snapBackDuration);
      }
    } else {
      // Snap back without refresh
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }

    touchState.current.isDragging = false;
  }, [disabled, state.isPulling, state.canRefresh, state.isRefreshing, onRefresh, threshold, snapBackDuration]);

  const attachListeners = useCallback((element: HTMLElement | null) => {
    if (!element || disabled) return;

    containerRef.current = element;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Get display text based on state
  const getDisplayText = useCallback(() => {
    if (state.isRefreshing) return refreshingText;
    if (state.canRefresh) return releaseText;
    return pullText;
  }, [state.isRefreshing, state.canRefresh, refreshingText, releaseText, pullText]);

  return {
    state,
    attachListeners,
    getDisplayText,
    containerRef
  };
}

/**
 * Hook that returns a ref to attach pull-to-refresh to an element
 */
export function usePullToRefreshRef(options: PullToRefreshOptions) {
  const elementRef = useRef<HTMLElement>(null);
  const { state, attachListeners, getDisplayText } = usePullToRefresh(options);

  useEffect(() => {
    const cleanup = attachListeners(elementRef.current);
    return cleanup;
  }, [attachListeners]);

  return {
    elementRef,
    state,
    getDisplayText
  };
}