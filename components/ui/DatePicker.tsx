"use client";
import React, { useState, useRef, useEffect } from "react";
import Popover from "./Popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  error?: string;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
  label,
  error,
  className = "",
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(value);
    }
  }, [value]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange?.(null);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const calendar = (
    <Calendar
      currentMonth={currentMonth}
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onPreviousMonth={previousMonth}
      onNextMonth={nextMonth}
      onToday={goToToday}
      isDateDisabled={isDateDisabled}
    />
  );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <Popover
        content={calendar}
        placement="bottom"
        closeOnBackdropClick={true}
        closeOnEscape={true}
        onOpenChange={setIsOpen}
      >
        <button
          type="button"
          disabled={disabled}
          className={`w-full px-4 py-2.5 text-left bg-[var(--surface-card)] border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 ${
            error
              ? "border-danger-500 focus:ring-danger-500/40 focus:border-danger-500"
              : "border-[var(--surface-border)] hover:border-neutral-400"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-[var(--surface-hover)]"
              : "cursor-pointer"
          }`}
          aria-label={label || "Select date"}
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span
              className={
                selectedDate
                  ? "text-foreground"
                  : "text-foreground-muted"
              }
            >
              {selectedDate ? formatDate(selectedDate) : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {selectedDate && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-foreground-muted hover:text-foreground transition-colors"
                  aria-label="Clear date"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              <svg
                className="w-5 h-5 text-foreground-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </button>
      </Popover>
      {error && (
        <p className="mt-1.5 text-sm text-danger-500">{error}</p>
      )}
    </div>
  );
}

// Calendar Component
interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  isDateDisabled: (date: Date) => boolean;
}

function Calendar({
  currentMonth,
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
  onToday,
  isDateDisabled,
}: CalendarProps) {
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days: (Date | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
  }

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return isSameDay(date, new Date());
  };

  const handleKeyDown = (e: React.KeyboardEvent, date: Date | null) => {
    if (!date) return;
    
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isDateDisabled(date)) {
        onDateSelect(date);
      }
    }
  };

  return (
    <div className="p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPreviousMonth}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-foreground">{monthName}</h3>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-foreground-muted text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const disabled = isDateDisabled(date);
          const selected = isSameDay(date, selectedDate);
          const today = isToday(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => !disabled && onDateSelect(date)}
              onKeyDown={(e) => handleKeyDown(e, date)}
              disabled={disabled}
              className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
                selected
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : today
                  ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
                  : disabled
                  ? "text-foreground-muted opacity-40 cursor-not-allowed"
                  : "text-foreground hover:bg-surface-hover"
              }`}
              aria-label={date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              aria-selected={selected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Footer with Today button */}
      <div className="mt-4 pt-4 border-t border-[var(--surface-border)]">
        <button
          type="button"
          onClick={onToday}
          className="w-full px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        >
          Today
        </button>
      </div>
    </div>
  );
}
