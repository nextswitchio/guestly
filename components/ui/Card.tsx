import React from "react";

type CardVariant = "default" | "glass" | "elevated" | "flat" | "bordered" | "navy";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  children?: React.ReactNode;
}

function variantClasses(variant: CardVariant, hoverable: boolean) {
  const baseMap: Record<CardVariant, string> = {
    default: "bg-[var(--surface-card)] border border-[var(--surface-border)]",
    glass: "glass",
    elevated: "bg-[var(--surface-card)] border border-[var(--surface-border)]",
    flat: "bg-[var(--surface-card)] border border-[var(--surface-border)]",
    bordered: "bg-transparent border-2 border-[var(--surface-border)]",
    navy: "bg-navy-800 border border-navy-700 text-white",
  };

  // Shadow classes based on variant
  const shadowMap: Record<CardVariant, string> = {
    default: "[box-shadow:var(--elevation-1)]",
    glass: "[box-shadow:var(--elevation-2)]",
    elevated: "[box-shadow:var(--elevation-2)]",
    flat: "",
    bordered: "",
    navy: "[box-shadow:var(--elevation-2)]",
  };

  // Hover shadow classes when hoverable is true
  const hoverShadowMap: Record<CardVariant, string> = {
    default: "hover:[box-shadow:var(--elevation-3)]",
    glass: "hover:[box-shadow:var(--elevation-4)]",
    elevated: "hover:[box-shadow:var(--elevation-4)]",
    flat: "hover:[box-shadow:var(--elevation-2)]",
    bordered: "hover:[box-shadow:var(--elevation-3)]",
    navy: "hover:[box-shadow:var(--elevation-4)]",
  };

  const base = baseMap[variant] ?? baseMap.default;
  const shadow = shadowMap[variant] ?? shadowMap.default;
  const hoverShadow = hoverable ? hoverShadowMap[variant] : "";

  return `${base} ${shadow} ${hoverShadow}`.trim();
}

function paddingClasses(padding: "none" | "sm" | "md" | "lg") {
  const map = { none: "", sm: "p-3", md: "p-5", lg: "p-6" };
  return map[padding] ?? map.md;
}

function Card({
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  // Spring transition using design tokens with enhanced hover effects
  const transitionClasses = hoverable 
    ? "transition-all [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-spring)] spring-hover"
    : "transition-all [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-spring-gentle)]";

  return (
    <div
      className={`rounded-2xl ${variantClasses(variant, hoverable)} ${paddingClasses(padding)} ${transitionClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Named export for compatibility
export { Card };
// Default export
export default Card;
