import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-neutral-700">{label}</label>}
      <input
        ref={ref}
        className={`h-10 w-full rounded-md border bg-white px-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? "border-red-500 focus:ring-red-500" : "border-neutral-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;

