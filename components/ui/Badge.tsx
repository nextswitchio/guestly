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
    primary: "bg-lime/10 text-lime",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-50 text-red-700",
    navy: "bg-neutral-900 text-white",
    virtual: "bg-lime text-dark",
    hybrid: "bg-neutral-800 text-lime",
    physical: "bg-green-500 text-white",
    free: "bg-green-50 text-green-700",
    live: "bg-red-500 text-white",
  };
  return map[variant] ?? map.neutral;
}

function dotColor(variant: Variant, prefersReducedMotion: boolean) {
  const map: Record<Variant, string> = {
    neutral: "bg-neutral-500",
    primary: "bg-lime",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    navy: "bg-white",
    virtual: "bg-white",
    hybrid: "bg-lime",
    physical: "bg-white",
    free: "bg-green-500",
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
