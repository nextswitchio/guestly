"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, rightIcon, className = "", id, ...props },
  ref
) {
  const inputId = id ?? React.useId();
  const hintId = React.useId();
  const errorId = React.useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-[var(--foreground-muted)] transition-colors duration-200">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`h-11 w-full rounded-xl border bg-[var(--surface-card)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${
            leftIcon ? "pl-10" : "pl-3.5"
          } ${rightIcon ? "pr-10" : "pr-3.5"} ${
            error
              ? "border-danger-400 focus-visible:border-danger-500 focus-visible:ring-danger-400/30"
              : "border-[var(--surface-border)] hover:border-neutral-300 focus-visible:border-primary-500 focus-visible:ring-primary-500/40"
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 flex items-center text-[var(--foreground-muted)] transition-colors duration-200">
            {rightIcon}
          </span>
        )}
      </div>
      <div className="min-h-[1.25rem]">
        {error && (
          <p
            id={errorId}
            className="text-xs text-danger-600 animate-spring-slide-up"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-[var(--foreground-muted)]">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
});

export default Input;

// Named export for compatibility
export { Input };
