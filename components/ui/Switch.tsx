"use client";
import React from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked = false, onChange, disabled = false, label, id, className = "" },
  ref
) {
  const switchId = id ?? React.useId();
  const labelId = React.useId();

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

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-11 w-20 items-center rounded-full transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/40 focus-visible:ring-offset-2 ${
          checked
            ? "bg-lime hover:bg-lime-hover"
            : "bg-neutral-300 hover:bg-neutral-400"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        <span
          className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
            checked ? "translate-x-11" : "translate-x-2"
          }`}
        />
      </button>
      {label && (
        <label
          id={labelId}
          htmlFor={switchId}
          className={`text-sm font-medium text-neutral-900 select-none ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={!disabled ? handleToggle : undefined}
        >
          {label}
        </label>
      )}
    </div>
  );
});

export default Switch;
