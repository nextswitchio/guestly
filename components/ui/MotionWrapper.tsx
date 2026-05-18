"use client";

import React from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface MotionWrapperProps {
  children: React.ReactNode;
  /** Animation class to apply when motion is enabled */
  animationClass?: string;
  /** Alternative class to apply when motion is reduced */
  reducedMotionClass?: string;
  /** Whether to completely hide the element when motion is reduced */
  hideOnReducedMotion?: boolean;
  /** Additional className */
  className?: string;
  /** HTML element type to render */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional props to pass to the element */
  [key: string]: unknown;
}

/**
 * A wrapper component that conditionally applies animation classes based on user's motion preferences.
 * 
 * @example
 * // Basic usage - applies animation class only when motion is enabled
 * <MotionWrapper animationClass="animate-fade-in">
 *   <div>Content</div>
 * </MotionWrapper>
 * 
 * @example
 * // With alternative class for reduced motion
 * <MotionWrapper 
 *   animationClass="animate-spring-scale" 
 *   reducedMotionClass="opacity-100"
 * >
 *   <div>Content</div>
 * </MotionWrapper>
 * 
 * @example
 * // Hide decorative animations completely
 * <MotionWrapper animationClass="animate-pulse-glow" hideOnReducedMotion>
 *   <div>Decorative element</div>
 * </MotionWrapper>
 */
export default function MotionWrapper({
  children,
  animationClass = "",
  reducedMotionClass = "",
  hideOnReducedMotion = false,
  className = "",
  as: Component = "div",
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  // Hide element completely if requested and motion is reduced
  if (hideOnReducedMotion && prefersReducedMotion) {
    return null;
  }

  // Determine which class to apply
  const appliedClass = prefersReducedMotion 
    ? reducedMotionClass 
    : animationClass;

  const finalClassName = [className, appliedClass].filter(Boolean).join(" ");

  const ElementComponent = Component as React.ElementType;

  return (
    <ElementComponent className={finalClassName} {...props}>
      {children}
    </ElementComponent>
  );
}

/**
 * Hook to conditionally apply styles based on motion preferences
 */
export function useMotionStyles(
  animationStyles: React.CSSProperties,
  reducedMotionStyles?: React.CSSProperties
): React.CSSProperties {
  const prefersReducedMotion = useReducedMotion();
  
  return prefersReducedMotion 
    ? (reducedMotionStyles || {})
    : animationStyles;
}

/**
 * Hook to conditionally execute functions based on motion preferences
 */
export function useMotionCallback<T extends (...args: unknown[]) => unknown>(
  animationCallback: T,
  reducedMotionCallback?: T
): T {
  const prefersReducedMotion = useReducedMotion();
  
  return (prefersReducedMotion 
    ? (reducedMotionCallback || (() => {}))
    : animationCallback) as T;
}