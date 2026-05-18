import { useEffect, useState } from 'react';

/**
 * Hook to detect user's motion preferences
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Create media query for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value - this is safe in useEffect
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook that returns animation duration based on motion preferences
 * Returns 0ms if reduced motion is preferred, otherwise returns the provided duration
 */
export function useAnimationDuration(duration: number): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0 : duration;
}

/**
 * Hook that returns animation class names based on motion preferences
 * Returns empty string or instant alternatives if reduced motion is preferred
 */
export function useAnimationClass(
  animationClass: string,
  instantAlternative?: string
): string {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return instantAlternative || '';
  }
  
  return animationClass;
}

/**
 * Hook that returns spring/bounce easing as linear when reduced motion is preferred
 */
export function useAnimationEasing(easing: string): string {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    // Convert spring/bounce easings to linear for reduced motion
    if (easing.includes('spring') || easing.includes('bounce')) {
      return 'linear';
    }
  }
  
  return easing;
}