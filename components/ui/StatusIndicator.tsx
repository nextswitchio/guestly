"use client";
import React from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type StatusType = "active" | "inactive" | "pending" | "completed" | "cancelled" | "draft" | "sold-out";

interface StatusIndicatorProps {
  status: StatusType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, { 
  color: string; 
  bgColor: string; 
  label: string;
  dotColor: string;
  shouldPulse?: boolean; // Only pulse for truly dynamic statuses
}> = {
  active: {
    color: "text-[var(--color-success-600)]",
    bgColor: "bg-[var(--color-success-50)]",
    label: "Active",
    dotColor: "bg-[var(--color-success-500)]",
    shouldPulse: true // Active status benefits from pulse
  },
  inactive: {
    color: "text-[var(--color-neutral-600)]",
    bgColor: "bg-[var(--color-neutral-50)]",
    label: "Inactive",
    dotColor: "bg-[var(--color-neutral-400)]"
  },
  pending: {
    color: "text-[var(--color-warning-600)]",
    bgColor: "bg-[var(--color-warning-50)]",
    label: "Pending",
    dotColor: "bg-[var(--color-warning-500)]",
    shouldPulse: true // Pending status benefits from pulse
  },
  completed: {
    color: "text-[var(--color-success-600)]",
    bgColor: "bg-[var(--color-success-50)]",
    label: "Completed",
    dotColor: "bg-[var(--color-success-500)]"
  },
  cancelled: {
    color: "text-[var(--color-danger-600)]",
    bgColor: "bg-[var(--color-danger-50)]",
    label: "Cancelled",
    dotColor: "bg-[var(--color-danger-500)]"
  },
  draft: {
    color: "text-[var(--color-neutral-600)]",
    bgColor: "bg-[var(--color-neutral-50)]",
    label: "Draft",
    dotColor: "bg-[var(--color-neutral-400)]"
  },
  "sold-out": {
    color: "text-[var(--color-danger-600)]",
    bgColor: "bg-[var(--color-danger-50)]",
    label: "Sold Out",
    dotColor: "bg-[var(--color-danger-500)]"
  }
};

const sizeConfig = {
  sm: {
    dot: "h-2 w-2",
    text: "text-xs",
    padding: "px-2 py-1"
  },
  md: {
    dot: "h-2.5 w-2.5",
    text: "text-xs",
    padding: "px-2.5 py-1.5"
  },
  lg: {
    dot: "h-3 w-3",
    text: "text-sm",
    padding: "px-3 py-2"
  }
};

export default function StatusIndicator({ 
  status, 
  size = "md", 
  showLabel = true, 
  className = "" 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const prefersReducedMotion = useReducedMotion();

  // Only pulse for dynamic statuses and when motion is enabled
  const shouldAnimate = config.shouldPulse && !prefersReducedMotion;
  const pulseClass = shouldAnimate ? "animate-pulse-subtle" : "";

  if (!showLabel) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div 
          className={`${sizeStyles.dot} ${config.dotColor} rounded-full transition-all duration-200 hover:scale-110 ${pulseClass}`}
          title={config.label}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${config.bgColor} ${sizeStyles.padding} transition-all duration-200 hover:scale-105 ${className}`}>
      <div className={`${sizeStyles.dot} ${config.dotColor} rounded-full ${pulseClass}`} />
      <span className={`${sizeStyles.text} ${config.color} font-medium`}>
        {config.label}
      </span>
    </div>
  );
}