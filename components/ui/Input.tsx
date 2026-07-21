"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const _Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
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
          className="text-sm font-medium text-neutral-900"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-neutral-500 transition-colors duration-200">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`h-11 w-full rounded-xl border bg-white text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${
            leftIcon ? "pl-10" : "pl-3.5"
          } ${rightIcon ? "pr-10" : "pr-3.5"} ${
            error
              ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-400/30"
              : "border-neutral-200 hover:border-neutral-300 focus-visible:border-lime focus-visible:ring-lime/20"
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 flex items-center text-neutral-500 transition-colors duration-200">
            {rightIcon}
          </span>
        )}
      </div>
      <div className="min-h-[1.25rem]">
        {error && (
          <p
            id={errorId}
            className="text-xs text-red-600 animate-spring-slide-up"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
});

const Input = React.memo(_Input);
export default Input;
export { Input };
