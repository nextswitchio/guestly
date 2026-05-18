"use client";

import React, { useState } from 'react';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';

interface SwipeAction {
  icon: React.ReactNode;
  label: string;
  color: 'primary' | 'success' | 'danger' | 'warning';
  action: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  disabled?: boolean;
  swipeThreshold?: number;
}

/**
 * SwipeableCard component that allows swipe gestures to reveal actions
 * Commonly used for notifications, list items, etc.
 */
export default function SwipeableCard({
  children,
  leftAction,
  rightAction,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  disabled = false,
  swipeThreshold = 80
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRef = React.useRef<HTMLDivElement>(null);
  const touchState = React.useRef({
    startX: 0,
    currentX: 0,
    isDragging: false
  });

  // Handle touch start
  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    if (disabled || e.touches.length !== 1) return;

    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      currentX: touch.clientX,
      isDragging: true
    };
    setIsAnimating(false);
  }, [disabled]);

  // Handle touch move
  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    if (disabled || !touchState.current.isDragging) return;

    const touch = e.touches[0];
    touchState.current.currentX = touch.clientX;
    
    const deltaX = touch.clientX - touchState.current.startX;
    
    // Apply resistance when swiping beyond available actions
    let offset = deltaX;
    const maxOffset = 120; // Maximum swipe distance
    
    if (Math.abs(offset) > maxOffset) {
      const excess = Math.abs(offset) - maxOffset;
      const resistance = Math.max(0.1, 1 - (excess / 100));
      offset = Math.sign(offset) * (maxOffset + excess * resistance);
    }

    // Only allow swipe if there's an action available
    if ((offset > 0 && !leftAction) || (offset < 0 && !rightAction)) {
      offset = 0;
    }

    setSwipeOffset(offset);
  }, [disabled, leftAction, rightAction]);

  // Handle touch end
  const handleTouchEnd = React.useCallback(() => {
    if (disabled || !touchState.current.isDragging) return;

    touchState.current.isDragging = false;
    setIsAnimating(true);

    const offset = swipeOffset;
    const absOffset = Math.abs(offset);

    if (absOffset >= swipeThreshold) {
      // Trigger action
      if (offset > 0 && leftAction) {
        leftAction.action();
        onSwipeRight?.();
      } else if (offset < 0 && rightAction) {
        rightAction.action();
        onSwipeLeft?.();
      }
    }

    // Reset position
    setSwipeOffset(0);
  }, [disabled, swipeOffset, swipeThreshold, leftAction, rightAction, onSwipeLeft, onSwipeRight]);

  // Attach touch listeners
  React.useEffect(() => {
    const element = cardRef.current;
    if (!element || disabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Get action background color
  const getActionColor = (color: SwipeAction['color']) => {
    switch (color) {
      case 'primary': return 'bg-lime';
      case 'success': return 'bg-green-500';
      case 'danger': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-neutral-500';
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left action background */}
      {leftAction && swipeOffset > 0 && (
        <div className={`absolute inset-y-0 left-0 flex items-center justify-start pl-6 ${getActionColor(leftAction.color)}`}
             style={{ width: Math.min(swipeOffset, 120) }}>
          <div className="flex items-center gap-2 text-white">
            {leftAction.icon}
            {swipeOffset > 60 && (
              <span className="text-sm font-medium">{leftAction.label}</span>
            )}
          </div>
        </div>
      )}

      {/* Right action background */}
      {rightAction && swipeOffset < 0 && (
        <div className={`absolute inset-y-0 right-0 flex items-center justify-end pr-6 ${getActionColor(rightAction.color)}`}
             style={{ width: Math.min(Math.abs(swipeOffset), 120) }}>
          <div className="flex items-center gap-2 text-white">
            {Math.abs(swipeOffset) > 60 && (
              <span className="text-sm font-medium">{rightAction.label}</span>
            )}
            {rightAction.icon}
          </div>
        </div>
      )}

      {/* Card content */}
      <div
        ref={cardRef}
        className="relative bg-white touch-pan-y"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isAnimating ? 'transform 300ms ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}