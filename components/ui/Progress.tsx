"use client";
import React from "react";
import { useReducedMotion, useAnimationClass } from "@/lib/hooks/useReducedMotion";

type ProgressVariant = "linear" | "circular";
type ProgressSize = "sm" | "md" | "lg";

interface ProgressProps {
  variant?: ProgressVariant;
  value?: number; // 0-100, undefined for indeterminate
  size?: ProgressSize;
  showPercentage?: boolean;
  color?: "primary" | "success" | "warning" | "danger";
  className?: string;
  label?: string;
}

export default function Progress({
  variant = "linear",
  value,
  size = "md",
  showPercentage = false,
  color = "primary",
  className = "",
  label,
}: ProgressProps) {
  const isIndeterminate = value === undefined;
  const clampedValue = value !== undefined ? Math.min(100, Math.max(0, value)) : 0;

  if (variant === "circular") {
    return (
      <CircularProgress
        value={clampedValue}
        isIndeterminate={isIndeterminate}
        size={size}
        showPercentage={showPercentage}
        color={color}
        className={className}
        label={label}
      />
    );
  }

  return (
    <LinearProgress
      value={clampedValue}
      isIndeterminate={isIndeterminate}
      size={size}
      showPercentage={showPercentage}
      color={color}
      className={className}
      label={label}
    />
  );
}

// Linear Progress Component
interface LinearProgressProps {
  value: number;
  isIndeterminate: boolean;
  size: ProgressSize;
  showPercentage: boolean;
  color: "primary" | "success" | "warning" | "danger";
  className: string;
  label?: string;
}

function LinearProgress({
  value,
  isIndeterminate,
  size,
  showPercentage,
  color,
  className,
  label,
}: LinearProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const indeterminateClass = useAnimationClass("animate-indeterminate-linear");

  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showPercentage && !isIndeterminate && (
            <span className="text-sm font-medium text-foreground-muted">
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-surface-hover rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        {isIndeterminate ? (
          <div
            className={`h-full ${colorClasses[color]} rounded-full ${indeterminateClass}`}
            style={{ width: "40%" }}
          />
        ) : (
          <div
            className={`h-full ${colorClasses[color]} rounded-full ${
              prefersReducedMotion ? "transition-none" : "transition-all duration-300 ease-out"
            }`}
            style={{ width: `${value}%` }}
          />
        )}
      </div>
    </div>
  );
}

// Circular Progress Component
interface CircularProgressProps {
  value: number;
  isIndeterminate: boolean;
  size: ProgressSize;
  showPercentage: boolean;
  color: "primary" | "success" | "warning" | "danger";
  className: string;
  label?: string;
}

function CircularProgress({
  value,
  isIndeterminate,
  size,
  showPercentage,
  color,
  className,
  label,
}: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const indeterminateClass = useAnimationClass("animate-indeterminate-circular");

  const sizeClasses = {
    sm: { container: "w-12 h-12", svg: 48, strokeWidth: 4, fontSize: "text-xs" },
    md: { container: "w-16 h-16", svg: 64, strokeWidth: 5, fontSize: "text-sm" },
    lg: { container: "w-24 h-24", svg: 96, strokeWidth: 6, fontSize: "text-base" },
  };

  const colorClasses = {
    primary: "stroke-primary-500",
    success: "stroke-success-500",
    warning: "stroke-warning-500",
    danger: "stroke-danger-500",
  };

  const config = sizeClasses[size];
  const radius = (config.svg - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`relative ${config.container}`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <svg
          className="transform -rotate-90"
          width={config.svg}
          height={config.svg}
          viewBox={`0 0 ${config.svg} ${config.svg}`}
        >
          {/* Background circle */}
          <circle
            cx={config.svg / 2}
            cy={config.svg / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-surface-hover"
          />
          {/* Progress circle */}
          {isIndeterminate ? (
            <circle
              cx={config.svg / 2}
              cy={config.svg / 2}
              r={radius}
              fill="none"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              className={`${colorClasses[color]} ${indeterminateClass}`}
              style={{
                strokeDasharray: `${circumference * 0.25} ${circumference * 0.75}`,
              }}
            />
          ) : (
            <circle
              cx={config.svg / 2}
              cy={config.svg / 2}
              r={radius}
              fill="none"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              className={`${colorClasses[color]} ${
                prefersReducedMotion ? "transition-none" : "transition-all duration-300 ease-out"
              }`}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
            />
          )}
        </svg>
        {/* Percentage text */}
        {showPercentage && !isIndeterminate && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-semibold text-foreground ${config.fontSize}`}>
              {Math.round(value)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-foreground-muted text-center">
          {label}
        </span>
      )}
    </div>
  );
}
