import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ label: string; value: string }>;
}

export default function Select({
  label,
  error,
  className = "",
  options = [],
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-neutral-700">{label}</label>}
      <select
        className={`h-10 w-full rounded-md border bg-white px-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? "border-red-500 focus:ring-red-500" : "border-neutral-300"
          } ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
          : children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

