import React from 'react';
import Icon from '@/components/ui/Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode | string;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'primary' | 'white' | 'secondary' | 'outline' | 'teal' | 'teal-outline' | 'ghost' | 'success' | 'danger' | 'default' | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  height?: string;
  glow?: boolean;
  fullWidth?: boolean;
  href?: string;
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  leftIcon,
  rightIcon,
  variant = "primary",
  size,
  height,
  glow,
  fullWidth,
  href,
  className = "",
  asChild,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  // Size classes
  const sizeClasses: Record<string, string> = {
    xs: "px-2 py-1 text-xs min-h-[24px]",
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-7 py-3.5 text-[15px] min-h-[52px]",
    lg: "px-8 py-4 text-base min-h-[56px]",
    xl: "px-10 py-5 text-lg min-h-[64px]",
  };

  const resolvedSize = size ? sizeClasses[size] : (height ? `px-7 py-3.5 text-[15px] ${height}` : sizeClasses.md);

  // Base classes
  const baseClasses = `font-medium rounded-lg transition-colors font-inter leading-[19.2px] flex items-center justify-center gap-2 ${resolvedSize} ${fullWidth ? 'w-full' : ''}`;

  // Disabled classes
  const disabledClasses = "bg-[#D4E0E4] text-[#485558] cursor-not-allowed";

  // Active variant classes
  const activeVariantClasses: Record<string, string> = {
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
    default:
      "bg-transparent text-dark border border-[#012E3B] cursor-pointer hover:bg-gray-100",
    ghost:
      "bg-transparent text-dark border border-transparent cursor-pointer hover:bg-gray-100",
    success:
      "bg-green-600 text-white border border-green-600 cursor-pointer hover:bg-green-700",
    danger:
      "bg-red-600 text-white border border-red-600 cursor-pointer hover:bg-red-700",
    amber:
      "bg-amber-500 text-white border border-amber-500 cursor-pointer hover:bg-amber-600",
  };

  const variantClass = activeVariantClasses[variant] ?? activeVariantClasses.primary;
  const resolvedLeftIcon = leftIcon || (icon && iconPosition === "left" ? icon : null);
  const resolvedRightIcon = rightIcon || (icon && iconPosition === "right" ? icon : null);

  const content = (
    <>
      {loading && (
        <span className="flex items-center justify-center">
          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </span>
      )}
      {!loading && resolvedLeftIcon && (
        <span className="flex items-center justify-center">
          {typeof resolvedLeftIcon === "string" ? <Icon name={resolvedLeftIcon} size={16} /> : resolvedLeftIcon}
        </span>
      )}
      {children && <span className="inline-flex items-center gap-1.5">{children}</span>}
      {!loading && resolvedRightIcon && (
        <span className="flex items-center justify-center">
          {typeof resolvedRightIcon === "string" ? <Icon name={resolvedRightIcon} size={16} /> : resolvedRightIcon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${isDisabled ? disabledClasses : variantClass} ${className}`}
      >
        {content}
      </a>
    );
  }

  // Handle asChild pattern - render child element with button props
  if (asChild && children) {
    const child = React.Children.only(children) as React.ReactElement<{ className?: string; disabled?: boolean }>;
    // Filter out Button-specific props that shouldn't be passed to the child
    // (leftIcon, rightIcon, icon, iconPosition, loading, variant, size, height, glow, fullWidth, asChild are already destructured above)
    return React.cloneElement(child, {
      disabled: isDisabled,
      className: `${baseClasses} ${isDisabled ? disabledClasses : variantClass} ${child.props.className || ''} ${className}`,
      ...rest,
    });
  }

  return (
    <button
      disabled={isDisabled}
      className={`${baseClasses} ${isDisabled ? disabledClasses : variantClass} ${className}`}
      {...rest}
    >
      {content}
    </button>
  );
};

export { Button };
export default Button;
