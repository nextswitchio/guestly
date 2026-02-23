import React from "react";

interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 24 }: LoaderProps) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600"
      style={{ width: size, height: size }}
    />
  );
}

