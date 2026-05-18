"use client";

import { useRef, useEffect, useCallback } from 'react';

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe (default: 50px)
  velocity?: number; // Minimum velocity for swipe (default: 0.3px/ms)
  preventDefaultTouchmove?: boolean; // Prevent default touchmove behavior
  disabled?: boolean;
}

export interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  isSwiping: boolean;
}

/**
 * Hook for handling swipe gestures on touch devices
 * Provides callbacks for swipe directions with configurable thresholds
 */
export function useSwipeGesture(options: SwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
    preventDefaultTouchmove = false,
    disabled = false
  } = options;

  const swipeState = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwiping: false
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || e.touches.length !== 1) return;

    const touch = e.touches[0];
    swipeState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isSwiping: true
    };
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !swipeState.current.isSwiping) return;

    if (preventDefaultTouchmove) {
      e.preventDefault();
    }
  }, [disabled, preventDefaultTouchmove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled || !swipeState.current.isSwiping) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - swipeState.current.startX;
    const deltaY = endY - swipeState.current.startY;
    const deltaTime = endTime - swipeState.current.startTime;

    // Calculate distance and velocity
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const swipeVelocity = distance / deltaTime;

    // Reset swipe state
    swipeState.current.isSwiping = false;

    // Check if swipe meets threshold requirements
    if (distance < threshold || swipeVelocity < velocity) return;

    // Determine swipe direction based on the dominant axis
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
  }, [disabled, threshold, velocity, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const attachListeners = useCallback((element: HTMLElement | null) => {
    if (!element || disabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmove });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouchmove]);

  return { attachListeners };
}

/**
 * Hook that returns a ref to attach swipe gestures to an element
 */
export function useSwipeRef<T extends HTMLElement = HTMLDivElement>(options: SwipeGestureOptions = {}) {
  const elementRef = useRef<T>(null);
  const { attachListeners } = useSwipeGesture(options);

  useEffect(() => {
    const cleanup = attachListeners(elementRef.current);
    return cleanup;
  }, [attachListeners]);

  return elementRef;
}