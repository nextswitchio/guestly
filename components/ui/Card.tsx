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
    default: "bg-white border border-neutral-200",
    glass: "glass",
    elevated: "bg-white border border-neutral-200",
    flat: "bg-white border border-neutral-200",
    bordered: "bg-transparent border-2 border-neutral-200",
    navy: "bg-navy-800 border border-navy-700 text-white",
  };

  // Shadow classes based on variant
  const shadowMap: Record<CardVariant, string> = {
    default: "[box-shadow:0_1px_3px_rgba(0,0,0,0.1)]",
    glass: "[box-shadow:0_4px_6px_rgba(0,0,0,0.1)]",
    elevated: "[box-shadow:0_4px_6px_rgba(0,0,0,0.1)]",
    flat: "",
    bordered: "",
    navy: "[box-shadow:0_4px_6px_rgba(0,0,0,0.1)]",
  };

  // Hover shadow classes when hoverable is true
  const hoverShadowMap: Record<CardVariant, string> = {
    default: "hover:[box-shadow:0_10px_15px_rgba(0,0,0,0.1)]",
    glass: "hover:[box-shadow:0_20px_25px_rgba(0,0,0,0.15)]",
    elevated: "hover:[box-shadow:0_20px_25px_rgba(0,0,0,0.15)]",
    flat: "hover:[box-shadow:0_4px_6px_rgba(0,0,0,0.1)]",
    bordered: "hover:[box-shadow:0_10px_15px_rgba(0,0,0,0.1)]",
    navy: "hover:[box-shadow:0_20px_25px_rgba(0,0,0,0.15)]",
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
    ? "transition-all [transition-duration:300ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] spring-hover"
    : "transition-all [transition-duration:200ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]";

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
