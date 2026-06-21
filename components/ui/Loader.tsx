import React from "react";

interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 24 }: LoaderProps) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-lime/20 border-t-lime"
      style={{ width: size, height: size }}
    />
  );
}

