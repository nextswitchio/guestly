import React from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    dismissable?: boolean;
    onDismiss?: () => void;
    className?: string;
}

function alertStyles(variant: AlertVariant) {
    const map: Record<AlertVariant, { wrap: string; icon: string; iconPath: React.ReactNode }> = {
        info: {
            wrap: "bg-primary-50 border-primary-200 text-primary-900",
            icon: "text-primary-500",
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        },
        success: {
            wrap: "bg-success-50 border-success-200 text-success-900",
            icon: "text-success-500",
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        },
        warning: {
            wrap: "bg-warning-50 border-warning-200 text-warning-900",
            icon: "text-warning-500",
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        },
        danger: {
            wrap: "bg-danger-50 border-danger-200 text-danger-900",
            icon: "text-danger-500",
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        },
    };
    return map[variant] ?? map.info;
}

export default function Alert({
    variant = "info",
    title,
    children,
    dismissable,
    onDismiss,
    className = "",
}: AlertProps) {
    const styles = alertStyles(variant);

    return (
        <div
            className={`flex gap-3 rounded-xl border px-4 py-3.5 animate-fade-in ${styles.wrap} ${className}`}
            role="alert"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                {styles.iconPath}
            </svg>
            <div className="flex-1 min-w-0">
                {title && <p className="text-sm font-semibold mb-0.5">{title}</p>}
                <div className="text-sm opacity-90">{children}</div>
            </div>
            {dismissable && (
                <button
                    onClick={onDismiss}
                    className="shrink-0 rounded-lg p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Dismiss"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
}
