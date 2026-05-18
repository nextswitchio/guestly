"use client";
import React from "react";

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

type StepStatus = "completed" | "active" | "upcoming";
type Orientation = "horizontal" | "vertical";

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  orientation?: Orientation;
  onStepClick?: (stepIndex: number) => void;
  allowClickOnCompleted?: boolean;
  className?: string;
}

export default function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  onStepClick,
  allowClickOnCompleted = true,
  className = "",
}: StepperProps) {
  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "upcoming";
  };

  const handleStepClick = (index: number) => {
    if (!onStepClick) return;
    
    const status = getStepStatus(index);
    // Only allow clicking on completed steps if enabled
    if (status === "completed" && allowClickOnCompleted) {
      onStepClick(index);
    }
  };

  if (orientation === "vertical") {
    return (
      <div className={`flex flex-col ${className}`} role="navigation" aria-label="Progress">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          const isClickable = status === "completed" && allowClickOnCompleted && !!onStepClick;

          return (
            <div key={index} className="flex gap-3">
              {/* Step indicator column */}
              <div className="flex flex-col items-center">
                <StepIndicator
                  step={step}
                  status={status}
                  stepNumber={index + 1}
                  isClickable={isClickable}
                  onClick={() => handleStepClick(index)}
                />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 my-2 transition-colors duration-300 ${
                      status === "completed"
                        ? "bg-primary-500"
                        : "bg-surface-border"
                    }`}
                    style={{ minHeight: "32px" }}
                  />
                )}
              </div>

              {/* Step content column */}
              <div className={`pb-8 ${isLast ? "" : ""}`}>
                <StepContent
                  step={step}
                  status={status}
                  isClickable={isClickable}
                  onClick={() => handleStepClick(index)}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`w-full ${className}`} role="navigation" aria-label="Progress">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          const isClickable = status === "completed" && allowClickOnCompleted && !!onStepClick;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2 flex-1">
                <StepIndicator
                  step={step}
                  status={status}
                  stepNumber={index + 1}
                  isClickable={isClickable}
                  onClick={() => handleStepClick(index)}
                />
                <StepContent
                  step={step}
                  status={status}
                  isClickable={isClickable}
                  onClick={() => handleStepClick(index)}
                  compact
                />
              </div>

              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${
                    status === "completed"
                      ? "bg-primary-500"
                      : "bg-surface-border"
                  }`}
                  style={{ maxWidth: "80px" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Step Indicator Component
interface StepIndicatorProps {
  step: Step;
  status: StepStatus;
  stepNumber: number;
  isClickable?: boolean;
  onClick?: () => void;
}

function StepIndicator({
  step,
  status,
  stepNumber,
  isClickable,
  onClick,
}: StepIndicatorProps) {
  const baseClasses =
    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out";

  const statusClasses = {
    completed: "bg-primary-500 text-white shadow-sm",
    active: "bg-primary-500 text-white shadow-md ring-4 ring-primary-100",
    upcoming: "bg-surface-card border-2 border-surface-border text-foreground-muted",
  };

  const clickableClasses = isClickable
    ? "cursor-pointer hover:scale-110 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
    : "";

  const classes = `${baseClasses} ${statusClasses[status]} ${clickableClasses}`;

  const content = (
    <>
      {status === "completed" ? (
        step.icon || (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )
      ) : status === "active" ? (
        step.icon || <span className="text-sm font-bold">{stepNumber}</span>
      ) : (
        <span className="text-sm font-medium">{stepNumber}</span>
      )}
    </>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={`Go to ${step.label}`}
        aria-current={status === "active" ? "step" : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={classes}
      aria-current={status === "active" ? "step" : undefined}
      aria-label={step.label}
    >
      {content}
    </div>
  );
}

// Step Content Component
interface StepContentProps {
  step: Step;
  status: StepStatus;
  isClickable?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

function StepContent({
  step,
  status,
  isClickable,
  onClick,
  compact = false,
}: StepContentProps) {
  const statusClasses = {
    completed: "text-foreground-muted",
    active: "text-foreground font-semibold",
    upcoming: "text-foreground-subtle",
  };

  const clickableClasses = isClickable
    ? "cursor-pointer hover:text-foreground transition-colors duration-200"
    : "";

  const content = (
    <>
      <div
        className={`text-sm ${statusClasses[status]} ${clickableClasses} transition-colors duration-300`}
      >
        {step.label}
      </div>
      {!compact && step.description && (
        <div className="text-xs text-foreground-subtle mt-1">
          {step.description}
        </div>
      )}
    </>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        className={`text-center ${compact ? "" : "text-left"} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:rounded px-1 -mx-1`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`${compact ? "text-center" : "text-left"}`}>
      {content}
    </div>
  );
}
