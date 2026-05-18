"use client";
import React from "react";
import DatePicker from "@/components/ui/DatePicker";
import Icon, { IconName } from "@/components/ui/Icon";

export type TimeFilterValue = 
  | "all"
  | "today"
  | "this-weekend"
  | "this-month"
  | "custom";

interface TimeFilterProps {
  value?: TimeFilterValue;
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (value: TimeFilterValue, startDate?: Date | null, endDate?: Date | null) => void;
  className?: string;
  isDark?: boolean;
}

export default function TimeFilter({
  value = "all",
  startDate = null,
  endDate = null,
  onChange,
  className = "",
  isDark = false,
}: TimeFilterProps) {
  const [showCustomRange, setShowCustomRange] = React.useState(value === "custom");
  const [customStart, setCustomStart] = React.useState<Date | null>(startDate);
  const [customEnd, setCustomEnd] = React.useState<Date | null>(endDate);

  const handleQuickFilterClick = (filterValue: TimeFilterValue) => {
    if (filterValue === "custom") {
      setShowCustomRange(true);
      onChange?.(filterValue, customStart, customEnd);
    } else {
      setShowCustomRange(false);
      const { start, end } = getDateRangeForFilter(filterValue);
      onChange?.(filterValue, start, end);
    }
  };

  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setCustomStart(start);
    setCustomEnd(end);
    if (start || end) {
      onChange?.("custom", start, end);
    }
  };

  const getDateRangeForFilter = (filterValue: TimeFilterValue): { start: Date | null; end: Date | null } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filterValue) {
      case "today":
        return {
          start: today,
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
        };
      
      case "this-weekend": {
        // Find next Saturday and Sunday
        const dayOfWeek = now.getDay();
        const daysUntilSaturday = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysUntilSaturday);
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        sunday.setHours(23, 59, 59);
        
        return {
          start: saturday,
          end: sunday,
        };
      }
      
      case "this-month": {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        return {
          start: firstDay,
          end: lastDay,
        };
      }
      
      default:
        return { start: null, end: null };
    }
  };

  const quickFilters: Array<{ value: TimeFilterValue; label: string; icon: IconName }> = [
    { value: "all", label: "All Dates", icon: "calendar" },
    { value: "today", label: "Today", icon: "clock" },
    { value: "this-weekend", label: "This Weekend", icon: "party" },
    { value: "this-month", label: "This Month", icon: "calendar" },
    { value: "custom", label: "Custom Range", icon: "search" },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick filter buttons */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}>
          Time Period
        </label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleQuickFilterClick(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-[var(--duration-fast)] flex items-center gap-2 ${
                isDark
                  ? value === filter.value
                    ? "bg-lime text-dark shadow-md scale-105"
                    : "bg-[#1e6470] text-[#d4e8eb] border border-[#3d8993] hover:bg-[#3d8993] hover:text-white"
                  : value === filter.value
                  ? "bg-primary-600 text-white shadow-[var(--elevation-2)] scale-105"
                  : "bg-[var(--surface-card)] text-[var(--foreground)] border border-[var(--surface-border)] hover:border-primary-300 hover:bg-primary-50"
              }`}
            >
              <Icon name={filter.icon} size={16} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range pickers */}
      {showCustomRange && (
        <div className={`p-4 border rounded-xl space-y-4 animate-[slideDown_var(--duration-normal)_var(--ease-out)] ${
          isDark
            ? "bg-[#001c24] border-[#1e6470]"
            : "bg-[var(--surface-card)] border-[var(--surface-border)]"
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={customStart || undefined}
              onChange={(date) => handleCustomDateChange(date, customEnd)}
              placeholder="Select start date"
              maxDate={customEnd || undefined}
            />
            <DatePicker
              label="End Date"
              value={customEnd || undefined}
              onChange={(date) => handleCustomDateChange(customStart, date)}
              placeholder="Select end date"
              minDate={customStart || undefined}
            />
          </div>
          
          {(customStart || customEnd) && (
            <div className={`flex items-center justify-between pt-2 border-t ${isDark ? "border-[#1e6470] text-[#d4e8eb]" : "border-[var(--surface-border)] text-[var(--foreground-muted)]"}`}>
              <p className="text-sm">
                {customStart && customEnd
                  ? `${customStart.toLocaleDateString()} - ${customEnd.toLocaleDateString()}`
                  : customStart
                  ? `From ${customStart.toLocaleDateString()}`
                  : customEnd
                  ? `Until ${customEnd.toLocaleDateString()}`
                  : "Select dates"}
              </p>
              <button
                onClick={() => {
                  setCustomStart(null);
                  setCustomEnd(null);
                  handleCustomDateChange(null, null);
                }}
                className={`text-sm font-medium transition-colors ${isDark ? "text-lime hover:text-lime/80" : "text-danger-600 hover:text-danger-700"}`}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
