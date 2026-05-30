"use client";
import React from "react";
import { createPortal } from "react-dom";
import { useReducedMotion, useAnimationClass } from "@/lib/hooks/useReducedMotion";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

function sizeClass(size: "sm" | "md" | "lg" | "xl") {
  const map = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };
  return map[size] ?? map.md;
}

function Modal({ 
  open, 
  onClose, 
  title, 
  description, 
  size = "md", 
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children, 
  footer 
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const prefersReducedMotion = useReducedMotion();
  const fadeInClass = useAnimationClass("animate-fade-in");
  const scaleInClass = useAnimationClass("animate-spring-scale");

  React.useEffect(() => { setMounted(true); }, []);

  // Keep refs for callbacks so the focus-trap effect doesn't depend on them
  const onCloseRef = React.useRef(onClose);
  const closeOnEscapeRef = React.useRef(closeOnEscape);
  onCloseRef.current = onClose;
  closeOnEscapeRef.current = closeOnEscape;

  // Focus trap and keyboard handling
  React.useEffect(() => {
    if (!open) return;
    
    const el = panelRef.current;
    if (!el) return;
    
    // Get all focusable elements
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    // Focus first element when modal opens
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      // Escape key handling
      if (e.key === "Escape" && closeOnEscapeRef.current) { 
        e.preventDefault(); 
        onCloseRef.current?.(); 
      }
      // Tab key handling for focus trap
      else if (e.key === "Tab") {
        if (!focusable.length) return;
        if (e.shiftKey && document.activeElement === first) { 
          e.preventDefault(); 
          last?.focus(); 
        }
        else if (!e.shiftKey && document.activeElement === last) { 
          e.preventDefault(); 
          first?.focus(); 
        }
      }
    }
    
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Body scroll lock
  React.useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  if (!mounted || !open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${fadeInClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {/* Backdrop with blur effect */}
      <div
        className={`absolute inset-0 bg-neutral-900/60 backdrop-blur-md ${
          prefersReducedMotion 
            ? "transition-none" 
            : "transition-opacity duration-300"
        }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      {/* Panel with spring scale-in animation */}
      <div
        ref={panelRef}
        className={`relative z-50 w-full ${sizeClass(size)} rounded-2xl bg-white border border-neutral-200 shadow-2xl ${scaleInClass}`}
      >
        {/* Header */}
        {(title || (onClose && showCloseButton)) && (
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4">
            <div>
              {title && (
                <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
              )}
            </div>
            {onClose && showCloseButton && (
              <button
                onClick={onClose}
                className={`shrink-0 rounded-xl p-1.5 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 spring-tap ${
                  prefersReducedMotion 
                    ? "transition-none" 
                    : "transition-all duration-200"
                }`}
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// Named export for compatibility
export { Modal };
// Default export
export default Modal;
