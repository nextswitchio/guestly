import React from "react";

type Variant = "neutral" | "success" | "warning" | "primary";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  children?: React.ReactNode;
}

function color(variant: Variant) {
  if (variant === "success") return "bg-success-100 text-success-700";
  if (variant === "warning") return "bg-warning-100 text-warning-700";
  if (variant === "primary") return "bg-primary-100 text-primary-700";
  return "bg-neutral-100 text-neutral-700";
}

export default function Badge({ variant = "neutral", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color(variant)} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

