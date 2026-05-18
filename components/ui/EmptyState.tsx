import React from "react";
import Icon, { IconName } from "@/components/ui/Icon";
import Button from "./Button";

interface EmptyStateProps {
  icon?: IconName | React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  tips?: string[];
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  tips,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center transition-colors ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-neutral-400 transition-transform hover:scale-110">
          {typeof icon === 'string' ? <Icon name={icon as IconName} size={32} /> : icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-neutral-900">{title}</h3>

      {/* Description */}
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            action.href ? (
              <a href={action.href}>
                <Button variant="primary" size="md">
                  {action.label}
                </Button>
              </a>
            ) : (
              <Button variant="primary" size="md" onClick={action.onClick}>
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <a href={secondaryAction.href}>
                <Button variant="secondary" size="md">
                  {secondaryAction.label}
                </Button>
              </a>
            ) : (
              <Button variant="secondary" size="md" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      )}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <div className="mt-8 w-full max-w-md rounded-xl bg-white p-4 text-left border border-neutral-200">
          <p className="mb-2 text-xs font-semibold text-neutral-900 flex items-center gap-1">
            <Icon name="lightbulb" size={14} /> Quick Tips
          </p>
          <ul className="space-y-1.5 text-xs text-neutral-600">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5 text-lime">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
