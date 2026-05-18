"use client";
import React from "react";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  label?: string;
  error?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      name,
      options,
      value,
      onChange,
      disabled = false,
      orientation = "vertical",
      className = "",
      label,
      error,
    },
    ref
  ) {
    const groupId = React.useId();
    const labelId = React.useId();
    const errorId = React.useId();

    const handleChange = (optionValue: string) => {
      if (!disabled && onChange) {
        onChange(optionValue);
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLDivElement>,
      optionValue: string,
      index: number
    ) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleChange(optionValue);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (index + 1) % options.length;
        const nextOption = options[nextIndex];
        if (!nextOption.disabled) {
          handleChange(nextOption.value);
        }
        // Focus next radio
        const nextElement = e.currentTarget.parentElement?.children[
          nextIndex
        ] as HTMLElement;
        nextElement?.querySelector<HTMLElement>('[role="radio"]')?.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex = (index - 1 + options.length) % options.length;
        const prevOption = options[prevIndex];
        if (!prevOption.disabled) {
          handleChange(prevOption.value);
        }
        // Focus previous radio
        const prevElement = e.currentTarget.parentElement?.children[
          prevIndex
        ] as HTMLElement;
        prevElement?.querySelector<HTMLElement>('[role="radio"]')?.focus();
      }
    };

    return (
      <div ref={ref} className={className}>
        {label && (
          <label
            id={labelId}
            className="block text-sm font-medium text-[var(--foreground)] mb-3"
          >
            {label}
          </label>
        )}
        <div
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`flex ${
            orientation === "vertical" ? "flex-col gap-3" : "flex-row gap-4"
          }`}
        >
          {options.map((option, index) => {
            const isChecked = value === option.value;
            const isDisabled = disabled || option.disabled;
            const radioId = `${groupId}-${option.value}`;

            return (
              <div
                key={option.value}
                className={`flex items-start gap-3 ${
                  isDisabled ? "opacity-50" : ""
                }`}
              >
                <div
                  role="radio"
                  id={radioId}
                  aria-checked={isChecked}
                  aria-disabled={isDisabled}
                  tabIndex={isChecked ? 0 : -1}
                  onClick={() => !isDisabled && handleChange(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, option.value, index)}
                  className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 ${
                    isChecked
                      ? "border-primary-500 bg-primary-500"
                      : "border-neutral-300 bg-transparent hover:border-primary-400"
                  } ${
                    isDisabled
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isChecked && (
                    <div className="w-2 h-2 rounded-full bg-white animate-scale-in" />
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={radioId}
                    className={`text-sm font-medium text-[var(--foreground)] select-none ${
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() => !isDisabled && handleChange(option.value)}
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {error && (
          <p
            id={errorId}
            className="text-sm text-danger-500 mt-2"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default RadioGroup;
