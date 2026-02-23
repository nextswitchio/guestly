import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
      <div className="text-4xl">🤷‍♂️</div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

