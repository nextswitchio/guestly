"use client";
import React, { useState, useEffect, useRef } from "react";
import Popover from "./Popover";

interface TimePickerProps {
  value?: string; // Format: "HH:MM" (24-hour)
  onChange?: (time: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  use12Hour?: boolean;
  minuteStep?: number;
  className?: string;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  label,
  error,
  use12Hour = false,
  minuteStep = 1,
  className = "",
}: TimePickerProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(value || null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
    }
  }, [value]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onChange?.(time);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTime(null);
    onChange?.(null);
  };

  const formatTime = (time: string | null): string => {
    if (!time) return "";
    
    const [hours, minutes] = time.split(":").map(Number);
    
    if (use12Hour) {
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const timeSelector = (
    <TimeSelector
      selectedTime={selectedTime}
      onTimeSelect={handleTimeSelect}
      use12Hour={use12Hour}
      minuteStep={minuteStep}
    />
  );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-1.5">
          {label}
        </label>
      )}
      <Popover
        content={timeSelector}
        placement="bottom"
        closeOnBackdropClick={true}
        closeOnEscape={true}
        onOpenChange={setIsOpen}
      >
        <button
          type="button"
          disabled={disabled}
          className={`w-full px-4 py-2.5 text-left bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime ${
            error
              ? "border-red-500 focus:ring-red-500/40 focus:border-red-500"
              : "border-neutral-200 hover:border-neutral-400"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-neutral-50"
              : "cursor-pointer"
          }`}
          aria-label={label || "Select time"}
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span
              className={
                selectedTime
                  ? "text-neutral-900"
                  : "text-neutral-500"
              }
            >
              {selectedTime ? formatTime(selectedTime) : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {selectedTime && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                  aria-label="Clear time"
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
                className="w-5 h-5 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </button>
      </Popover>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Time Selector Component
interface TimeSelectorProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  use12Hour: boolean;
  minuteStep: number;
}

function TimeSelector({
  selectedTime,
  onTimeSelect,
  use12Hour,
  minuteStep,
}: TimeSelectorProps) {
  const [hours, setHours] = useState<number>(12);
  const [minutes, setMinutes] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTime) {
      const [h, m] = selectedTime.split(":").map(Number);
      
      if (use12Hour) {
        setPeriod(h >= 12 ? "PM" : "AM");
        setHours(h % 12 || 12);
      } else {
        setHours(h);
      }
      
      setMinutes(m);
    } else {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      if (use12Hour) {
        setPeriod(currentHours >= 12 ? "PM" : "AM");
        setHours(currentHours % 12 || 12);
      } else {
        setHours(currentHours);
      }
      
      setMinutes(currentMinutes);
    }
  }, [selectedTime, use12Hour]);

  const handleConfirm = () => {
    let finalHours = hours;
    
    if (use12Hour) {
      if (period === "PM" && hours !== 12) {
        finalHours = hours + 12;
      } else if (period === "AM" && hours === 12) {
        finalHours = 0;
      }
    }
    
    const timeString = `${finalHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    onTimeSelect(timeString);
  };

  const handleNow = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    if (use12Hour) {
      setPeriod(currentHours >= 12 ? "PM" : "AM");
      setHours(currentHours % 12 || 12);
    } else {
      setHours(currentHours);
    }
    
    setMinutes(currentMinutes);
  };

  const incrementHours = () => {
    const maxHours = use12Hour ? 12 : 23;
    const minHours = use12Hour ? 1 : 0;
    setHours((prev) => (prev >= maxHours ? minHours : prev + 1));
  };

  const decrementHours = () => {
    const maxHours = use12Hour ? 12 : 23;
    const minHours = use12Hour ? 1 : 0;
    setHours((prev) => (prev <= minHours ? maxHours : prev - 1));
  };

  const incrementMinutes = () => {
    setMinutes((prev) => (prev >= 59 ? 0 : Math.min(59, prev + minuteStep)));
  };

  const decrementMinutes = () => {
    setMinutes((prev) => (prev <= 0 ? 59 : Math.max(0, prev - minuteStep)));
  };

  const handleHourKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      incrementHours();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrementHours();
    }
  };

  const handleMinuteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      incrementMinutes();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrementMinutes();
    }
  };

  return (
    <div className="p-4 w-72">
      {/* Time Display */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementHours}
            className="p-1 rounded hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20"
            aria-label="Increment hours"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <input
            type="text"
            value={hours.toString().padStart(2, "0")}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              const maxHours = use12Hour ? 12 : 23;
              const minHours = use12Hour ? 1 : 0;
              if (val >= minHours && val <= maxHours) {
                setHours(val);
              }
            }}
            onKeyDown={handleHourKeyDown}
            className="w-16 px-3 py-2 text-center text-2xl font-semibold bg-neutral-50 rounded-lg border-2 border-transparent focus:border-lime focus:outline-none transition-colors"
            aria-label="Hours"
          />
          <button
            type="button"
            onClick={decrementHours}
            className="p-1 rounded hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20"
            aria-label="Decrement hours"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Separator */}
        <span className="text-2xl font-semibold text-neutral-500">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={incrementMinutes}
            className="p-1 rounded hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20"
            aria-label="Increment minutes"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <input
            type="text"
            value={minutes.toString().padStart(2, "0")}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (val >= 0 && val <= 59) {
                setMinutes(val);
              }
            }}
            onKeyDown={handleMinuteKeyDown}
            className="w-16 px-3 py-2 text-center text-2xl font-semibold bg-neutral-50 rounded-lg border-2 border-transparent focus:border-lime focus:outline-none transition-colors"
            aria-label="Minutes"
          />
          <button
            type="button"
            onClick={decrementMinutes}
            className="p-1 rounded hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20"
            aria-label="Decrement minutes"
          >
            <svg
              className="w-5 h-5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* AM/PM Toggle */}
        {use12Hour && (
          <div className="flex flex-col gap-1 ml-2">
            <button
              type="button"
              onClick={() => setPeriod("AM")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20 ${
                period === "AM"
                  ? "bg-lime text-dark"
                  : "bg-neutral-50 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setPeriod("PM")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20 ${
                period === "PM"
                  ? "bg-lime text-dark"
                  : "bg-neutral-50 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              PM
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={handleNow}
          className="flex-1 px-4 py-2 text-sm font-medium text-lime hover:bg-lime/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20"
        >
          Now
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 px-4 py-2 text-sm font-medium text-dark bg-lime hover:bg-lime-hover rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-lime/20"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
