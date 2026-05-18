"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface UseDataTransitionOptions<T> {
  data: T;
  loading: boolean;
  transitionDuration?: number;
  enableOptimisticUpdates?: boolean;
}

interface DataTransitionState<T> {
  currentData: T;
  previousData: T | null;
  isTransitioning: boolean;
  isLoading: boolean;
  progress: number;
}

/**
 * Hook for managing smooth transitions between data states
 * Provides optimistic UI updates and smooth loading transitions
 */
export function useDataTransition<T>({
  data,
  loading,
  transitionDuration = 300,
  enableOptimisticUpdates = true,
}: UseDataTransitionOptions<T>): DataTransitionState<T> & {
  setOptimisticData: (optimisticData: T) => void;
  resetOptimistic: () => void;
} {
  const [currentData, setCurrentData] = useState<T>(data);
  const [previousData, setPreviousData] = useState<T | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimisticData, setOptimisticDataState] = useState<T | null>(null);
  
  // Use refs to avoid dependency issues
  const currentDataRef = useRef(currentData);
  const optimisticDataRef = useRef(optimisticData);
  
  // Update refs when state changes
  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);
  
  useEffect(() => {
    optimisticDataRef.current = optimisticData;
  }, [optimisticData]);

  // Handle data changes with smooth transitions
  useEffect(() => {
    if (loading) {
      return;
    }

    // Check if data actually changed to prevent infinite loops
    const dataChanged = JSON.stringify(data) !== JSON.stringify(currentDataRef.current);
    const optimisticChanged = optimisticDataRef.current && JSON.stringify(data) !== JSON.stringify(optimisticDataRef.current);

    if (optimisticChanged) {
      // Transition from optimistic to real data
      setPreviousData(optimisticDataRef.current);
      setIsTransitioning(true);
      setProgress(0);

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / transitionDuration, 1);
        setProgress(newProgress);

        if (newProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentData(data);
          setPreviousData(null);
          setIsTransitioning(false);
          setOptimisticDataState(null);
          setProgress(0);
        }
      };

      requestAnimationFrame(animate);
    } else if (dataChanged) {
      // Normal data transition
      setPreviousData(currentDataRef.current);
      setIsTransitioning(true);
      setProgress(0);

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / transitionDuration, 1);
        setProgress(newProgress);

        if (newProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentData(data);
          setPreviousData(null);
          setIsTransitioning(false);
          setProgress(0);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [data, loading, transitionDuration]);

  const setOptimisticData = useCallback((newOptimisticData: T) => {
    if (!enableOptimisticUpdates) return;
    
    setOptimisticDataState(newOptimisticData);
    setCurrentData(newOptimisticData);
  }, [enableOptimisticUpdates]);

  const resetOptimistic = useCallback(() => {
    setOptimisticDataState(null);
  }, []);

  return {
    currentData: optimisticData || currentData,
    previousData,
    isTransitioning,
    isLoading: loading,
    progress,
    setOptimisticData,
    resetOptimistic,
  };
}

/**
 * Hook for managing time range transitions with smooth animations
 */
export function useTimeRangeTransition() {
  const [isChanging, setIsChanging] = useState(false);
  const [pendingRange, setPendingRange] = useState<string | null>(null);

  const changeTimeRange = useCallback(async (
    newRange: string,
    onRangeChange: (range: string) => Promise<void> | void
  ) => {
    setIsChanging(true);
    setPendingRange(newRange);

    try {
      await onRangeChange(newRange);
    } finally {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsChanging(false);
        setPendingRange(null);
      }, 150);
    }
  }, []);

  return {
    isChanging,
    pendingRange,
    changeTimeRange,
  };
}

/**
 * Easing functions for smooth animations
 */
export const easingFunctions = {
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};