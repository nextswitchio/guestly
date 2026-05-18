"use client";
import React from "react";
import type { ButtonHTMLAttributes } from "react";
import { getImageSrc } from "@/utils/imageUtils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?:
    | "primary"
    | "white"
    | "secondary"
    | "outline"
    | "teal"
    | "teal-outline";
  iconPosition?: "left" | "right";
  height?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  icon,
  iconPosition = "left",
  variant = "primary",
  height = "min-h-[52px]",
  ...rest
}) => {
  // Base classes that apply to all variants
  const baseClasses = `font-medium rounded-lg w-full px-7 py-3.5 text-base transition-colors font-inter leading-[19.2px] text-[15px] flex items-center justify-center gap-2 ${height}`;

  // Disabled classes (same for all variants)
  const disabledClasses = "bg-[#D4E0E4] text-[#485558] cursor-not-allowed";

  // Active variant classes (when not disabled)
  const activeVariantClasses: Record<
    "primary" | "white" | "secondary" | "outline" | "teal" | "teal-outline",
    string
  > = {
    primary:
      "bg-lime border border-lime text-dark cursor-pointer hover:bg-lime-hover",
    secondary:
      "bg-dark text-white border border-dark cursor-pointer hover:bg-dark/90",
    teal: "bg-[#012E3B] text-white border border-[#012E3B] cursor-pointer hover:bg-[#012E3B]/90",
    white:
      "bg-white text-dark border border-white cursor-pointer hover:bg-gray-50",
    "teal-outline":
      "bg-white text-dark border border-[#E5E7EB] cursor-pointer hover:bg-gray-50",
    outline:
      "bg-transparent text-dark border border-[#012E3B] cursor-pointer hover:bg-gray-100",
  };

  // Get the appropriate variant class
  const variantClass =
    activeVariantClasses[variant as keyof typeof activeVariantClasses] ??
    activeVariantClasses.primary;

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : variantClass}`}
      {...rest}
    >
      {icon && iconPosition === "left" && (
        <span className="flex items-center justify-center">
          {typeof icon === "string" ? (
            <img src={getImageSrc(icon)} alt="" />
          ) : (
            icon
          )}
        </span>
      )}

      <span className="inline-flex items-center gap-1.5">{children}</span>

      {icon && iconPosition === "right" && (
        <span className="flex items-center justify-center">
          {typeof icon === "string" ? (
            <img src={getImageSrc(icon)} alt="" />
          ) : (
            icon
          )}
        </span>
      )}
    </button>
  );
};

export default Button;
