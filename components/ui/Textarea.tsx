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
            className="text-sm font-medium text-neutral-900"
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
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/20 ${
              error
                ? "border-red-400 focus-visible:ring-red-400/30"
                : "border-neutral-200 hover:border-neutral-300 focus-visible:border-lime"
            } ${autoResize ? "resize-none overflow-hidden" : "resize-y"} ${className}`}
            style={autoResize ? { minHeight: "80px" } : undefined}
            {...props}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-xs text-red-600">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={hintId} className="text-xs text-neutral-500">
                {hint}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p
              className={`text-xs ${
                currentLength > maxLength * 0.9
                  ? "text-red-600"
                  : "text-neutral-500"
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
