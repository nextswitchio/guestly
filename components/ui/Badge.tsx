import React from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Variant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "navy"
  | "virtual"
  | "hybrid"
  | "physical"
  | "free"
  | "live";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
  children?: React.ReactNode;
}

function colorMap(variant: Variant) {
  const map: Record<Variant, string> = {
    neutral: "bg-neutral-100 text-neutral-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-100 text-warning-800",
    danger: "bg-danger-50 text-danger-700",
    navy: "bg-navy-800 text-white",
    virtual: "bg-primary-500 text-white",
    hybrid: "bg-navy-700 text-primary-300",
    physical: "bg-success-500 text-white",
    free: "bg-success-50 text-success-700",
    live: "bg-danger-500 text-white",
  };
  return map[variant] ?? map.neutral;
}

function dotColor(variant: Variant, prefersReducedMotion: boolean) {
  const map: Record<Variant, string> = {
    neutral: "bg-neutral-500",
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
    navy: "bg-white",
    virtual: "bg-white",
    hybrid: "bg-primary-300",
    physical: "bg-white",
    free: "bg-success-500",
    live: prefersReducedMotion ? "bg-white" : "bg-white animate-pulse-subtle",
  };
  return map[variant] ?? map.neutral;
}

export default function Badge({
  variant = "neutral",
  dot,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${colorMap(variant)} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor(variant, prefersReducedMotion)}`} />
      )}
      {children}
    </span>
  );
}
