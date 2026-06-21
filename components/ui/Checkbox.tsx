"use client";
import React from "react";

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  id?: string;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      checked = false,
      indeterminate = false,
      onChange,
      disabled = false,
      label,
      description,
      error,
      id,
      className = "",
    },
    ref
  ) {
    const checkboxId = id ?? React.useId();
    const labelId = React.useId();
    const descriptionId = React.useId();
    const errorId = React.useId();

    const handleToggle = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggle();
      }
    };

    // Determine the visual state
    const isChecked = indeterminate ? false : checked;
    const showIndeterminate = indeterminate;

    return (
      <div className={`inline-flex items-start gap-3 ${className}`}>
        <button
          ref={ref}
          id={checkboxId}
          type="button"
          role="checkbox"
          aria-checked={indeterminate ? "mixed" : checked}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={
            description || error
              ? `${description ? descriptionId : ""} ${error ? errorId : ""}`.trim()
              : undefined
          }
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`relative flex items-center justify-center w-11 h-11 rounded border-2 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/20 focus-visible:ring-offset-2 ${
            isChecked || showIndeterminate
              ? "border-lime bg-lime"
              : "border-neutral-300 bg-transparent hover:border-lime"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {showIndeterminate ? (
            <svg
              className="w-5 h-5 text-white animate-scale-in"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6H10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : isChecked ? (
            <svg
              className="w-5 h-5 text-white animate-scale-in"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </button>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                id={labelId}
                htmlFor={checkboxId}
                className={`text-sm font-medium text-neutral-900 select-none block ${
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={!disabled ? handleToggle : undefined}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={descriptionId}
                className="text-xs text-neutral-500 mt-1"
              >
                {description}
              </p>
            )}
          </div>
        )}
        {error && (
          <p
            id={errorId}
            className="text-sm text-red-500 mt-2"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Checkbox;
