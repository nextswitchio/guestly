import React from "react";

import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

function variantClasses(variant: Variant) {
  if (variant === "primary") return "bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-sm";
  if (variant === "secondary") return "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium";
  if (variant === "outline") return "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 font-medium shadow-sm";
  if (variant === "ghost") return "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900";
  return "";
}

function sizeClasses(size: Size) {
  if (size === "sm") return "h-8 px-3 text-xs";
  if (size === "lg") return "h-11 px-6 text-base";
  return "h-9 px-4 text-sm";
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:pointer-events-none";
  const classes = `${base} ${variantClasses(variant)} ${sizeClasses(size)} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

