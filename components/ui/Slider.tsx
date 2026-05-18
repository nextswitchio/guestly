"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";

type SliderMode = "single" | "range";

interface SliderProps {
  mode?: SliderMode;
  min?: number;
  max?: number;
  step?: number;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  disabled?: boolean;
  showValue?: boolean;
  showStepMarkers?: boolean;
  label?: string;
  className?: string;
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    mode = "single",
    min = 0,
    max = 100,
    step = 1,
    value: controlledValue,
    defaultValue,
    onChange,
    disabled = false,
    showValue = true,
    showStepMarkers = false,
    label,
    className = "",
    formatValue = (v) => v.toString(),
  },
  ref
) {
  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;

  // Initialize internal state
  const getInitialValue = (): number | [number, number] => {
    if (isControlled) return controlledValue;
    if (defaultValue !== undefined) return defaultValue;
    return mode === "range" ? [min, max] : min;
  };

  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    getInitialValue()
  );

  // Use controlled value if provided, otherwise use internal state
  const currentValue = isControlled ? controlledValue : internalValue;

  // Update internal value when controlled value changes
  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlledValue);
    }
  }, [isControlled, controlledValue]);

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<"start" | "end" | null>(null);

  // Normalize value to ensure it's within bounds
  const normalizeValue = useCallback(
    (val: number): number => {
      const steps = Math.round((val - min) / step);
      const normalized = min + steps * step;
      return Math.max(min, Math.min(max, normalized));
    },
    [min, max, step]
  );

  // Get values as array for consistent handling
  const getValueArray = (): [number, number] => {
    if (mode === "range") {
      return Array.isArray(currentValue) ? currentValue : [min, max];
    }
    return [min, typeof currentValue === "number" ? currentValue : min];
  };

  const [startValue, endValue] = getValueArray();

  // Calculate percentage position
  const getPercentage = (val: number): number => {
    return ((val - min) / (max - min)) * 100;
  };

  // Get value from mouse/touch position
  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      return normalizeValue(rawValue);
    },
    [min, max, normalizeValue]
  );

  // Handle value update
  const updateValue = useCallback(
    (newValue: number | [number, number]) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  // Handle mouse/touch move
  const handleMove = useCallback(
    (clientX: number) => {
      if (disabled || !isDragging) return;

      const newValue = getValueFromPosition(clientX);

      if (mode === "single") {
        updateValue(newValue);
      } else {
        const [start, end] = getValueArray();
        if (isDragging === "start") {
          updateValue([Math.min(newValue, end), end]);
        } else {
          updateValue([start, Math.max(newValue, start)]);
        }
      }
    },
    [disabled, isDragging, mode, getValueFromPosition, updateValue, getValueArray]
  );

  // Mouse event handlers
  const handleMouseDown = (handle: "start" | "end") => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Touch event handlers
  const handleTouchStart = (handle: "start" | "end") => (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Track click to jump to position
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isDragging) return;

    const newValue = getValueFromPosition(e.clientX);

    if (mode === "single") {
      updateValue(newValue);
    } else {
      const [start, end] = getValueArray();
      const distToStart = Math.abs(newValue - start);
      const distToEnd = Math.abs(newValue - end);

      if (distToStart < distToEnd) {
        updateValue([newValue, end]);
      } else {
        updateValue([start, newValue]);
      }
    }
  };

  // Keyboard handlers
  const handleKeyDown = (handle: "start" | "end") => (e: React.KeyboardEvent) => {
    if (disabled) return;

    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      delta = step;
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      delta = -step;
      e.preventDefault();
    } else if (e.key === "Home") {
      delta = min - (mode === "single" ? (currentValue as number) : handle === "start" ? startValue : endValue);
      e.preventDefault();
    } else if (e.key === "End") {
      delta = max - (mode === "single" ? (currentValue as number) : handle === "start" ? startValue : endValue);
      e.preventDefault();
    }

    if (delta !== 0) {
      if (mode === "single") {
        const newValue = normalizeValue((currentValue as number) + delta);
        updateValue(newValue);
      } else {
        const [start, end] = getValueArray();
        if (handle === "start") {
          const newStart = normalizeValue(start + delta);
          updateValue([Math.min(newStart, end), end]);
        } else {
          const newEnd = normalizeValue(end + delta);
          updateValue([start, Math.max(newEnd, start)]);
        }
      }
    }
  };

  // Add/remove global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Calculate positions
  const startPercentage = mode === "range" ? getPercentage(startValue) : 0;
  const endPercentage = getPercentage(endValue);

  // Generate step markers
  const stepMarkers = showStepMarkers
    ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
    : [];

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {showValue && (
            <span className="text-sm font-medium text-foreground-muted">
              {mode === "range"
                ? `${formatValue(startValue)} - ${formatValue(endValue)}`
                : formatValue(endValue)}
            </span>
          )}
        </div>
      )}

      <div className="relative pt-2 pb-6">
        {/* Track */}
        <div
          ref={trackRef}
          className={`relative h-2 bg-surface-hover rounded-full ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          onClick={handleTrackClick}
        >
          {/* Active range */}
          <div
            className="absolute h-full bg-primary-500 rounded-full transition-all duration-200 ease-out"
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
            }}
          />

          {/* Step markers */}
          {showStepMarkers && (
            <div className="absolute inset-0">
              {stepMarkers.map((markerValue) => (
                <div
                  key={markerValue}
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-surface-border rounded-full"
                  style={{ left: `${getPercentage(markerValue)}%` }}
                />
              ))}
            </div>
          )}

          {/* Start handle (for range mode) */}
          {mode === "range" && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-md transition-all duration-200 ease-out ${
                disabled
                  ? "cursor-not-allowed"
                  : "cursor-grab active:cursor-grabbing hover:scale-110"
              } ${
                isDragging === "start" ? "scale-110 shadow-lg ring-2 ring-primary-500/40" : ""
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2`}
              style={{ left: `${startPercentage}%` }}
              onMouseDown={handleMouseDown("start")}
              onTouchStart={handleTouchStart("start")}
              onKeyDown={handleKeyDown("start")}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={startValue}
              aria-label={`${label || "Range"} start`}
              tabIndex={disabled ? -1 : 0}
            />
          )}

          {/* End handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-md transition-all duration-200 ease-out ${
              disabled
                ? "cursor-not-allowed"
                : "cursor-grab active:cursor-grabbing hover:scale-110"
            } ${
              isDragging === "end" ? "scale-110 shadow-lg ring-2 ring-primary-500/40" : ""
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2`}
            style={{ left: `${endPercentage}%` }}
            onMouseDown={handleMouseDown("end")}
            onTouchStart={handleTouchStart("end")}
            onKeyDown={handleKeyDown("end")}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={endValue}
            aria-label={mode === "range" ? `${label || "Range"} end` : label || "Value"}
            tabIndex={disabled ? -1 : 0}
          />
        </div>

        {/* Min/Max labels */}
        {showStepMarkers && (
          <div className="flex justify-between mt-2 text-xs text-foreground-muted">
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default Slider;
