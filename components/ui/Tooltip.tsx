"use client";
import React, { useState, useRef, useEffect } from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  placement?: Placement;
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

export default function Tooltip({
  content,
  placement = "top",
  delay = 200,
  children,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      // Keep tooltip within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }

      setPosition({ top, left });
    }
  }, [visible, placement]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone child element and add event handlers
  const childProps = (children as React.ReactElement<any>).props || {};
  const trigger = React.cloneElement(children as React.ReactElement<any>, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      childProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      childProps.onBlur?.(e);
    },
    "aria-describedby": visible ? "tooltip" : undefined,
  });

  const arrowClasses = getArrowClasses(placement);

  return (
    <>
      {trigger}
      {visible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={`fixed z-50 px-3 py-2 text-xs font-medium text-white bg-navy-800 dark:bg-navy-700 rounded-lg shadow-lg pointer-events-none animate-fade-in ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            animationDuration: "var(--duration-fast)",
            animationTimingFunction: "var(--ease-out)",
          }}
        >
          {content}
          <div className={arrowClasses} />
        </div>
      )}
    </>
  );
}

function getArrowClasses(placement: Placement): string {
  const baseClasses = "absolute w-2 h-2 bg-navy-800 dark:bg-navy-700 transform rotate-45";
  
  switch (placement) {
    case "top":
      return `${baseClasses} bottom-[-4px] left-1/2 -translate-x-1/2`;
    case "bottom":
      return `${baseClasses} top-[-4px] left-1/2 -translate-x-1/2`;
    case "left":
      return `${baseClasses} right-[-4px] top-1/2 -translate-y-1/2`;
    case "right":
      return `${baseClasses} left-[-4px] top-1/2 -translate-y-1/2`;
    default:
      return `${baseClasses} bottom-[-4px] left-1/2 -translate-x-1/2`;
  }
}
