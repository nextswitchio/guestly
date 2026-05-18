"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  content: React.ReactNode;
  placement?: Placement;
  children: React.ReactElement;
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Popover({
  content,
  placement = "bottom",
  children,
  className = "",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  onOpenChange,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  const togglePopover = () => {
    handleOpenChange(!open);
  };

  const closePopover = () => {
    handleOpenChange(false);
  };

  // Calculate position with collision detection
  useEffect(() => {
    if (open && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      // Initial positioning based on placement
      switch (placement) {
        case "top":
          top = triggerRect.top - popoverRect.height - 8;
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
          break;
        case "left":
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          left = triggerRect.left - popoverRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      // Collision detection - keep within viewport
      const padding = 8;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Horizontal collision detection
      if (left < padding) {
        left = padding;
      } else if (left + popoverRect.width > viewportWidth - padding) {
        left = viewportWidth - popoverRect.width - padding;
      }

      // Vertical collision detection
      if (top < padding) {
        top = padding;
      } else if (top + popoverRect.height > viewportHeight - padding) {
        top = viewportHeight - popoverRect.height - padding;
      }

      setPosition({ top, left });
    }
  }, [open, placement]);

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopover();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape]);

  // Focus trap implementation
  useEffect(() => {
    if (!open || !popoverRef.current) return;

    const popoverElement = popoverRef.current;
    const focusableElements = popoverElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element when popover opens
    firstFocusable?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    popoverElement.addEventListener("keydown", handleTab as EventListener);
    return () => popoverElement.removeEventListener("keydown", handleTab as EventListener);
  }, [open]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === backdropRef.current) {
      closePopover();
    }
  };

  // Clone child element and add click handler
  const trigger = React.cloneElement(children, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      togglePopover();
      // Preserve original onClick if it exists
      if (typeof children.props === 'object' && children.props && 'onClick' in children.props) {
        const originalOnClick = children.props.onClick as ((e: React.MouseEvent) => void) | undefined;
        originalOnClick?.(e);
      }
    },
    "aria-expanded": open,
    "aria-haspopup": "dialog",
  } as any);

  const arrowClasses = getArrowClasses(placement);

  return (
    <>
      {trigger}
      {open && (
        <>
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
            style={{
              animationDuration: "var(--duration-fast)",
              animationTimingFunction: "var(--ease-out)",
            }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          {/* Popover */}
          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            className={`fixed z-50 bg-[var(--surface-card)] rounded-lg shadow-xl border border-[var(--surface-border)] animate-scale-in ${className}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              animationDuration: "var(--duration-fast)",
              animationTimingFunction: "var(--ease-spring)",
            }}
          >
            {content}
            <div className={arrowClasses} />
          </div>
        </>
      )}
    </>
  );
}

function getArrowClasses(placement: Placement): string {
  const baseClasses =
    "absolute w-2 h-2 bg-[var(--surface-card)] border-[var(--surface-border)] transform rotate-45";

  switch (placement) {
    case "top":
      return `${baseClasses} bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r`;
    case "bottom":
      return `${baseClasses} top-[-5px] left-1/2 -translate-x-1/2 border-t border-l`;
    case "left":
      return `${baseClasses} right-[-5px] top-1/2 -translate-y-1/2 border-t border-r`;
    case "right":
      return `${baseClasses} left-[-5px] top-1/2 -translate-y-1/2 border-b border-l`;
    default:
      return `${baseClasses} top-[-5px] left-1/2 -translate-x-1/2 border-t border-l`;
  }
}
