import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center">
      <div className="mb-2 text-lg font-semibold">{title}</div>
      {description && <div className="mb-4 text-sm text-neutral-600">{description}</div>}
      {actionText && <Button onClick={onAction}>{actionText}</Button>}
    </div>
  );
}

