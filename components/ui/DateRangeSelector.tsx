"use client";
import React from "react";

interface DateRangeSelectorProps {
  value: 'day' | 'week' | 'month' | 'year';
  onChange: (period: 'day' | 'week' | 'month' | 'year') => void;
  className?: string;
}

export default function DateRangeSelector({ value, onChange, className = "" }: DateRangeSelectorProps) {
  const options = [
    { value: 'day' as const, label: 'Last 24 Hours' },
    { value: 'week' as const, label: 'Last 7 Days' },
    { value: 'month' as const, label: 'Last 30 Days' },
    { value: 'year' as const, label: 'Last 12 Months' },
  ];

  return (
    <div className={`flex rounded-lg bg-neutral-50 border border-neutral-200 p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${value === option.value
              ? 'bg-lime text-dark shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}