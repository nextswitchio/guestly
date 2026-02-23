import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

