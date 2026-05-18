'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({
  title,
  message,
  onRetry,
  onDismiss,
  variant = 'error'
}: ErrorMessageProps) {
  const variantStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      icon: 'alert-triangle' as const
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      icon: 'alert-circle' as const
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      icon: 'info' as const
    }
  };

  const styles = variantStyles[variant];

  return (
    <Card className={`p-6 ${styles.bg} border ${styles.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon name={styles.icon} className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-lg font-semibold ${styles.textColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${styles.textColor} opacity-90`}>
            {message}
          </p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-4">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon name="refresh-cw" className="w-4 h-4" />
                  Try Again
                </Button>
              )}
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  size="sm"
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${styles.iconColor} hover:opacity-70 transition-opacity`}
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        )}
      </div>
    </Card>
  );
}

// Inline error message for forms
export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
      <Icon name="alert-circle" className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}

// Toast-style error notification
export function ErrorToast({ 
  message, 
  onClose 
}: { 
  message: string; 
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <Card className="p-4 bg-red-50 border border-red-200 shadow-lg max-w-md">
        <div className="flex items-start gap-3">
          <Icon name="alert-triangle" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900 flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-red-600 hover:opacity-70 transition-opacity"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
