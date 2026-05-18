"use client";
import React from "react";
import SwipeableCard from "@/components/ui/SwipeableCard";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type Toast = {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
};

interface ToastContextType {
  addToast: (
    message: string,
    options?: {
      type?: Toast["type"];
      duration?: number;
      action?: ToastAction;
      dismissible?: boolean;
    }
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [progress, setProgress] = React.useState(100);
  const [isExiting, setIsExiting] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(Date.now());
  const remainingTimeRef = React.useRef<number>(toast.duration || 5000);

  const startTimer = React.useCallback(() => {
    startTimeRef.current = Date.now();
    const duration = remainingTimeRef.current;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      const progressPercent = (remaining / duration) * 100;
      setProgress(progressPercent);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleDismiss();
      }
    }, 16);
  }, []);

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  };

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  React.useEffect(() => {
    if (toast.duration !== 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [toast.duration, startTimer]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-success-50 dark:bg-success-900/20",
          border: "border-success-200 dark:border-success-800",
          text: "text-success-900 dark:text-success-100",
          icon: "text-success-600 dark:text-success-400",
          progress: "bg-success-500",
        };
      case "warning":
        return {
          bg: "bg-warning-50 dark:bg-warning-900/20",
          border: "border-warning-200 dark:border-warning-800",
          text: "text-warning-900 dark:text-warning-100",
          icon: "text-warning-600 dark:text-warning-400",
          progress: "bg-warning-500",
        };
      case "error":
        return {
          bg: "bg-danger-50 dark:bg-danger-900/20",
          border: "border-danger-200 dark:border-danger-800",
          text: "text-danger-900 dark:text-danger-100",
          icon: "text-danger-600 dark:text-danger-400",
          progress: "bg-danger-500",
        };
      default: // info
        return {
          bg: "bg-primary-50 dark:bg-primary-900/20",
          border: "border-primary-200 dark:border-primary-800",
          text: "text-primary-900 dark:text-primary-100",
          icon: "text-primary-600 dark:text-primary-400",
          progress: "bg-primary-500",
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default: // info
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const styles = getToastStyles();

  return (
    <SwipeableCard
      rightAction={{
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        label: "Dismiss",
        color: "danger",
        action: handleDismiss
      }}
      onSwipeLeft={handleDismiss}
      className={`transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)] ${
        isExiting ? "opacity-0 translate-x-full scale-95" : "opacity-100 translate-x-0 scale-100"
      }`}
      swipeThreshold={60}
    >
      <div
        className={`
          relative min-w-80 max-w-md rounded-lg border shadow-lg overflow-hidden
          ${styles.bg} ${styles.border}
          ${!isExiting ? (toast.type === "success" ? "animate-success-bounce" : "animate-spring-slide-up") : ""}
        `}
        onMouseEnter={pauseTimer}
        onMouseLeave={startTimer}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 p-4">
          <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${styles.text}`}>{toast.message}</p>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  handleDismiss();
                }}
                className={`mt-2 text-sm font-semibold ${styles.icon} hover:underline focus:outline-none focus:underline`}
              >
                {toast.action.label}
              </button>
            )}
          </div>
          {toast.dismissible !== false && (
            <button
              onClick={handleDismiss}
              className={`flex-shrink-0 ${styles.icon} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded touch-target transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)] spring-tap`}
              aria-label="Dismiss"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {toast.duration !== 0 && (
          <div className="h-1 bg-black/10 dark:bg-white/10">
            <div
              className={`h-full transition-all duration-75 ease-linear ${styles.progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </SwipeableCard>
  );
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (
      message: string,
      options?: {
        type?: Toast["type"];
        duration?: number;
        action?: ToastAction;
        dismissible?: boolean;
      }
    ) => {
      const id = Math.random().toString(36).slice(2);
      const newToast: Toast = {
        id,
        message,
        type: options?.type || "info",
        duration: options?.duration !== undefined ? options.duration : 5000,
        action: options?.action,
        dismissible: options?.dismissible !== false,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

