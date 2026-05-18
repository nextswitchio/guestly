"use client";

import React, { useEffect, useRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  autoResize?: boolean;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hint,
      error,
      autoResize = false,
      showCharCount = false,
      className = "",
      id,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) {
    const textareaId = id ?? React.useId();
    const hintId = React.useId();
    const errorId = React.useId();
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Handle auto-resize
    useEffect(() => {
      if (!autoResize) return;

      const textarea = internalRef.current;
      if (!textarea) return;

      const adjustHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      adjustHeight();
    }, [value, autoResize]);

    // Combine refs
    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const currentLength =
      typeof value === "string" ? value.length : props.defaultValue?.toString().length || 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={setRefs}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            className={`w-full rounded-xl border bg-[var(--surface-card)] px-3.5 py-2.5 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 ${
              error
                ? "border-danger-400 focus-visible:ring-danger-400/30"
                : "border-[var(--surface-border)] hover:border-neutral-300 focus-visible:border-primary-500"
            } ${autoResize ? "resize-none overflow-hidden" : "resize-y"} ${className}`}
            style={autoResize ? { minHeight: "80px" } : undefined}
            {...props}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-xs text-danger-600">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={hintId} className="text-xs text-[var(--foreground-muted)]">
                {hint}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p
              className={`text-xs ${
                currentLength > maxLength * 0.9
                  ? "text-danger-600"
                  : "text-[var(--foreground-muted)]"
              }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default Textarea;

// Named export for compatibility
export { Textarea };
